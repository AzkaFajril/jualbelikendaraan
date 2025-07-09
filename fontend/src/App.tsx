import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./Pages/users/register";
import Login from "./Pages/users/login";
import AdminDashboard from "./Pages/admin/admindashboard";
import Profile from "./Pages/profile";
import Home from "./Pages/componets/Home";
import UploadKendaraan from "./Pages/componets/itemKendaraan/upload";
import DetailKendaraan from "./Pages/componets/itemKendaraan/clickdetail";
import TawarCepatForm from "./Pages/componets/tawarcepat";


export default function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/UploadKendaraan" element={<UploadKendaraan/>} />
        <Route path="/DetailKendaraan" element={<DetailKendaraan/>} />
        <Route path="/DetailKendaraan/:id" element={<DetailKendaraan/>} />
        <Route path="/DetailKendaraan/:id" element={<DetailKendaraan />} />
        <Route path="/TawarCepatForm" element={<TawarCepatForm />} />
      </Routes>
    </Router>
  );
}
