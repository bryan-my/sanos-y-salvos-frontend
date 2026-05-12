import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mascotaService } from '../services/api';
import './Dashboard.css';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    loadMascotas(user.id);
  }, [user?.id]);

  const loadMascotas = async (userId) => {
    try {
      const response = await mascotaService.getByUsuario(userId);
      setMascotas(response.data);
    } catch (err) {
      setError('Error al cargar mascotas');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      PERDIDA: 'badge-lost',
      ENCONTRADA: 'badge-found',
      EN_CASA: 'badge-home',
    };
    return badges[estado] || '';
  };

  if (loading) {
    return <div className="dashboard-loading">Cargando...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <Link to="/" className="dashboard-navlink">Inicio</Link>
          <h1>Mis Mascotas</h1>
        </div>
        <div className="dashboard-header-actions">
          <Link to="/registrar-mascota" className="dashboard-navlink dashboard-navlink-primary">Registrar mascota</Link>
          <button onClick={logout} className="btn-logout">Cerrar Sesión</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="section-header">
          <h2>Hola, {user?.nombreCompleto || user?.email}</h2>
          <Link to="/registrar-mascota" className="btn-primary" style={{ textDecoration: 'none' }}>
            Añadir mascota
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="mascotas-grid">
          {mascotas.length === 0 ? (
            <p className="no-data">No tienes mascotas registradas</p>
          ) : (
            mascotas.map((mascota) => (
              <div key={mascota.id} className="mascota-card">
                {mascota.fotoUrl && (
                  <img src={mascota.fotoUrl} alt={mascota.nombre} className="mascota-img" />
                )}
                <div className="mascota-info">
                  <h3>{mascota.nombre}</h3>
                  <p><strong>Especie:</strong> {mascota.especie}</p>
                  <p><strong>Raza:</strong> {mascota.raza}</p>
                  <p><strong>Color:</strong> {mascota.color}</p>
                  <p><strong>Tamaño:</strong> {mascota.tamaño || mascota.tamanho}</p>
                  <span className={`badge ${getEstadoBadge(mascota.estado)}`}>
                    {mascota.estado.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
