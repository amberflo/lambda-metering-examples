'use strict';

const uuid = require('uuid');

const meterApiName = process.env.METER_API_NAME;
const customerId = process.env.CUSTOMER_ID;

const methods = {
    'direct-api': require('../ingest/direct-api'),
    'direct-sqs': require('../ingest/direct-sqs'),
    'direct-s3': require('../ingest/direct-s3'),
    'cw-subscriber': require('../ingest/cw-subscriber'),
    'stream-subscriber': require('../ingest/stream-subscriber'),
};

exports.handler = async (event) => {
    const ingest = methods[event.pathParameters.method];

    if (!ingest) {
        throw new Error(`Invalid method. Valid methods are: ${Object.keys(methods).join(', ')}`);
    }

    const record = {
        meterApiName,
        customerId,
        meterTimeInMillis: Date.now(),
        meterValue: 1,
        uniqueId: uuid.v1(),
        dimensions: {
            method: event.pathParameters.method,
        },
    };

    await ingest(record);

    console.info('ingested:', record);

    return {
        statusCode: 200,
        body: '',
    };
};
