import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from '../utils/cloudinary.js';
import multer from 'multer';

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    // Upload ke Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: 'profile_photos', resource_type: 'image' },
      async (error, result) => {
        if (error) return res.status(500).json({ message: error.message });
        // Simpan URL ke user
        const user = await User.findByIdAndUpdate(
          req.user.userId,
          { photo: result.secure_url },
          { new: true }
        ).select('-password');
        res.json({ photo: user.photo });
      }
    );
    result.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Cari user berdasarkan username atau email
    const user = await User.findOne({ $or: [ { username }, { email } ] });
    if (!user) {
      return res.status(400).json({ message: 'Username/email atau password salah' });
    }

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Username/email atau password salah' });
    }

    // Buat token dengan expiry yang lebih lama (7 hari)
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email, role: user.role },
      'your_jwt_secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Cek apakah username atau email sudah ada
    const existingUser = await User.findOne({ $or: [ { username }, { email } ] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username atau email sudah digunakan' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Buat user baru
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    await user.save();

    res.status(201).json({ message: 'Registrasi berhasil' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hanya admin
export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Akses ditolak' });
    }
    const users = await User.find({}, '-password'); // tanpa password
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Akses ditolak' });
    }
    const { id } = req.params;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Role tidak valid' });
    }
    const user = await User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true, context: 'query' });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json({ message: 'Role user berhasil diubah', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Akses ditolak' });
    }
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json({
      username: user.username,
      email: user.email,
      role: user.role,
      _id: user._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeProfilePhoto = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { photo: '' },
      { new: true }
    ).select('-password');
    res.json({ photo: '' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  // Pastikan req.user sudah diisi oleh middleware auth
  res.json({
    username: req.user.username,
    email: req.user.email
  });
}; 