#!/usr/bin/env bash

USERNAME=$1
PASSWORD=$2
EMAIL=$3

curl -X POST https://d2wf6cqtjj.execute-api.ap-southeast-1.amazonaws.com/dev \
	-H 'Content-Type: application/json' \
	-d '{"username": "'$USERNAME'", "password": "'$PASSWORD'", "email": "'$EMAIL'"}'
