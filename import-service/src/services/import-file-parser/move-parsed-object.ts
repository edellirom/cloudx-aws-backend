import AWS from 'aws-sdk';

export default async function moveParsedObject(
  s3: AWS.S3,
  s3BucketName: string,
  s3BucketKey: string
): Promise<void> {
  try {
    const copyParams = {
      Bucket: s3BucketName,
      CopySource: `${s3BucketName}/${s3BucketKey}`,
      Key: s3BucketKey.replace('uploads', 'parsed'),
    };
    await s3.copyObject(copyParams).promise();

    const deleteParams = {
      Bucket: s3BucketName,
      Key: s3BucketKey,
    };
    await s3.deleteObject(deleteParams).promise();
  } catch (error) {
    console.log(error);
  }
}
