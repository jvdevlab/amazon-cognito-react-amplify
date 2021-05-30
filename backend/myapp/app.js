const aws = require("aws-sdk");
aws.config.update({
  region: "us-east-1",
});

exports.handler = async (event) => {
  try {
    console.log("Received Event:", JSON.stringify(event, null, 2));
    return await authorize(event);
  } catch (e) {
    return error(e);
  }
};

const authorize = async (event) => {
  const token = event.headers.Authorization.replace("Bearer ", "");
  const providerName = event.requestContext.authorizer.claims["iss"].replace("https://", "");
  const identityPoolId = event.headers["identitypoolid"];

  const params = {
    IdentityPoolId: identityPoolId,
    Logins: {
      [providerName]: token,
    },
  };

  aws.config.credentials = new aws.CognitoIdentityCredentials(params);

  await aws.config.credentials.getPromise();

  return await route(event);
};

const route = async (event) => {
  const routes = {
    "/api/data": dataRoute,
  };

  if (routes[event.path]) {
    return await routes[event.path](event);
  } else {
    return error(`Invalid URL: ${event.path}`);
  }
};

const dataRoute = async (event) => {
  if (event.httpMethod === "POST") {
    let body = event.body;
    if (event.isBase64Encoded) {
      body = Buffer.from(event.body, "base64").toString();
    }

    body = JSON.parse(body);
    const operation = body.operation;

    if (body.tableName) {
      body.payload.TableName = body.tableName;
    }

    const payload = body.payload;

    const dynamo = new aws.DynamoDB.DocumentClient();

    let result = {};
    switch (operation) {
      case "put":
        payload.Item.insertedBy = event.requestContext.authorizer.claims.email;
        result = await dynamo.put(payload).promise();
        break;
      case "get":
        result = await dynamo.get(payload).promise();
        break;
      case "update":
        result = await dynamo.update(payload).promise();
        break;
      case "delete":
        result = await dynamo.delete(payload).promise();
        break;
      case "scan":
        result = await dynamo.scan(payload).promise();
        break;
      default:
        result = error(`Unknown operation: ${operation}`);
    }

    return success(result);
  } else {
    return error(`Unsupported HTTP method: ${event.httpMethod}`);
  }
};

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "http://localhost:3000",
};

const success = (body, isBase64Encoded = false) => {
  return {
    statusCode: 200,
    isBase64Encoded: isBase64Encoded,
    body: JSON.stringify(body),
    headers: headers,
  };
};

const error = (e) => {
  console.error(e);

  return {
    statusCode: 200,
    body: JSON.stringify({
      error: e,
    }),
    headers: headers,
  };
};
