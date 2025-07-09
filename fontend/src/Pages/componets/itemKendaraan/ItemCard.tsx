import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Item = {
  _id: string;
  tipe: string;
  harga: number;
  jarakTempuh: number;
  lokasi: string;
  images: string[];
  createdAt: string;
  user?: { username: string };
};

const formatRupiah = (angka: number) => {
  return 'Rp ' + angka.toLocaleString('id-ID');
};

const ListKendaraan = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/items');
      const data = await res.json();
      setItems(data);
      setLoading(false);
    };
    fetchItems();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4 text-blue-700">
        {items.length} Motor bekas tersedia untuk dibeli
      </h2>
      {loading && <p>Loading...</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(item => (
          <Link to={`/DetailKendaraan/${item._id}`} key={item._id} className="bg-white rounded-lg shadow p-3 flex flex-col hover:shadow-lg transition cursor-pointer">
            <img
              src={item.images[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
              alt={item.tipe}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <div className="flex-1">
              <div className="font-bold text-base mb-1">{item.tipe}</div>
              <div className="text-gray-600 text-sm mb-1">{item.lokasi}</div>
              <div className="text-blue-700 font-semibold mb-1">{formatRupiah(item.harga)}</div>
              <div className="text-xs text-gray-500 mb-1">Jarak tempuh: {item.jarakTempuh} km</div>
              <div className="text-xs text-gray-400">Upload: {new Date(item.createdAt).toLocaleDateString('id-ID')}</div>
              {item.user && (
                <div className="text-xs text-gray-500 mt-1">Penjual: {item.user.username}</div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ListKendaraan;
