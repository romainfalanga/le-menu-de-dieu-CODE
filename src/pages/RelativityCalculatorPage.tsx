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
      
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 lg:py-6 relative z-10 max-w-full pt-20">
        {/* En-tête */}
        <header className="text-center mb-3 sm:mb-4 lg:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-1 sm:mb-2 lg:mb-3 px-2 drop-shadow-lg">
            Relativité Restreinte
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-blue-200/90 max-w-3xl mx-auto px-2 sm:px-4 leading-relaxed">
            Explorez la relation entre vitesse et dilatation du temps selon Einstein
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