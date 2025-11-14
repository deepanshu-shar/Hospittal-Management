import { Router } from 'express';
import {
  getPatients,
  getPatientById,
  createPatientHandler,
  updatePatientHandler,
  deletePatientHandler
} from '../controllers/patients.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createPatientValidation,
  updatePatientValidation,
  patientIdParam
} from '../validators/patients.validators.js';

const router = Router();

router.get('/patients', getPatients);
router.get('/patients/:id', validateRequest(patientIdParam), getPatientById);
router.post('/patients', validateRequest(createPatientValidation), createPatientHandler);
router.put('/patients/:id', validateRequest([...patientIdParam, ...updatePatientValidation]), updatePatientHandler);
router.delete('/patients/:id', validateRequest(patientIdParam), deletePatientHandler);

export default router;
