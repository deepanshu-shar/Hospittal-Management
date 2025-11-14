import { Router } from 'express';
import {
  getAppointments,
  getAppointmentById,
  createAppointmentHandler,
  updateAppointmentHandler,
  deleteAppointmentHandler
} from '../controllers/appointments.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  appointmentIdParam,
  createAppointmentValidation,
  updateAppointmentValidation
} from '../validators/appointments.validators.js';

const router = Router();

router.get('/appointments', getAppointments);
router.get('/appointments/:id', validateRequest(appointmentIdParam), getAppointmentById);
router.post('/appointments', validateRequest(createAppointmentValidation), createAppointmentHandler);
router.put('/appointments/:id', validateRequest([...appointmentIdParam, ...updateAppointmentValidation]), updateAppointmentHandler);
router.delete('/appointments/:id', validateRequest(appointmentIdParam), deleteAppointmentHandler);

export default router;
