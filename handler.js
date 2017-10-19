'use strict';

module.exports.hello = (event, context, callback) => {
  console.log(event.Records[0].s3);

  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  console.log(`A file named ${key} was put in a bucket ${bucket}`);

  callback(null, { message: `A file named ${key} was put in a bucket ${bucket}`, event });
};
