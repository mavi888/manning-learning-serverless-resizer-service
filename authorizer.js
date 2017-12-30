'use strict';

const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

const APPLICATION_ID = 'myImageResizerId';
const APPLICATION_SECRET = 'myImageResizerSecret';

module.exports.generateToken = jsonToSign => {
  const hasValidId = jsonToSign.applicationId && jsonToSign.applicationId === APPLICATION_ID;

  const hasValidSecret = jsonToSign.applicationSecret && jsonToSign.applicationSecret === APPLICATION_SECRET;

  if (hasValidId && hasValidSecret) {
    // sign with default (HMAC SHA256)
    return jwt.sign(jsonToSign, SECRET_KEY);
  } else {
    throw new Error('Invalid token or applicationId');
  }
};

module.exports.generatePolicy = (token, methodArn) => {
  try {
    if (decodeToken(token) != null) {
      //Token was decoded successfully
      return buildPolicy('user', 'Allow', methodArn);
    } else {
      //Token is not decoded properly
      throw new Error('Unauthorized');
    }
  } catch (error) {
    throw new Error('Unauthorized');
  }
};

function decodeToken(token) {
  try {
    var decoded = jwt.verify(token, SECRET_KEY);
    const hasValidAppId = decoded.applicationId && decoded.applicationId === APPLICATION_ID;

    const hasValidSecret = decoded.applicationSecret && decoded.applicationSecret === APPLICATION_SECRET;

    if (hasValidAppId && hasValidSecret) {
      return decoded;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

function buildPolicy(principalId, effect, resource) {
  var authResponse = {};
  authResponse.principalId = principalId;

  if (effect && resource) {
    var policyDocument = {
      Version: '2012-10-17', // default version
      Statement: [
        {
          Action: 'execute-api:Invoke', // default action
          Effect: effect,
          Resource: resource
        }
      ]
    };
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
}
