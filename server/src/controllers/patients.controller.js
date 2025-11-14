import {
  listPatients,
  findPatientById,
  createPatient,
  updatePatient,
  deletePatient
} from '../models/patients.model.js';

export const getPatients = async (req, res, next) => {
  try {
    const { q, departmentId } = req.query;
    const patients = await listPatients({ search: q, departmentId });
    res.json({ data: patients });
  } catch (error) {
    next(error);
  }
};

export const getPatientById = async (req, res, next) => {
  try {
    const patient = await findPatientById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }
    return res.json({ data: patient });
  } catch (error) {
    return next(error);
  }
};

export const createPatientHandler = async (req, res, next) => {
  try {
    const patient = await createPatient(req.body);
    res.status(201).json({ data: patient });
  } catch (error) {
    next(error);
  }
};

export const updatePatientHandler = async (req, res, next) => {
  try {
    const patient = await findPatientById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }
    const updated = await updatePatient(req.params.id, req.body);
    return res.json({ data: updated });
  } catch (error) {
    return next(error);
  }
};

export const deletePatientHandler = async (req, res, next) => {
  try {
    const patient = await findPatientById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }
    await deletePatient(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
