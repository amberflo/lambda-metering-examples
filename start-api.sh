#!/bin/bash

sam local start-api --template template.yaml 2>&1 | tr '\r' '\n'
