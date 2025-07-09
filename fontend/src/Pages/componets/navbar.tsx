import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setIsLoggedIn(!!token);
    setRole(role);
    // Ambil id user dari localStorage jika sudah pernah fetch profile
    const id = localStorage.getItem('userId');
    setUserId(id);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setRole(null);
    setUserId(null);
    navigate('/login');
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex items-center justify-between shadow">
      <div className="flex items-center gap-6">
        <Link to="/" className="font-bold text-xl hover:text-blue-200">JualBeliKendaraan</Link>
        <Link to="/" className="hover:text-blue-200">Home</Link>
        {isLoggedIn && role === 'admin' && (
          <Link to="/admin" className="hover:text-blue-200">Dashboard</Link>
        )}
        {isLoggedIn && (
          <Link to={userId ? `/profile/${userId}` : '/profile'} className="hover:text-blue-200">Profile</Link>
        )},
        {isLoggedIn && (
          <Link to={userId ? `/upload/${userId}` : '/upload'} className="hover:text-blue-200">Profile</Link>
        )}
      </div>
      <div>
        {!isLoggedIn ? (
          <Link to="/login" className="bg-white text-blue-700 px-4 py-1 rounded hover:bg-blue-100 font-semibold">Login</Link>
        ) : (
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded font-semibold">Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
