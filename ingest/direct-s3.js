'use strict';

const AWS = require('aws-sdk');

const bucketName = process.env.INGEST_BUCKET_NAME;
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_KEY;

const s3 = new AWS.S3({
    region: 'us-west-2',
    accessKeyId,
    secretAccessKey,
});

module.exports = async (record) => {
    const date = new Date(record.meterTimeInMillis).toISOString().slice(0, 10);
    const key = `ingest/records/${date}/${record.uniqueId}`;

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: JSON.stringify(record),
    };
    return s3.putObject(params).promise();
};
