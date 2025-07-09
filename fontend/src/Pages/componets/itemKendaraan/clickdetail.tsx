import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaMotorcycle, FaCalendarAlt, FaTachometerAlt, FaPalette, FaCogs, FaUser } from 'react-icons/fa';

interface Item {
  _id: string;
  tipe: string;
  harga: number;
  jarakTempuh: number;
  lokasi: string;
  deskripsi: string;
  images: string[];
  createdAt: string;
  tahun?: number;
  merk?: string;
  varian?: string;
  transmisi?: string;
  warna?: string;
  user?: { username: string };
  kelengkapan?: string[]; // Tambahkan field kelengkapan
  Merk?: string[]; // Tambahkan field kelengkapan
  model?: string[]; // Tambahkan field kelengkapan
  telepon: string;
  bqa?: string;
}

const formatRupiah = (angka: number) => 'Rp ' + angka.toLocaleString('id-ID');

const kelengkapan = [
  { label: 'STNK', icon: 'https://img.icons8.com/color/48/000000/checked-checkbox.png' },
  { label: 'BPKB', icon: 'https://img.icons8.com/color/48/000000/contract.png' },
  { label: 'Kunci Cadang', icon: 'https://img.icons8.com/color/48/000000/key.png' },
];

const DetailKendaraan = () => {
  const { id } = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/items/${id}`);
      const data = await res.json();
      setItem(data);
      setLoading(false);
    };
    fetchItem();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!item) return <div className="p-8 text-center text-red-500">Kendaraan tidak ditemukan</div>;

  return (
    <main>
    <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row gap-8">
    <div className="flex items-center gap-2 mb-2">
  <FaUser className="text-gray-500" />
  <span className="font-semibold">Penjual:</span>
  <span>{item.user?.username || 'Penjual'}</span>
</div>
<div>
    <strong>BQA:</strong> {item.bqa}
  </div>
      {/* Gambar dan carousel */}
      <div className="flex-1">
        <div className="relative bg-white rounded shadow p-2">
          <img
            src={item.images[imgIdx] || 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={item.tipe}
            className="w-full h-80 object-cover rounded mb-2 border"
          />
          {/* Carousel thumbnail */}
          <div className="flex gap-2 overflow-x-auto mt-2">
            {item.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                className={`w-16 h-16 object-cover rounded border cursor-pointer ${imgIdx === i ? 'border-blue-500' : ''}`}
                onClick={() => setImgIdx(i)}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Info kendaraan */}
      <div className="flex-1 max-w-md flex flex-col gap-4">
        <div className="bg-white rounded shadow p-6">
          <div className="text-xl font-bold mb-1 flex items-center gap-2">
            <FaMotorcycle className="text-gray-500" /> {item.tipe}
          </div>
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <FaMapMarkerAlt className="mr-1" /> {item.lokasi}
          </div>
          <div className="text-3xl font-bold text-blue-700 mb-4">{formatRupiah(item.harga)}</div>
          <div className="mb-4">
            <table className="w-full text-sm text-left">
              <tbody>
                <tr>
                  <td className="font-semibold py-1 flex items-center gap-1"><FaCalendarAlt /> Tahun Rilis</td>
                  <td>{item.tahun || '2023'}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-1 flex items-center gap-1"><FaCogs /> Merk</td>
                  <td>{item.merk || item.tipe}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-1 flex items-center gap-1"><FaCogs /> Merk</td>
                  <td>{item.model || item.tipe}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-1 flex items-center gap-1"><FaCogs /> Tipe/Varian</td>
                  <td>{item.varian || item.tipe}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-1 flex items-center gap-1"><FaCogs /> Transmisi</td>
                  <td>{item.transmisi || 'Matic'}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-1 flex items-center gap-1"><FaPalette /> Warna</td>
                  <td>{item.warna || 'Hitam'}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-1 flex items-center gap-1"><FaTachometerAlt /> Jarak Tempuh</td>
                  <td>{item.jarakTempuh} km</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <FaUser className="text-gray-500" />
            <span className="font-semibold">Penjual:</span>
            <span>{item.user?.username || 'Penjual'}</span>
          </div>
         
              {item.telepon ? (
  <a
    href={`https://wa.me/${item.telepon.replace(/[^0-9]/g, '')}`}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded w-full text-lg font-semibold shadow flex items-center justify-center gap-2"
  >
    Hubungi via WhatsApp
  </a>
) : (
  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded w-full text-lg font-semibold shadow">
    Hubungi Penjual
  </button>
)}
        </div>
        {/* Box info penjual */}
        <div className="bg-blue-50 rounded shadow p-4 flex items-center gap-4 mt-2">
          <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold text-blue-700 border">{item.user?.username?.[0]?.toUpperCase() || 'P'}</div>
          <div>
            <div className="font-semibold">{item.user?.username || 'Penjual'}</div>
            <div className="text-xs text-gray-500">Verified Seller</div>
          </div>
        </div>
      </div>
      {/* Deskripsi dan kelengkapan di bawah */}
    </div>
    <div className="max-w-6xl mx-auto p-4">
        <h3 className="font-bold text-lg mb-2">Informasi Produk</h3>
        <div className="whitespace-pre-line text-gray-700 mb-6">{item.deskripsi}</div>
        <h4 className="font-bold mb-2">Kelengkapan Berkas</h4>
        <div className="flex gap-4 mb-4">
          {kelengkapan
            .filter(k => item.kelengkapan && item.kelengkapan.includes(k.label))
            .map(k => (
              <div key={k.label} className="flex flex-col items-center">
                <img src={k.icon} alt={k.label} className="w-10 h-10 mb-1" />
                <span className="text-xs text-gray-700">{k.label}</span>
              </div>
            ))}
          {item.kelengkapan && item.kelengkapan.length === 0 && (
            <span className="text-xs text-gray-500">Tidak ada kelengkapan terdaftar</span>
          )}
        </div>
        <div className="text-xs text-gray-500">Diupdate pada: {new Date(item.createdAt).toLocaleDateString('id-ID')}</div>
      </div>
    </main>
    
  );
};

export default DetailKendaraan;
