'use strict';

const AWS = require('aws-sdk');

const queueUrl = process.env.INGEST_QUEUE_URL;
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_KEY;

const sqs = new AWS.SQS({
    region: 'us-west-2',
    accessKeyId,
    secretAccessKey,
});

module.exports = async (record) => {
    const params = {
        QueueUrl: queueUrl,
        MessageGroupId: record.uniqueId,
        MessageDeduplicationId: record.uniqueId,
        MessageBody: JSON.stringify(record),
    };
    return sqs.sendMessage(params).promise();
};
