'use strict';

const zlib = require('zlib');

const methods = {
    'direct-api': require('../ingest/direct-api'),
    'direct-sqs': require('../ingest/direct-sqs'),
    'direct-s3': require('../ingest/direct-s3'),
};
const ingest = methods['direct-s3'];

const prefix = 'meter_record_for_cw';

exports.handler = async (input) => {
    const payload = JSON.parse(zlib.gunzipSync(Buffer.from(input.awslogs.data, 'base64')).toString());

    if (payload.messageType === 'CONTROL_MESSAGE') {
        return;
    }

    const records = payload
        .logEvents
        .map(x => x.message)
        .map(m => {
            const i = m.indexOf(prefix);
            if (!i) return;
            return JSON.parse(m.slice(i + prefix.length + 1));
        })
        .filter(x => x);

    await ingest(records);

    console.info('ingested:', records);
};
