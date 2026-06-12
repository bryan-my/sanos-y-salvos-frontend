import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MascotaDetalle from './pages/MascotaDetalle';
import Mascotas from './pages/Mascotas';
import RegistrarMascota from './pages/RegistrarMascota';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ReportarAvistamiento from './pages/ReportarAvistamiento';
import BuzonCoincidencias from './pages/BuzonCoincidencias';
import './App.css';

function App() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registrar-mascota" element={<RegistrarMascota />} />
        <Route path="/reportar-avistamiento" element={<ReportarAvistamiento />} />
        <Route path="/mascotas" element={<Mascotas />} />
        <Route path="/mascotas/:id" element={<MascotaDetalle />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to={isAdmin ? '/admin' : '/dashboard'} /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to={isAdmin ? '/admin' : '/dashboard'} /> : <Register />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buzon-coincidencias"
          element={
            <ProtectedRoute>
              <BuzonCoincidencias />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
