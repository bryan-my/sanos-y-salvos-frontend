import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mascotaService } from '../services/api';

const Mascotas = () => {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    mascotaService
      .getLista()
      .then((res) => {
        if (!isMounted) return;
        setMascotas(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        if (!isMounted) return;
        setError('No se pudieron cargar las mascotas.');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const getEstadoLabel = (estado) => {
    if (estado === 'PERDIDA') return 'Perdida';
    if (estado === 'ENCONTRADA') return 'Encontrada';
    if (estado === 'EN_CASA') return 'En casa';
    return estado;
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

          <div className="page-head">
            <h1>Mascotas registradas</h1>
            <div className="muted">Listado público con todas las mascotas del sistema.</div>
          </div>

          {loading && <div className="muted">Cargando mascotas...</div>}
          {!loading && error && <div className="page-alert"><p>{error}</p></div>}
          {!loading && !error && mascotas.length === 0 && <div className="muted">Aún no hay mascotas registradas.</div>}

          {!loading && !error && mascotas.length > 0 && (
            <div className="card-grid">
              {mascotas.map((m) => (
                <article key={m.id} className="pet-card">
                  <div
                    className="pet-image"
                    style={{
                      backgroundImage: m.fotoUrl
                        ? `url(${m.fotoUrl})`
                        : "linear-gradient(135deg, rgba(47, 124, 246, 0.28), rgba(14, 165, 233, 0.18))",
                    }}
                  />
                  <div className="pet-body">
                    <div className="pet-top">
                      <h3 className="pet-title">{m.nombre}</h3>
                      {m.estado && (
                        <span className={`pill pill-${String(m.estado).toLowerCase()}`}>
                          {getEstadoLabel(String(m.estado))}
                        </span>
                      )}
                    </div>
                    <div className="pet-meta">{m.ultimaUbicacion || 'Ubicación no informada'}</div>
                    <div className="pet-actions">
                      <Link to={`/mascotas/${encodeURIComponent(m.id)}`} className="btn btn-ghost btn-sm">Ver detalle</Link>
                      <Link to="/registrar-mascota" className="btn btn-outline btn-sm">Registrar</Link>
                    </div>
                  </div>
                </article>
              ))}
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

export default Mascotas;

