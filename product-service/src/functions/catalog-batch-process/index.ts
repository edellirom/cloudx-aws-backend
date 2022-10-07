import { handlerPath } from '@libs/handler-resolver';

export const catalogBatchProcess = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        batchSize: 5,
        arn: 'arn:aws:sqs:eu-west-1:064446435005:catalog-items-queue',
      },
    },
  ],
};

//example with resource Fn::GetAtt
// sqs: {
//   batchSize: '2',
//   arn: {
//     'Fn::GetAtt': ['CatalogItemsQueue', 'Arn'],
//   },
// },
