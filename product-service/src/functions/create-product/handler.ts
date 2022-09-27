import { v4 as uuidv4 } from 'uuid';
import { middyfy } from '@libs/lambda';
import { productsRepository } from 'src/repository';
import { Product } from 'src/types';
import Joi from 'joi';
import { errorHandler } from 'src/app';

const createProduct = async (event) => {
  console.log('createProduct Request: ', event.body);
  const validationSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
  });
  try {
    const { title, description, price } = await validationSchema.validateAsync(
      event.body
    );
    const product = <Product>{
      id: uuidv4(),
      title,
      description,
      price,
    };
    await productsRepository.saveProduct(product);
  } catch (error) {
    return errorHandler(error);
  }

  return {
    statusCode: 201,
  };
};

export const main = middyfy(createProduct);
