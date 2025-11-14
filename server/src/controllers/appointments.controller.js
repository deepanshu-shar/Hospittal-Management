import {
  listAppointments,
  findAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from '../models/appointments.model.js';

export const getAppointments = async (req, res, next) => {
  try {
    const { q, status, doctorId, patientId, from, to } = req.query;
    const appointments = await listAppointments({
      search: q,
      status,
      doctorId,
      patientId,
      fromDate: from,
      toDate: to
    });
    res.json({ data: appointments });
  } catch (error) {
    next(error);
  }
};

export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await findAppointmentById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }
    return res.json({ data: appointment });
  } catch (error) {
    return next(error);
  }
};

export const createAppointmentHandler = async (req, res, next) => {
  try {
    const appointment = await createAppointment(req.body);
    res.status(201).json({ data: appointment });
  } catch (error) {
    next(error);
  }
};

export const updateAppointmentHandler = async (req, res, next) => {
  try {
    const appointment = await findAppointmentById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }
    const updated = await updateAppointment(req.params.id, req.body);
    return res.json({ data: updated });
  } catch (error) {
    return next(error);
  }
};

export const deleteAppointmentHandler = async (req, res, next) => {
  try {
    const appointment = await findAppointmentById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }
    await deleteAppointment(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
