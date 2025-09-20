import React, { useState, useEffect } from 'react';
import { RelativityChart } from '../components/RelativityChart';
import { ControlPanel } from '../components/ControlPanel';
import { ExplanationPanel } from '../components/ExplanationPanel';
import {
  calculateGamma,
  calculateVelocity,
  generateVelocityToGammaData,
  generateGammaToVelocityData,
  SPEED_OF_LIGHT
} from '../utils/physics';
import { DataPoint } from '../types';

export const RelativityCalculatorPage: React.FC = () => {
  // Force le re-rendu propre de la page
  React.useEffect(() => {
    // Assure que la page est correctement montée
    window.scrollTo(0, 0);
  }, []);

  const [velocity, setVelocity] = useState<number>(0); // km/s
  const [gamma, setGamma] = useState<number>(1);
  const [timeInput, setTimeInput] = useState<number>(60); // Temps de référence en secondes
  const [lastChanged, setLastChanged] = useState<'velocity' | 'gamma'>('velocity');
  
  const [velocityToGammaData] = useState<DataPoint[]>(() => generateVelocityToGammaData());
  const [gammaToVelocityData] = useState<DataPoint[]>(() => generateGammaToVelocityData());

  // Synchronisation vitesse -> gamma (seulement si la vitesse a été changée en dernier)
  useEffect(() => {
    if (lastChanged === 'velocity') {
      const newGamma = calculateGamma(velocity);
      if (Math.abs(newGamma - gamma) > 0.01) {
        setGamma(newGamma);
      }
    }
  }, [velocity, gamma, lastChanged]);

  // Synchronisation gamma -> vitesse (seulement si gamma a été changé en dernier)
  useEffect(() => {
    if (lastChanged === 'gamma') {
      const newVelocity = calculateVelocity(gamma);
      setVelocity(newVelocity);
    }
  }, [gamma, velocity, lastChanged]);

  const handleVelocityChange = (newVelocity: number) => {
    setLastChanged('velocity');
    setVelocity(newVelocity);
  };

  const handleGammaChange = (newGamma: number) => {
    setLastChanged('gamma');
    setGamma(newGamma);
  };

  const handleTimeInputChange = (newTime: number) => {
    setTimeInput(newTime);
  };

  const markerPoint: DataPoint = { x: velocity, y: gamma };
  const markerPointInverse: DataPoint = { x: gamma, y: velocity };

  // Calcul dynamique des domaines basé sur gamma
  const calculateDomains = (currentGamma: number) => {
    if (currentGamma <= 1.1) {
      // Vue zoomée pour les petites valeurs
      return {
        velocityToGamma: {
          xDomain: [0, SPEED_OF_LIGHT * 0.15] as [number, number], // 0 à 15% de c
          yDomain: [1, 1.1] as [number, number]
        },
        gammaToVelocity: {
          xDomain: [1, 1.1] as [number, number],
          yDomain: [0, SPEED_OF_LIGHT * 0.15] as [number, number]
        }
      };
    } else if (currentGamma <= 2) {
      return {
        velocityToGamma: {
          xDomain: [0, SPEED_OF_LIGHT * 0.9] as [number, number],
          yDomain: [1, 2.5] as [number, number]
        },
        gammaToVelocity: {
          xDomain: [1, 2.5] as [number, number],
          yDomain: [0, SPEED_OF_LIGHT * 0.9] as [number, number]
        }
      };
    } else if (currentGamma <= 10) {
      return {
        velocityToGamma: {
          xDomain: [0, SPEED_OF_LIGHT * 0.995] as [number, number],
          yDomain: [1, 12] as [number, number]
        },
        gammaToVelocity: {
          xDomain: [1, 12] as [number, number],
          yDomain: [0, SPEED_OF_LIGHT * 0.995] as [number, number]
        }
      };
    } else {
      // Vue complète pour les grandes valeurs
      return {
        velocityToGamma: {
          xDomain: [0, SPEED_OF_LIGHT] as [number, number],
          yDomain: [1, 320] as [number, number]
        },
        gammaToVelocity: {
          xDomain: [1, 320] as [number, number],
          yDomain: [0, SPEED_OF_LIGHT] as [number, number]
        }
      };
    }
  };

  const domains = calculateDomains(gamma);

  const referenceLines = [
    { y: 2, label: "γ = 2" },
    { y: 5, label: "γ = 5" },
    { y: 10, label: "γ = 10" }
  ].filter(line => line.y <= domains.velocityToGamma.yDomain[1]);

  const referenceLines2 = [
    { x: 2, label: "γ = 2" },
    { x: 5, label: "γ = 5" },
    { x: 10, label: "γ = 10" },
    { x: 50, label: "γ = 50" },
    { x: 100, label: "γ = 100" },
    { x: 200, label: "γ = 200" },
    { x: 320, label: "γ = 320" }
  ].filter(line => line.x <= domains.gammaToVelocity.xDomain[1]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-x-hidden">
      {/* Effet de particules en arrière-plan */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-purple-900/20"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.05)_50%,transparent_75%)] bg-[length:60px_60px] animate-pulse"></div>
      
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 lg:py-6 relative z-10 max-w-full pt-16 sm:pt-20">
        {/* En-tête */}
        <header className="text-center mb-2 sm:mb-4 lg:mb-6">
        <div className="space-y-6 sm:space-y-4 lg:space-y-6">
          <h1 className="text-3xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-2 lg:mb-3 px-2 drop-shadow-lg relative">
            <div className="relative inline-block">
              {/* Ondes gravitationnelles en arrière-plan */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-xl animate-wave-1"></div>
              <div className="absolute inset-0 -z-10 bg-gradient-to-l from-cyan-500/15 via-blue-500/15 to-purple-500/15 blur-2xl animate-wave-2"></div>
              
              {/* Particules quantiques */}
              <div className="absolute -inset-8 -z-10">
                <div className="absolute top-2 left-4 w-1 h-1 bg-blue-400 rounded-full animate-quantum-1"></div>
                <div className="absolute top-8 right-6 w-1 h-1 bg-purple-400 rounded-full animate-quantum-2"></div>
                <div className="absolute bottom-4 left-8 w-1 h-1 bg-cyan-400 rounded-full animate-quantum-3"></div>
                <div className="absolute bottom-2 right-4 w-1 h-1 bg-pink-400 rounded-full animate-quantum-4"></div>
                <div className="absolute top-6 left-12 w-1 h-1 bg-indigo-400 rounded-full animate-quantum-5"></div>
              </div>
              
              {/* Effet de dilatation temporelle */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-sm scale-110 animate-time-dilation"></div>
              
              {/* Texte principal avec gradient animé */}
              <span className="relative z-10 bg-gradient-to-r from-white via-blue-200 via-purple-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent animate-gradient-shift bg-[length:400%_400%]">
                Relativité Restreinte
              </span>
              
              {/* Effet de scan lumineux */}
              <div className="absolute inset-0 -z-5 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-light-scan"></div>
              
              {/* Reflets cristallins */}
              <div className="absolute top-0 left-1/4 w-8 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-crystal-1"></div>
              <div className="absolute bottom-0 right-1/3 w-6 h-0.5 bg-gradient-to-r from-transparent via-blue-300/60 to-transparent animate-crystal-2"></div>
              
              {/* Particules orbitales */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2">
                  <div className="absolute w-1 h-1 bg-blue-400/60 rounded-full animate-orbit-1"></div>
                  <div className="absolute w-1 h-1 bg-purple-400/60 rounded-full animate-orbit-2"></div>
                  <div className="absolute w-1 h-1 bg-cyan-400/60 rounded-full animate-orbit-3"></div>
                </div>
              </div>
              
              {/* Anneaux énergétiques */}
              <div className="absolute inset-0 rounded-full border border-blue-400/20 scale-100 hover:scale-110 transition-all duration-1000 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full border border-purple-400/15 scale-110 hover:scale-125 transition-all duration-1500 animate-pulse animation-delay-500"></div>
              <div className="absolute inset-0 rounded-full border border-cyan-400/10 scale-125 hover:scale-140 transition-all duration-2000 animate-pulse animation-delay-1000"></div>
              
              {/* Lueur externe */}
              <div className="absolute inset-0 rounded-full border border-purple-400/0 hover:border-purple-400/20 scale-100 hover:scale-200 transition-all duration-3000 animate-pulse animation-delay-300"></div>
            </div>
          </h1>
          <p className="text-sm sm:text-sm lg:text-base text-blue-200/90 max-w-3xl mx-auto px-2 sm:px-4 leading-relaxed mt-2">
          </p>
        </header>

        {/* Contenu principal */}
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          {/* Panneau de contrôle - toujours en premier sur mobile */}
          <div className="w-full max-w-4xl mx-auto">
            <ControlPanel
              velocity={velocity}
              gamma={gamma}
              timeInput={timeInput}
              onVelocityChange={handleVelocityChange}
              onGammaChange={handleGammaChange}
              onTimeInputChange={handleTimeInputChange}
            />
          </div>

          {/* Graphiques - empilés verticalement sur mobile, côte à côte sur desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            <RelativityChart
              data={velocityToGammaData}
              markerData={markerPoint}
              xLabel="Vitesse (km/s)"
              yLabel="Accélération du temps"
              title="Graphe A"
              subtitle="Vitesse → Accélération du temps"
              xDomain={domains.velocityToGamma.xDomain}
              yDomain={domains.velocityToGamma.yDomain}
              referenceLines={referenceLines}
            />
            
            <RelativityChart
              data={gammaToVelocityData}
              markerData={markerPointInverse}
              xLabel="Accélération du temps"
              yLabel="Vitesse (km/s)"
              title="Graphe B"
              subtitle="Accélération du temps → Vitesse"
              xDomain={domains.gammaToVelocity.xDomain}
              yDomain={domains.gammaToVelocity.yDomain}
              referenceLines={referenceLines2}
            />
          </div>

          {/* Explications */}
        </div>
      </div>
    </div>
  );
};