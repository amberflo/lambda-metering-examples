#!/bin/bash

set -ex

api_url=''

methods=(
    cw-subscriber
    stream-subscriber
    direct-api
    direct-s3
    direct-sqs
)

for m in "${methods[@]}"
do
    curl -X POST "$api_url/$m"
done
