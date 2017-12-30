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

function sendResponse(statusCode, message, callback) {
  const response = {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
  callback(null, response);
}
