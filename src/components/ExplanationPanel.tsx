import React from 'react';
import { formatNumber, formatVelocityKmPerSec } from '../utils/physics';

interface ExplanationPanelProps {
  velocity: number;
  gamma: number;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  velocity,
  gamma
}) => {
  const getExplanationText = () => {
    if (gamma < 1.1) {
      return "À basse vitesse, les effets relativistes sont négligeables.";
    } else if (gamma < 2) {
      return `γ = ${formatNumber(gamma, 2)} → ton temps s'écoule ${formatNumber(gamma, 2)} fois plus lentement : 1 s pour toi = ${formatNumber(gamma, 2)} s à ${formatVelocityKmPerSec(velocity, gamma)} km/s.`;
    } else if (gamma < 10) {
      return `γ = ${formatNumber(gamma, 1)} → ton temps s'écoule ${formatNumber(gamma, 1)} fois plus lentement : 1 s pour toi = ${formatNumber(gamma, 1)} s à ${formatVelocityKmPerSec(velocity, gamma)} km/s.`;
    } else {
      return `γ = ${formatNumber(gamma, 1)} → ton temps s'écoule ${formatNumber(gamma, 1)} fois plus lentement : 1 s pour toi = ${formatNumber(gamma, 1)} s à ${formatVelocityKmPerSec(velocity, gamma)} km/s.`;
    }
  };

  const getSpeedNote = () => {
    const velocityPercent = velocity / 299792.458;
    if (velocityPercent > 0.9) {
      return "Plus γ grandit, plus tu dois rajouter des 9 après la virgule dans ta vitesse (% de c).";
    }
    return "";
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl shadow-xl border border-purple-100">
      <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">
        Interprétation Physique
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-lg lg:rounded-xl border-l-4 border-blue-500 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-2 text-xs sm:text-sm lg:text-base">Formules</h3>
          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm font-mono text-gray-700">
            <div>γ = 1 / √(1 - (v/c)²)</div>
            <div>v = c × √(1 - 1/γ²)</div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-lg lg:rounded-xl border-l-4 border-purple-500 shadow-sm sm:col-span-2 lg:col-span-1">
          <h3 className="font-semibold text-gray-800 mb-2 text-xs sm:text-sm lg:text-base">Situation</h3>
          <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
            {getExplanationText()}
          </p>
          {getSpeedNote() && (
            <p className="text-gray-600 text-xs mt-2 italic leading-relaxed">
              {getSpeedNote()}
            </p>
          )}
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-lg lg:rounded-xl border-l-4 border-green-500 shadow-sm sm:col-span-2 lg:col-span-1">
          <h3 className="font-semibold text-gray-800 mb-2 text-xs sm:text-sm lg:text-base">Exemples</h3>
          <div className="text-xs sm:text-sm text-gray-700 space-y-1 leading-relaxed">
            <div>• γ = 2 → temps 2× plus lent (à ~87% de c)</div>
            <div>• γ = 10 → temps 10× plus lent (à ~99.5% de c)</div>
            <div>• γ = 100 → temps 100× plus lent</div>
            <div>• γ = 320 → temps 320× plus lent</div>
          </div>
        </div>
      </div>
    </div>
  );
};