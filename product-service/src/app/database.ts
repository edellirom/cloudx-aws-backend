import { ClientConfig, Pool, PoolClient } from 'pg';

const credentials: ClientConfig = {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
};

export class Db {
  constructor(private client: Pool) {}

  async query<T>(statement: string): Promise<T> {
    const client = await this.client.connect();
    try {
      console.log('Query statement: ', statement);
      const result = <T>(await this.client.query(statement)).rows;
      return result;
    } catch (error) {
      console.log(error);
    } finally {
      client.release();
    }
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>) {
    const client = await this.client.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

export const db = new Db(new Pool(credentials));
