import { handlerPath } from '@libs/handler-resolver';

export const getProductList = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/products',
      },
    },
  ],
};
