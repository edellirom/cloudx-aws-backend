import AWS from 'aws-sdk';

export const sqsSendMessage = <T>(sqs: AWS.SQS, sqsUrl: string, data: T) => {
  sqs.sendMessage(
    {
      QueueUrl: sqsUrl,
      MessageBody: JSON.stringify(data),
    },
    (error) => {
      if (error) {
        console.log(error);
      }
    }
  );
};
