import express from 'express';
import { uploadKendaraanMulter, uploadKendaraan } from '../controllers/itemKendaraanController.js';
import auth from '../middlewares/auth.js';
import { getAllKendaraan, getKendaraanById } from '../controllers/itemKendaraanController.js';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/',
  auth,
  uploadKendaraanMulter.fields([
    { name: 'images', maxCount: 10 },
    { name: 'dokumen', maxCount: 10 }
  ]),
  [
    body('merk').notEmpty().withMessage('Merk wajib diisi'),
    body('model').notEmpty().withMessage('Model wajib diisi'),
    body('varian').notEmpty().withMessage('Varian wajib diisi'),    // ...validasi lain sesuai kebutuhan
  ],
  uploadKendaraan
);

router.get('/', getAllKendaraan);
router.get('/:id', getKendaraanById);

export default router;
