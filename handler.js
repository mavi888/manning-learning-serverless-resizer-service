'use strict';

const resizer = require('./resizer');

module.exports.resizer = (event, context, callback) => {
  console.log(event.Records[0].s3);

  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  console.log(`A file named ${key} was put in a bucket ${bucket}`);

  resizer(bucket, key)
    .then(() => {
      console.log(`The thumbnail was created`);
      callback(null, { message: 'The thumbnail was created' });
    })
    .catch(error => {
      console.log(error);
      callback(error);
    });
};

module.exports.thumbnails = (event, context, callback) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  console.log(bucket);
  console.log(key);

  console.log(`A new file ${key} was created in the bucket ${bucket}`);
  callback(null, { message: `A new file ${key} was created in the bucket ${bucket}` });
};
