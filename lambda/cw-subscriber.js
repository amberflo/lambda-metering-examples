'use strict';

const zlib = require('zlib');

const methods = {
    'direct-api': require('../ingest/direct-api'),
    'direct-sqs': require('../ingest/direct-sqs'),
    'direct-s3': require('../ingest/direct-s3'),
};
const ingest = methods['direct-s3'];  // any of the direct ingestion methods will work.

const prefix = 'meter_record_for_cw';

/*
 * The payload will contain multiple log messages, from potentially multiple
 * invocations of your lambda function.
 *
 * If there is an error calling the ingest function, the lambda will fail and
 * there will be some retries.
 * See https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Subscriptions.html
 */
exports.handler = async (input) => {
    // Decompress and parse the CloudWatch payload
    const payload = JSON.parse(zlib.gunzipSync(Buffer.from(input.awslogs.data, 'base64')).toString());

    if (payload.messageType === 'CONTROL_MESSAGE') {
        return;
    }

    const records = payload
        .logEvents
        .map(x => x.message)
        .map(m => {
            const i = m.indexOf(prefix);
            if (i < 0) return;  // get only messages containing meter records
            return JSON.parse(m.slice(i + prefix.length + 1));
        })
        .filter(x => x);

    // Ingest records in bulk
    await ingest(records);

    console.info('ingested:', records);
};
