import { body, param } from 'express-validator';

const basePatientRules = [
  body('firstName').trim().notEmpty().withMessage('First name is required.'),
  body('lastName').trim().notEmpty().withMessage('Last name is required.'),
  body('email').isEmail().withMessage('Valid email is required.'),
  body('phone').trim().notEmpty().withMessage('Phone is required.'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required.'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other.'),
  body('address').trim().notEmpty().withMessage('Address is required.'),
  body('departmentId').optional({ nullable: true }).isInt({ min: 1 }).withMessage('Department must be a valid id.')
];

export const patientIdParam = [param('id').isInt({ min: 1 }).withMessage('Patient id must be numeric.')];

export const createPatientValidation = basePatientRules;

export const updatePatientValidation = basePatientRules;
