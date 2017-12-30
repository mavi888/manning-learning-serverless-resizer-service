'use strict';

module.exports.generateToken = (event, context, callback) => {
  console.log('generateToken was called');
  console.log(event);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      token: 'token'
    })
  };

  callback(null, response);
};
