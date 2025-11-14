import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Replicate __dirname functionality in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'deepanshu@1122';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '112233';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Deepanshu';

async function run() {
  console.log('--- Seeding Admin: Database Connection Details ---');
  console.log('Host:', process.env.DB_HOST);
  console.log('User:', process.env.DB_USER);
  console.log('Password Set:', !!process.env.DB_PASSWORD);
  console.log('Database:', process.env.DB_NAME);
  console.log('------------------------------------');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const [rows] = await connection.execute('SELECT id FROM admins WHERE email = ?', [ADMIN_EMAIL]);
    if (rows.length > 0) {
      console.log('Admin already exists. Skipping.');
      return;
    }

    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await connection.execute(
      'INSERT INTO admins (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [ADMIN_NAME, ADMIN_EMAIL, hash, 'admin']
    );

    console.log(`Admin seeded with email ${ADMIN_EMAIL}.`);
  } finally {
    await connection.end();
  }
}

run().catch((error) => {
  console.error('Failed to seed admin user:', error);
  process.exit(1);
});
