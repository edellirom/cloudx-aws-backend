import { handlerPath } from '@libs/handler-resolver';

export const catalogBatchProcess = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: 'arn:aws:sqs:eu-west-1:064446435005:catalog-items-queue',
    },
  ],
};

// sqs: {
//   batchSize: '2',
//   arn: {
//     'Fn::GetAtt': ['CatalogItemsQueue', 'Arn'],
//   },
// },
