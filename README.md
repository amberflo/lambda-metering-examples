# Lambda Metering Examples

Amberflo provides different methods to ingest meter records:
- Amberflo [API call](https://docs.amberflo.io/reference/post_ingest), or
- Adding a file to a [designated S3 bucket](https://docs.amberflo.io/docs/s3-ingestion), or
- Sending a message to a [designated SQS queue](https://docs.amberflo.io/docs/sqs-ingestion).

In the context of a running service, in our case an AWS Lambda function, this can be done:
- during the lambda execution itself, or
- by subscribing to the lambda logs, or
- **(TODO)** from a lambda extension.

In this project, you can see how to implement each of these methods.
