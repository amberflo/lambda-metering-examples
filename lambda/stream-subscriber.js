'use strict';

const zlib = require('zlib');

const methods = {
    'direct-api': require('../ingest/direct-api'),
    'direct-sqs': require('../ingest/direct-sqs'),
    'direct-s3': require('../ingest/direct-s3'),
};
const ingest = methods['direct-s3'];

const prefix = 'meter_record_for_stream';

exports.handler = async (event) => {
    const records = event
        .Records
        .map(r => r.kinesis.data)
        .map(d => JSON.parse(zlib.gunzipSync(Buffer.from(d, 'base64')).toString()))
        .filter(m => m.messageType !== 'CONTROL_MESSAGE')
        .map(p => p
            .logEvents
            .map(x => x.message)
            .map(m => {
                const i = m.indexOf(prefix);
                if (i < 0) return;
                return JSON.parse(m.slice(i + prefix.length + 1));
            })
            .filter(x => x)
        ).flat();

    await ingest(records);

    console.info('ingested:', records);
};
