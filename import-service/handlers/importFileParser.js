'use strict';
const AWS = require('aws-sdk')
const csv = require('csv-parser')
const BUCKET = 'uploaded-products-bucket'

module.exports.importFileParser = async (event) => {
    const s3 = new AWS.S3({region: 'eu-west-1'});
   
    try {
        for (const record of event.Records) {
            const params = {
                Bucket: BUCKET,
                Key: record.s3.object.key
            }
    
            const s3Stream = s3.getObject(params).createReadStream()
            await new Promise((res,rej) => {
                s3Stream
                .pipe(csv())
                .on('data', (data) => { console.log("data", JSON.stringify(data))})
                .on('error', ()=> { rej() })
                .on('end', async () => {
                    await s3.copyObject({
                        Bucket: BUCKET,
                        CopySource: `${BUCKET}/${record.s3.object.key}`,
                        Key: record.s3.object.key.replace('uploaded','parsed')
                    }).promise()
            
                    await s3.deleteObject({
                        Bucket: BUCKET,
                        Key: record.s3.object.key
                    }).promise()
                   res()
                })
            })
            
            return {
                statusCode: 200,
                headers: { "Access-Control-Allow-Origin": "*" },
            };
        }
    } catch (err) {
        return {
            statusCode: 500,
            message: err.message
        }
    }
  };
  