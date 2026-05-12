import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MascotaDetalle from './pages/MascotaDetalle';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
