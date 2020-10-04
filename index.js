/*
  ROUTES

    check out pretty links pro for "cloaked redirects, javascript redirects, more"

    cloak affiliate links 
    have differnet cloaked link for each place I am going to use it for tracking

  /images/{imagePath+}
  /js/{jsResource+}
  /css/{cssResource+}
  /{proxy+} //this should be all .html files
  $default (do 404?)

*/
'use strict';

const AWS = require('aws-sdk');
const { stat } = require('fs');
const s3 = new AWS.S3();

const BUCKET = 'sandbox.threemuddypigs.com';
const OBJECTKEY = 'test-file.html';

exports.handler = async (event, context, callback) => {
  
    console.log('EVENT Info: ' + JSON.stringify(event));

    const requestMethod = event.requestContext.http.method;
    if ('GET' != requestMethod) {
      return;
    }

    //1. Read event to get requested resource
    let resource = event.rawPath.replace('/' + event.requestContext.stage, '');
    if (resource.startsWith('/')) {
      resource = resource.replace('/', '');
    }
    //TODO add .html extension if not there
    console.log('processing request for: ' + resource);
      //1b. Determine if it's a .js or .css resource
        //content-type: text/javascript; charset=UTF-8
        //content-type: text/css; charset=utf-8
      //1c. Determine if it's an image
        //content-type: image/jpeg
    //2. get header, nav and footer from S3 
      //2b. cache these values if it takes too much time
    //3. get partial for requested resource
    //4. build full HTML

    //Need EJS
    //Make routes to figure out if its an image, js, css or html file so it can setup variables properly
    //find youtube video of using node with lambda
    //what is the amazon image processor called?
    //can i cache things in lambda? like read the template header from dynamo once per deploy?
      //or cache the supported image widths from dynamo
      //TODO test read times and see if this is worth it
      //how would I know the value in teh DB changed? probably shouldn't do this
    
    //TODO make this typescript

    let statusCode = 200;
    let contentType = 'text/html';
    let isBase64Encoded = false;
    if (resource.startsWith('images')) {
      contentType = 'image/jpeg';
      isBase64Encoded = true;
    }
    let body = '';
    try {
      // html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head><body><h1>Test File Inline</h1></body></html>';
      const params = {
        Bucket: BUCKET,
        Key: resource,
        ResponseContentType: contentType
      };

      let s3Object = await s3.getObject(params).promise();
      body = s3Object.Body.toString(isBase64Encoded ? 'base64' : 'utf-8');
    } catch (err) {
        statusCode = 400;
        body = err;
        console.log(err);
        return;
    }

    const response = {
      statusCode : statusCode,
      headers: {
        'Content-Type' : contentType,
      },
      body : body,
      isBase64Encoded : isBase64Encoded
    };
    // callback will send HTML back
    callback(null, response);
};