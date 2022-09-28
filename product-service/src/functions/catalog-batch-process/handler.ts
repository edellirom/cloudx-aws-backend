import { middyfy } from '@libs/lambda';
import { catalogBatchProcessService } from 'src/services/catalog-batch-process';
import { SNSEvent } from 'aws-lambda';

const catalogBatchProcess = async (event: SNSEvent) => {
  try {
    await catalogBatchProcessService(event.Records);
  } catch (error) {
    console.log(error);
  }
  return {
    statusCode: 201,
  };
};

export const main = middyfy(catalogBatchProcess);
