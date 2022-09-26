import { handlerPath } from '@libs/handler-resolver';

export const getProductById = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/products/{id}',
      },
    },
  ],
};
