import { Router } from 'express';
import {
  getBills,
  getBillById,
  createBillHandler,
  updateBillHandler,
  deleteBillHandler
} from '../controllers/billing.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { billIdParam, createBillValidation, updateBillValidation } from '../validators/billing.validators.js';

const router = Router();

router.get('/billing', getBills);
router.get('/billing/:id', validateRequest(billIdParam), getBillById);
router.post('/billing', validateRequest(createBillValidation), createBillHandler);
router.put('/billing/:id', validateRequest([...billIdParam, ...updateBillValidation]), updateBillHandler);
router.delete('/billing/:id', validateRequest(billIdParam), deleteBillHandler);

export default router;
