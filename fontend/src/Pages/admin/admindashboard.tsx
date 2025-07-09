import { useState, useEffect } from 'react';
import './admindashboard.css';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/users';

type User = {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
};

const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('users');
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      alert('Akses hanya untuk admin!');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white flex flex-col py-8 px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Admin Panel</h2>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li
              className={`cursor-pointer px-4 py-2 rounded ${activeMenu === 'dashboard' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
              onClick={() => setActiveMenu('dashboard')}
            >
              Dashboard
            </li>
            <li
              className={`cursor-pointer px-4 py-2 rounded ${activeMenu === 'users' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
              onClick={() => setActiveMenu('users')}
            >
              Manajemen User
            </li>
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-8 bg-red-500 hover:bg-red-600 text-white py-2 rounded shadow w-full"
        >
          Logout
        </button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeMenu === 'dashboard' && (
          <h1 className="text-3xl font-bold mb-6">Selamat datang di Dashboard Admin</h1>
        )}
        {activeMenu === 'users' && <UserManagement />}
      </main>
    </div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ username: '', email: '' });
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Gagal mengambil data user');
      const data: User[] = await res.json();
      setUsers(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Terjadi error');
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin hapus user ini?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal hapus user');
      setActionMsg('User berhasil dihapus');
      setUsers(users.filter(u => u._id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) setActionMsg(err.message);
      else setActionMsg('Terjadi error');
    }
  };

  const handleRoleChange = async (id: string, newRole: 'user' | 'admin') => {
    if (!window.confirm('Yakin ubah role user ini?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal ubah role');
      setActionMsg('Role user berhasil diubah');
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
    } catch (err: unknown) {
      if (err instanceof Error) setActionMsg(err.message);
      else setActionMsg('Terjadi error');
    }
  };

  // Edit user
  const openEditModal = (user: User) => {
    setEditUser(user);
    setEditForm({ username: user.username, email: user.email });
  };
  const closeEditModal = () => {
    setEditUser(null);
    setEditForm({ username: '', email: '' });
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    try {
      const res = await fetch(`${API_URL}/${editUser._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal update user');
      setActionMsg('User berhasil diupdate');
      setUsers(users.map(u => u._id === editUser._id ? { ...u, ...editForm } : u));
      closeEditModal();
    } catch (err: unknown) {
      if (err instanceof Error) setActionMsg(err.message);
      else setActionMsg('Terjadi error');
    }
  };

  // Filter users by search
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-blue-800">Manajemen User</h2>
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Cari username atau email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 border rounded w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {actionMsg && <p className="text-green-600">{actionMsg}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="py-2 px-4 text-left">Username</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id} className="border-b hover:bg-blue-50">
                <td className="py-2 px-4">{user.username}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">
                  <select
                    value={user.role}
                    onChange={e => handleRoleChange(user._id, e.target.value as 'user' | 'admin')}
                    className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="py-2 px-4 space-x-2">
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded shadow"
                    onClick={() => openEditModal(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow"
                    onClick={() => handleDelete(user._id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal Edit User */}
      {editUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-blue-700">Edit User</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-gray-700">Username</label>
                <input
                  name="username"
                  value={editForm.username}
                  onChange={handleEditChange}
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">Email</label>
                <input
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  required
                  type="email"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded shadow"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
