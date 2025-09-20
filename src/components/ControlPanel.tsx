import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { Slider } from './Slider';
import { formatNumber, formatVelocityFraction, formatVelocityKmPerSec, calculateVelocity, formatTime } from '../utils/physics';

interface ControlPanelProps {
  velocity: number;
  gamma: number;
  timeInput: number;
  onVelocityChange: (velocity: number) => void;
  onGammaChange: (gamma: number) => void;
  onTimeInputChange: (time: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  velocity,
  gamma,
  timeInput,
  onVelocityChange,
  onGammaChange,
  onTimeInputChange,
}) => {
  const [referenceFrame, setReferenceFrame] = useState<'static' | 'moving'>('static');
  
  const maxGamma = 320;
  const maxVelocity = 299791; // km/s - vitesse maximale fixe

  // Calculs de dilatation temporelle selon le référentiel choisi
  let timeForStaticObserver: number;
  let timeForMovingObserver: number;
  let timeDifference: number;
  
  if (referenceFrame === 'static') {
    // 60 secondes du point de vue de l'observateur statique
    timeForStaticObserver = timeInput;
    timeForMovingObserver = timeInput / gamma;
    timeDifference = timeForStaticObserver - timeForMovingObserver;
  } else {
    // 60 secondes du point de vue de l'observateur en mouvement
    timeForMovingObserver = timeInput;
    timeForStaticObserver = timeInput * gamma;
    timeDifference = timeForStaticObserver - timeForMovingObserver;
  }

  return (
    <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm p-3 sm:p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-2xl border border-white/20 space-y-3 sm:space-y-4 lg:space-y-6">
      <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
        Contrôles Interactifs
      </h2>
      
      <div className="space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Calculateur de dilatation temporelle */}
        <div className="bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm p-3 sm:p-4 lg:p-5 rounded-lg lg:rounded-xl border border-blue-200/50 shadow-lg">
          <div className="flex items-center mb-2 sm:mb-3">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600 flex-shrink-0" />
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">
              Calculateur de Dilatation Temporelle
            </h3>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Point de vue de référence
              </label>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => setReferenceFrame('static')}
                  className={`flex-1 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                    referenceFrame === 'static'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <span className="hidden sm:inline">Observateur statique (0 km/s)</span>
                  <span className="sm:hidden">Statique (0 km/s)</span>
                </button>
                <button
                  onClick={() => setReferenceFrame('moving')}
                  className={`flex-1 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                    referenceFrame === 'moving'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <span className="hidden sm:inline">Observateur en mouvement</span>
                  <span className="sm:hidden">En mouvement</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {referenceFrame === 'static' 
                  ? "Le temps saisi correspond au temps écoulé pour l'observateur statique"
                  : "Le temps saisi correspond au temps écoulé pour l'observateur en mouvement"
                }
              </p>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Temps écoulé dans ce référentiel (secondes)
              </label>
              <input
                type="number"
                value={timeInput}
                onChange={(e) => onTimeInputChange(Number(e.target.value) || 0)}
                min="0"
                step="1"
                className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-all duration-200 bg-white/90 hover:bg-white focus:bg-white shadow-sm"
                placeholder="Entrez un nombre de secondes..."
              />
            </div>
            
            {/* Boutons de présélection */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
              <button
                onClick={() => onTimeInputChange(3600)}
                className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-blue-50 hover:from-blue-200 hover:to-blue-100 text-blue-800 rounded-md sm:rounded-lg text-xs font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 border border-blue-200/50 shadow-sm"
              >
                1 heure
              </button>
              <button
                onClick={() => onTimeInputChange(86400)}
                className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-green-100 to-green-50 hover:from-green-200 hover:to-green-100 text-green-800 rounded-md sm:rounded-lg text-xs font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 border border-green-200/50 shadow-sm"
              >
                1 jour
              </button>
              <button
                onClick={() => onTimeInputChange(2592000)}
                className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 text-purple-800 rounded-md sm:rounded-lg text-xs font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 border border-purple-200/50 shadow-sm"
              >
                1 mois
              </button>
              <button
                onClick={() => onTimeInputChange(31536000)}
                className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-orange-100 to-orange-50 hover:from-orange-200 hover:to-orange-100 text-orange-800 rounded-md sm:rounded-lg text-xs font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 border border-orange-200/50 shadow-sm"
              >
                1 an
              </button>
            </div>
            
            {timeInput > 0 && (
              <div className="grid grid-cols-1 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="bg-gradient-to-r from-white to-green-50/50 p-2 sm:p-3 rounded-lg border-l-4 border-green-500 shadow-sm">
                  <div className="font-semibold text-gray-800 mb-1 text-xs sm:text-sm">
                    Observateur statique (0 km/s)
                    {referenceFrame === 'static' && <span className="text-blue-600 text-xs ml-1">(référence)</span>}
                  </div>
                  <div className="text-gray-600 text-xs sm:text-sm font-medium">
                    {formatTime(timeForStaticObserver)}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-white to-blue-50/50 p-2 sm:p-3 rounded-lg border-l-4 border-blue-500 shadow-sm">
                  <div className="font-semibold text-gray-800 mb-1 text-xs sm:text-sm">
                    <span className="hidden sm:inline">Observateur en mouvement ({formatVelocityKmPerSec(velocity, gamma)} km/s)</span>
                    <span className="sm:hidden">En mouvement ({formatVelocityKmPerSec(velocity, gamma)} km/s)</span>
                    {referenceFrame === 'moving' && <span className="text-purple-600 text-xs ml-1">(référence)</span>}
                  </div>
                  <div className="text-gray-600 text-xs sm:text-sm font-medium">
                    {formatTime(timeForMovingObserver)}
                  </div>
                </div>
                
                {gamma > 1.01 && (
                  <div className="bg-gradient-to-r from-yellow-50/80 to-orange-50/50 p-2 sm:p-3 rounded-lg border-l-4 border-yellow-500 shadow-sm">
                    <div className="font-semibold text-gray-800 mb-1 text-xs sm:text-sm">Différence temporelle</div>
                    <div className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      <div className="text-gray-600">
                        {referenceFrame === 'static' ? (
                          <>L'observateur en mouvement vieillit de <strong>{formatTime(timeDifference)} de moins</strong></>
                        ) : (
                          <>L'observateur statique vieillit de <strong>{formatTime(timeDifference)} de plus</strong></>
                        )}
                        <br className="hidden sm:block" />
                        <span className="text-xs text-gray-500">
                          {referenceFrame === 'static' 
                            ? `(Facteur γ = ${formatNumber(gamma, 2)} → temps ${formatNumber(gamma, 2)}× plus lent pour l'observateur en mouvement)`
                            : `(Facteur γ = ${formatNumber(gamma, 2)} → temps ${formatNumber(gamma, 2)}× plus rapide pour l'observateur statique)`
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {gamma > 1.01 && (
                  <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/50 p-2 sm:p-3 rounded-lg border-l-4 border-blue-500 shadow-sm">
                    <div className="font-semibold text-gray-800 mb-1 text-xs sm:text-sm">
                      <span className="hidden sm:inline">Point de vue de l'observateur en mouvement</span>
                      <span className="sm:hidden">Point de vue en mouvement</span>
                    </div>
                    <div className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {referenceFrame === 'static' ? (
                        <>Pour lui, c'est l'observateur "statique" qui vieillit <strong>{formatNumber(gamma, 2)} fois plus vite</strong></>
                      ) : (
                        <>Pour lui, c'est l'observateur "statique" qui vieillit <strong>{formatNumber(gamma, 2)} fois plus lentement</strong></>
                      )}
                      <br className="hidden sm:block" />
                      <span className="text-xs text-gray-500">
                        {referenceFrame === 'static' 
                          ? "Réciprocité de la relativité : chacun voit l'autre vieillir plus lentement dans son propre référentiel"
                          : "Dans ce référentiel, l'observateur statique semble vieillir plus lentement"
                        }
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs sm:text-sm lg:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
            Vitesse (v)
          </label>
          <p className="text-xs text-gray-500 italic mb-2">
            Modifier la vitesse de l'observateur en mouvement modifiera son accélération
          </p>
          <Slider
            value={velocity}
            min={0}
            max={maxVelocity}
            step={maxVelocity / 10000}
            onChange={onVelocityChange}
            className="w-full h-2 sm:h-3 lg:h-4"
          />
          <div className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 font-medium bg-white/60 p-2 rounded-md border border-gray-200/50">
            {formatVelocityKmPerSec(velocity, gamma)} km/s ({formatVelocityFraction(velocity)} de c)
          </div>
        </div>

        <div>
          <label className="block text-xs sm:text-sm lg:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
            Accélération du temps (γ)
          </label>
          <p className="text-xs text-gray-500 italic mb-2">
            Modifier l'accélération du temps modifiera la vitesse de l'observateur
          </p>
          <Slider
            value={gamma}
            min={1}
            max={maxGamma}
            step={0.1}
            onChange={onGammaChange}
            className="w-full h-2 sm:h-3 lg:h-4"
          />
          <div className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 font-medium bg-white/60 p-2 rounded-md border border-gray-200/50">
            γ = {formatNumber(gamma, 2)}
            <br className="hidden sm:block" />
            <span className="text-gray-500 text-xs">
              <span className="hidden sm:inline">Le temps s'écoule {formatNumber(gamma, 1)} fois plus vite qu'un observateur statique</span>
              <span className="sm:hidden">Temps {formatNumber(gamma, 1)}× plus vite</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
