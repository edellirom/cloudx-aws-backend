import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { Product } from 'src/types';

const getProductById = async (event) => {
  const { id } = event.pathParameters;
  return formatJSONResponse<Product>({
    id,
    title: 'Product #1',
    description: 'Description of #1 product',
    price: 100,
  });
};

export const main = middyfy(getProductById);
