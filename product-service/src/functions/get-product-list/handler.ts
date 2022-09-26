import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { Product } from 'src/types';

const getProductList = async () => {
  const products = [
    {
      title: 'Product #1',
      description: 'Description of #1 product',
      price: 100,
    },
    {
      title: 'Product #2',
      description: 'Description of #2 product',
      price: 200,
    },
    {
      title: 'Product #3',
      description: 'Description of #3 product',
      price: 300,
    },
  ];
  return formatJSONResponse<Product[]>(products);
};

export const main = middyfy(getProductList);
