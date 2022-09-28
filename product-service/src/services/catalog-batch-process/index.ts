import AWS from 'aws-sdk';
import { saveProduct } from '../../repository';
import { snsPublish } from './sns-publish';

export const catalogBatchProcessService = async (records) => {
  const sns = new AWS.SNS({ region: 'eu-west-1' });

  await Promise.all(
    records.map(async ({ body }) => {
      await saveProduct(JSON.parse(body));
    })
  );

  await snsPublish(sns, 'Products added to database!');
};
