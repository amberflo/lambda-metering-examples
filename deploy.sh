#!/bin/bash

set -ex

sam validate \
    --lint --template-file template.yaml

sam build \
    --template-file template.yaml

sam deploy \
    --s3-bucket aws-lamda-sam \
    --s3-prefix lambda-metering-example \
    --stack-name lambda-metering-example \
    --capabilities CAPABILITY_IAM \
    --confirm-changeset
