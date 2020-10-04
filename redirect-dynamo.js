// const { DocDB } = require('aws-sdk');
/** STATIC REDIRECTS
//easy to remember links - Easy-To-Remember Links, Pretty links
/facebook
/instagram
/youtube
/twitter

SCHEMA (Link)
  ID: pretty link (path)
  target
  redirection (301, 302, 307)
  clicks
  created_at
  modified_at
  last_clicked

{
  "clicks": 0,
  "createdAt": "2020-10-03T05:24:55.585Z",
  "lastClickedAt": "1970-01-01T00:00:00.000Z",
  "path": "facebook",
  "redirect": 301,
  "target": "https://www.facebook.com/threemuddypigs/",
  "updatedAt": "2020-10-03T05:24:55.585Z"
}
arn:aws:dynamodb:us-east-1:344966100116:table/Links
//https://youtu.be/ijyeE-pXFk0?t=365

**/

'use strict';
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = async (event, context, callback) => {

  const params = {
    TableName: 'Links',
    Key: {
      path: "facebook"
    }
  }

  try {
    const start = new Date();
    let data = await docClient.get(params).promise()
    console.log('data took ' + (new Date().getTime() - start.getTime()) + 'ms = ' + JSON.stringify(data));
  } catch (e) {
    console.log(e.message)
  }

  const updateParams = {
    TableName: 'Links',
    Key: {
      path: "facebook"
    },
    // UpdateExpression: "remove info.actors[0]",
    UpdateExpression: "set clicks = clicks + :clicksIncrement, lastClickedAt = :now",
    // UpdateExpression: "set clicks = clicks + :clicksIncrement, lastClickedAt = :now",
    // ConditionExpression: "size(info.actors) > :num",
    ExpressionAttributeValues:{
        ":clicksIncrement": 1
        ,":now" : new Date().toISOString()
    },  
    ReturnValues:"ALL_NEW"
  }

  try {
    let updated = await docClient.update(updateParams).promise()
    console.log("UpdateItem succeeded:", JSON.stringify(updated, null, 2));
  } catch (err) {
    console.error("Unable to update item. Error JSON:", err);
  }
  
    // console.log('Handling redirect');
    // console.log('EVENT Info: ' + JSON.stringify(event));

    console.log('done');

    // const response = {
    //   statusCode: 301,
    //   headers: {
    //     'Location': 'https://facebook.com/',
    //   }
    // };
    // callback will send HTML back
    // callback(null, response);

    // context.succeed({ 
    //     location: "https://[bucket-name].s3-eu-west-1.amazonaws.com/myimage.png" });
    // });
};