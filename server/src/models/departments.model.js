import { query } from '../db/pool.js';

export const listDepartments = async ({ search }) => {
  let sql =
    'SELECT id, name, description, created_at AS createdAt, updated_at AS updatedAt FROM departments WHERE 1=1';
  const params = [];

  if (search) {
    sql += ' AND (name LIKE ? OR description LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term);
  }

  sql += ' ORDER BY name ASC';

  const [rows] = await query(sql, params);
  return rows;
};

export const findDepartmentById = async (id) => {
  const [rows] = await query(
    'SELECT id, name, description, created_at AS createdAt, updated_at AS updatedAt FROM departments WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

export const createDepartment = async ({ name, description }) => {
  const [result] = await query('INSERT INTO departments (name, description) VALUES (?, ?)', [name, description || null]);
  return findDepartmentById(result.insertId);
};

export const updateDepartment = async (id, { name, description }) => {
  await query('UPDATE departments SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [name, description || null, id]);
  return findDepartmentById(id);
};

export const deleteDepartment = async (id) => {
  await query('DELETE FROM departments WHERE id = ?', [id]);
};
