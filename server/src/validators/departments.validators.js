import { body, param } from 'express-validator';

const baseDepartmentRules = [
  body('name').trim().notEmpty().withMessage('Department name is required.'),
  body('description').optional({ nullable: true }).isString().withMessage('Description must be text.')
];

export const departmentIdParam = [param('id').isInt({ min: 1 }).withMessage('Department id must be numeric.')];

export const createDepartmentValidation = baseDepartmentRules;
export const updateDepartmentValidation = baseDepartmentRules;
