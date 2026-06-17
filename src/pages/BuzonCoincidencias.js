import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { coincidenciasService } from '../services/api';
import MatchDetalleModal from '../components/MatchDetalleModal';
import { formatAvistamientoUbicacion } from '../utils/avistamientoUtils';
import './BuzonCoincidencias.css';

const BuzonCoincidencias = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [matchesPendientes, setMatchesPendientes] = useState([]);
  const [matchesAceptados, setMatchesAceptados] = useState([]);
  const [tabActivo, setTabActivo] = useState('pendientes');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [coincidenciaSeleccionada, setCoincidenciaSeleccionada] = useState(null);

  const fetchCoincidencias = async () => {
    try {
      const response = await coincidenciasService.getCoincidenciasPendientes();
      setMatchesPendientes(response.data || []);
    } catch (error) {
      console.error('Error al cargar coincidencias:', error);
      setMessage('Error al cargar las coincidencias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoincidencias();
  }, []);

  const handleAceptar = async (id) => {
    try {
      await coincidenciasService.actualizarEstadoCoincidencia(id, 'APROBADO');
      const matchAceptado = matchesPendientes.find(match => match.id === id);
      if (matchAceptado) {
        setMatchesPendientes(prev => prev.filter(match => match.id !== id));
        setMatchesAceptados(prev => [...prev, { ...matchAceptado, estado: 'APROBADO' }]);
      }
      setMessage('Coincidencia aceptada exitosamente');
    } catch (error) {
      console.error('Error al aceptar:', error);
      setMessage('Error al aceptar la coincidencia');
    }
  };

  const handleRechazar = async (id) => {
    try {
      await coincidenciasService.actualizarEstadoCoincidencia(id, 'DESCARTADO');
      setMatchesPendientes(prev => prev.filter(match => match.id !== id));
      setMessage('Coincidencia rechazada');
    } catch (error) {
      console.error('Error al rechazar:', error);
      setMessage('Error al rechazar la coincidencia');
    }
  };

  const handleVerDetalle = (coincidencia) => {
    setCoincidenciaSeleccionada(coincidencia);
    setModalAbierto(true);
  };

  const coincidenciasAMostrar = tabActivo === 'pendientes' ? matchesPendientes : matchesAceptados;

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
            <Link to="/dashboard" className="nav-link">Mi Panel</Link>
            {isAuthenticated && (
              <Link to="/buzon-coincidencias" className="nav-link nav-link-accent">Buzón de Matches</Link>
            )}
          </nav>

          <div className="auth-area">
            {isAuthenticated ? (
              <>
                <div className="auth-user">
                  <div className="auth-user-label">Conectado</div>
                  <div className="auth-user-value">{user?.nombreCompleto || user?.email}</div>
                </div>
                <button type="button" onClick={logout} className="btn btn-ghost">Cerrar sesión</button>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <main className="buzon-main">
        <section className="section">
          <div className="container buzon-container">
            <div className="section-head">
              <h1>Buzón de Coincidencias</h1>
              <p>Gestiona los matches generados entre mascotas perdidas y avistamientos</p>
            </div>

            <div className="buzon-tabs">
              <button
                onClick={() => setTabActivo('pendientes')}
                className={`buzon-tab${tabActivo === 'pendientes' ? ' buzon-tab--active' : ''}`}
              >
                Pendientes ({matchesPendientes.length})
              </button>
              <button
                onClick={() => setTabActivo('aceptadas')}
                className={`buzon-tab${tabActivo === 'aceptadas' ? ' buzon-tab--active' : ''}`}
              >
                Aceptadas ({matchesAceptados.length})
              </button>
            </div>

            {message && (
              <div className={`buzon-message ${message.includes('Error') ? 'buzon-message--error' : 'buzon-message--ok'}`}>
                {message}
              </div>
            )}

            {loading ? (
              <div className="buzon-loading">
                <p>Cargando coincidencias...</p>
              </div>
            ) : coincidenciasAMostrar.length === 0 ? (
              <div className="buzon-empty">
                <h3 className="buzon-empty__title">
                  {tabActivo === 'pendientes'
                    ? 'No hay coincidencias pendientes'
                    : 'No hay coincidencias aceptadas'}
                </h3>
                <p className="buzon-empty__text">
                  {tabActivo === 'pendientes'
                    ? '¡Genial! No tienes matches pendientes de revisión'
                    : 'Cuando aceptes un match, aparecerá aquí'}
                </p>
              </div>
            ) : (
              <div className="buzon-cards-grid">
                {coincidenciasAMostrar.map((coincidencia) => {
                  const esAlta = (coincidencia.porcentajeSimilitud ?? 0) >= 70;
                  return (
                    <div
                      key={coincidencia.id}
                      className={`buzon-card${tabActivo === 'aceptadas' ? ' buzon-card--clickable' : ''}`}
                      onClick={() => tabActivo === 'aceptadas' && handleVerDetalle(coincidencia)}
                    >
                      <div className="buzon-card__header">
                        <div className={`buzon-similarity ${esAlta ? 'buzon-similarity--high' : 'buzon-similarity--medium'}`}>
                          <div className={`buzon-similarity__value ${esAlta ? 'buzon-similarity__value--high' : 'buzon-similarity__value--medium'}`}>
                            {coincidencia.porcentajeSimilitud ? `${Math.round(coincidencia.porcentajeSimilitud)}%` : 'N/A'}
                          </div>
                          <div className="buzon-similarity__label">Similitud</div>
                        </div>

                        <div className="buzon-date">
                          <div className="buzon-date__label">Fecha del match</div>
                          <div className="buzon-date__value">
                            {coincidencia.fecha
                              ? new Date(coincidencia.fecha).toLocaleDateString('es-CL', {
                                  year: 'numeric', month: 'long', day: 'numeric',
                                  hour: '2-digit', minute: '2-digit',
                                })
                              : 'No especificada'}
                          </div>
                        </div>
                      </div>

                      <div className="buzon-comparison">
                        <div className="buzon-comparison__pet">
                          <div className="buzon-comparison__title buzon-comparison__title--pet">Mascota Perdida</div>
                          <div className="buzon-comparison__text">
                            <p><strong>Nombre:</strong> {coincidencia.mascota?.nombre || 'No especificado'}</p>
                            <p><strong>Especie:</strong> {coincidencia.mascota?.especie || 'No especificada'}</p>
                            <p><strong>Color:</strong> {coincidencia.mascota?.color || 'No especificado'}</p>
                            <p><strong>Tamaño:</strong> {coincidencia.mascota?.tamaño || coincidencia.mascota?.tamanho || 'No especificado'}</p>
                          </div>
                        </div>

                        <div className="buzon-comparison__sighting">
                          <div className="buzon-comparison__title buzon-comparison__title--sighting">Avistamiento</div>
                          <div className="buzon-comparison__text">
                            <p><strong>Especie:</strong> {coincidencia.avistamiento?.especie || 'No especificada'}</p>
                            <p><strong>Descripción:</strong> {coincidencia.avistamiento?.descripcionFisica || 'No especificada'}</p>
                            <p><strong>Ubicación:</strong> {formatAvistamientoUbicacion(coincidencia.avistamiento)}</p>
                          </div>
                        </div>
                      </div>

                      {tabActivo === 'pendientes' && (
                        <div className="buzon-actions">
                          <button
                            className="buzon-btn-accept"
                            onClick={(e) => { e.stopPropagation(); handleAceptar(coincidencia.id); }}
                          >
                            Aceptar Match
                          </button>
                          <button
                            className="buzon-btn-reject"
                            onClick={(e) => { e.stopPropagation(); handleRechazar(coincidencia.id); }}
                          >
                            Rechazar
                          </button>
                        </div>
                      )}

                      {tabActivo === 'aceptadas' && (
                        <div className="buzon-accepted-hint">
                          Haz clic para ver los detalles de contacto
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      {modalAbierto && (
        <MatchDetalleModal
          match={coincidenciaSeleccionada}
          onClose={() => setModalAbierto(false)}
        />
      )}

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-col">
            <div className="footer-brand">Sanos y Salvos</div>
            <div className="footer-text">Plataforma de apoyo para reportar y localizar mascotas.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BuzonCoincidencias;
