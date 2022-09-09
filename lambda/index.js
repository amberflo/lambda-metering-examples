'use strict';

const uuid = require('uuid');

const meterApiName = process.env.METER_API_NAME;
const customerId = process.env.CUSTOMER_ID;

const methods = {
    'direct-api': require('./direct-api'),
    'direct-sqs': require('./direct-sqs'),
    'direct-s3': require('./direct-s3'),
    'cw-subscriber': require('./cw-subscriber'),
};

exports.handler = async (event, context) => {
    const method = methods[event.pathParameters.method];

    if (!method) {
        throw new Error(`Invalid method. Valid methods are: ${Object.keys(methods).join(', ')}`)
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

    await method(record);

    console.info('ingested:', record);

    return {
        statusCode: 200,
        body: '',
    }
};
