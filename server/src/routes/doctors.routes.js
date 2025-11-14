import { Router } from 'express';
import {
  getDoctors,
  getDoctorById,
  createDoctorHandler,
  updateDoctorHandler,
  deleteDoctorHandler
} from '../controllers/doctors.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { doctorIdParam, createDoctorValidation, updateDoctorValidation } from '../validators/doctors.validators.js';

const router = Router();

router.get('/doctors', getDoctors);
router.get('/doctors/:id', validateRequest(doctorIdParam), getDoctorById);
router.post('/doctors', validateRequest(createDoctorValidation), createDoctorHandler);
router.put('/doctors/:id', validateRequest([...doctorIdParam, ...updateDoctorValidation]), updateDoctorHandler);
router.delete('/doctors/:id', validateRequest(doctorIdParam), deleteDoctorHandler);

export default router;
