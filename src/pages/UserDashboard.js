import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mascotaService } from '../services/api';
import './Dashboard.css';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    color: '',
    tamanho: '',
    fotoUrl: '',
    estado: 'EN_CASA',
    descripcion: '',
    ultimaUbicacion: '',
    idUsuario: user?.id || '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadMascotas();
  }, []);

  const loadMascotas = async () => {
    try {
      const response = await mascotaService.getByUsuario(user.id);
      setMascotas(response.data);
    } catch (err) {
      setError('Error al cargar mascotas');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await mascotaService.registrar(formData);
      setShowForm(false);
      setFormData({
        nombre: '',
        especie: '',
        raza: '',
        color: '',
        tamanho: '',
        fotoUrl: '',
        estado: 'EN_CASA',
        descripcion: '',
        ultimaUbicacion: '',
        idUsuario: user.id,
      });
      loadMascotas();
    } catch (err) {
      setError('Error al registrar mascota');
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
        <h1>Bienvenido, {user?.email}</h1>
        <button onClick={logout} className="btn-logout">Cerrar Sesión</button>
      </header>

      <div className="dashboard-content">
        <div className="section-header">
          <h2>Mis Mascotas</h2>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancelar' : 'Registrar Mascota'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <div className="form-card">
            <h3>Registrar Nueva Mascota</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Especie</label>
                  <select name="especie" value={formData.especie} onChange={handleChange} required>
                    <option value="">Seleccionar</option>
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Raza</label>
                  <input type="text" name="raza" value={formData.raza} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <input type="text" name="color" value={formData.color} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Tamaño</label>
                  <select name="tamanho" value={formData.tamanho} onChange={handleChange} required>
                    <option value="">Seleccionar</option>
                    <option value="Pequeño">Pequeño</option>
                    <option value="Mediano">Mediano</option>
                    <option value="Grande">Grande</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select name="estado" value={formData.estado} onChange={handleChange} required>
                    <option value="EN_CASA">En Casa</option>
                    <option value="PERDIDA">Perdida</option>
                    <option value="ENCONTRADA">Encontrada</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>URL Foto</label>
                <input type="text" name="fotoUrl" value={formData.fotoUrl} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Última Ubicación</label>
                <input type="text" name="ultimaUbicacion" value={formData.ultimaUbicacion} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="3" />
              </div>
              <button type="submit" className="btn-primary">Guardar</button>
            </form>
          </div>
        )}

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
                  <p><strong>Tamaño:</strong> {mascota.tamanho}</p>
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
