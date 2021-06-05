## Blog Post

:scroll: A more detailed description of this project and a code walk-through can be found on my [blog](https://jvdevlab.com/blog/aws/cognito/react-amplify).

## Description

This [GitHub project](https://github.com/jvdevlab/amazon-cognito-react-amplify) shows how to secure [Amazon API Gateway](https://aws.amazon.com/api-gateway) with [Amazon Cognito](https://aws.amazon.com/cognito) and access it from [React](https://reactjs.org) application using [AWS Amplify](https://github.com/aws-amplify/amplify-js).

The backend is provisioned using [AWS SAM](https://aws.amazon.com/serverless/sam/) and consists of:

- An Amazon API Gateway that acts as a proxy to a serverless function.
- A [Node.js](https://nodejs.org/en/) based [AWS Lambda](https://aws.amazon.com/lambda/) function that performs basic CRUD operations on [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) using [AWS SDK](https://aws.amazon.com/sdk-for-javascript/).
- An Amazon DynamoDB table.
- Resources to setup Amazon Cognito
  - User Pool
  - App Client
  - Domain
  - Identity Pool
  - Roles
  - Groups
  - Users

The React based frontend application uses AWS Amplify for user authentication and communication with Amazon API Gateway. A few additional libraries ([Material-UI](https://material-ui.com/), [react-json-view](https://github.com/mac-s-g/react-json-view), [react-loading-overlay](https://github.com/derrickpelletier/react-loading-overlay)) are used to improve user experience.

## Setup

- Install [Docker](https://docs.docker.com/get-docker/).
- Clone the repo.
- If your AWS security credentials are **not** in `~/.aws`, then adjust the bind mapping in `docker-compose.yml`.
- Rename `.env.local` to `.env`.
- Update S3_BUCKET variable in the `.env` file with your s3 bucket name. AWS SAM needs it to upload the template and serverless function code.
- To deploy the backend to AWS run:

```bash
docker compose up backend
```

- To get configuration data run:

```bash
docker compose up describe
```

- Copy the above command output into corresponding variables in the `.env` file.
- Create demo users password

```bash
docker compose run -e USR_PWD=<pwd> --rm users
```

## Demo

- To start the frontend application run:

```bash
docker compose up frontend
```

- Open the app <http://localhost:3000>
- Verify that you can not perform CRUD operations.
- Sign in with `advanced@test.com` user and password you specified earlier. Verify that you can perform all CRUD operations.
- Sign out and sign in back with `basic@test.com` (same password). Verify that you can do Get and Scan only. You should get `AccessDeniedException` if you try to Put, Update or Delete.

![](https://jvdevlab.com/assets/images/04-02a5139ee86c403c2026cee0fb6763b0.PNG)

## Cleanup

- To delete the backend from AWS run:

```bash
docker compose up clean
docker compose down
```
