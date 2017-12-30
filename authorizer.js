'use strict';

const jwt = require('jsonwebtoken');

const SECRET_KEY = 'mySuperSecretKey!';

const APPLICATION_ID = 'myImageResizerId';
const APPLICATION_SECRET = 'myImageResizerSecret';

module.exports.generateToken = jsonToSign => {
  console.log(jsonToSign);

  const hasValidId = jsonToSign.applicationId && jsonToSign.applicationId === APPLICATION_ID;

  const hasValidSecret = jsonToSign.applicationSecret && jsonToSign.applicationSecret === APPLICATION_SECRET;

  if (hasValidId && hasValidSecret) {
    // sign with default (HMAC SHA256)
    return jwt.sign(jsonToSign, SECRET_KEY);
  } else {
    throw new Error('Invalid token or applicationId');
  }
};
