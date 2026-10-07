export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Calculates the straight-line distance between two GPS coordinates using the Haversine formula.
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const EARTH_RADIUS_KM = 6371; // Radius of the earth in kilometers

  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);

  const lat1Rad = toRadians(coord1.latitude);
  const lat2Rad = toRadians(coord2.latitude);

  // Haversine formula core mathematics
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return parseFloat(distance.toFixed(2)); // Returns distance rounded to 2 decimal places
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
