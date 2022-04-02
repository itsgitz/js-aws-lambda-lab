#!/usr/bin/env bash

PROFILE=$1
FUNCTION=$2
ZIP_FILE="fileb://function.zip"

aws lambda update-function-code \
	--profile $PROFILE \
	--function-name $FUNCTION \
	--zip-file $ZIP_FILE
