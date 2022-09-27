export async function putObjectSignedUrl(
  s3: AWS.S3,
  s3BucketName: string,
  s3BucketKey: string,
  expires: number = 60,
  contentType: string = 'text/csv'
): Promise<string> {
  const params = {
    Bucket: s3BucketName,
    Key: s3BucketKey,
    Expires: expires,
    ContentType: contentType,
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
