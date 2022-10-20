import AWS from 'aws-sdk';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { putObjectSignedUrl } from './object-signed-url';

const s3BucketName = process.env.S3_BUCKET_UPLOADS;

const importProductsFile = async (event, context, callback) => {
  try {
    const fileName = event.queryStringParameters.name ?? `default.csv`;

    const s3 = new AWS.S3({ region: 'eu-west-1', signatureVersion: 'v4' });

    const signedUrl = await putObjectSignedUrl(
      s3,
      s3BucketName,
      `uploads/${fileName}`
    );

    return formatJSONResponse({
      url: signedUrl,
    });
  } catch (error) {
    console.log(error);
    callback('error', error.message);
  }
};

export const main = middyfy(importProductsFile);
