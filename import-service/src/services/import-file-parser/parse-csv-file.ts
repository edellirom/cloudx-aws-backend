import AWS from 'aws-sdk';
import csv from 'csv-parser';
import createReadStream from './create-read-stream';

export default async function parseCSVFile<T>(
  s3: AWS.S3,
  s3BucketName: string,
  s3BucketKey: string,
  callback: (data: T) => void
): Promise<T[]> {
  const readStream = await createReadStream(s3, s3BucketName, s3BucketKey);
  return new Promise<T[]>((resolve, reject) => {
    const result: T[] = [];
    readStream
      .pipe(csv())
      .on('data', (data) => {
        callback(data);
        result.push(data);
      })
      .on('error', (error) => reject(error))
      .on('end', () => resolve(result));
  });
}
