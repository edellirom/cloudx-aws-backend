import { handlerPath } from '@libs/handler-resolver';
import * as dotenv from 'dotenv';

dotenv.config();

export const importProductsFile = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/import/products',
        cors: true,
        authorizer: {
          arn: `${process.env.AWS_BASIC_AUTHORIZER_ARN}`,
          identitySource: 'method.request.header.Authorization',
          type: 'token',
          resultTtlInSeconds: 0,
        },
      },
    },
  ],
};
