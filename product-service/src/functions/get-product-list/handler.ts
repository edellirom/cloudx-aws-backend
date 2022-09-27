import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productsRepository } from 'src/repository';
import { Product } from 'src/types';

const getProductList = async () => {
  const products = await productsRepository.getProducts();
  return formatJSONResponse<Product[]>(products);
};

export const main = middyfy(getProductList);
