import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import authRouter from './routes/auth.routes.js';
import patientsRouter from './routes/patients.routes.js';
import doctorsRouter from './routes/doctors.routes.js';
import appointmentsRouter from './routes/appointments.routes.js';
import billingRouter from './routes/billing.routes.js';
import departmentsRouter from './routes/departments.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';
import { authenticate } from './middleware/auth.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan(env.NODE_ENV === 'test' ? 'tiny' : 'dev'));

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRouter);

app.use('/api/v1', authenticate, patientsRouter);
app.use('/api/v1', authenticate, doctorsRouter);
app.use('/api/v1', authenticate, appointmentsRouter);
app.use('/api/v1', authenticate, billingRouter);
app.use('/api/v1', authenticate, departmentsRouter);
app.use('/api/v1/dashboard', authenticate, dashboardRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
