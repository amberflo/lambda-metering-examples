'use strict';

const zlib = require('zlib');

const methods = {
    'direct-api': require('../ingest/direct-api'),
    'direct-sqs': require('../ingest/direct-sqs'),
    'direct-s3': require('../ingest/direct-s3'),
};
const ingest = methods['direct-s3'];  // any of the direct ingestion methods will work.

const prefix = 'meter_record_for_stream';

/*
 * The payload will contain multiple records from potentially different lambda
 * functions.  And each record will contain multiple log messages, from
 * potentially multiple invocations of a lambda function.
 *
 * If there is an error calling the ingest function, the lambda will fail and
 * try again.
 */
exports.handler = async (event) => {
    const records = event
        .Records
        .map(r => r.kinesis.data)
        .map(d =>
            // Decompress and parse the CloudWatch payload
            JSON.parse(zlib.gunzipSync(Buffer.from(d, 'base64')).toString())
        )
        .filter(m => m.messageType !== 'CONTROL_MESSAGE')
        .map(p => p
            .logEvents
            .map(x => x.message)
            .map(m => {
                const i = m.indexOf(prefix);
                if (i < 0) return;  // get only messages containing meter records
                return JSON.parse(m.slice(i + prefix.length + 1));
            })
            .filter(x => x)
        ).flat();

    // Ingest records in bulk
    await ingest(records);

    console.info('ingested:', records);
};
