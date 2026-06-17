import React from 'react';
import { formatAvistamientoFecha, formatAvistamientoUbicacion } from '../utils/avistamientoUtils';
import './MatchDetalleModal.css';

const MatchDetalleModal = ({ match, onClose }) => {
  if (!match) return null;

  const esAlta = (match.porcentajeSimilitud ?? 0) >= 70;

  return (
    <div className="modal-overlay">
      <div className="modal-panel">
        <button onClick={onClose} className="modal-close">&times;</button>

        <h2 className="modal-title">Detalles de la Coincidencia</h2>

        <div className="modal-grid">
          {/* Mascota Perdida */}
          <div className="modal-section--pet">
            <h3 className="modal-section__title--pet">Mascota Perdida</h3>
            {match.mascota?.fotoUrl && (
              <img
                src={match.mascota.fotoUrl}
                alt={match.mascota?.nombre || 'Mascota'}
                className="modal-photo"
              />
            )}
            <p><strong>Nombre:</strong> {match.mascota?.nombre || 'No especificado'}</p>
            <p><strong>Especie:</strong> {match.mascota?.especie || 'No especificada'}</p>
            <p><strong>Raza:</strong> {match.mascota?.raza || 'No especificada'}</p>
            <p><strong>Color:</strong> {match.mascota?.color || 'No especificado'}</p>
            <p><strong>Tamaño:</strong> {match.mascota?.tamaño || match.mascota?.tamanho || 'No especificado'}</p>
          </div>

          {/* Avistamiento Reportado */}
          <div className="modal-section--sighting">
            <h3 className="modal-section__title--sighting">Avistamiento Reportado</h3>
            {match.avistamiento?.fotoUrl && (
              <img
                src={match.avistamiento.fotoUrl}
                alt="Avistamiento"
                className="modal-photo"
              />
            )}
            <p><strong>Especie:</strong> {match.avistamiento?.especie || 'No especificada'}</p>
            <p><strong>Descripción:</strong> {match.avistamiento?.descripcionFisica || 'No especificada'}</p>
            <p><strong>Ubicación:</strong> {formatAvistamientoUbicacion(match.avistamiento)}</p>
            <p><strong>Fecha del avistamiento:</strong> {formatAvistamientoFecha(match.avistamiento)}</p>
          </div>
        </div>

        <div className="modal-similarity">
          <div>
            <div className="modal-similarity__label">Porcentaje de Similitud</div>
            <div className={`modal-similarity__value ${esAlta ? 'modal-similarity__value--high' : 'modal-similarity__value--medium'}`}>
              {match.porcentajeSimilitud ? `${match.porcentajeSimilitud}%` : 'N/A'}
            </div>
          </div>
        </div>

        <div className="modal-contact">
          <h4 className="modal-contact__title">📞 Información de Contacto</h4>
          <p className="modal-contact__text">
            <strong>Nombre:</strong> {match.avistamiento?.nombreReportador || 'No especificado'}
          </p>
          <p className="modal-contact__text">
            <strong>Teléfono:</strong> {match.avistamiento?.telefonoContacto || 'No especificado'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MatchDetalleModal;
