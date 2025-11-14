import { findAdminByEmail } from '../models/admin.model.js';
import { comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await findAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isValid = await comparePassword(password, admin.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = signToken({ sub: admin.id, role: admin.role, email: admin.email, name: admin.name });

    return res.json({
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    return next(error);
  }
};
