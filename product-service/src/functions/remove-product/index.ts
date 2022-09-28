import { handlerPath } from '@libs/handler-resolver';

export const removeProduct = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: 'delete',
        path: '/products/{id}',
      },
    },
  ],
};
