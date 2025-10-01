import { Router } from 'express';
import UserService from '../services/UserService';

const router = Router();

router.post('/auth/register', async (req, res, next) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: 'name, email e role são obrigatórios' });
    }

    const existingUser = await UserService.getUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({ message: 'Usuário já existe' });
    }

    const user = await UserService.createUser({ name, email, role });
    return res.status(201).json(user);
  } catch (error) {
    return next(error);
  }
});

router.get('/auth/:email', async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await UserService.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.json(user);
  } catch (error) {
    return next(error);
  }
});

export default router;
