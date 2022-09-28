import AWS from 'aws-sdk';
export const snsPublish = async (
  sns: AWS.SNS,
  message: string
): Promise<AWS.SNS.PublishResponse> => {
  const publishParams = {
    Subject: 'Product Service',
    Message: message,
    TopicArn: process.env.SNS_CREATE_PRODUCT_TOPIC_ARN,
  };

  return sns
    .publish(publishParams, (error, data) => {
      if (error) {
        console.log('Product Service SNS publish Error: ', error);
      }
      console.log('Publish data: ', data);
    })
    .promise();
};
