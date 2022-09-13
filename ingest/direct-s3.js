'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid');

const bucketName = process.env.INGEST_BUCKET_NAME;
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_KEY;

const s3 = new AWS.S3({
    region: 'us-west-2',
    accessKeyId,
    secretAccessKey,
});

module.exports = async (record) => {
    const date = new Date().toISOString().slice(0, 10);
    const key = `ingest/records/${date}/${uuid.v1()}`;

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: JSON.stringify(record),
    };
    return s3.putObject(params).promise();
};
