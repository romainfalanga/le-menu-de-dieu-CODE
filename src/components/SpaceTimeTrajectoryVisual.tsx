import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const SpaceTimeTrajectoryVisual: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showConvergence, setShowConvergence] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnimating) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 0.4; // Vitesse modérée : 0.4
          if (newProgress >= 100) {
            // Redémarre automatiquement
            setShowConvergence(false);
            return 0;
          }
          if (newProgress >= 60) {
            setShowConvergence(true);
          }
          return newProgress;
        });
      }, 60); // Vitesse modérée : 60ms
    }
    return () => clearInterval(interval);
  }, [isAnimating]);

  const handlePlayPause = () => {
    setIsAnimating(!isAnimating);
  };

  const handleReset = () => {
    setProgress(0);
    setShowConvergence(false);
    setIsAnimating(false);
  };

  // Fonction pour calculer le chemin spatial complexe basé sur l'image
  const calculateSpatialPath = (t: number) => {
    // Normalisation du paramètre t (0 à 60 pour avant l'horizon)
    const normalizedT = t / 60;
    
    // Position X de base : progression linéaire de gauche (10) vers l'horizon (400)
    const baseX = 10 + normalizedT * (horizonX - 10);
    
    // Création d'une trajectoire spatiale avec des courbes prononcées et des retours en arrière
    // La trajectoire doit être plus aventureuse dans l'espace tout en restant fluide
    
    // Position X : oscillations prononcées avec retours en arrière
    // Utilisation de plusieurs harmoniques pour créer des boucles complexes
    const xOscillation1 = Math.sin(normalizedT * Math.PI * 8) * 80 * Math.exp(-normalizedT * 0.8);
    const xOscillation2 = Math.sin(normalizedT * Math.PI * 16) * 40 * Math.exp(-normalizedT * 1.2);
    const xOscillation3 = Math.cos(normalizedT * Math.PI * 12) * 25 * Math.exp(-normalizedT * 1.5);
    
    const x = baseX + xOscillation1 + xOscillation2 + xOscillation3;
    
    // Position Y : combinaison harmonieuse de plusieurs ondes
    const centerY = 175; // Centre vertical
    
    // Onde principale : amplitude très prononcée avec des courbes dramatiques
    const mainWave = Math.sin(normalizedT * Math.PI * 6) * 120 * Math.exp(-normalizedT * 0.6);
    
    // Onde secondaire : créer des boucles et des retours
    const secondaryWave = Math.cos(normalizedT * Math.PI * 10) * 60 * Math.exp(-normalizedT * 1.0);
    
    // Onde tertiaire : oscillations rapides pour la complexité
    const tertiaryWave = Math.sin(normalizedT * Math.PI * 18) * 30 * Math.exp(-normalizedT * 1.8);
    
    // Dérive verticale : mouvement ample de haut en bas
    const verticalDrift = Math.sin(normalizedT * Math.PI * 3) * 80 * (1 - normalizedT * 0.5);
    
    // Mouvement en spirale pour créer des retours en arrière visuels
    const spiralEffect = Math.sin(normalizedT * Math.PI * 14) * Math.cos(normalizedT * Math.PI * 7) * 45 * Math.exp(-normalizedT * 1.3);
    
    // Combinaison harmonieuse de toutes les composantes
    const y = centerY + mainWave + secondaryWave + tertiaryWave + verticalDrift + spiralEffect;
    
    return { x, y };
  };

  // Calcul des positions des trajectoires
  const horizonX = 400; // Position de l'horizon des événements (60% de progression)
  const singularityY = 175; // Centré verticalement dans la zone de visualisation
  
  // Définition de la forme du tissu espace-temps selon la progression
  const backgroundShapePoints = progress <= 60 
    ? "0,0 0,350 400,350 650,350 650,0 400,0"  // Rectangle étendu jusqu'à x=650 avant l'horizon
    : "0,0 0,350 400,350 620,175 400,0";  // Triangle après l'horizon
  
  // La trajectoire temporelle suit exactement la même progression que la spatiale
  // jusqu'à l'horizon des événements (60% de progression)
  const spatialProgressToHorizon = Math.min(progress, 60); // Limité à 60%
  const temporalX = 10 + (spatialProgressToHorizon / 60) * (horizonX - 10); // De x=10 à x=400

  // Position de la trajectoire spatiale à l'horizon (pour la continuité)
  const spatialAtHorizon = calculateSpatialPath(60);
  const spaceTrajectoryYAtHorizon = spatialAtHorizon.y;

  return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-2 sm:p-4">

      {/* Zone de visualisation */}
      <div className="relative bg-black/30 rounded-xl p-1 sm:p-2 h-64 sm:h-80 lg:h-[500px] xl:h-[600px] overflow-hidden mb-1 sm:mb-2">

        <svg width="100%" height="100%" viewBox="0 0 700 410" className="absolute inset-0" preserveAspectRatio="xMidYMid meet">
          {/* Fond du tissu espace-temps - forme dynamique selon la progression */}
          <defs>
            <clipPath id="triangularBackground">
              <polygon points={backgroundShapePoints} />
            </clipPath>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          
          {/* Fond avec grille - clippé selon la forme du tissu espace-temps */}
          <rect width="100%" height="100%" fill="url(#grid)" clipPath="url(#triangularBackground)" />
          
          {/* Grille de fond */}
          
          {/* Contour du tissu espace-temps pour bien voir la forme */}
          <polygon 
            points={backgroundShapePoints}
            fill="none" 
            stroke="rgba(255,255,255,0.3)" 
            strokeWidth="2"
          />

          {/* Horizon des événements */}
          <line
            x1={horizonX}
            y1="0"
            x2={horizonX}
            y2="350"
            stroke={progress <= 60 ? "#ffcc00" : "#0066ff"}
            strokeWidth="3"
            strokeDasharray="10,5"
          />
          <text x={horizonX} y="25" fill={progress <= 60 ? "#ffcc00" : "#0066ff"} fontSize="20" fontWeight="bold" textAnchor="middle" className="hidden sm:block">
            Horizon des Événements
          </text>
          
          {/* Version mobile du label */}
          <text x={horizonX} y="20" fill={progress <= 60 ? "#ffcc00" : "#0066ff"} fontSize="24" fontWeight="bold" textAnchor="middle" className="sm:hidden">
            Horizon des Événements
          </text>

          {/* Zone "Futur potentiel" - avant l'horizon seulement */}
          {progress <= 60 && (
            <rect
              x="0"
              y="0"
              width={horizonX}
              height="350"
              fill="rgba(239, 68, 68, 0.2)"
              stroke="none"
            />
          )}

          {/* Singularité */}
          <circle
            cx="620"
            cy={singularityY}
            r="8"
            fill={progress <= 60 ? "#ffcc00" : "#0066ff"}
            className="animate-pulse"
          />
          
          {/* Boule interne de la singularité (après l'horizon) */}
          {progress > 60 && (
            <circle
              cx="620"
              cy={singularityY}
              r="4"
              fill="#ef4444"
              className="animate-pulse"
            />
          )}
          
          <text x="620" y={singularityY - 15} fill={progress <= 60 ? "#ffcc00" : "#0066ff"} fontSize="20" fontWeight="bold" textAnchor="middle" className="hidden sm:block">
            Singularité
          </text>
          
          {/* Version mobile du label singularité */}
          <text x="620" y={singularityY - 12} fill={progress <= 60 ? "#ffcc00" : "#0066ff"} fontSize="24" fontWeight="bold" textAnchor="middle" className="sm:hidden">
            Singularité
          </text>

          {/* Labels temporels */}
          {/* "Passé" - toujours à gauche du rectangle */}
          {/* "Passé" - toujours à la même position (en bas à gauche) */}
          <text x="20" y="395" fill="#0066ff" fontSize="18" fontWeight="bold" opacity="0.8" className="hidden sm:block">
            Passé
          </text>
          <text x="15" y="385" fill="#0066ff" fontSize="22" fontWeight="bold" opacity="0.8" className="sm:hidden">
            Passé
          </text>
          
          {/* Flèche entre Passé et Futur */}
          {progress <= 60 ? (
            // Avant l'horizon : flèche bleue horizontale de Passé vers Futur
            <>
              <defs>
                <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" 
                 refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#0066ff" />
                </marker>
              </defs>
              <line
                x1="80"
                y1="390"
                x2="600"
                y2="390"
                stroke="#0066ff"
                strokeWidth="2"
                markerEnd="url(#arrowhead-blue)"
                opacity="0.7"
                className="hidden sm:block"
              />
              <line
                x1="80"
                y1="380"
                x2="600"
                y2="380"
                stroke="#0066ff"
                strokeWidth="2"
                markerEnd="url(#arrowhead-blue)"
                opacity="0.7"
                className="sm:hidden"
              />
            </>
          ) : (
            // Après l'horizon : flèche jaune qui suit la forme du schéma
            <>
              <defs>
                <marker id="arrowhead-yellow" markerWidth="10" markerHeight="7" 
                 refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#ffcc00" />
                </marker>
              </defs>
              <path
                d="M 80 390 L 400 390 L 610 180"
                fill="none"
                stroke="#ffcc00"
                strokeWidth="2"
                markerEnd="url(#arrowhead-yellow)"
                opacity="0.7"
                className="hidden sm:block"
              />
              <path
                d="M 80 380 L 400 380 L 620 175"
                fill="none"
                stroke="#ffcc00"
                strokeWidth="2"
                markerEnd="url(#arrowhead-yellow)"
                opacity="0.7"
                className="sm:hidden"
              />
            </>
          )}

          {/* "Futur" - position dynamique selon la progression */}
          {progress <= 60 ? (
            // Avant l'horizon : "Futur" en bas à droite du rectangle - DÉPLACÉ PLUS À DROITE
            <>
            <text x="620" y="395" fill="#0066ff" fontSize="18" fontWeight="bold" opacity="0.8" className="hidden sm:block">
              Futur
            </text>
            <text x="620" y="385" fill="#0066ff" fontSize="22" fontWeight="bold" opacity="0.8" className="sm:hidden">
              Futur
            </text>
            </>
          ) : (
            // Après l'horizon : "Futur" se déplace à droite de "Singularité"
            <>
            <>
            <text x="20" y="395" fill="#ffcc00" fontSize="18" fontWeight="bold" opacity="0.8" className="hidden sm:block">
              Passé
            </text>
            <text x="15" y="385" fill="#ffcc00" fontSize="22" fontWeight="bold" opacity="0.8" className="sm:hidden">
              Passé
            </text>
            <text x="620" y={singularityY + 25} fill="#ffcc00" fontSize="18" fontWeight="bold" opacity="0.8" textAnchor="middle" className="hidden sm:block"
              transform="rotate(-45 620 200)">
              Futur
            </text>
            <text x="620" y={singularityY + 25} fill="#ffcc00" fontSize="22" fontWeight="bold" opacity="0.8" textAnchor="middle" className="sm:hidden"
              transform="rotate(-45 620 200)">
              Futur
            </text>
            </>
            </>
          )}

          {/* Texte "Présent" qui coulisse avec la trajectoire temporelle */}
          {progress > 0 && (
            <>
              {/* Avant l'horizon : "Présent" suit la trajectoire temporelle (bleue) */}
              {progress <= 60 && (
                <>
                  {/* Fond du texte Présent */}
                  <rect
                    x={temporalX - 45}
                    y="380"
                    width="90"
                    height="20"
                    fill="rgba(0, 102, 255, 0.8)"
                    rx="4"
                    ry="4"
                    className="hidden sm:block"
                  />
                  <rect
                    x={temporalX - 45}
                    y="370"
                    width="90"
                    height="20"
                    fill="rgba(0, 102, 255, 0.8)"
                    rx="4"
                    ry="4"
                    className="sm:hidden"
                  />
                  <text 
                    x={temporalX} 
                    y="395" 
                    fill="white" 
                    fontSize="18" 
                    fontWeight="bold" 
                    opacity="0.8" 
                    textAnchor="middle" 
                    className="hidden sm:block"
                  >
                    Présent
                  </text>
                  {/* Fond du texte Présent mobile */}
                  <rect
                    x={temporalX - 55}
                    y="365"
                    width="110"
                    height="25"
                    fill="rgba(0, 102, 255, 0.8)"
                    rx="4"
                    ry="4"
                    className="sm:hidden"
                  />
                  <text 
                    x={temporalX} 
                    y="385" 
                    fill="white" 
                    fontSize="22" 
                    fontWeight="bold" 
                    opacity="0.8" 
                    textAnchor="middle" 
                    className="sm:hidden"
                  >
                    Présent
                  </text>
                </>
              )}
              
              {/* Après l'horizon : "Présent" suit la nouvelle trajectoire temporelle (jaune) */}
              {showConvergence && progress > 60 && (
                <>
                  {/* Fond du texte Présent après l'horizon */}
                  <rect
                    x={(() => {
                      const convergenceProgress = (progress - 60) / 40;
                      return spatialAtHorizon.x + (620 - spatialAtHorizon.x) * convergenceProgress - 45;
                    })()}
                    y={(() => {
                      const convergenceProgress = (progress - 60) / 40;
                      return 395 - (395 - (singularityY + 25)) * convergenceProgress - 10;
                    })()}
                    width="90"
                    height="20"
                    fill="rgba(255, 204, 0, 0.8)"
                    rx="4"
                    ry="4"
                    className="hidden sm:block"
                    transform={(() => {
                      const convergenceProgress = (progress - 60) / 40;
                      const x = spatialAtHorizon.x + (620 - spatialAtHorizon.x) * convergenceProgress;
                      const y = 395 - (395 - (singularityY + 25)) * convergenceProgress;
                      return `rotate(-45 ${x} ${y})`;
                    })()}
                  />
                  <text 
                    x={(() => {
                      const convergenceProgress = (progress - 60) / 40;
                      return spatialAtHorizon.x + (620 - spatialAtHorizon.x) * convergenceProgress;
                    })()} 
                    y={(() => {
                      const convergenceProgress = (progress - 60) / 40;
                      return 395 - (395 - (singularityY + 25)) * convergenceProgress + 3;
                    })()} 
                    fill="white" 
                    fontSize="18" 
                    fontWeight="bold" 
                    opacity="0.8" 
                    textAnchor="middle" 
                    className="hidden sm:block"
                    transform={(() => {
                      const convergenceProgress = (progress - 60) / 40;
                      const x = spatialAtHorizon.x + (620 - spatialAtHorizon.x) * convergenceProgress;
                      const y = 395 - (395 - (singularityY + 25)) * convergenceProgress;
                      return `rotate(-45 ${x} ${y})`;
                    })()}
                  >
                    Présent
                  </text>
                  {/* Fond du texte Présent mobile après l'horizon */}
                  <rect
                    x={(() => {
                      const convergenceProgress = (progress - 60) / 40;
                      return spatialAtHorizon.x + (620 - spatialAtHorizon.x) * convergenceProgress - 55;
                    })()}
                    y={(() => {
                      const convergenceProgress = (progress - 60) / 40;
                      return 385 - (385 - (singularityY + 25)) * convergenceProgress - 12;
                    })()}
                    width="110"
                    height="25"
                    fill="rgba(255, 204, 0, 0.8)"
                    rx="4"
                    ry="4"
                    className="sm:hidden"
                    transform={(() => {
                      const convergenceProgress = (progress - 60) / 40;
                      const x = spatialAtHorizon.x + (620 - spatialAtHorizon.x) * convergenceProgress;
                      const y = 385 - (385 - (singularityY + 25)) * convergenceProgress;
                      return `rotate(-45 ${x} ${y})`;
                    })()}
                  />
                  <text 
                    x={(() => {
                      const convergenceProgress = (progress - 60) / 40;
                      return spatialAtHorizon.x + (620 - spatialAtHorizon.x) * convergenceProgress;
                    })()} 
                    y={(() => {
                      const convergenceProgress = (progress - 60) / 40;
                     return 385 - (385 - (singularityY + 25)) * convergenceProgress + 10;
                    })()} 
                    fill="white" 
                    fontSize="22" 
                    fontWeight="bold" 
                    opacity="0.8" 
                    textAnchor="middle" 
                    className="sm:hidden"
                    transform={(() => {
                      const convergenceProgress = (progress - 60) / 40;
                      const x = spatialAtHorizon.x + (620 - spatialAtHorizon.x) * convergenceProgress;
                     const y = 385 - (385 - (singularityY + 25)) * convergenceProgress + 10;
                      return `rotate(-45 ${x} ${y})`;
                    })()}
                  >
                    Présent
                  </text>
                </>
              )}
            </>
          )}
          {/* Trajectoire Spatiale (jaune) - avant l'horizon des événements */}
          {/* Représente la liberté de mouvement dans l'espace avec des boucles complexes */}
          {/* Avant l'horizon : trajectoire spatiale normale (jaune) */}
          {progress > 0 && (
            <path
              d={(() => {
                const points = [];
                const startPoint = calculateSpatialPath(0);
                points.push(`M ${startPoint.x} ${startPoint.y}`);
                
                // Dessine jusqu'à l'horizon (60%) ou jusqu'au point actuel si avant l'horizon
                const maxProgress = Math.min(Math.floor(progress), 60);
                for (let i = 1; i <= maxProgress; i++) {
                  const point = calculateSpatialPath(i);
                  points.push(`L ${point.x} ${point.y}`);
                }
                
                return points.join(' ');
              })()}
              fill="none"
              stroke="#ffcc00"
              strokeWidth="3"
              opacity={progress > 60 ? "0.6" : "0.8"}
            />
          )}

          {/* Trajectoire Temporelle (bleue) avant l'horizon */}
          {/* Ligne verticale qui représente l'écoulement du temps vers le futur */}
          {/* Après l'horizon : devient la Trajectoire Spatiale (jaune) qui a pris la forme temporelle */}
          {progress > 0 && progress <= 60 && (
            <line
              x1={temporalX}
              y1="0"
              x2={temporalX}
              y2="350"
              stroke="#0066ff"
              strokeWidth="3"
              opacity="0.8"
            />
          )}

          {/* Trajectoire Spatiale (jaune) après l'horizon */}
          {/* A pris la forme de la Trajectoire Temporelle : ligne verticale qui se contracte */}
          {/* Rétrécit selon la géométrie triangulaire du tissu espace-temps vers la singularité */}
          {showConvergence && progress > 60 && (
            (() => {
              const convergenceProgress = (progress - 60) / 40;
              const currentX = spatialAtHorizon.x + (620 - spatialAtHorizon.x) * convergenceProgress;
              
              // Définition des dimensions du tissu espace-temps :
              // Rectangle : de x=0 à x=400, hauteur complète (0 à 350)
              // Triangle : de x=400 à x=620, rétrécit vers la singularité
              
              let y1, y2;
              
              if (currentX <= 400) {
                // Dans la partie rectangulaire : trajectoire temporelle occupe toute la hauteur
                y1 = 0;
                y2 = 350;
              } else {
                // Dans la partie triangulaire : calcul de la hauteur selon la forme du triangle
                const progressInTriangle = (currentX - 400) / (620 - 400);
                const triangleHeight = 350 * (1 - progressInTriangle);
                const centerY = 175;
                
                y1 = centerY - triangleHeight / 2;
                y2 = centerY + triangleHeight / 2;
              }
              
              return (
                <line
                  x1={currentX}
                  y1={y1}
                  x2={currentX}
                  y2={y2}
                  stroke="#ffcc00"
                  strokeWidth="3"
                  opacity="0.8"
                />
              );
            })()
          )}

          {/* Trajectoire Temporelle (bleue) après l'horizon */}
          {/* A pris la forme de la Trajectoire Spatiale : chemin courbe vers la singularité */}
          {/* Converge inévitablement vers la singularité - le futur devient spatial */}
          {showConvergence && progress > 60 && (
            <path
              d={(() => {
                const points = [];
                points.push(`M ${spatialAtHorizon.x} ${spatialAtHorizon.y}`);
                
                // Génère les points de la trajectoire espace-temps unifiée
                const progressAfterHorizon = progress - 60;
                for (let i = 1; i <= Math.floor(progressAfterHorizon); i++) {
                  const convergenceProgress = i / 40; // 40 = 100 - 60 (progression totale après l'horizon)
                  const x = spatialAtHorizon.x + (620 - spatialAtHorizon.x) * convergenceProgress;
                  const y = spatialAtHorizon.y + (singularityY - spatialAtHorizon.y) * convergenceProgress;
                  points.push(`L ${x} ${y}`);
                }
                
                return points.join(' ');
              })()}
              fill="none"
              stroke="#0066ff"
              strokeWidth="4"
              opacity="0.9"
            />
          )}

          {/* Point actuel de la Trajectoire Spatiale (jaune) */}
          {/* Avant l'horizon : suit le chemin spatial complexe avec boucles */}
          {progress > 0 && progress <= 60 && (
            (() => {
              const currentPos = calculateSpatialPath(progress);
              return <circle
              cx={currentPos.x}
              cy={currentPos.y}
              r="6"
              fill="#ffcc00"
              className="animate-pulse"
            />;
            })()
          )}

          {/* Point actuel de la Trajectoire Temporelle (bleue) après l'horizon */}
          {/* A pris la forme spatiale : suit le chemin courbe vers la singularité */}
          {/* Le temps devient espace et converge inévitablement */}
          {showConvergence && progress > 60 && (
            <circle
              cx={(() => {
                const convergenceProgress = (progress - 60) / 40;
                return spatialAtHorizon.x + (620 - spatialAtHorizon.x) * convergenceProgress;
              })()}
              cy={(() => {
                const convergenceProgress = (progress - 60) / 40;
                return spatialAtHorizon.y + (singularityY - spatialAtHorizon.y) * convergenceProgress;
              })()}
              r="8"
              fill="#0066ff"
              className="animate-pulse"
            />
          )}

        </svg>


      </div>

      {/* Contrôles de lecture - en dessous du schéma */}
      <div className="flex justify-center mb-1 sm:mb-2">
        <button
          onClick={handlePlayPause}
          className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
        >
          {isAnimating ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </button>
      </div>

      {/* Légendes - maintenant en dehors de la zone SVG */}
      <div className="mt-1 sm:mt-2 bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3">
        <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">Légende</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <div className="flex items-center">
            <div className="w-4 h-1 mr-2" style={{backgroundColor: '#ffcc00'}}></div>
            <span className="text-xs sm:text-sm text-white">Trajectoire Spatiale</span>
          </div>
          <div className="flex items-center">
            <div className="w-1 h-4 mr-2" style={{backgroundColor: '#0066ff'}}></div>
            <span className="text-xs sm:text-sm text-white">Trajectoire Temporelle</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-1 mr-2 bg-red-500 opacity-50 rounded-sm"></div>
            <span className="text-white text-xs sm:text-sm">Futur potentiel</span>
          </div>
        </div>
      </div>

      {/* Explications contextuelles */}
      <div className="mt-2 sm:mt-4 grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-yellow-900/20 p-3 sm:p-4 rounded-lg border-l-4" style={{borderColor: '#ffcc00'}}>
          <h4 className="font-semibold mb-2 text-base sm:text-lg" style={{color: '#ffcc00'}}>Zone Normale (Avant l'Horizon)</h4>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            <strong>Trajectoire Spatiale (jaune) :</strong> Liberté totale de mouvement dans l'espace avec des courbes complexes et des retours en arrière possibles.
            <br/><br/>
            <strong>Trajectoire Temporelle (bleue) :</strong> Progression linéaire et inévitable vers le futur.
          </p>
        </div>
        <div className="bg-green-900/20 p-3 sm:p-4 rounded-lg border-l-4" style={{borderColor: '#00cc00'}}>
          <h4 className="font-semibold mb-2 text-base sm:text-lg" style={{color: '#00cc00'}}>Point de Transformation</h4>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            <strong>Horizon des événements :</strong> Point critique où les trajectoires spatiale et temporelle échangent leurs rôles et leurs propriétés.
            <br/><br/>
            <strong>Inversion :</strong> Ce qui était spatial devient temporel, ce qui était temporel devient spatial.
          </p>
        </div>
        <div className="bg-red-900/20 p-3 sm:p-4 rounded-lg">
          <h4 className="font-semibold text-red-300 mb-2 text-base sm:text-lg">Zone Inversée (Après l'Horizon)</h4>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            <strong>Trajectoire Temporelle (bleue) :</strong> A pris la forme spatiale d'origine et converge inévitablement vers la singularité.
            <br/><br/>
            <strong>Trajectoire Spatiale (jaune) :</strong> A pris la forme temporelle d'origine et est contrainte de se contracter vers la singularité.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpaceTimeTrajectoryVisual;