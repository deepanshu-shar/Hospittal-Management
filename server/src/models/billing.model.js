import { query } from '../db/pool.js';

export const listBills = async ({ search, status, patientId }) => {
  let sql =
    'SELECT b.id, b.invoice_number AS invoiceNumber, b.appointment_id AS appointmentId, b.patient_id AS patientId, b.amount, b.status, b.due_date AS dueDate, b.paid_at AS paidAt, b.payment_method AS paymentMethod, b.notes, b.created_at AS createdAt, b.updated_at AS updatedAt, p.first_name AS patientFirstName, p.last_name AS patientLastName FROM billing b INNER JOIN patients p ON b.patient_id = p.id WHERE 1=1';
  const params = [];

  if (search) {
    sql += ' AND (b.invoice_number LIKE ? OR p.first_name LIKE ? OR p.last_name LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  if (status) {
    sql += ' AND b.status = ?';
    params.push(status);
  }

  if (patientId) {
    sql += ' AND b.patient_id = ?';
    params.push(patientId);
  }

  sql += ' ORDER BY b.created_at DESC';

  const [rows] = await query(sql, params);
  return rows;
};

export const findBillById = async (id) => {
  const [rows] = await query(
    'SELECT id, invoice_number AS invoiceNumber, appointment_id AS appointmentId, patient_id AS patientId, amount, status, due_date AS dueDate, paid_at AS paidAt, payment_method AS paymentMethod, notes, created_at AS createdAt, updated_at AS updatedAt FROM billing WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

export const createBill = async (payload) => {
  const { invoiceNumber, appointmentId, patientId, amount, status, dueDate, paidAt, paymentMethod, notes } = payload;

  const [result] = await query(
    'INSERT INTO billing (invoice_number, appointment_id, patient_id, amount, status, due_date, paid_at, payment_method, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      invoiceNumber,
      appointmentId || null,
      patientId,
      amount,
      status || 'pending',
      dueDate,
      paidAt || null,
      paymentMethod || null,
      notes || null
    ]
  );

  return findBillById(result.insertId);
};

export const updateBill = async (id, payload) => {
  const { invoiceNumber, appointmentId, patientId, amount, status, dueDate, paidAt, paymentMethod, notes } = payload;

  await query(
    'UPDATE billing SET invoice_number = ?, appointment_id = ?, patient_id = ?, amount = ?, status = ?, due_date = ?, paid_at = ?, payment_method = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [
      invoiceNumber,
      appointmentId || null,
      patientId,
      amount,
      status || 'pending',
      dueDate,
      paidAt || null,
      paymentMethod || null,
      notes || null,
      id
    ]
  );

  return findBillById(id);
};

export const deleteBill = async (id) => {
  await query('DELETE FROM billing WHERE id = ?', [id]);
};
