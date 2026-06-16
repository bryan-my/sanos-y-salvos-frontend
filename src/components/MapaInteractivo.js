import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapaInteractivo = ({ ubicaciones = [] }) => {
  return (
    <MapContainer
      center={[-33.4569, -70.6812]}
      zoom={13}
      style={{ height: '500px', width: '100%', borderRadius: '10px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {ubicaciones
        .filter(ubicacion => ubicacion && ubicacion.latitud != null && ubicacion.longitud != null)
        .map((ubicacion, index) => (
          <Marker
            key={index}
            position={[ubicacion.latitud, ubicacion.longitud]}
          >
          <Popup>
            {ubicacion.descripcionLugar || ubicacion.descripcionFisica || 'Sin descripción'}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapaInteractivo;
