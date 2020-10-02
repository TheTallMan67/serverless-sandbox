'use strict';

exports.handler = async (event, context, callback) => {
  
    console.log('Handling redirect')
    console.log('EVENT Info: ' + JSON.stringify(event));

    const response = {
      statusCode: 301,
      headers: {
        'Location': 'https://facebook.com/threemuddypigs',
      }
    };
    // callback will send HTML back
    callback(null, response);

    // context.succeed({ 
    //     location: "https://[bucket-name].s3-eu-west-1.amazonaws.com/myimage.png" });
    // });
};