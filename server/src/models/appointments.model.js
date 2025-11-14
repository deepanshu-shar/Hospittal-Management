import { query } from '../db/pool.js';

export const listAppointments = async ({ search, status, doctorId, patientId, fromDate, toDate }) => {
  let sql =
    'SELECT a.id, a.patient_id AS patientId, a.doctor_id AS doctorId, a.scheduled_at AS scheduledAt, a.reason, a.status, a.notes, a.created_at AS createdAt, a.updated_at AS updatedAt, p.first_name AS patientFirstName, p.last_name AS patientLastName, d.first_name AS doctorFirstName, d.last_name AS doctorLastName FROM appointments a INNER JOIN patients p ON a.patient_id = p.id INNER JOIN doctors d ON a.doctor_id = d.id WHERE 1=1';
  const params = [];

  if (search) {
    sql += ' AND (p.first_name LIKE ? OR p.last_name LIKE ? OR d.first_name LIKE ? OR d.last_name LIKE ? OR a.reason LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term, term, term);
  }

  if (status) {
    sql += ' AND a.status = ?';
    params.push(status);
  }

  if (doctorId) {
    sql += ' AND a.doctor_id = ?';
    params.push(doctorId);
  }

  if (patientId) {
    sql += ' AND a.patient_id = ?';
    params.push(patientId);
  }

  if (fromDate) {
    sql += ' AND DATE(a.scheduled_at) >= ?';
    params.push(fromDate);
  }

  if (toDate) {
    sql += ' AND DATE(a.scheduled_at) <= ?';
    params.push(toDate);
  }

  sql += ' ORDER BY a.scheduled_at DESC';

  const [rows] = await query(sql, params);
  return rows;
};

export const findAppointmentById = async (id) => {
  const [rows] = await query(
    'SELECT id, patient_id AS patientId, doctor_id AS doctorId, scheduled_at AS scheduledAt, reason, status, notes, created_at AS createdAt, updated_at AS updatedAt FROM appointments WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

export const createAppointment = async (payload) => {
  const { patientId, doctorId, scheduledAt, reason, status, notes } = payload;

  const [result] = await query(
    'INSERT INTO appointments (patient_id, doctor_id, scheduled_at, reason, status, notes) VALUES (?, ?, ?, ?, ?, ?)',
    [patientId, doctorId, scheduledAt, reason, status || 'scheduled', notes || null]
  );

  return findAppointmentById(result.insertId);
};

export const updateAppointment = async (id, payload) => {
  const { patientId, doctorId, scheduledAt, reason, status, notes } = payload;

  await query(
    'UPDATE appointments SET patient_id = ?, doctor_id = ?, scheduled_at = ?, reason = ?, status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [patientId, doctorId, scheduledAt, reason, status || 'scheduled', notes || null, id]
  );

  return findAppointmentById(id);
};

export const deleteAppointment = async (id) => {
  await query('DELETE FROM appointments WHERE id = ?', [id]);
};
