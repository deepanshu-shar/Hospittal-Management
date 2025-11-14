import { Router } from 'express';
import {
  getDepartments,
  getDepartmentById,
  createDepartmentHandler,
  updateDepartmentHandler,
  deleteDepartmentHandler
} from '../controllers/departments.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  departmentIdParam,
  createDepartmentValidation,
  updateDepartmentValidation
} from '../validators/departments.validators.js';

const router = Router();

router.get('/departments', getDepartments);
router.get('/departments/:id', validateRequest(departmentIdParam), getDepartmentById);
router.post('/departments', validateRequest(createDepartmentValidation), createDepartmentHandler);
router.put('/departments/:id', validateRequest([...departmentIdParam, ...updateDepartmentValidation]), updateDepartmentHandler);
router.delete('/departments/:id', validateRequest(departmentIdParam), deleteDepartmentHandler);

export default router;
