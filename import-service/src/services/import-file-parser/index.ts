import AWS from 'aws-sdk';
import parseCSVFile from './parse-csv-file';
import moveParsedObject from './move-parsed-object';
import { Product } from '../../types';

export const importFileParserService = async (s3Object) => {
  const s3BucketName = process.env.S3_BUCKET_UPLOADS;
  AWS.config.update({ region: process.env.AWS_REGION });
  const s3 = new AWS.S3({ signatureVersion: 'v4' });
  await parseCSVFile<Product>(s3, s3BucketName, s3Object.key, (data) => {
    console.log(data);
  });

  await moveParsedObject(s3, s3BucketName, s3Object.key);
};
