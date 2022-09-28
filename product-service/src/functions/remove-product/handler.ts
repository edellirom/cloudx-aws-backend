import Joi from 'joi';
import { middyfy } from '@libs/lambda';
import { productsRepository } from 'src/repository';
import { errorHandler } from 'src/app';

const removeProduct = async (event) => {
  console.log('removeProduct Request: ', event.pathParameters);
  const validationSchema = Joi.object({
    id: Joi.string().required().min(5),
  });
  try {
    const { id } = await validationSchema.validateAsync(event.pathParameters);
    await productsRepository.removeProduct(id);
    return {
      statusCode: 204,
    };
  } catch (error) {
    return errorHandler(error);
  }
};

export const main = middyfy(removeProduct);
