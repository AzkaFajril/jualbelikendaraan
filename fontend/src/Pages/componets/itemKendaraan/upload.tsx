import { useState, useEffect } from 'react';
import { dataMotor } from '../tawarcepat/dataMotor';
import type { ModelMotor, MerkMotor } from '../tawarcepat/dataMotor';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const formatRupiah = (value: string) => {
  const number = value.replace(/[^\d]/g, '');
  if (!number) return '';
  return 'Rp ' + parseInt(number, 10).toLocaleString('id-ID');
};

const UploadKendaraan = () => {
  const [tipe, setTipe] = useState('');
  const [harga, setHarga] = useState('');
  const [hargaInput, setHargaInput] = useState('');
  const [jarakTempuh, setJarakTempuh] = useState('');
  const [tahun, setTahun] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Dropdown motor
  const [merk, setMerk] = useState('');
  const [model, setModel] = useState('');
  const [varian, setVarian] = useState('');
  const [selectedMerk, setSelectedMerk] = useState<MerkMotor | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelMotor | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(files as File[]);
    setPreview(files.map(file => URL.createObjectURL(file)));
  };

  const handleHargaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    setHarga(raw);
    setHargaInput(formatRupiah(raw));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    // Validasi sederhana
    if (!merk || !model || !varian || !tahun || !jarakTempuh || !harga || images.length === 0) {
      setMessage('Mohon lengkapi semua field wajib dan upload minimal 1 foto kendaraan.');
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('merk', merk);
      formData.append('model', model);
      formData.append('varian', varian);
      formData.append('tahun', tahun);
      formData.append('jarakTempuh', jarakTempuh);
            formData.append('tipe', tipe);
      formData.append('harga', harga);
      formData.append('lokasi', lokasi);
      formData.append('deskripsi', deskripsi);
      images.forEach(img => formData.append('images', img));
      const res = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Kendaraan berhasil diupload!');
        setTipe(''); setHarga(''); setHargaInput(''); setJarakTempuh(''); setTahun(''); setLokasi(''); setDeskripsi(''); setImages([]); setPreview([]); setMerk(''); setModel(''); setVarian(''); setSelectedMerk(null); setSelectedModel(null);
      } else {
        let msg = data.message || '';
        if (data.errors) {
          msg += '\n' + data.errors.map((e: { msg: string }) => e.msg).join('\n');
        }
        setMessage(msg || 'Gagal upload kendaraan');
      }
    } catch {
      setMessage('Gagal upload kendaraan');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Jual Kendaraan</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Merk */}
          <select
            name="merk"
            value={merk}
            onChange={e => {
              const val = e.target.value;
              setMerk(val);
              setModel('');
              setVarian('');
              const found = dataMotor.find(m => m.nama === val) || null;
              setSelectedMerk(found);
              setSelectedModel(null);
            }}
            className="input input-bordered w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            required
          >
            <option value="">Pilih merk</option>
            {dataMotor.map(m => (
              <option key={m.nama} value={m.nama}>{m.nama}</option>
            ))}
          </select>
          {/* Model */}
          <select
            name="model"
            value={model}
            onChange={e => {
              const val = e.target.value;
              setModel(val);
              setVarian('');
              const found = selectedMerk?.model.find(m => m.nama === val) || null;
              setSelectedModel(found);
            }}
            className="input input-bordered w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            disabled={!selectedMerk}
            required
          >
            <option value="">Pilih model</option>
            {selectedMerk?.model.map(m => (
              <option key={m.nama} value={m.nama}>{m.nama}</option>
            ))}
          </select>
          {/* Varian */}
          <select
            name="varian"
            value={varian}
            onChange={e => setVarian(e.target.value)}
            className="input input-bordered w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            disabled={!selectedModel}
            required
          >
            <option value="">Pilih varian</option>
            {selectedModel?.varian.map(v => (
              <option key={v.nama} value={v.nama}>{v.nama}</option>
            ))}
          </select>
          {/* Kilometer */}
          <input name="kilometer" value={jarakTempuh} onChange={e => setJarakTempuh(e.target.value)} placeholder="Kilometer" className="input input-bordered w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition" />
          {/* Tahun */}
          <input name="tahun" value={tahun} onChange={e => setTahun(e.target.value)} placeholder="Tahun" className="input input-bordered w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition" />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Tipe Motor</label>
          <input value={tipe} onChange={e => setTipe(e.target.value)} required className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Harga</label>
          <input
            type="text"
            value={hargaInput}
            onChange={handleHargaChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Rp 0"
            inputMode="numeric"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Lokasi</label>
          <input value={lokasi} onChange={e => setLokasi(e.target.value)} required className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Deskripsi</label>
          <textarea
            value={deskripsi}
            onChange={e => setDeskripsi(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[80px]"
            placeholder="Tulis deskripsi kendaraan..."
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Foto Kendaraan (bisa lebih dari satu)</label>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          <div className="flex flex-wrap gap-2 mt-2">
            {preview.map((src, i) => (
              <img key={i} src={src} alt="preview" className="w-20 h-20 object-cover rounded border" />
            ))}
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          {loading ? 'Uploading...' : 'Upload Kendaraan'}
        </button>
        {message && <div className="text-center text-red-500 whitespace-pre-line">{message}</div>}
      </form>
    </div>
  );
};

export default UploadKendaraan;
