import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Replicate __dirname functionality in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });

const schemaPath = path.resolve(__dirname, '../db/schema.sql');

const setupDatabase = async () => {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  if (!DB_HOST || !DB_PORT || !DB_USER || !DB_NAME) {
    console.error('Database environment variables from .env file are not set correctly.');
    console.error('Please check your server/.env file.');
    console.error('Required variables: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME');
    process.exit(1);
  }

  let connection;
  try {
    // Connect without specifying a database to ensure we can create it
    connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      multipleStatements: true, // Allow multiple queries in one execution
    });

    console.log('Connected to MySQL server.');

    // Create the database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`Database "${DB_NAME}" is ready.`);

    // Switch to the newly created database
    await connection.changeUser({ database: DB_NAME });
    console.log(`Switched to database "${DB_NAME}".`);

    // Read and execute the schema.sql file
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schemaSql);
    console.log('Database schema has been successfully loaded.');

  } catch (error) {
    console.error('Failed to setup database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('MySQL connection closed.');
    }
  }
};

setupDatabase();
