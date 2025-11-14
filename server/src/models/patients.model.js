import { query } from '../db/pool.js';

export const listPatients = async ({ search, departmentId }) => {
  let sql =
    'SELECT p.id, p.first_name AS firstName, p.last_name AS lastName, p.email, p.phone, p.date_of_birth AS dateOfBirth, p.gender, p.address, p.department_id AS departmentId, d.name AS departmentName, p.created_at AS createdAt, p.updated_at AS updatedAt FROM patients p LEFT JOIN departments d ON p.department_id = d.id WHERE 1=1';
  const params = [];

  if (search) {
    sql += ' AND (p.first_name LIKE ? OR p.last_name LIKE ? OR p.email LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  if (departmentId) {
    sql += ' AND p.department_id = ?';
    params.push(departmentId);
  }

  sql += ' ORDER BY p.created_at DESC';

  const [rows] = await query(sql, params);
  return rows;
};

export const findPatientById = async (id) => {
  const [rows] = await query(
    'SELECT p.id, p.first_name AS firstName, p.last_name AS lastName, p.email, p.phone, p.date_of_birth AS dateOfBirth, p.gender, p.address, p.department_id AS departmentId, p.created_at AS createdAt, p.updated_at AS updatedAt FROM patients p WHERE p.id = ?',
    [id]
  );
  return rows[0] || null;
};

export const createPatient = async (payload) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    gender,
    address,
    departmentId
  } = payload;

  const [result] = await query(
    'INSERT INTO patients (first_name, last_name, email, phone, date_of_birth, gender, address, department_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [firstName, lastName, email, phone, dateOfBirth, gender, address, departmentId || null]
  );

  return findPatientById(result.insertId);
};

export const updatePatient = async (id, payload) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    gender,
    address,
    departmentId
  } = payload;

  await query(
    'UPDATE patients SET first_name = ?, last_name = ?, email = ?, phone = ?, date_of_birth = ?, gender = ?, address = ?, department_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [firstName, lastName, email, phone, dateOfBirth, gender, address, departmentId || null, id]
  );

  return findPatientById(id);
};

export const deletePatient = async (id) => {
  await query('DELETE FROM patients WHERE id = ?', [id]);
};
