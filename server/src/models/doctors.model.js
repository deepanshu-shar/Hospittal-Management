import { query } from '../db/pool.js';

export const listDoctors = async ({ search, departmentId }) => {
  let sql =
    'SELECT d.id, d.first_name AS firstName, d.last_name AS lastName, d.email, d.phone, d.specialization, d.department_id AS departmentId, dept.name AS departmentName, d.created_at AS createdAt, d.updated_at AS updatedAt FROM doctors d LEFT JOIN departments dept ON d.department_id = dept.id WHERE 1=1';
  const params = [];

  if (search) {
    sql += ' AND (d.first_name LIKE ? OR d.last_name LIKE ? OR d.email LIKE ? OR d.specialization LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term, term);
  }

  if (departmentId) {
    sql += ' AND d.department_id = ?';
    params.push(departmentId);
  }

  sql += ' ORDER BY d.created_at DESC';

  const [rows] = await query(sql, params);
  return rows;
};

export const findDoctorById = async (id) => {
  const [rows] = await query(
    'SELECT d.id, d.first_name AS firstName, d.last_name AS lastName, d.email, d.phone, d.specialization, d.department_id AS departmentId, d.created_at AS createdAt, d.updated_at AS updatedAt FROM doctors d WHERE d.id = ?',
    [id]
  );
  return rows[0] || null;
};

export const createDoctor = async (payload) => {
  const { firstName, lastName, email, phone, specialization, departmentId } = payload;

  const [result] = await query(
    'INSERT INTO doctors (first_name, last_name, email, phone, specialization, department_id) VALUES (?, ?, ?, ?, ?, ?)',
    [firstName, lastName, email, phone, specialization, departmentId || null]
  );

  return findDoctorById(result.insertId);
};

export const updateDoctor = async (id, payload) => {
  const { firstName, lastName, email, phone, specialization, departmentId } = payload;

  await query(
    'UPDATE doctors SET first_name = ?, last_name = ?, email = ?, phone = ?, specialization = ?, department_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [firstName, lastName, email, phone, specialization, departmentId || null, id]
  );

  return findDoctorById(id);
};

export const deleteDoctor = async (id) => {
  await query('DELETE FROM doctors WHERE id = ?', [id]);
};
