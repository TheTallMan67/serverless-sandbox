'use strict';

const AWS = require('aws-sdk');
const { stat } = require('fs');
const s3 = new AWS.S3();

const BUCKET = 'sandbox.threemuddypigs.com';
const OBJECTKEY = 'test-file.html';

exports.handler = async (event, context, callback) => {
    
    let statusCode = 200;
    let html = '';
    try {
        // html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head><body><h1>Test File Inline</h1></body></html>';
        const params = {
            Bucket: BUCKET,
            Key: OBJECTKEY,
            ResponseContentType: 'text/html'
        };
        let s3Object = await s3.getObject(params).promise();
        html = s3Object.Body.toString('utf-8');
        console.log(html);
    } catch (err) {
        statusCode = 400;
        html = err;
        console.log(err);
        return;
    }

    const response = {
      statusCode: statusCode,
      headers: {
        'Content-Type': 'text/html',
      },
      body: html
    };
    // callback will send HTML back
    callback(null, response);
};

// function getS3Object(bucket, key) {
//     return S3.getObject({
//         Bucket: bucket,
//         Key: key,
//         ResponseContentType: 'text/html'
//     }).promsise();
// }