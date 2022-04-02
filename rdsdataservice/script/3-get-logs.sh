#!/usr/bin/env bash

PROFILE=$1

aws --profile $PROFILE \
	logs tail /aws/lambda/sharingSessionFunction \
	--follow
