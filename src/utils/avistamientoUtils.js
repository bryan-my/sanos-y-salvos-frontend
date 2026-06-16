export const formatAvistamientoUbicacion = (avistamiento) => {
  if (!avistamiento) return 'No especificada';
  if (avistamiento.ubicacion) return avistamiento.ubicacion;
  if (avistamiento.latitud != null && avistamiento.longitud != null) {
    return `${Number(avistamiento.latitud).toFixed(4)}, ${Number(avistamiento.longitud).toFixed(4)}`;
  }
  return 'No especificada';
};

export const formatAvistamientoFecha = (avistamiento) => {
  const fecha = avistamiento?.fechaReporte || avistamiento?.fecha;
  if (!fecha) return 'No especificada';
  return new Date(fecha).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
