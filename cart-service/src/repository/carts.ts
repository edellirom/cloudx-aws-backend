import { Carts } from 'src/types';
import { db, Db } from '../app/database';

export class CartsRepository {
  constructor(protected db: Db) {}

  async getCarts(): Promise<Carts[]> {
    return <Promise<Carts[]>>this.db.query(`
      SELECT c.id, c.user_id, c.created_at, c.updated_at 
      FROM carts c
    `);
  }

  async getCartById(id: string): Promise<Carts> {
    return <Promise<Carts>>this.db.query(`
      SELECT c.id, c.user_id, c.created_at, c.updated_at 
      FROM carts c
      WHERE p.id = '${id}'
    `);
  }

  async saveProduct(item: Carts): Promise<void> {
    await this.db.transaction(async client => {
      const productsResponse = await client.query(`
        INSERT INTO products (
          user_id,
        )
        VALUES (
          '${item.user_id}',
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

  async removeCart(id: string): Promise<void> {
    this.db.query(`
      DLETE FROM carts
      WHERE c.id = '${id}'
    `);
  }
}

export const productsRepository = new CartsRepository(db);
