import mysql from 'mysql2/promise';
import { env } from '../config/env.js';

const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: env.DB_CONNECTION_LIMIT,
  queueLimit: 0
});

export const getConnection = () => pool.getConnection();
export const query = (sql, params = []) => pool.execute(sql, params);
export default pool;
