# Lambda Metering Examples

This project demonstrates how to meter a lambda function.

Amberflo provides different methods to ingest meter records:
- Amberflo [API call](https://docs.amberflo.io/reference/post_ingest), or
- Adding a file to a [designated S3 bucket](https://docs.amberflo.io/docs/s3-ingestion), or
- Sending a message to a [designated SQS queue](https://docs.amberflo.io/docs/sqs-ingestion).

In the context of a running service, in our case an AWS Lambda function, this can be done:
- during the lambda execution itself, or
- by subscribing to the lambda logs, or
- **(TODO)** from a lambda extension.

In this project, you can see how to implement each of these methods.

## Overview

This project uses [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started.html) to create an API that will be served by a lambda
function.  When this function runs, it causes a meter record to be ingested.

Each ingestion method is triggered by a different call to the API. For instance, `POST $API_URL/direct-s3` will cause the ingestion to happen immediately via your designated S3 bucket.

## Ingestion Methods

In the **direct** ingestion methods, the ingestion happens in your main lambda code.

- [via Amberflo API](./ingest/direct-api.js)
    - in this case, you call the [Amberflo API](https://docs.amberflo.io/reference/post_ingest) directly from your lambda to send the meter records.

- [via S3](./ingest/direct-s3.js)
    - in this case, you use the official AWS SDK to add your meter records as files to an [Amberflo provided](https://docs.amberflo.io/docs/s3-ingestion) S3 bucket.

- [via SQS](./ingest/direct-sqs.js)
    - in this case, you use the official AWS SDK to send your meter records as messages to an [Amberflo provided](https://docs.amberflo.io/docs/sqs-ingestion) SQS queue.

All these methods support the same payload format.

These methods are easier to setup because they require no additional infrastructure, but they will make an HTTP request to the underlying service, so you'll need to handle errors. They'll also increase the running time of your lambda and may require installing additional dependencies. For these reasons, an indirect method is preferable.

In the **indirect** ingestion methods, your meter records are logged by the main lambda, and another lambda [processes the log records](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html), extracts the meter records and ingests them.

This facilitates error handling (you can always retry processing the logs) and keeps your lambda code simple. Although the infrastructure cost is higher (the log subscription and consumer), it does not grow with each new lambda you need to meter but remains constant.

- [with CloudWatch subscriber Lambda](./lambda/cw-subscriber.js)
    - in this case, the ingestion lambda subscribes directly to your CloudWatch log group
- [with Kinesis subscriber Lambda](./lambda/stream-subscriber.js)
    - in this case, you send your CloudWatch logs to a Kinesis stream, and your ingestion lambda consumes the stream

Currently, a CloudWatch log group can have at most 2 subscription filters, so having Kinesis intermediate the ingestion may be useful if you also need the logs for other purposes (i.e. Kinesis allows fanning out).

To read more about the CloudWatch integration, see [this doc](https://docs.amberflo.io/docs/cloudwatch-logs-ingestion-1).

## How to Use

### Requisites

To run this example you'll need:

- An [Amberflo account](https://ui.amberflo.io/)
- A [meter](https://docs.amberflo.io/reference/post_meters) and a [customer](https://docs.amberflo.io/reference/post_customers) in Amberflo
- An AWS account
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) installed
- [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) installed
- Node.js

### Deploying & Testing

Fill in the lambda environment variables in the SAM [template](./template.yaml) file and run the [deploy](./deploy.sh) script.

When the deployment is complete, find the API stage URL in the [API Gateway console](https://us-west-2.console.aws.amazon.com/apigateway/main/apis) and set it as the `api_url` in the [test](./test.sh) script.

Now you can run the [test](./test.sh) script to cause the lambda to execute and meter events ingested.

In the Amberflo UI, you should now be able to see the usage.
