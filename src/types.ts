export interface DataPoint {
  x: number;
  y: number;
  isMarker?: boolean;
}

export interface RelativityData {
  velocity: number; // km/s
  gamma: number;
  velocityFraction: number; // v/c
}