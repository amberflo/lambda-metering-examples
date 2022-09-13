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

/*
 * Send your meter records as a message in your designated SQS queue.
 *
 * In this method, `record` can also be an array of records.
 *
 * You'll need to handle errors related to the SQS API call.
 *
 * Errors during meter validation won't cause this method to fail and will be
 * available for your inspection in the S3 bucket (the SQS ingestion is just a
 * proxy for the S3 ingestion).
 */
module.exports = async (record) => {
    const params = {
        QueueUrl: queueUrl,
        MessageGroupId: record.uniqueId,
        MessageDeduplicationId: record.uniqueId,
        MessageBody: JSON.stringify(record),
    };
    return sqs.sendMessage(params).promise();
};
