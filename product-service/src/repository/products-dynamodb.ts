import { Product } from 'src/types';
import AWS from 'aws-sdk';

export class ProductsRepository {
  constructor(protected db: AWS.DynamoDB.DocumentClient) {}

  getProductTableName = (): AWS.DynamoDB.DocumentClient.ScanInput => ({
    TableName: process.env.PRODUCTS_TABLE_NAME,
  });

  getStocksTableName = (): AWS.DynamoDB.DocumentClient.ScanInput => ({
    TableName: process.env.STOCKS_TABLE_NAME,
  });

  async getProducts(): Promise<Product[]> {
    const products = await this.db.scan(this.getProductTableName()).promise();

    const stocks = await this.db.scan(this.getStocksTableName()).promise();

    const stockByProductId = stocks.Items.reduce((acc, item) => {
      const { product_id, count } = item;
      return { ...acc, [product_id]: count };
    }, {});

    const productsItems = products.Items.map((item): unknown => {
      const count = stockByProductId[item.id];
      return { ...item, count };
    });

    return productsItems as Product[];
  }

  async getProductById(id: string): Promise<Product> {
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
    try {
      const result = await this.db.transactGet(params).promise();

      return result.Responses.reduce(
        (res, response) => (res = { ...res, ...response.Item }),
        {}
      ) as Product;
    } catch (error) {
      console.log(error);
    }
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
