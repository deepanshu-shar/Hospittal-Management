import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { loginValidation } from '../validators/auth.validators.js';

const router = Router();

router.post('/login', validateRequest(loginValidation), login);

export default router;
