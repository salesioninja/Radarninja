/**
 * LÓGICA CORE: haversine.ts
 * 
 * Por que usar essa fórmula matemática pura?
 * R: A fórmula de Haversine permite calcular com precisão aceitável a distância real na 
 * superfície esférica da Terra entre duas coordenadas de GPS (Latitude e Longitude),
 * ignorando colinas, mas perfeita para escopos urbanos (raios de descoberta de Missões Ocultas).
 * Desacoplamos isso de qualquer framework web para garantir que a lógica "Core" seja altamente testável (TDD).
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Calcula a distância em quilômetros entre dois pontos usando a fórmula de Haversine.
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Raio Terra em km

  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);

  const lat1 = toRadians(coord1.latitude);
  const lat2 = toRadians(coord2.latitude);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
            
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
