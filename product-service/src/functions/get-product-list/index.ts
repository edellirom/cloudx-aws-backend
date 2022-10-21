import { handlerPath } from '@libs/handler-resolver';
import * as dotenv from 'dotenv';

dotenv.config();

export const getProductList = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/products',
        cors: true,
        // authorizer: {
        //   arn: `${process.env.AWS_COGNITO_USER_POOL_ARN}`,
        //   type: 'COGNITO_USER_POOLS',
        // },
      },
    },
  ],
};
