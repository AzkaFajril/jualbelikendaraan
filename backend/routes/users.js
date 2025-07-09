import express from 'express';
import { getAllUsers, updateUserRole, deleteUser, getMe } from '../controllers/authController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Semua endpoint ini hanya untuk admin (auth middleware)
router.get('/', auth, getAllUsers);
router.patch('/:id/role', auth, updateUserRole);
router.delete('/:id', auth, deleteUser);
router.get('/me', auth, getMe);

export default router; 