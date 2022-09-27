import AWS from 'aws-sdk';
import { Readable } from 'stream';

export default async function createReadStream(
  s3: AWS.S3,
  s3BucketName: string,
  s3BucketKey: string
): Promise<Readable> {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: s3BucketName,
      Key: s3BucketKey,
    };
    try {
      s3.headObject(params, (error, data) => {
        if (error) {
          throw error;
        }
        const stream = s3.getObject(params).createReadStream();
        resolve(stream);
      });
    } catch (error) {
      reject(error);
    }
  });
}
