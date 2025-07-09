import { useState, useEffect } from 'react';
import { dataMotor } from './dataMotor';
import type { ModelMotor, MerkMotor } from './dataMotor';

const kelengkapanList = [
  { label: 'STNK', icon: 'https://img.icons8.com/color/96/000000/checked-checkbox.png' },
  { label: 'BPKB', icon: 'https://img.icons8.com/color/96/000000/contract.png' },
  { label: 'Buku Servis', icon: 'https://img.icons8.com/color/96/000000/notebook.png' },
];
const rekomendasiFoto = [
  { label: 'Depan', icon: 'https://img.icons8.com/ios-filled/50/000000/motorcycle.png' },
  { label: 'Belakang', icon: 'https://img.icons8.com/ios-filled/50/000000/motorcycle.png' },
  { label: 'Samping Kanan', icon: 'https://img.icons8.com/ios-filled/50/000000/motorcycle.png' },
  { label: 'Samping Kiri', icon: 'https://img.icons8.com/ios-filled/50/000000/motorcycle.png' },
  { label: 'Klakson', icon: 'https://img.icons8.com/ios-filled/50/000000/motorcycle.png' },
  { label: 'Detail Lainnya', icon: 'https://img.icons8.com/ios-filled/50/000000/motorcycle.png' },
];

interface FormState {
  merk: string;
  model: string;
  varian: string;
  jarakTempuh: string;
  tipe: string;
  harga: string;
  lokasi: string;
  warna: string;
  kondisiPilih: string;
  pajakPilih: string;
  modifikasi: string;
  deskripsi: string;
  kelengkapan: string[];
  images: File[];
  dokumen: File[];
  alamat: string;
  telepon: string;
}

