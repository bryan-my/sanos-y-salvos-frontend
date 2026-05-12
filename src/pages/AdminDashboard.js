import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usuarioService, mascotaService } from '../services/api';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('usuarios');
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userMascotas, setUserMascotas] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usuariosRes] = await Promise.all([
        usuarioService.getLista()
      ]);
      setUsuarios(usuariosRes.data);
    } catch (err) {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const loadUserMascotas = async (userId) => {
    try {
      const response = await mascotaService.getByUsuario(userId);
      setUserMascotas(response.data);
      setSelectedUser(usuarios.find(u => u.id === userId));
    } catch (err) {
      setError('Error al cargar mascotas del usuario');
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
      <header className="dashboard-header admin-header">
        <h1>Panel de Administración</h1>
        <button onClick={logout} className="btn-logout">Cerrar Sesión</button>
      </header>

      <div className="dashboard-content">
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'usuarios' ? 'active' : ''}`}
            onClick={() => setActiveTab('usuarios')}
          >
            Usuarios ({usuarios.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'mascotas' ? 'active' : ''}`}
            onClick={() => setActiveTab('mascotas')}
          >
            Mascotas
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {activeTab === 'usuarios' && (
          <div className="usuarios-section">
            <h2>Usuarios Registrados</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Rol</th>
                    <th>Dirección</th>
                    <th>Fecha Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>{usuario.id}</td>
                      <td>{usuario.nombreCompleto}</td>
                      <td>{usuario.email}</td>
                      <td>{usuario.telefono}</td>
                      <td>
                        <span className={`badge ${usuario.rol === 'ADMINISTRADOR' ? 'badge-admin' : 'badge-user'}`}>
                          {usuario.rol}
                        </span>
                      </td>
                      <td>{usuario.direccion}</td>
                      <td>{new Date(usuario.fechaRegistro).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn-action"
                          onClick={() => loadUserMascotas(usuario.id)}
                        >
                          Ver Mascotas
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedUser && (
              <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3>Mascotas de {selectedUser.nombreCompleto}</h3>
                  <div className="mascotas-list">
                    {userMascotas.length === 0 ? (
                      <p>Este usuario no tiene mascotas registradas</p>
                    ) : (
                      userMascotas.map((mascota) => (
                        <div key={mascota.id} className="mascota-item">
                          <p><strong>Nombre:</strong> {mascota.nombre}</p>
                          <p><strong>Especie:</strong> {mascota.especie}</p>
                          <p><strong>Raza:</strong> {mascota.raza}</p>
                          <p><strong>Estado:</strong>
                            <span className={`badge ${getEstadoBadge(mascota.estado)}`}>
                              {mascota.estado.replace('_', ' ')}
                            </span>
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  <button className="btn-primary" onClick={() => setSelectedUser(null)}>
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'mascotas' && (
          <div className="mascotas-section">
            <h2>Todas las Mascotas</h2>
            <p className="info-text">
              Selecciona un usuario de la pestaña "Usuarios" para ver sus mascotas.
            </p>
            <div className="mascotas-grid">
              {usuarios.map((usuario) => (
                <div key={usuario.id} className="user-mascotas-section">
                  <h3 onClick={() => loadUserMascotas(usuario.id)} style={{cursor: 'pointer'}}>
                    {usuario.nombreCompleto}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
