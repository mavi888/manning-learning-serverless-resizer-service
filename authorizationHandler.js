'use strict';

const authorizer = require('./authorizer');

module.exports.generateToken = (event, context, callback) => {
  console.log('generateToken was called');
  try {
    const token = authorizer.generateToken(JSON.parse(event.body || {}));
    sendResponse(200, { token }, callback);
  } catch (error) {
    sendResponse(400, { message: 'ApplicationId or ApplicationSecret are invalid' }, callback);
  }
};

module.exports.authorize = (event, context, callback) => {
  console.log(event);
  try {
    const policy = authorizer.generatePolicy(event.authorizationToken, event.methodArn);
    callback(null, policy);
  } catch (error) {
    callback(error.message);
  }
};

function sendResponse(statusCode, message, callback) {
  const response = {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
  callback(null, response);
}
