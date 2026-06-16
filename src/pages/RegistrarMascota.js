import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../context/AuthContext';
import { mascotaService, geolocalizacionService } from '../services/api';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapaClickeable({ onPositionChange, markerPos }) {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng);
    },
  });

  if (!markerPos) {
    return null;
  }

  return (
    <Marker
      position={markerPos}
      draggable
      eventHandlers={{
        dragend(e) {
          const { lat, lng } = e.target.getLatLng();
          onPositionChange({ lat, lng });
        },
      }}
    />
  );
}

const RegistrarMascota = () => {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    color: '',
    tamanho: '',
    estado: 'EN_CASA',
    fotoUrl: '',
    ultimaUbicacion: '',
    descripcion: '',
    latitud: null,
    longitud: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePositionChange = (latlng) => {
    setFormData((prev) => ({
      ...prev,
      latitud: latlng.lat,
      longitud: latlng.lng,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setError('');
    setOk('');
    setLoading(true);

    try {
      const { latitud, longitud, tamanho, ...mascotaFields } = formData;
      const payload = {
        ...mascotaFields,
        idUsuario: user?.id,
        tamaño: tamanho,
      };
      const res = await mascotaService.registrar(payload);
      const idCreado = res.data?.id;
      
      // Si hay coordenadas, registrar la ubicación
      if (idCreado && latitud !== null && longitud !== null) {
        try {
          await geolocalizacionService.registrarUbicacion({
            idMascota: idCreado,
            latitud,
            longitud,
            descripcionLugar: formData.ultimaUbicacion,
          });
        } catch (ubicacionErr) {
          console.error('Error registering location:', ubicacionErr);
          // No interrumpir el flujo si falla el registro de ubicación
        }
      }
      
      setOk('Mascota registrada correctamente.');
      setFormData({
        nombre: '',
        especie: '',
        raza: '',
        color: '',
        tamanho: '',
        estado: 'EN_CASA',
        fotoUrl: '',
        ultimaUbicacion: '',
        descripcion: '',
        latitud: null,
        longitud: null,
      });
      if (idCreado) {
        navigate(`/mascotas/${encodeURIComponent(idCreado)}`);
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        setError('Necesitas iniciar sesión para registrar una mascota.');
      } else {
        setError('No se pudo registrar la mascota. Revisa los datos e intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">S</span>
            <span className="brand-text">Sanos y Salvos</span>
          </Link>

          <nav className="nav">
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/registrar-mascota" className="nav-link">Registrar mascota</Link>
            <Link to="/mascotas" className="nav-link">Mascotas</Link>
            {isAuthenticated && <Link to="/dashboard" className="nav-link">Mis mascotas</Link>}
          </nav>

          <div className="auth-area">
            {isAuthenticated ? (
              <>
                <div className="auth-user">
                  <div className="auth-user-label">Conectado</div>
                  <div className="auth-user-value">{user?.nombreCompleto || user?.email}</div>
                </div>
                <Link to={isAdmin ? '/admin' : '/dashboard'} className="btn btn-primary">
                  {isAdmin ? 'Panel Admin' : 'Mi Panel'}
                </Link>
                <button type="button" onClick={logout} className="btn btn-ghost">Cerrar sesión</button>
              </>
            ) : (
              <div className="auth-cta">
                <Link to="/login" className="btn btn-primary">Iniciar sesión</Link>
                <div className="auth-secondary">
                  <span>¿Primera vez?</span> <Link to="/register" className="inline-link">Regístrate</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="page">
        <div className="container page-inner">
          <div className="page-top">
            <Link to="/" className="inline-link">Volver al inicio</Link>
          </div>

          <div className="section-head">
            <h2>Registrar mascota</h2>
            <p>Completa el formulario para agregar una mascota. Si no has iniciado sesión, verás el formulario bloqueado.</p>
          </div>

          <div className="pet-form-card">
            {!isAuthenticated && (
              <div className="pet-form-locked">
                <div className="pet-form-locked-title">Inicia sesión para registrar</div>
                <div className="pet-form-locked-text">
                  El registro de mascotas requiere autenticación. Puedes ver las mascotas públicas desde el inicio.
                </div>
                <div className="pet-form-locked-actions">
                  <Link to="/login" className="btn btn-primary">Iniciar sesión</Link>
                  <Link to="/register" className="btn btn-outline">Crear cuenta</Link>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className={`pet-form ${!isAuthenticated ? 'pet-form-disabled' : ''}`}>
              <div className="pet-form-actions">
                <Link to="/" className="btn btn-ghost">Inicio</Link>
                {isAuthenticated && <Link to="/dashboard" className="btn btn-outline">Ver mis mascotas</Link>}
              </div>

              <div className="pet-form-grid">
                <div className="pet-field">
                  <label className="pet-label">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    disabled={!isAuthenticated || loading}
                    className="pet-input"
                    placeholder="Ej: Luna"
                  />
                </div>
                <div className="pet-field">
                  <label className="pet-label">Especie</label>
                  <select
                    name="especie"
                    value={formData.especie}
                    onChange={handleChange}
                    required
                    disabled={!isAuthenticated || loading}
                    className="pet-input"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="pet-field">
                  <label className="pet-label">Raza</label>
                  <input
                    type="text"
                    name="raza"
                    value={formData.raza}
                    onChange={handleChange}
                    disabled={!isAuthenticated || loading}
                    className="pet-input"
                    placeholder="Ej: Mestiza"
                  />
                </div>
                <div className="pet-field">
                  <label className="pet-label">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    required
                    disabled={!isAuthenticated || loading}
                    className="pet-input"
                    placeholder="Ej: Café"
                  />
                </div>
                <div className="pet-field">
                  <label className="pet-label">Tamaño</label>
                  <select
                    name="tamanho"
                    value={formData.tamanho}
                    onChange={handleChange}
                    required
                    disabled={!isAuthenticated || loading}
                    className="pet-input"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Pequeño">Pequeño</option>
                    <option value="Mediano">Mediano</option>
                    <option value="Grande">Grande</option>
                  </select>
                </div>
                <div className="pet-field">
                  <label className="pet-label">Estado</label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    required
                    disabled={!isAuthenticated || loading}
                    className="pet-input"
                  >
                    <option value="EN_CASA">En casa</option>
                    <option value="PERDIDA">Perdida</option>
                    <option value="ENCONTRADA">Encontrada</option>
                  </select>
                </div>
                <div className="pet-field pet-field-span">
                  <label className="pet-label">URL foto (opcional)</label>
                  <input
                    type="url"
                    name="fotoUrl"
                    value={formData.fotoUrl}
                    onChange={handleChange}
                    disabled={!isAuthenticated || loading}
                    className="pet-input"
                    placeholder="https://..."
                  />
                </div>
                <div className="pet-field pet-field-span">
                  <label className="pet-label">Última ubicación (opcional)</label>
                  <input
                    type="text"
                    name="ultimaUbicacion"
                    value={formData.ultimaUbicacion}
                    onChange={handleChange}
                    disabled={!isAuthenticated || loading}
                    className="pet-input"
                    placeholder="Ej: Ñuñoa, Santiago"
                  />
                </div>
                <div className="pet-field pet-field-span">
                  <label className="pet-label">Ubicación en el mapa (clic o arrastra el marcador)</label>
                  <MapContainer
                    center={[-33.4569, -70.6812]}
                    zoom={13}
                    style={{ height: '300px', width: '100%', borderRadius: '10px' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapaClickeable
                      onPositionChange={handlePositionChange}
                      markerPos={formData.latitud != null && formData.longitud != null ? [formData.latitud, formData.longitud] : null}
                    />
                  </MapContainer>
                  {formData.latitud && formData.longitud && (
                    <p style={{ marginTop: '8px', color: '#666' }}>
                      Coordenadas seleccionadas: {formData.latitud.toFixed(4)}, {formData.longitud.toFixed(4)}
                    </p>
                  )}
                </div>
                <div className="pet-field pet-field-span">
                  <label className="pet-label">Descripción (opcional)</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    disabled={!isAuthenticated || loading}
                    className="pet-input pet-textarea"
                    rows="3"
                    placeholder="Se perdió / se encontró, rasgos, collar, etc."
                  />
                </div>
              </div>

              {(error || ok) && (
                <div className={`pet-form-alert ${ok ? 'pet-form-alert-ok' : 'pet-form-alert-error'}`}>
                  {ok || error}
                </div>
              )}

              <div className="pet-form-actions">
                <button type="submit" className="btn btn-primary" disabled={!isAuthenticated || loading}>
                  {loading ? 'Registrando...' : 'Registrar'}
                </button>
                {!isAuthenticated && <div className="pet-form-note">Inicia sesión para habilitar el formulario.</div>}
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <div className="container footer-bottom-inner footer-simple">
          <span>© {new Date().getFullYear()} Sanos y Salvos</span>
          <Link to="/" className="footer-link">Inicio</Link>
        </div>
      </footer>
    </div>
  );
};

export default RegistrarMascota;
