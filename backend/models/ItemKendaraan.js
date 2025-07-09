import mongoose from 'mongoose';

const itemKendaraanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tipe: { type: String},
  merk: { type: String },
  model: { type: String },
  varian: { type: String },
  harga: { type: Number, required: true },
  jarakTempuh: { type: Number, required: true },
  lokasi: { type: String, required: true },
  kondisi: {
    pilih: { type: String } // contoh: "Baik", "Bekas", dll
  },
  pajak: {
    pilih: { type: String }
  },
  modifikasi: { type: String, required: true  },
  kelengkapan: [{ type: String }], // ['STNK', 'BPKB', 'Buku Servis']
  dokumen: [{ type: String, required: true  }], // array of document URLs (scan STNK, BPKB, dll)
  deskripsi: { type: String, required: true },
  images: [{ type: String }], // array of image URLs
  createdAt: { type: Date, default: Date.now },
  warna: {type:String},
  alamat: {type:String},
  telepon: {type:String},
  bqa: { type: String },
});

export default mongoose.model('ItemKendaraan', itemKendaraanSchema);
