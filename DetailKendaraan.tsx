import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Tipe data kendaraan
interface Item {
  _id: string;
  tipe: string;
  harga: number;
  jarakTempuh: number;
  lokasi: string;
  deskripsi: string;
  images: string[];
  createdAt: string;
  user?: { username: string };
  kelengkapan?: string[]; // Added kelengkapan field
}

const formatRupiah = (angka: number) => 'Rp ' + angka.toLocaleString('id-ID');

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
    <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row gap-8">
      {/* Gambar dan carousel */}
      <div className="flex-1">
        <div className="relative">
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
      <div className="flex-1 max-w-md">
        <div className="text-xl font-bold mb-2">{item.tipe} <span className="text-gray-500">di {item.lokasi}</span></div>
        <div className="text-2xl font-bold text-blue-700 mb-4">{formatRupiah(item.harga)}</div>
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-semibold">Jarak Tempuh:</span> <span>{item.jarakTempuh} km</span>
        </div>
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-semibold">Tanggal Upload:</span> <span>{new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
        </div>
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-semibold">Penjual:</span> <span>{item.user?.username}</span>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded mt-4 w-full">Hubungi Penjual</button>
      </div>
      {/* Deskripsi dan kelengkapan */}
      <div className="w-full mt-8 md:mt-0 md:w-2/3">
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
    </div>
  );
};

export default DetailKendaraan; 