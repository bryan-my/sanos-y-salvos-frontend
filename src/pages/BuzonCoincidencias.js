import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { coincidenciasService } from '../services/api';

const BuzonCoincidencias = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [coincidencias, setCoincidencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchCoincidencias = async () => {
    try {
      const response = await coincidenciasService.getCoincidenciasPendientes();
      setCoincidencias(response.data || []);
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

  const handleActualizarEstado = async (id, estado) => {
    try {
      await coincidenciasService.actualizarEstadoCoincidencia(id, estado);
      setMessage(estado === 'APROBADO' ? 'Coincidencia aprobada exitosamente' : 'Coincidencia descartada');
      // Refrescar la lista
      fetchCoincidencias();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      setMessage('Error al actualizar el estado de la coincidencia');
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
          <div className="container" style={{ maxWidth: '900px' }}>
            <div className="section-head">
              <h1>Buzón de Coincidencias</h1>
              <p>Gestiona los matches generados entre mascotas perdidas y avistamientos</p>
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
            ) : coincidencias.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                <h3 style={{ color: '#64748b' }}>No hay coincidencias pendientes</h3>
                <p style={{ color: '#94a3b8', marginTop: '8px' }}>¡Genial! No tienes matches pendientes de revisión</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {coincidencias.map((coincidencia) => (
                  <div key={coincidencia.id} style={{
                    padding: '20px',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>ID del Avistamiento</div>
                      <div style={{ fontSize: '18px', fontWeight: 600 }}>#{coincidencia.avistamientoId || 'N/A'}</div>
                    </div>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Porcentaje de Similitud</div>
                      <div style={{ 
                        fontSize: '28px', 
                        fontWeight: 700, 
                        color: coincidencia.porcentajeSimilitud >= 70 ? '#10b981' : '#f59e0b' 
                      }}>
                        {coincidencia.porcentajeSimilitud ? `${coincidencia.porcentajeSimilitud}%` : 'N/A'}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Fecha</div>
                      <div style={{ fontSize: '14px' }}>
                        {coincidencia.fecha ? new Date(coincidencia.fecha).toLocaleDateString('es-CL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => handleActualizarEstado(coincidencia.id, 'APROBADO')}
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
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleActualizarEstado(coincidencia.id, 'DESCARTADO')}
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
                        Descartar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

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
