import {
  listDoctors,
  findDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
} from '../models/doctors.model.js';

export const getDoctors = async (req, res, next) => {
  try {
    const { q, departmentId } = req.query;
    const doctors = await listDoctors({ search: q, departmentId });
    res.json({ data: doctors });
  } catch (error) {
    next(error);
  }
};

export const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await findDoctorById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }
    return res.json({ data: doctor });
  } catch (error) {
    return next(error);
  }
};

export const createDoctorHandler = async (req, res, next) => {
  try {
    const doctor = await createDoctor(req.body);
    res.status(201).json({ data: doctor });
  } catch (error) {
    next(error);
  }
};

export const updateDoctorHandler = async (req, res, next) => {
  try {
    const doctor = await findDoctorById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }
    const updated = await updateDoctor(req.params.id, req.body);
    return res.json({ data: updated });
  } catch (error) {
    return next(error);
  }
};

export const deleteDoctorHandler = async (req, res, next) => {
  try {
    const doctor = await findDoctorById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }
    await deleteDoctor(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
