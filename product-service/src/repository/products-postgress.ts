import { Product } from 'src/types';
import { db, Db } from '../app/database';

export class ProductsRepository {
  constructor(protected db: Db) {}

  async getProducts(): Promise<Product[]> {
    return <Promise<Product[]>>this.db.query(`
      SELECT p.id, p.title, p.description, p.price, s.count
      FROM products p
      JOIN stocks s 
      ON s.product_id = p.id 
    `);
  }

  async getProductById(id: string): Promise<Product> {
    return <Promise<Product>>this.db.query(`
      SELECT p.id, p.title, p.description, p.price, s.count
      FROM products p
      JOIN stocks s 
      ON s.product_id = p.id 
      WHERE p.id = '${id}'
    `);
  }

  async saveProduct(item: Product): Promise<void> {
    await this.db.transaction(async (client) => {
      const productsResponse = await client.query(`
        INSERT INTO products (
          title,
          description,
          price
        )
        VALUES (
          '${item.title}',
          '${item.description}',
          '${item.price}'
        )
        RETURNING id
      `);
      const { id } = productsResponse.rows[0];

      await client.query(`
      INSERT INTO stocks (
        product_id,
        count
      )
      VALUES (
        '${id}',
        ${item.count}
      )
      `);
    });
  }

  async removeProduct(id: string): Promise<void> {
    this.db.query(`
      DLETE FROM products
      WHERE p.id = '${id}'
    `);
  }
}
export const productsRepository = new ProductsRepository(db);
