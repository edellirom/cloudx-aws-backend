import AWS from 'aws-sdk';
import parseCSVFile from './parse-csv-file';
import moveParsedObject from './move-parsed-object';
import { sqsSendMessage } from './sqs-send-message';
import { Product } from '../../types';

export const importFileParserService = async (s3Object) => {
  const s3BucketName = process.env.S3_BUCKET_UPLOADS;
  const sqsUrl = process.env.SQS_CATALOG_ITEMS_URL;
  AWS.config.update({ region: process.env.AWS_REGION });
  const s3 = new AWS.S3({ signatureVersion: 'v4' });
  const sqs = new AWS.SQS();
  await parseCSVFile<Product>(s3, s3BucketName, s3Object.key, (data) => {
    sqsSendMessage(sqs, sqsUrl, data)
  });

  await moveParsedObject(s3, s3BucketName, s3Object.key);
};
