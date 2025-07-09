import { useEffect, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  username: string;
  email: string;
  role: string;
  photo?: string;
  _id?: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Cek token, jika tidak ada redirect ke login
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!res.ok) throw new Error('Gagal mengambil data profil');
        const data = await res.json();
        setProfile(data);
        if (data._id) localStorage.setItem('userId', data._id);
      } catch {
        setError('Gagal mengambil data profil');
      }
      setLoading(false);
    };
    fetchProfile();
  }, [navigate]);

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('photo', file);
    setUploading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/me/photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && profile) {
        setProfile({ ...profile, photo: data.photo });
      } else {
        alert(data.message || 'Gagal upload foto');
      }
    } catch {
      alert('Gagal upload foto');
    }
    setUploading(false);
  };

  const handleRemovePhoto = async () => {
    setUploading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/me/photo', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (res.ok && profile) {
        setProfile({ ...profile, photo: '' });
      } else {
        alert(data.message || 'Gagal hapus foto');
      }
    } catch {
      alert('Gagal hapus foto');
    }
    setUploading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Profil Akun</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {profile && (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <img
                src={profile.photo || 'https://ui-avatars.com/api/?name=' + profile.username}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border"
              />
              <label className="block">
                <span className="sr-only">Upload Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  disabled={uploading}
                />
              </label>
              <button
                onClick={handleRemovePhoto}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded shadow text-sm"
                disabled={uploading || !profile.photo}
              >
                Hapus Foto
              </button>
              {uploading && <span className="text-blue-600 text-sm">Uploading...</span>}
            </div>
            <div>
              <span className="font-semibold text-gray-700">Username:</span>
              <span className="ml-2 text-gray-900">{profile.username}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Email:</span>
              <span className="ml-2 text-gray-900">{profile.email}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Role:</span>
              <span className="ml-2 text-gray-900 capitalize">{profile.role}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
