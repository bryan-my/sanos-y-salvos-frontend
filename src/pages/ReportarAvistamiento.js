import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { reportesService } from '../services/api';
import './ReportarAvistamiento.css';

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

  if (!markerPos) return null;

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

const ReportarAvistamiento = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    especie: '',
    descripcionFisica: '',
    fotoUrl: '',
    nombreReportador: '',
    telefonoContacto: '',
    latitud: null,
    longitud: null,
  });
  const [exito, setExito] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (formData.latitud == null || formData.longitud == null) {
      alert('Debes seleccionar una ubicación en el mapa (clic o arrastrando el marcador).');
      return;
    }
    try {
      await reportesService.reportarAvistamiento({
        especie: formData.especie,
        descripcionFisica: formData.descripcionFisica,
        fotoUrl: formData.fotoUrl,
        nombreReportador: formData.nombreReportador,
        telefonoContacto: formData.telefonoContacto,
        latitud: formData.latitud,
        longitud: formData.longitud,
      });
      setExito(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error al reportar avistamiento:', error);
      alert('Error al enviar el reporte. Por favor, intenta nuevamente.');
    }
  };

  if (exito) {
    return (
      <div className="site">
        <main>
          <section className="section reporte-exito">
            <div className="container">
              <h1 className="reporte-exito__title">¡Reporte enviado exitosamente!</h1>
              <p className="reporte-exito__text">Gracias por colaborar con la comunidad.</p>
              <p className="reporte-exito__redirect">Redirigiendo a la página principal...</p>
            </div>
          </section>
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
          <nav className="nav">
            <Link to="/" className="nav-link">Volver al inicio</Link>
          </nav>
        </div>
      </header>

      <main className="reporte-main">
        <section className="section">
          <div className="container reporte-container">
            <div className="section-head">
              <h1>Reportar Mascota Vista</h1>
              <p>Completa el formulario para ayudar a encontrar a su dueño.</p>
            </div>

            <form onSubmit={handleSubmit} className="reporte-form">
              <div className="reporte-field">
                <label className="reporte-label">Especie (ej: Perro, Gato)</label>
                <input
                  type="text"
                  name="especie"
                  value={formData.especie}
                  onChange={handleChange}
                  required
                  className="reporte-input"
                />
              </div>

              <div className="reporte-field">
                <label className="reporte-label">Descripción física</label>
                <textarea
                  name="descripcionFisica"
                  value={formData.descripcionFisica}
                  onChange={handleChange}
                  rows="4"
                  required
                  className="reporte-input"
                />
              </div>

              <div className="reporte-field">
                <label className="reporte-label">URL de foto (opcional)</label>
                <input
                  type="url"
                  name="fotoUrl"
                  value={formData.fotoUrl}
                  onChange={handleChange}
                  className="reporte-input"
                />
              </div>

              <div className="reporte-field">
                <label className="reporte-label">Tu nombre</label>
                <input
                  type="text"
                  name="nombreReportador"
                  value={formData.nombreReportador}
                  onChange={handleChange}
                  required
                  className="reporte-input"
                />
              </div>

              <div className="reporte-field">
                <label className="reporte-label">Teléfono de contacto</label>
                <input
                  type="tel"
                  name="telefonoContacto"
                  value={formData.telefonoContacto}
                  onChange={handleChange}
                  required
                  className="reporte-input"
                />
              </div>

              <div className="reporte-field">
                <label className="reporte-label">Ubicación (clic en el mapa o arrastra el marcador)</label>
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
                    markerPos={
                      formData.latitud != null && formData.longitud != null
                        ? [formData.latitud, formData.longitud]
                        : null
                    }
                  />
                </MapContainer>
                {formData.latitud && formData.longitud && (
                  <p className="reporte-coords">
                    Coordenadas seleccionadas: {formData.latitud.toFixed(4)}, {formData.longitud.toFixed(4)}
                  </p>
                )}
              </div>

              <div className="reporte-form-actions">
                <button type="submit" className="btn btn-primary">Enviar Reporte</button>
                <Link to="/" className="btn btn-outline">Cancelar</Link>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ReportarAvistamiento;
