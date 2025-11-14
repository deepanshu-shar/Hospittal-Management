import { query } from '../db/pool.js';

export const getSummary = async (req, res, next) => {
  try {
    const [rows] = await query(
      `SELECT
        (SELECT COUNT(*) FROM patients) AS patients,
        (SELECT COUNT(*) FROM doctors) AS doctors,
        (SELECT COUNT(*) FROM appointments) AS appointments,
        (SELECT COUNT(*) FROM billing) AS billing`
    );

    res.json({ data: rows[0] });
  } catch (error) {
    next(error);
  }
};
