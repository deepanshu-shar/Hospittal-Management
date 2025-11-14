import { body, param } from 'express-validator';

const baseAppointmentRules = [
  body('patientId').isInt({ min: 1 }).withMessage('Patient id is required.'),
  body('doctorId').isInt({ min: 1 }).withMessage('Doctor id is required.'),
  body('scheduledAt').isISO8601().withMessage('Valid scheduled date and time is required.'),
  body('reason').trim().notEmpty().withMessage('Reason is required.'),
  body('status')
    .optional()
    .isIn(['scheduled', 'completed', 'cancelled'])
    .withMessage('Status must be scheduled, completed, or cancelled.'),
  body('notes').optional({ nullable: true }).isString().withMessage('Notes must be text.')
];

export const appointmentIdParam = [param('id').isInt({ min: 1 }).withMessage('Appointment id must be numeric.')];

export const createAppointmentValidation = baseAppointmentRules;
export const updateAppointmentValidation = baseAppointmentRules;
