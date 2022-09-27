import { Product } from 'src/types';
import AWS from 'aws-sdk';

export class ProductsRepository {
  constructor(protected db: AWS.DynamoDB.DocumentClient) {}

  async getProducts(): Promise<Product[]> {
    const result = await this.db
      .scan({ TableName: process.env.PRODUCTS_TABLE_NAME })
      .promise();
    return result.Items as Product[];
  }

  async getProductsStock(): Promise<Product[]> {
    const params = {
      RequestItems: {
        products: {
          Keys: [{ id: null }],
        },
        stocks: {
          Keys: [{ product_id: null }],
        },
      },
    };
    const result = await db.batchGet(params).promise();

    console.log(result.Responses.stocks);
    console.log(result.Responses.products);
    return [];
  }

  async getProductById(id: string): Promise<Product> {
    const params = {
      Key: {
        id,
      },
      TableName: process.env.PRODUCTS_TABLE_NAME,
    };
    return (await this.db.get(params).promise()).Item as Product;
  }

  async getProductStockById(id: string): Promise<Product> {
    const params = {
      TransactItems: [
        {
          Get: {
            TableName: process.env.PRODUCTS_TABLE_NAME,
            Key: {
              id,
            },
          },
        },
        {
          Get: {
            TableName: process.env.STOCKS_TABLE_NAME,
            Key: {
              product_id: id,
            },
          },
        },
      ],
    };
    const responses = (await this.db.transactGet(params).promise()).Responses;

    return responses.reduce(
      (res, response) => (res = { ...res, ...response.Item }),
      {}
    ) as Product;
  }

  async saveProduct(item: Product): Promise<void> {
    const params = {
      Item: item,
      TableName: process.env.PRODUCTS_TABLE_NAME,
    };
    await this.db.put(params).promise();
  }
}

export const productsRepository = new ProductsRepository(
  new AWS.DynamoDB.DocumentClient()
);