const Stepper = ({ step }: { step: number }) => (
  <div className="flex justify-center gap-8 mb-6">
    <div className={`flex flex-col items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}> <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold mb-1" style={{ borderColor: step >= 1 ? '#2563eb' : '#d1d5db' }}>1</div> <span>Data Kendaraan</span> </div>
    <div className={`flex flex-col items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}> <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold mb-1" style={{ borderColor: step >= 2 ? '#2563eb' : '#d1d5db' }}>2</div> <span>Kelengkapan</span> </div>
    <div className={`flex flex-col items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
      <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold mb-1" style={{ borderColor: step >= 3 ? '#2563eb' : '#d1d5db' }}>3</div>
      <span>Kontak</span>
    </div>
  </div>
);

const TawarCepatForm = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    merk: '', model: '', varian: '', jarakTempuh: '',
    tipe: '', harga: '', lokasi: '', warna: '',
    kondisiPilih: '', pajakPilih: '',
    modifikasi: '', deskripsi: '', kelengkapan: [], images: [], dokumen: [], alamat: '', telepon: ''
  });
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewDokumen, setPreviewDokumen] = useState<string[]>([]);
  const [selectedMerk, setSelectedMerk] = useState<MerkMotor | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelMotor | null>(null);
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!res.ok) throw new Error('Gagal mengambil data user');
        const data = await res.json();
        setUser({ username: data.username, email: data.email });
      } catch {
        setUser({ username: '-', email: '-' });
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleKelengkapan = (label: string) => {
    setForm(f => ({ ...f, kelengkapan: f.kelengkapan.includes(label) ? f.kelengkapan.filter((k) => k !== label) : [...f.kelengkapan, label] }));
  };
  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setForm(f => ({ ...f, images: files }));
    setPreviewImages(files.map((f) => URL.createObjectURL(f)));
  };
  const handleDokumen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setForm(f => ({ ...f, dokumen: files }));
    setPreviewDokumen(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submit
    setIsSubmitting(true);

    // Validasi sederhana di frontend
    if (!form.merk || !form.model || !form.varian  || form.images.length === 0) {
      alert('Mohon lengkapi semua field wajib dan upload minimal 1 foto kendaraan.');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('merk', form.merk);
    formData.append('model', form.model);
    formData.append('varian', form.varian);
    formData.append('jarakTempuh', form.jarakTempuh);
    formData.append('warna', form.warna);
    formData.append('harga', form.harga);
    formData.append('lokasi', form.lokasi);
    formData.append('kondisi', JSON.stringify({ pilih: form.kondisiPilih }));
    formData.append('pajak', JSON.stringify({ pilih: form.pajakPilih }));
    formData.append('modifikasi', form.modifikasi);
    formData.append('deskripsi', form.deskripsi);
    formData.append('kelengkapan', JSON.stringify(form.kelengkapan));
    formData.append('alamat', form.alamat);
    formData.append('telepon', '+62' + form.telepon);


    form.images.forEach((file) => {
      formData.append('images', file);
    });
    form.dokumen.forEach((file) => {
      formData.append('dokumen', file);
    });

    try {
      const res = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });
      
      const data = await res.json();
      if (!res.ok) {
        let msg = data.message || '';
        if (data.errors) {
          msg += '\n' + data.errors.map((e: { msg: string }) => e.msg).join('\n');
        }
        alert('Gagal menyimpan data: ' + msg);
        setIsSubmitting(false);
        return;
      }
      alert('Data berhasil disimpan!');
      // Reset form jika perlu
      setForm({
        merk: '', model: '', varian: '', jarakTempuh: '',
        tipe: '', harga: '', lokasi: '', warna: '',
        kondisiPilih: '', pajakPilih: '',alamat: '', telepon: '',
        modifikasi: '', deskripsi: '', kelengkapan: [], images: [], dokumen: []
      });
      setPreviewImages([]);
      setPreviewDokumen([]);
      setStep(1); // Kembali ke step 1
    } catch (err) {
      alert('Gagal menyimpan data: ' + (err as Error).message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center py-8">
      <form
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-3xl border border-gray-100"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center text-2xl font-bold mb-2">Isi Form</h2>
        {/* Tampilkan username dan email */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between bg-blue-50 rounded-lg p-4 border border-blue-100">
  <div className="font-semibold text-gray-700">👤 {user?.username || '-'}</div>
  <div className="text-gray-500 text-sm">{user?.email || '-'}</div>
</div>
        <Stepper step={step} />
        {step === 1 && (
          <div className="space-y-10">
            {/* Detail Motor */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="md:w-1/4">
                <label className="font-bold text-lg mb-1 block">
                  Detail Motor <span className="text-red-500">*</span>
                </label>
                <p className="text-gray-500 text-sm">Informasi mengenai kondisi motor yang akan kamu jual</p>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Merk */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Merk</label>
                  <select
                    name="merk"
                    value={form.merk}
                    onChange={e => {
                      const merk = e.target.value;
                      setForm(f => ({ ...f, merk, model: '', varian: '' }));
                      const foundMerk = dataMotor.find(m => m.nama === merk) || null;
                      setSelectedMerk(foundMerk);
                      setSelectedModel(null);
                    }}
                    className="w-full rounded-full px-4 py-2 border border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  >
                    <option value="">Pilih merk</option>
                    {dataMotor.map(m => (
                      <option key={m.nama} value={m.nama}>{m.nama}</option>
                    ))}
                  </select>
                </div>
                {/* Model */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Model</label>
                  <select
                    name="model"
                    value={form.model}
                    onChange={e => {
                      const model = e.target.value;
                      setForm(f => ({ ...f, model, varian: '' }));
                      const foundModel = selectedMerk?.model.find(m => m.nama === model) || null;
                      setSelectedModel(foundModel);
                    }}
                    className="w-full rounded-full px-4 py-2 border border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    disabled={!selectedMerk}
                  >
                    <option value="">Pilih model</option>
                    {selectedMerk?.model.map(m => (
                      <option key={m.nama} value={m.nama}>{m.nama}</option>
                    ))}
                  </select>
                </div>
                {/* Varian */}
               
                <div>
                  <label className="block text-sm font-semibold mb-1">Variant</label>
                  <select
                    name="varian"
                    value={form.varian}
                    onChange={handleChange}
                    className="w-full rounded-full px-4 py-2 border border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    disabled={!selectedModel}
                  >
                    <option value="">Pilih varian</option>
                    {selectedModel?.varian.map(v => (
                      <option key={v.nama} value={v.nama}>{v.nama}</option>
                    ))}
                  </select>
                </div>
                {/* Kilometer */}
                <div className="col-span-1 md:col-span-3 flex items-end gap-2 mt-2">
                  <div className="flex flex-col w-40">
                    <label className="block text-sm font-semibold mb-1">Kilometer</label>
                    <div className="flex">
                      <input
                        name="jarakTempuh"
                        value={form.jarakTempuh}
                        onChange={handleChange}
                        placeholder="0"
                        type="number"
                        min="0"
                        className="w-full rounded-full px-4 py-2 border border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition pr-12"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">KM</span>
                    </div>
                  </div>
                </div>
                {/* Warna */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Warna</label>
                  <select
                    name="warna"
                    value={form.warna}
                    onChange={handleChange}
                    className="w-full rounded-full px-4 py-2 border border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  >
                    <option value="">Pilih warna</option>
                    <option value="Hitam">Hitam</option>
                    <option value="Putih">Putih</option>
                    <option value="Merah">Merah</option>
                    <option value="Biru">Biru</option>
                    <option value="Silver">Silver</option>
                    <option value="Abu-abu">Abu-abu</option>
                    <option value="Coklat">Coklat</option>
                    <option value="Hijau">Hijau</option>
                    <option value="Kuning">Kuning</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Kondisi Motor */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="md:w-1/4">
                <label className="font-bold text-lg mb-1 block">Kondisi Motor <span className="text-red-500">*</span></label>
                <p className="text-gray-500 text-sm">Kondisi motor saat ini</p>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kondisi */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Kondisi</label>
                  <select
                    name="kondisiPilih"
                    value={form.kondisiPilih}
                    onChange={handleChange}
                    className="w-full rounded-full px-4 py-2 border border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  >
                    <option value="">Pilih kondisi</option>
                    <option value="Baik">Baik</option>
                    <option value="Bekas">Bekas</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Pajak Kendaraan */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="md:w-1/4">
                <label className="font-bold text-lg mb-1 block">Pajak Kendaraan <span className="text-red-500">*</span></label>
                <p className="text-gray-500 text-sm">Status pajak kendaraan saat ini</p>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pajak Pilih */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Status Pajak</label>
                  <select
                    name="pajakPilih"
                    value={form.pajakPilih}
                    onChange={handleChange}
                    className="w-full rounded-full px-4 py-2 border border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  >
                    <option value="">Pilih status pajak</option>
                    <option value="Hidup">Hidup</option>
                    <option value="Mati">Mati</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Lokasi & Harga */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="md:w-1/4">
                <label className="font-bold text-lg mb-1 block">Lokasi & Harga <span className="text-red-500">*</span></label>
                <p className="text-gray-500 text-sm">Isi lokasi dan harga kendaraan</p>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Lokasi */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Lokasi</label>
                  <input
                    name="lokasi"
                    value={form.lokasi}
                    onChange={handleChange}
                    placeholder="Lokasi"
                    className="w-full rounded-full px-4 py-2 border border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>
                {/* Harga */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Harga</label>
                  <input
                    name="harga"
                    value={form.harga}
                    onChange={handleChange}
                    placeholder="Harga"
                    className="w-full rounded-full px-4 py-2 border border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="font-semibold">Modifikasi & Detail</label>
              <textarea name="modifikasi" value={form.modifikasi} onChange={handleChange} className="input input-bordered w-full min-h-[60px] rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition" placeholder="Penjelasan modifikasi atau detail lain yang dilakukan" />
            </div>
            <div>
              <label className="font-semibold">Deskripsi</label>
              <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} className="input input-bordered w-full min-h-[60px] rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition" placeholder="Deskripsi kendaraan" />
            </div>
            <div className="flex justify-end">
              <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>Berikutnya</button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="font-semibold">Kelengkapan Dokumen</label>
              <div className="flex gap-6 mt-2">
                {kelengkapanList.map(k => (
                  <div key={k.label} className="flex flex-col items-center cursor-pointer" onClick={() => handleKelengkapan(k.label)}>
                    <img src={k.icon} alt={k.label} className={`w-20 h-20 mb-1 border-2 rounded-lg ${form.kelengkapan.includes(k.label) ? 'border-blue-600' : 'border-gray-200'}`} />
                    <span className="text-xs text-gray-700">{k.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="font-semibold">Upload foto kendaraan kamu</label>
              <input type="file" multiple accept="image/*" onChange={handleImages} className="block mt-2" />
              <div className="flex gap-3 mt-2 flex-wrap">
                {previewImages.map((img, i) => (
                  <img key={i} src={img} alt="preview" className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm" />
                ))}
              </div>
            </div>
            <div>
              <label className="font-semibold">Upload dokumen (opsional)</label>
              <input type="file" multiple accept="image/*,.pdf" onChange={handleDokumen} className="block mt-2" />
              <div className="flex gap-3 mt-2 flex-wrap">
                {previewDokumen.map((img, i) => (
                  <img key={i} src={img} alt="dokumen" className="w-16 h-16 object-cover rounded border" />
                ))}
              </div>
            </div>
            <div>
              <label className="font-semibold">Rekomendasi Foto</label>
              <div className="flex gap-4 mt-2 flex-wrap">
                {rekomendasiFoto.map((r, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <img src={r.icon} alt={r.label} className="w-12 h-12 mb-1" />
                    <span className="text-xs text-gray-700">{r.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <button type="button" className="btn" onClick={() => setStep(1)}>Kembali</button>
              <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>Berikutnya</button>
            </div>
          </div>   
        )}
        {step === 3 && (
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="md:w-1/4">
                <label className="font-bold text-lg mb-1 block">
                  Kontak Penjual <span className="text-red-500">*</span>
                </label>
                <p className="text-gray-500 text-sm">Masukkan alamat dan nomor telepon yang bisa dihubungi</p>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Alamat</label>
                  <input
                    type="text"
                    name="alamat"
                    value={form.alamat}
                    onChange={handleChange}
                    className="w-full rounded-full px-4 py-2 border border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    placeholder="Alamat lengkap"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Nomor Telepon</label>
                  <div className="flex items-center">
                    <span className="rounded-l-full px-4 py-2 border border-r-0 border-gray-200 bg-gray-100 text-gray-500 select-none">+62</span>
                    <input
                      type="tel"
                      name="telepon"
                      value={form.telepon}
                      onChange={e => {
                        // Hanya angka, tidak boleh awalan 0
                        let val = e.target.value.replace(/[^0-9]/g, '');
                        if (val.startsWith('0')) val = val.slice(1);
                        setForm(f => ({ ...f, telepon: val }));
                      }}
                      className="w-full rounded-r-full px-4 py-2 border border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                      placeholder="8123456789"
                      required
                      maxLength={13}
                    />

                    
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Format: 812xxxxxxx</div>
                </div>
                  <div className="flex justify-between">
              <button type="button" className="btn" onClick={() => setStep(2)}>Kembali</button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
            
              </div>
              
            </div>
          </div>
        )}
        
      </form>
    </div>
  );
};

export default TawarCepatForm;
