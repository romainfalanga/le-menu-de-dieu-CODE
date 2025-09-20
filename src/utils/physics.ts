// Constante physique : vitesse de la lumière en km/s
export const SPEED_OF_LIGHT = 299792.458; // km/s

// Calcule le facteur de Lorentz γ
export function calculateGamma(velocity: number): number {
  const velocityFraction = velocity / SPEED_OF_LIGHT;
  if (velocityFraction >= 1) return Infinity;
  return 1 / Math.sqrt(1 - velocityFraction * velocityFraction);
}

// Calcule la vitesse à partir du facteur γ
export function calculateVelocity(gamma: number): number {
  if (gamma <= 1) return 0;
  return SPEED_OF_LIGHT * Math.sqrt(1 - 1 / (gamma * gamma));
}

// Génère des points pour le graphique vitesse -> γ
export function generateVelocityToGammaData(): DataPoint[] {
  const points: DataPoint[] = [];
  const maxVelocity = SPEED_OF_LIGHT * 0.9999999; // 99.99999% de c
  
  // Génération avec une résolution variable pour une meilleure précision
  // Résolution fine pour les basses vitesses
  for (let i = 0; i <= 500; i++) {
    const velocity = (SPEED_OF_LIGHT * 0.5 * i) / 500;
    const gamma = calculateGamma(velocity);
    
    if (gamma < 1000) {
      points.push({ x: velocity, y: gamma });
    }
  }
  
  // Résolution moyenne pour les vitesses moyennes
  for (let i = 0; i <= 500; i++) {
    const velocity = SPEED_OF_LIGHT * 0.5 + (SPEED_OF_LIGHT * 0.49 * i) / 500;
    const gamma = calculateGamma(velocity);
    
    if (gamma < 1000) {
      points.push({ x: velocity, y: gamma });
    }
  }
  
  // Résolution très fine pour les vitesses très élevées (99% à 99.99999% de c)
  for (let i = 0; i <= 2000; i++) {
    const velocity = SPEED_OF_LIGHT * 0.99 + (SPEED_OF_LIGHT * 0.0099999 * i) / 2000;
    const gamma = calculateGamma(velocity);
    
    if (gamma < 350) { // Limite pour l'affichage
      points.push({ x: velocity, y: gamma });
    }
  }
  
  return points;
}

// Génère des points pour le graphique γ -> vitesse
export function generateGammaToVelocityData(): DataPoint[] {
  const points: DataPoint[] = [];
  const maxGamma = 320;
  
  // Utilise un pas variable pour une meilleure résolution
  for (let gamma = 1; gamma <= 10; gamma += 0.1) {
    const velocity = calculateVelocity(gamma);
    points.push({ x: gamma, y: velocity });
  }
  
  for (let gamma = 10; gamma <= 100; gamma += 1) {
    const velocity = calculateVelocity(gamma);
    points.push({ x: gamma, y: velocity });
  }
  
  for (let gamma = 100; gamma <= maxGamma; gamma += 5) {
    const velocity = calculateVelocity(gamma);
    points.push({ x: gamma, y: velocity });
  }
  
  return points;
}

// Formate un nombre avec le bon nombre de décimales
export function formatNumber(num: number, decimals: number = 3): string {
  return num.toFixed(decimals);
}

// Formate la vitesse en km/s avec une précision dynamique basée sur gamma
export function formatVelocityKmPerSec(velocity: number, gamma: number): string {
  // Pour des valeurs entières de gamma importantes, afficher sans décimales si c'est proche
  if (Math.abs(velocity - Math.round(velocity)) < 0.1 && gamma > 10) {
    return Math.round(velocity).toString();
  }
  
  // Sinon, utiliser une précision adaptée
  if (gamma < 1.1) return velocity.toFixed(0);
  if (gamma < 2) return velocity.toFixed(1);
  if (gamma < 5) return velocity.toFixed(2);
  if (gamma < 10) return velocity.toFixed(3);
  if (gamma < 20) return velocity.toFixed(4);
  if (gamma < 50) return velocity.toFixed(5);
  if (gamma < 100) return velocity.toFixed(6);
  if (gamma < 200) return velocity.toFixed(7);
  return velocity.toFixed(8);
}

// Formate la fraction de c
export function formatVelocityFraction(velocity: number): string {
  const fraction = velocity / SPEED_OF_LIGHT;
  
  // Détermine le nombre de décimales basé sur la proximité de c
  let decimals = 1;
  if (fraction > 0.9) decimals = 3;
  if (fraction > 0.99) decimals = 4;
  if (fraction > 0.999) decimals = 5;
  if (fraction > 0.9999) decimals = 6;
  if (fraction > 0.99999) decimals = 7;
  if (fraction > 0.999999) decimals = 8;
  if (fraction > 0.9999999) decimals = 9;
  if (fraction > 0.99999999) decimals = 10;
  if (fraction > 0.999999999) decimals = 11;
  if (fraction > 0.9999999999) decimals = 12;
  
  const percentage = (fraction * 100).toFixed(decimals);
  
  // Évite d'afficher 100.000000% qui serait incorrect
  if (parseFloat(percentage) >= 100) {
    return `99.${'9'.repeat(Math.max(0, decimals - 1))}%`;
  }
  
  return `${percentage}%`;
}

// Formate le temps en unités lisibles (secondes, minutes, heures, jours, années)
export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${formatNumber(seconds, 2)} secondes`;
  }
  
  if (seconds < 3600) { // Moins d'une heure
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (remainingSeconds < 1) {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    return `${minutes} minute${minutes > 1 ? 's' : ''} et ${formatNumber(remainingSeconds, 1)} seconde${remainingSeconds > 1 ? 's' : ''}`;
  }
  
  if (seconds < 86400) { // Moins d'un jour
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    let result = `${hours} heure${hours > 1 ? 's' : ''}`;
    
    if (remainingMinutes > 0) {
      result += `, ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
    }
    
    if (remainingSeconds >= 1) {
      result += ` et ${formatNumber(remainingSeconds, 1)} seconde${remainingSeconds > 1 ? 's' : ''}`;
    }
    
    return result;
  }
  
  if (seconds < 2592000) { // Moins d'un mois (30 jours)
    const days = Math.floor(seconds / 86400);
    const remainingHours = Math.floor((seconds % 86400) / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    
    let result = `${days} jour${days > 1 ? 's' : ''}`;
    
    if (remainingHours > 0) {
      result += `, ${remainingHours} heure${remainingHours > 1 ? 's' : ''}`;
    }
    
    if (remainingMinutes > 0 && remainingHours === 0) {
      result += ` et ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
    }
    
    return result;
  }
  
  if (seconds < 31536000) { // Moins d'un an
    const months = Math.floor(seconds / 2592000);
    const remainingDays = Math.floor((seconds % 2592000) / 86400);
    
    let result = `${months} mois`;
    
    if (remainingDays > 0) {
      result += ` et ${remainingDays} jour${remainingDays > 1 ? 's' : ''}`;
    }
    
    return result;
  }
  
  // Plus d'un an
  const years = Math.floor(seconds / 31536000);
  const remainingMonths = Math.floor((seconds % 31536000) / 2592000);
  const remainingDays = Math.floor((seconds % 2592000) / 86400);
  
  let result = `${years} an${years > 1 ? 's' : ''}`;
  
  if (remainingMonths > 0) {
    result += `, ${remainingMonths} mois`;
  }
  
  if (remainingDays > 0 && remainingMonths === 0) {
    result += ` et ${remainingDays} jour${remainingDays > 1 ? 's' : ''}`;
  }
  
  return result;
}