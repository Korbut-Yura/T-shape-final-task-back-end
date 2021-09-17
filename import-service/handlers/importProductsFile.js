'use strict';
const AWS = require('aws-sdk')
const BUCKET = 'uploaded-products-bucket'

module.exports.importProductsFile = async (event) => {
    const s3 = new AWS.S3({ region: 'eu-west-1' })
    const { name } = event.queryStringParameters

    const params = ({
        Bucket: BUCKET,
        Key: `uploaded/${name}`,
        Expires: 60,
        ContentType: 'text/csv'
    })

    try {
        const s3Response = await s3.getSignedUrl('putObject', params)
        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(s3Response, null, 2 ),
        } 
    } catch (err) {
        return {
            statusCode: 500,
            message: err
        }
    }
};
  