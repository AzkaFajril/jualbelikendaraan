import ItemKendaraan from '../models/ItemKendaraan.js';
import cloudinary from '../utils/cloudinary.js';
import multer from 'multer';
import { validationResult } from 'express-validator';

const storage = multer.memoryStorage();
export const uploadKendaraanMulter = multer({ storage });

export const uploadKendaraan = async (req, res) => {
  // Validasi
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // Ambil semua field dari body
    const {
      tipe, harga, jarakTempuh, lokasi, deskripsi,
      merk, model, varian, tahun, kondisi, pajak, modifikasi, kelengkapan,telepon, alamat
    } = req.body;

    // Ambil file gambar dan dokumen
    const imageFiles = req.files && req.files['images'] ? req.files['images'] : [];
    const dokumenFiles = req.files && req.files['dokumen'] ? req.files['dokumen'] : [];

    if (!imageFiles || imageFiles.length === 0) {
      return res.status(400).json({ message: 'Minimal upload 1 foto kendaraan' });
    }

    // Upload semua foto kendaraan ke Cloudinary
    const imageUrls = [];
    for (const file of imageFiles) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'kendaraan', resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });
      imageUrls.push(result.secure_url);
    }

    // Upload file dokumen (scan STNK, BPKB, dll) ke Cloudinary
    const dokumenUrls = [];
    for (const file of dokumenFiles) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'dokumen_kendaraan', resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });
      dokumenUrls.push(result.secure_url);
    }

    // Parse field bertipe array/objek jika dikirim sebagai string
    let kelengkapanArr = kelengkapan;
    if (typeof kelengkapan === 'string') {
      try { kelengkapanArr = JSON.parse(kelengkapan); } catch { kelengkapanArr = [kelengkapan]; }
    }
    let kondisiObj = kondisi;
    if (typeof kondisi === 'string') {
      try { kondisiObj = JSON.parse(kondisi); } catch { kondisiObj = { pilih: kondisi, nilai: '' }; }
    }
    let pajakObj = pajak;
    if (typeof pajak === 'string') {
      try { pajakObj = JSON.parse(pajak); } catch { pajakObj = { pilih: pajak, nilai: '' }; }
    }

    const item = new ItemKendaraan({
      user: req.user.userId,
      tipe,
      merk,
      model,
      varian,
      tahun,
      harga,
      jarakTempuh,
      lokasi,
      kondisi: kondisiObj,
      pajak: pajakObj,
      modifikasi,
      kelengkapan: kelengkapanArr,
      dokumen: dokumenUrls,
      deskripsi,
      images: imageUrls,
      telepon,
      alamat,
      warna,
    });
    await item.save();
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllKendaraan = async (req, res) => {
  try {
    const items = await ItemKendaraan.find().populate('user', 'username').sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getKendaraanById = async (req, res) => {
  try {
    const item = await ItemKendaraan.findById(req.params.id).populate('user', 'username');
    if (!item) return res.status(404).json({ message: 'Kendaraan tidak ditemukan' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
