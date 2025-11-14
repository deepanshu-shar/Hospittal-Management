import { query } from '../db/pool.js';

export const findAdminByEmail = async (email) => {
  const [rows] = await query('SELECT id, name, email, password_hash AS passwordHash, role FROM admins WHERE email = ?', [email]);
  return rows[0] || null;
};
