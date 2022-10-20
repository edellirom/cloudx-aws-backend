import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productsRepository } from 'src/repository';
import { Product } from 'src/types';
import Joi from 'joi';
import { errorHandler } from 'src/app';

const getProductById = async (event) => {
  console.log('getProductById Request: ', event.pathParameters);
  const validationSchema = Joi.object({
    id: Joi.string().required().min(5),
  });
  try {
    const { id } = await validationSchema.validateAsync(event.pathParameters);
    const product = await productsRepository.getProductById(id);
    return formatJSONResponse<Product>(product);
  } catch (error) {
    return errorHandler(error);
  }
};

export const main = middyfy(getProductById);
