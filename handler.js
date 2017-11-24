'use strict';

const AWS = require('aws-sdk');
const stepfunctions = new AWS.StepFunctions();

const resizer = require('./resizer');
const imageMetadataManager = require('./imageMetadataManager');

module.exports.resizer = (event, context, callback) => {
  console.log(event);

  const bucket = event.bucketName;
  const key = event.objectKey;
  console.log(`A file named ${key} was put in a bucket ${bucket}`);

  resizer
    .resize(bucket, key)
    .then(() => {
      console.log(`The thumbnail was created`);
      callback(null, { message: 'The thumbnail was created' });
    })
    .catch(error => {
      console.log(error);
      callback(error);
    });
};

module.exports.saveImageMetadata = (event, context, callback) => {
  console.log(event);

  const bucket = event.bucketName;
  const key = event.objectKey;

  console.log('saveImageMetadata was called');

  imageMetadataManager
    .saveImageMetadata(bucket, key, false)
    .then(() => {
      console.log('Save image metadata was completed');
      callback(null, null);
    })
    .catch(error => {
      console.log(error);
      callback(null, null);
    });
};

module.exports.blackAndWhiteCrop = (event, context, callback) => {
  console.log(event);

  const bucket = event.bucketName;
  const key = event.objectKey;

  resizer
    .blackAndWhiteCrop(bucket, key)
    .then(url => {
      console.log('The thumbnail was created');
      callback(null, { message: 'The thumbnail was created' });
    })
    .catch(error => {
      console.log(error);
      callback(null, { message: `There was an error: ${error}` });
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

module.exports.executeStepFunction = (event, context, callback) => {
  const stateMachineName = 'ImageProcessingMachine'; // The name of the step function we defined in the serverless.yml

  console.log('Fetching the list of available workflows');

  stepfunctions
    .listStateMachines({})
    .promise()
    .then(listStateMachines => {
      console.log('Searching for the step function');

      for (var i = 0; i < listStateMachines.stateMachines.length; i++) {
        const item = listStateMachines.stateMachines[i];

        if (item.name.indexOf(stateMachineName) >= 0) {
          console.log('Found the step function');

          // The event data contains the information of the s3 bucket and the key of the object
          const eventData = event.Records[0];

          var params = {
            stateMachineArn: item.stateMachineArn,
            input: JSON.stringify({ objectKey: eventData.s3.object.key, bucketName: eventData.s3.bucket.name })
          };

          console.log('Start execution');
          stepfunctions.startExecution(params).promise().then(() => {
            return context.succeed('OK');
          });
        }
      }
    })
    .catch(error => {
      return context.fail(error);
    });
};
