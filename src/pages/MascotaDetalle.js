import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mascotaService } from '../services/api';

const MascotaDetalle = () => {
  const { id } = useParams();
  const [mascota, setMascota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, isAdmin, logout, user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await mascotaService.getById(id);
        if (!isMounted) return;
        setMascota(res.data);
      } catch (e) {
        if (!isMounted) return;
        const status = e.response?.status;
        if (status === 401 || status === 403) {
          setError('Este detalle requiere iniciar sesión (o ajustar permisos del backend para lectura pública).');
        } else {
          setError('No se pudo cargar la mascota.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="site">
        <header className="site-header">
          <div className="container header-inner">
            <Link to="/" className="brand">
              <span className="brand-mark">S</span>
              <span className="brand-text">Sanos y Salvos</span>
            </Link>
            <div className="auth-area">
              {isAuthenticated ? (
                <>
                  <div className="auth-user">
                    <div className="auth-user-label">Conectado</div>
                    <div className="auth-user-value">{user?.email}</div>
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
            <div className="page-card">
              <p>Cargando...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="site">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">S</span>
            <span className="brand-text">Sanos y Salvos</span>
          </Link>
          <div className="auth-area">
            {isAuthenticated ? (
              <>
                <div className="auth-user">
                  <div className="auth-user-label">Conectado</div>
                  <div className="auth-user-value">{user?.email}</div>
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

          <div className="page-head">
            <h1>Detalle de mascota</h1>
            <div className="muted">ID: {id}</div>
          </div>

          {error && (
            <div className="page-alert">
              <p>{error}</p>
              <div className="page-actions">
                <Link to="/login" className="btn btn-primary">Iniciar sesión</Link>
                <Link to="/register" className="btn btn-outline">Registrarse</Link>
              </div>
            </div>
          )}

          {!error && mascota && (
            <div className="page-card">
              <div className="page-card-top">
                <h2 className="page-card-title">{mascota.nombre}</h2>
                <span className={`pill pill-${String(mascota.estado || '').toLowerCase()}`}>
                  {String(mascota.estado || '').replace('_', ' ')}
                </span>
              </div>

              {mascota.fotoUrl && (
                <img src={mascota.fotoUrl} alt={mascota.nombre} className="page-image" />
              )}

              <div className="page-grid">
                <div><strong>Especie:</strong> {mascota.especie}</div>
                <div><strong>Raza:</strong> {mascota.raza}</div>
                <div><strong>Color:</strong> {mascota.color}</div>
                <div><strong>Tamaño:</strong> {mascota.tamanho || mascota.tamaño}</div>
                <div><strong>Estado:</strong> {String(mascota.estado || '').replace('_', ' ')}</div>
                <div><strong>Última ubicación:</strong> {mascota.ultimaUbicacion || '-'}</div>
                <div><strong>Descripción:</strong> {mascota.descripcion || '-'}</div>
              </div>
            </div>
          )}
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

export default MascotaDetalle;
