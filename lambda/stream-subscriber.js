'use strict';

const methods = {
    'direct-api': require('../ingest/direct-api'),
    'direct-sqs': require('../ingest/direct-sqs'),
    'direct-s3': require('../ingest/direct-s3'),
};
const ingest = methods['direct-s3'];

const prefix = 'meter_record_for_stream';

exports.handler = async (event) => {
    console.log(JSON.stringify(event, null, 4));
};
