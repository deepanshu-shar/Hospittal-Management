import {
  listDepartments,
  findDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from '../models/departments.model.js';

export const getDepartments = async (req, res, next) => {
  try {
    const { q } = req.query;
    const departments = await listDepartments({ search: q });
    res.json({ data: departments });
  } catch (error) {
    next(error);
  }
};

export const getDepartmentById = async (req, res, next) => {
  try {
    const department = await findDepartmentById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found.' });
    }
    return res.json({ data: department });
  } catch (error) {
    return next(error);
  }
};

export const createDepartmentHandler = async (req, res, next) => {
  try {
    const department = await createDepartment(req.body);
    res.status(201).json({ data: department });
  } catch (error) {
    next(error);
  }
};

export const updateDepartmentHandler = async (req, res, next) => {
  try {
    const department = await findDepartmentById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found.' });
    }
    const updated = await updateDepartment(req.params.id, req.body);
    return res.json({ data: updated });
  } catch (error) {
    return next(error);
  }
};

export const deleteDepartmentHandler = async (req, res, next) => {
  try {
    const department = await findDepartmentById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found.' });
    }
    await deleteDepartment(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
