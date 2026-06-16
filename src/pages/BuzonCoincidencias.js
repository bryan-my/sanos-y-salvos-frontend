import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { coincidenciasService } from '../services/api';
import MatchDetalleModal from '../components/MatchDetalleModal';

const BuzonCoincidencias = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [matchesPendientes, setMatchesPendientes] = useState([]);
  const [matchesAceptados, setMatchesAceptados] = useState([]);
  const [tabActivo, setTabActivo] = useState('pendientes'); // 'pendientes' | 'aceptadas'
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
      // Mover el match de pendientes a aceptados
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
      // Eliminar el match de pendientes
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
              <Link to="/buzon-coincidencias" className="nav-link" style={{ color: '#14b1ab', fontWeight: 500 }}>Buzón de Matches</Link>
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

      <main style={{ paddingTop: '120px', paddingBottom: '60px' }}>
        <section className="section">
          <div className="container" style={{ maxWidth: '1000px' }}>
            <div className="section-head">
              <h1>Buzón de Coincidencias</h1>
              <p>Gestiona los matches generados entre mascotas perdidas y avistamientos</p>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '24px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <button
                onClick={() => setTabActivo('pendientes')}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  backgroundColor: tabActivo === 'pendientes' ? '#14b1ab' : 'transparent',
                  color: tabActivo === 'pendientes' ? 'white' : '#64748b',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderRadius: '8px 8px 0 0'
                }}
              >
                Pendientes ({matchesPendientes.length})
              </button>
              <button
                onClick={() => setTabActivo('aceptadas')}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  backgroundColor: tabActivo === 'aceptadas' ? '#14b1ab' : 'transparent',
                  color: tabActivo === 'aceptadas' ? 'white' : '#64748b',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderRadius: '8px 8px 0 0'
                }}
              >
                Aceptadas ({matchesAceptados.length})
              </button>
            </div>

            {message && (
              <div style={{
                padding: '12px 16px',
                marginBottom: '24px',
                borderRadius: '8px',
                backgroundColor: message.includes('Error') ? '#fee2e2' : '#dcfce7',
                color: message.includes('Error') ? '#dc2626' : '#166534'
              }}>
                {message}
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>Cargando coincidencias...</p>
              </div>
            ) : coincidenciasAMostrar.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                <h3 style={{ color: '#64748b' }}>
                  {tabActivo === 'pendientes' 
                    ? 'No hay coincidencias pendientes' 
                    : 'No hay coincidencias aceptadas'}
                </h3>
                <p style={{ color: '#94a3b8', marginTop: '8px' }}>
                  {tabActivo === 'pendientes' 
                    ? '¡Genial! No tienes matches pendientes de revisión' 
                    : 'Cuando aceptes un match, aparecerá aquí'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
                {coincidenciasAMostrar.map((coincidencia) => (
                  <div 
                    key={coincidencia.id} 
                    style={{
                      padding: '24px',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                      border: '1px solid #e2e8f0',
                      cursor: tabActivo === 'aceptadas' ? 'pointer' : 'default'
                    }}
                    onClick={() => {
                      if (tabActivo === 'aceptadas') {
                        handleVerDetalle(coincidencia);
                      }
                    }}
                  >
                    {/* Porcentaje de Similitud */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px'
                    }}>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '80px',
                        height: '80px',
                        backgroundColor: (coincidencia.porcentajeSimilitud ?? 0) >= 70 ? '#f0fdf4' : '#fef3c7',
                        borderRadius: '50%',
                        border: '3px solid',
                        borderColor: (coincidencia.porcentajeSimilitud ?? 0) >= 70 ? '#10b981' : '#f59e0b'
                      }}>
                        <div style={{
                          fontSize: '20px',
                          fontWeight: 700,
                          color: (coincidencia.porcentajeSimilitud ?? 0) >= 70 ? '#10b981' : '#f59e0b'
                        }}>
                          {coincidencia.porcentajeSimilitud ? `${coincidencia.porcentajeSimilitud}%` : 'N/A'}
                        </div>
                        <div style={{ fontSize: '10px', color: '#64748b', textAlign: 'center' }}>
                          Similitud
                        </div>
                      </div>

                      <div style={{ flex: 1, marginLeft: '20px' }}>
                        <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>
                          Fecha del match
                        </div>
                        <div style={{ fontSize: '14px' }}>
                          {coincidencia.fecha ? new Date(coincidencia.fecha).toLocaleDateString('es-CL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'No especificada'}
                        </div>
                      </div>
                    </div>

                    {/* Comparación de Mascota y Avistamiento */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
                      <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                        <div style={{ fontSize: '12px', color: '#14b1ab', fontWeight: 600, marginBottom: '8px' }}>
                          Mascota Perdida
                        </div>
                        <div style={{ fontSize: '13px' }}>
                          <p style={{ marginBottom: '4px' }}>
                            <strong>Nombre:</strong> {coincidencia.mascota?.nombre || 'No especificado'}
                          </p>
                          <p style={{ marginBottom: '4px' }}>
                            <strong>Especie:</strong> {coincidencia.mascota?.especie || 'No especificada'}
                          </p>
                          <p style={{ marginBottom: '4px' }}>
                            <strong>Color:</strong> {coincidencia.mascota?.color || 'No especificado'}
                          </p>
                          <p>
                            <strong>Tamaño:</strong> {coincidencia.mascota?.tamaño || coincidencia.mascota?.tamanho || 'No especificado'}
                          </p>
                        </div>
                      </div>

                      <div style={{ padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                        <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 600, marginBottom: '8px' }}>
                          Avistamiento
                        </div>
                        <div style={{ fontSize: '13px' }}>
                          <p style={{ marginBottom: '4px' }}>
                            <strong>Especie:</strong> {coincidencia.avistamiento?.especie || 'No especificada'}
                          </p>
                          <p style={{ marginBottom: '4px' }}>
                            <strong>Descripción:</strong> {coincidencia.avistamiento?.descripcionFisica || coincidencia.avistamiento?.descripcionLugar || 'No especificada'}
                          </p>
                          <p>
                            <strong>Ubicación:</strong> {coincidencia.avistamiento?.ubicacion || 'No especificada'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Botones (solo para pendientes) */}
                    {tabActivo === 'pendientes' && (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAceptar(coincidencia.id);
                          }}
                          style={{
                            flex: 1,
                            padding: '10px 16px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Aceptar Match
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRechazar(coincidencia.id);
                          }}
                          style={{
                            flex: 1,
                            padding: '10px 16px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Rechazar
                        </button>
                      </div>
                    )}

                    {/* Mensaje para aceptadas */}
                    {tabActivo === 'aceptadas' && (
                      <div style={{ 
                        textAlign: 'center', 
                        padding: '8px', 
                        backgroundColor: '#dcfce7', 
                        color: '#166534', 
                        borderRadius: '8px', 
                        fontSize: '13px' 
                      }}>
                        Haz clic para ver los detalles de contacto
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Modal de detalles */}
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
