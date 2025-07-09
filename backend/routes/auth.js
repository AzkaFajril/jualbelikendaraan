import express from 'express';
import { register, login, getAllUsers, updateUserRole, deleteUser, getProfile, upload, uploadProfilePhoto, removeProfilePhoto } from '../controllers/authController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Register
router.post('/register', register);
// Login
router.post('/login', login);

// Profile
router.get('/me', auth, getProfile);
router.post('/me/photo', auth, upload.single('photo'), uploadProfilePhoto);
router.delete('/me/photo', auth, removeProfilePhoto);

// User management (admin only)
router.get('/users', auth, getAllUsers);
router.patch('/users/:id/role', auth, updateUserRole);
router.delete('/users/:id', auth, deleteUser);

export default router; 