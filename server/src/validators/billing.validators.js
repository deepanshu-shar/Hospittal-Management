import { body, param } from 'express-validator';

const baseBillingRules = [
  body('invoiceNumber').trim().notEmpty().withMessage('Invoice number is required.'),
  body('appointmentId').optional({ nullable: true }).isInt({ min: 1 }).withMessage('Appointment id must be numeric.'),
  body('patientId').isInt({ min: 1 }).withMessage('Patient id is required.'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be zero or higher.'),
  body('status')
    .optional()
    .isIn(['pending', 'paid', 'cancelled'])
    .withMessage('Status must be pending, paid, or cancelled.'),
  body('dueDate').isISO8601().withMessage('Due date is required.'),
  body('paidAt').optional({ nullable: true }).isISO8601().withMessage('Paid at must be a valid date.'),
  body('paymentMethod').optional({ nullable: true }).isString().withMessage('Payment method must be text.'),
  body('notes').optional({ nullable: true }).isString().withMessage('Notes must be text.')
];

export const billIdParam = [param('id').isInt({ min: 1 }).withMessage('Invoice id must be numeric.')];

export const createBillValidation = baseBillingRules;
export const updateBillValidation = baseBillingRules;
