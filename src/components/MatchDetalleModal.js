import React from 'react';
import { formatAvistamientoFecha, formatAvistamientoUbicacion } from '../utils/avistamientoUtils';

const MatchDetalleModal = ({ match, onClose }) => {
  if (!match) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '30px',
        position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: '#64748b'
        }}>
          &times;
        </button>

        <h2 style={{ marginBottom: '24px', color: '#0f172a' }}>
          Detalles de la Coincidencia
        </h2>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '20px', 
          marginBottom: '24px' 
        }}>
          {/* Mascota Perdida */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8fafc', 
            borderRadius: '10px' 
          }}>
            <h3 style={{ 
              color: '#14b1ab', 
              marginBottom: '16px', 
              fontSize: '18px' 
            }}>
              Mascota Perdida
            </h3>
            {match.mascota?.fotoUrl && (
              <img 
                src={match.mascota.fotoUrl} 
                alt={match.mascota?.nombre || 'Mascota'} 
                style={{ 
                  width: '100%', 
                  height: '150px', 
                  objectFit: 'cover', 
                  borderRadius: '8px', 
                  marginBottom: '12px' 
                }} 
              />
            )}
            <p><strong>Nombre:</strong> {match.mascota?.nombre || 'No especificado'}</p>
            <p><strong>Especie:</strong> {match.mascota?.especie || 'No especificada'}</p>
            <p><strong>Raza:</strong> {match.mascota?.raza || 'No especificada'}</p>
            <p><strong>Color:</strong> {match.mascota?.color || 'No especificado'}</p>
            <p><strong>Tamaño:</strong> {match.mascota?.tamaño || match.mascota?.tamanho || 'No especificado'}</p>
          </div>

          {/* Avistamiento Reportado */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f0fdf4', 
            borderRadius: '10px' 
          }}>
            <h3 style={{ 
              color: '#10b981', 
              marginBottom: '16px', 
              fontSize: '18px' 
            }}>
              Avistamiento Reportado
            </h3>
            {match.avistamiento?.fotoUrl && (
              <img 
                src={match.avistamiento.fotoUrl} 
                alt="Avistamiento" 
                style={{ 
                  width: '100%', 
                  height: '150px', 
                  objectFit: 'cover', 
                  borderRadius: '8px', 
                  marginBottom: '12px' 
                }} 
              />
            )}
            <p><strong>Especie:</strong> {match.avistamiento?.especie || 'No especificada'}</p>
            <p><strong>Descripción:</strong> {match.avistamiento?.descripcionFisica || match.avistamiento?.descripcionLugar || 'No especificada'}</p>
            <p><strong>Ubicación:</strong> {formatAvistamientoUbicacion(match.avistamiento)}</p>
            <p><strong>Fecha del avistamiento:</strong> {formatAvistamientoFecha(match.avistamiento)}</p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '24px',
          padding: '15px',
          backgroundColor: '#fef3c7',
          borderRadius: '8px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#92400e', marginBottom: '4px' }}>
              Porcentaje de Similitud
            </div>
            <div style={{
              fontSize: '36px',
              fontWeight: 700,
              color: (match.porcentajeSimilitud ?? 0) >= 70 ? '#10b981' : '#f59e0b'
            }}>
              {match.porcentajeSimilitud ? `${match.porcentajeSimilitud}%` : 'N/A'}
            </div>
          </div>
        </div>

        <div style={{
          padding: '24px',
          backgroundColor: '#eff6ff',
          borderRadius: '12px',
          border: '2px solid #3b82f6'
        }}>
          <h4 style={{ color: '#1e40af', marginBottom: '16px', fontSize: '20px' }}>
            📞 Información de Contacto
          </h4>
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>
            <strong>Nombre:</strong> {match.avistamiento?.nombreReportador || 'No especificado'}
          </p>
          <p style={{ fontSize: '16px' }}>
            <strong>Teléfono:</strong> {match.avistamiento?.telefonoContacto || 'No especificado'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MatchDetalleModal;
