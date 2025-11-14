import { body, param } from 'express-validator';

const baseDoctorRules = [
  body('firstName').trim().notEmpty().withMessage('First name is required.'),
  body('lastName').trim().notEmpty().withMessage('Last name is required.'),
  body('email').isEmail().withMessage('Valid email is required.'),
  body('phone').trim().notEmpty().withMessage('Phone is required.'),
  body('specialization').trim().notEmpty().withMessage('Specialization is required.'),
  body('departmentId').optional({ nullable: true }).isInt({ min: 1 }).withMessage('Department must be a valid id.')
];

export const doctorIdParam = [param('id').isInt({ min: 1 }).withMessage('Doctor id must be numeric.')];

export const createDoctorValidation = baseDoctorRules;
export const updateDoctorValidation = baseDoctorRules;
