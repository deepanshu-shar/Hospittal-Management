import { body } from 'express-validator';

export const loginValidation = [
  body('email').notEmpty().withMessage('Email is required.'),
  body('password').isLength({ min: 6 }).withMessage('Password is required.')
];
