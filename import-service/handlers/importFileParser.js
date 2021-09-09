'use strict';
const AWS = require('aws-sdk')

const BUCKET = 'uploaded-products-bucket'

module.exports.importFileParser = async (event) => {
    const s3 = new AWS.S3({region: 'eu-west-1'});

    for (const record of event.Records){
        await s3.copyObject({
            Bucket: BUCKET,
            CopySource: `${BUCKET}/${record.s3.object.key}`,
            Key: record.s3.object.key.replace('uploaded','parsed')
        }).promise()

        await s3.deleteObject({
            Bucket: BUCKET,
            Key: record.s3.object.key
        }).promise()
    }
    
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(
        {
          message: 'Go Serverless v1.0! Your function executed successfully!',
          input: event,
        },
        null,
        2
      ),
    };
  };
  