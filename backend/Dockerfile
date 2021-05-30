FROM nikolaik/python-nodejs:python3.9-nodejs15-alpine

RUN apk update && \
    apk add gcc musl-dev && \
    pip install --upgrade aws-shell aws-sam-cli
