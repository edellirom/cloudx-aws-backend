import { handlerPath } from '@libs/handler-resolver';

export const importProductsFile = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/import/products',
        cors: true,
        authorizer: {
          arn: `arn:aws:lambda:eu-west-1:064446435005:function:authorization-service-dev-basicAuthorizer`,
          identitySource: 'method.request.header.Authorization',
          type: 'token',
          resultTtlInSeconds: 0,
        },
      },
    },
  ],
};
