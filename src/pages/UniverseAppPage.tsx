import React, { useState, useEffect, useRef } from 'react';
import { Code, Layers, Zap, Atom, Cpu, Binary, ChevronDown, ChevronUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

// Composant pour les chiffres binaires qui se téléportent
const TeleportingBinaryDigits: React.FC = () => {
  // Fonction pour vérifier si deux positions se chevauchent
  const checkCollision = (newTop: number, newLeft: number, existingDigits: any[], minDistance: number = 0.8) => {
    return existingDigits.some(digit => {
      if (!digit.visible) return false; // Ignore les chiffres invisibles
      const distance = Math.sqrt(
        Math.pow(newTop - digit.top, 2) + Math.pow(newLeft - digit.left, 2)
      );
      return distance < minDistance;
    });
  };

  // Fonction pour générer une position sans collision
  const generateSafePosition = (existingDigits: any[], maxAttempts: number = 5) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const newTop = Math.random() * 90 + 5;
      const newLeft = Math.random() * 90 + 5;
      
      if (!checkCollision(newTop, newLeft, existingDigits)) {
        return { top: newTop, left: newLeft };
      }
    }
    
    // Si aucune position sûre n'est trouvée, retourner une position aléatoire
    return {
      top: Math.random() * 90 + 5,
      left: Math.random() * 90 + 5
    };
  };

  const [digits, setDigits] = React.useState(() => 
    Array.from({ length: 28 }, (_, i) => {
      // Génération initiale avec détection de collision
      const existingDigits: any[] = [];
      const position = generateSafePosition(existingDigits);
      
      const newDigit = {
        id: i,
        value: Math.random() > 0.5 ? '1' : '0',
        top: position.top,
        left: position.left,
        opacity: Math.random() * 0.3 + 0.1,
        size: ['text-xl', 'text-2xl', 'text-3xl'][Math.floor(Math.random() * 3)],
        visible: true,
        nextChangeTime: Date.now() + Math.random() * 200 + 100 // 0.1s à 0.3s
      };
      
      existingDigits.push(newDigit);
      return newDigit;
    })
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      
      setDigits(prevDigits => 
        prevDigits.map(digit => {
          if (now >= digit.nextChangeTime) {
            if (digit.visible) {
              // Disparaître complètement
              return {
                ...digit,
                visible: false,
                nextChangeTime: now + 100 // Réapparaître dans exactement 0.1 seconde
              };
            } else {
              // Réapparaître à un nouvel endroit avec de nouvelles propriétés (sans collision)
              const position = generateSafePosition(prevDigits.filter(d => d.id !== digit.id && d.visible));
              
              return {
                ...digit,
                value: Math.random() > 0.5 ? '1' : '0',
                top: position.top,
                left: position.left,
                opacity: Math.random() * 0.3 + 0.1,
                size: ['text-xl', 'text-2xl', 'text-3xl'][Math.floor(Math.random() * 3)],
                visible: true,
                nextChangeTime: now + Math.random() * 200 + 100 // Rester visible 0.1s à 0.3s avant prochaine téléportation
              };
            }
          }
          return digit;
        })
      );
    }, 10); // Vérification toutes les 10ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {digits.map(digit => (
        <div
          key={digit.id}
          className={`absolute ${digit.size} font-mono text-cyan-400 transition-opacity duration-300 select-none ${
            digit.visible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            top: `${digit.top}%`,
            left: `${digit.left}%`,
            opacity: digit.visible ? digit.opacity : 0,
            textShadow: '0 0 10px rgba(34, 211, 238, 0.5)',
            transform: 'translate(-50%, -50%)'
          }}
        >
          {digit.value}
        </div>
      ))}
    </div>
  );
};

export const UniverseAppPage: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(-1); // -1 pour la page d'intro

  const sections = [
    {
      id: -1,
      icon: <Code className="w-8 h-8 sm:w-12 sm:h-12" />,
      title: "L'univers est une application",
      scale: "Introduction",
      color: "from-cyan-500 to-purple-500",
      bgGradient: "from-slate-900 via-purple-900 to-indigo-900",
      content: {
        info: "Imaginons que l'univers fonctionne comme une application informatique.",
        universe: "Chaque couche correspond à un langage ou à un niveau d'abstraction, qui encapsule le précédent et prépare le suivant.",
        connectionHorizontal: "Ce que nous voyons à l'échelle humaine — le monde macroscopique — est une interface utilisateur : le rendu final d'un immense processus de compilation qui descend jusqu'à une mer de 0 et 1 à l'échelle de Planck."
      }
    },
    {
      id: 0,
      icon: <Layers className="w-8 h-8 sm:w-12 sm:h-12" />,
      applicationTitle: "Interface Utilisateur (Application)",
      universeTitle: "Monde macroscopique (Univers)",
      title: "Interface Utilisateur ↔ Monde macroscopique",
      scale: "10⁻⁴ m à 1 m",
      color: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-900/30 via-cyan-900/20 to-blue-800/30",
      content: {
        application: "Interface utilisateur (UI), rendu final affiché à l'écran.",
        universe: "Monde macroscopique, réalité visible à l'échelle humaine.",
        universeExamples: "êtres humains, animaux, arbres, montagnes, océans, objets du quotidien",
        applicationConnections: {
          above: null,
          below: "l'UI est générée par les composants React."
        },
        universeConnections: {
          above: null,
          below: "le monde macroscopique est formé de molécules."
        },
        connectionHorizontal: "l'UI est la traduction lisible d'un code invisible, tout comme le monde macroscopique est l'expression visible de structures moléculaires cachées."
      }
    },
    {
      id: 1,
      icon: <Code className="w-8 h-8 sm:w-12 sm:h-12" />,
      applicationTitle: "Composants React (Application)",
      universeTitle: "Molécules (Univers)",
      title: "Composants React ↔ Molécules",
      scale: "10⁻⁹ à 10⁻⁶ m",
      color: "from-green-500 to-emerald-500",
      bgGradient: "from-green-900/30 via-emerald-900/20 to-green-800/30",
      content: {
        application: "Composants React, briques réutilisables qui définissent logique et apparence. Chaque composant est écrit en JavaScript.",
        universe: "Molécules, assemblages d'atomes qui portent des propriétés fonctionnelles (ADN, protéines, matériaux).",
        universeExamples: "eau (H₂O), dioxygène (O₂), dioxyde de carbone (CO₂), ADN, protéines, lipides, plastiques, métaux",
        applicationConnections: {
          above: "les composants React construisent l'interface utilisateur.",
          below: "les composants React sont écrits en JavaScript."
        },
        universeConnections: {
          above: "les molécules forment le monde macroscopique.",
          below: "les molécules sont constituées d'atomes."
        },
        connectionHorizontal: "les composants React encapsulent du code pour donner un rôle précis, comme les molécules encapsulent des atomes pour leur donner des propriétés nouvelles."
      }
    },
    {
      id: 2,
      icon: <Zap className="w-8 h-8 sm:w-12 sm:h-12" />,
      applicationTitle: "JavaScript (Application)",
      universeTitle: "Atomes (Univers)",
      title: "JavaScript ↔ Atomes",
      scale: "10⁻¹⁰ m",
      color: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-900/30 via-orange-900/20 to-yellow-800/30",
      content: {
        application: "JavaScript, langage universel et flexible, base de React.",
        universe: "Atomes, briques fondamentales de la matière (électrons + noyau).",
        universeExamples: "hydrogène (H), oxygène (O), carbone (C), fer (Fe), uranium (U)",
        applicationConnections: {
          above: "JavaScript est utilisé pour écrire des composants React.",
          below: "JavaScript est exécuté par des moteurs en C/C++."
        },
        universeConnections: {
          above: "les atomes se combinent pour former des molécules.",
          below: "les atomes sont constitués de nucléons."
        },
        connectionHorizontal: "JavaScript est une syntaxe universelle qui permet d'assembler du code, comme les atomes offrent une grammaire universelle pour assembler la matière."
      }
    },
    {
      id: 3,
      icon: <Atom className="w-8 h-8 sm:w-12 sm:h-12" />,
      applicationTitle: "C / C++ (Application)",
      universeTitle: "Nucléons (Univers)",
      title: "C / C++ ↔ Nucléons",
      scale: "10⁻¹⁵ m",
      color: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-900/30 via-violet-900/20 to-purple-800/30",
      content: {
        application: "C et C++, langages systèmes robustes, fondations des moteurs d'exécution.",
        universe: "Nucléons (protons et neutrons), structures qui stabilisent les atomes.",
        universeExamples: "protons et neutrons dans les noyaux atomiques (hydrogène, hélium, carbone…)",
        applicationConnections: {
          above: "C/C++ fait tourner les moteurs JavaScript.",
          below: "C/C++ est compilé en instructions processeur."
        },
        universeConnections: {
          above: "les nucléons forment les noyaux atomiques.",
          below: "les nucléons sont constitués de quarks liés par des gluons."
        },
        connectionHorizontal: "C/C++ fournit une ossature stable pour exécuter les langages supérieurs, comme les nucléons fournissent une stabilité structurelle aux atomes."
      }
    },
    {
      id: 4,
      icon: <Cpu className="w-8 h-8 sm:w-12 sm:h-12" />,
      applicationTitle: "Instructions processeur (Application)",
      universeTitle: "Particules fondamentales (Univers)",
      title: "Instructions processeur ↔ Particules fondamentales",
      scale: "10⁻¹⁸ m",
      color: "from-red-500 to-pink-500",
      bgGradient: "from-red-900/30 via-pink-900/20 to-red-800/30",
      content: {
        application: "Instructions processeur (assembleur, opcodes : ADD, MOV, JMP), ordres élémentaires traduits en binaire.",
        universe: "Particules fondamentales : fermions (quarks et leptons) = la matière, bosons (photon, gluon, W/Z, Higgs) = les forces.",
        universeExamples: "Quarks (up, down, charm, strange, top, bottom), Leptons (électron, neutrinos, muons, taus), Bosons (photon, gluon, W, Z, Higgs)",
        applicationConnections: {
          above: "les instructions exécutent le code C/C++.",
          below: "les instructions sont traduites en 0 et 1."
        },
        universeConnections: {
          above: "les particules fondamentales forment les nucléons.",
          below: "les particules reposent sur l'échelle de Planck."
        },
        connectionHorizontal: "les instructions sont les ordres élémentaires de l'application, comme les particules sont les entités élémentaires de la matière et des forces."
      }
    },
    {
      id: 5,
      icon: <Binary className="w-8 h-8 sm:w-12 sm:h-12" />,
      applicationTitle: "0 et 1 (Application)",
      universeTitle: "Échelle de Planck (Univers)",
      title: "0 et 1 ↔ Échelle de Planck",
      scale: "10⁻³⁵ m",
      color: "from-gray-600 to-slate-600",
      bgGradient: "from-gray-900/30 via-slate-900/20 to-gray-800/30",
      content: {
        application: "Bits binaires, une mer de 0 et 1, sans signification isolée mais base de toute information.",
        universe: "Échelle de Planck, granularité ultime de l'espace-temps.",
        universeExamples: "granularité minimale de l'espace-temps (quanta hypothétiques), niveau où les lois de la relativité et de la mécanique quantique cessent de s'appliquer séparément",
        applicationConnections: {
          above: "les 0 et 1 composent les instructions processeur.",
          below: null
        },
        universeConnections: {
          above: "l'échelle de Planck donne naissance aux particules fondamentales.",
          below: null
        },
        connectionHorizontal: "les 0 et 1 sont les briques minimales de l'information, comme l'échelle de Planck est la brique minimale de la réalité physique."
      }
    }
  ];

  // Fonctions de navigation
  const goToUpperScale = () => {
    if (currentSection > -1) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const goToLowerScale = () => {
    if (currentSection < sections.length - 2) { // -2 car on a ajouté l'intro
      setCurrentSection(prev => prev + 1);
    }
  };

  const currentSectionData = sections[currentSection + 1]; // +1 car l'intro est à l'index -1

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      <div 
        className="min-h-screen overflow-hidden relative"
      >
        {/* Effet de particules en arrière-plan */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-indigo-900/20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(147,51,234,0.05)_50%,transparent_75%)] bg-[length:60px_60px] animate-pulse"></div>
        
        {/* Chiffres binaires téléportants pour la dernière section */}
        {currentSection === 5 && <TeleportingBinaryDigits />}
        
        {/* Bouton échelle supérieure (4 flèches vers l'extérieur) */}
        {/* Section actuelle */}
        <div className="flex items-start justify-center pt-2">
          {currentSection === -1 ? (
            // Page d'introduction
            <div className="w-full flex items-start justify-center p-2 sm:p-4 pt-2">
              <div className="max-w-4xl mx-auto w-full text-center">
                
                {/* Titre principal */}
                <div className="mb-3 sm:mb-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                    L'univers est une application
                  </h1>
                </div>

                {/* Contenu d'introduction */}
                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                    <p className="text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed">
                      Imaginons que l'univers fonctionne comme une application informatique.
                    </p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                    <p className="text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed">
                      Chaque couche correspond à un langage ou à un niveau d'abstraction, qui encapsule le précédent et prépare le suivant.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-yellow-400/30">
                    <p className="text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed font-medium">
                      Ce que nous voyons à l'échelle humaine : "le monde macroscopique" est une interface utilisateur : le rendu final d'un immense processus de compilation qui descend jusqu'à une mer de 0 et 1 à l'échelle de Planck.
                    </p>
                  </div>
                  
                  <div className="bg-red-900/30 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-red-400/30">
                    <p className="text-xs sm:text-sm lg:text-base text-gray-300 leading-relaxed italic">
                      Contrairement à une vraie application, ce code n'est pas modifiable par un développeur extérieur : nous n'avons pas accès aux sources. Nous percevons uniquement l'interface finale.
                    </p>
                  </div>
                </div>

                {/* Call to action */}
                <div className="flex flex-col items-center mb-2 sm:mb-3">
                  <p className="text-base sm:text-lg text-cyan-300 font-bold mb-3 sm:mb-4">
                    Explorez les 6 couches de cette analogie
                  </p>
                  <div className="animate-bounce">
                    <ArrowDown className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 mt-2">
                    Cliquez sur le bouton en bas pour commencer le voyage
                  </p>
                </div>

                {/* Bouton Explorer pour l'introduction */}
                {currentSection < sections.length - 2 && (
                  <div className="flex justify-center mt-2 sm:mt-3">
                    <button
                      onClick={goToLowerScale}
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-full px-6 py-3 sm:px-8 sm:py-4 shadow-2xl border-2 border-white/20 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <div className="flex items-center justify-center">
                        <span className="text-sm sm:text-base font-bold whitespace-nowrap">Explorer l'application de l'univers</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Pages des échelles
            <div className={`w-full bg-gradient-to-br ${currentSectionData.bgGradient} flex items-start justify-center p-2 sm:p-4`}>
              <div className="max-w-6xl mx-auto w-full">
                
                {/* En-tête de section */}
                <div className="text-center mb-3 sm:mb-4">
                  {/* Bouton Élargir intégré */}
                  {currentSection > 0 && (
                    <div className="mb-3 sm:mb-4">
                      <button
                        onClick={goToUpperScale}
                        className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full w-20 h-20 sm:w-24 sm:h-24 shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 border-2 border-white/20"
                      >
                        <div className="flex items-center justify-center h-full transition-all duration-500 group-hover:scale-110">
                          <span className="text-xs sm:text-sm font-bold transition-all duration-500 group-hover:text-sm sm:group-hover:text-base group-hover:font-extrabold text-center leading-tight">Élargir</span>
                        </div>
                      </button>
                    </div>
                  )}
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 inline-block border border-white/20">
                    <div className="flex items-center justify-center space-x-2 sm:space-x-3 text-xs sm:text-sm lg:text-base font-bold text-cyan-300">
                      <span>{currentSectionData.content.universe.split(',')[0]}</span>
                      <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
                      <span className="text-yellow-300">{currentSectionData.scale}</span>
                      <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
                      <span>{currentSectionData.content.application.split(',')[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Contenu principal */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  {/* Section Univers */}
                  <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/40 backdrop-blur-sm rounded-xl p-3 sm:p-4 border-2 border-purple-400/40 shadow-2xl">
                    <div className="bg-purple-800/30 backdrop-blur-sm rounded-lg px-3 py-2 mb-3 border border-purple-300/30">
                      <h3 className="text-base sm:text-lg font-bold text-purple-200 text-center">
                      Univers : {currentSectionData.content.universe.split(',')[0]}
                      </h3>
                    </div>
                    <p className="text-gray-200 text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3">
                      {currentSectionData.content.universe}
                    </p>
                    
                    {/* Exemples univers */}
                    {currentSectionData.content.universeExamples && (
                      <div className="bg-purple-800/30 backdrop-blur-sm rounded-md p-1.5 sm:p-2 border border-purple-300/30 mb-2 sm:mb-3">
                        <h4 className="font-bold text-purple-200 mb-1 text-xs">
                          🌌 Exemples dans l'univers
                        </h4>
                        <p className="text-gray-300 text-xs leading-relaxed italic">
                          {currentSectionData.content.universeExamples}
                        </p>
                      </div>
                    )}
                    
                    {/* Connexions univers */}
                    <div className="space-y-1 sm:space-y-2">
                      {currentSectionData.content.universeConnections?.above && (
                        <div className="bg-green-900/30 backdrop-blur-sm rounded-md p-1.5 sm:p-2 border border-green-400/30">
                          <h4 className="font-bold text-green-300 mb-1 flex items-center text-xs">
                            <ChevronUp className="w-3 h-3 mr-1" />
                            Au-dessus
                          </h4>
                          <p className="text-gray-200 text-xs leading-relaxed">
                            {currentSectionData.content.universeConnections.above}
                          </p>
                        </div>
                      )}
                      
                      {currentSectionData.content.universeConnections?.below && (
                        <div className="bg-orange-900/30 backdrop-blur-sm rounded-md p-1.5 sm:p-2 border border-orange-400/30">
                          <h4 className="font-bold text-orange-300 mb-1 flex items-center text-xs">
                            <ChevronDown className="w-3 h-3 mr-1" />
                            En dessous
                          </h4>
                          <p className="text-gray-200 text-xs leading-relaxed">
                            {currentSectionData.content.universeConnections.below}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section Informatique */}
                  <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/40 backdrop-blur-sm rounded-xl p-3 sm:p-4 border-2 border-blue-400/40 shadow-2xl">
                    <div className="bg-blue-800/30 backdrop-blur-sm rounded-lg px-3 py-2 mb-3 border border-blue-300/30">
                      <h3 className="text-base sm:text-lg font-bold text-blue-200 text-center">
                      Application : {currentSectionData.content.application.split(',')[0]}
                      </h3>
                    </div>
                    <p className="text-gray-200 text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3">
                      {currentSectionData.content.application}
                    </p>
                    
                    {/* Connexions application */}
                    <div className="space-y-1 sm:space-y-2">
                      {currentSectionData.content.applicationConnections?.above && (
                        <div className="bg-green-900/30 backdrop-blur-sm rounded-md p-1.5 sm:p-2 border border-green-400/30">
                          <h4 className="font-bold text-green-300 mb-1 flex items-center text-xs">
                            <ChevronUp className="w-3 h-3 mr-1" />
                            Au-dessus
                          </h4>
                          <p className="text-gray-200 text-xs leading-relaxed">
                            {currentSectionData.content.applicationConnections.above}
                          </p>
                        </div>
                      )}
                      
                      {currentSectionData.content.applicationConnections?.below && (
                        <div className="bg-orange-900/30 backdrop-blur-sm rounded-md p-1.5 sm:p-2 border border-orange-400/30">
                          <h4 className="font-bold text-orange-300 mb-1 flex items-center text-xs">
                            <ChevronDown className="w-3 h-3 mr-1" />
                            En dessous
                          </h4>
                          <p className="text-gray-200 text-xs leading-relaxed">
                            {currentSectionData.content.applicationConnections.below}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Connexion horizontale */}
                <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/40 backdrop-blur-sm rounded-xl p-3 sm:p-4 border-2 border-emerald-400/40 shadow-2xl">
                  <div className="bg-emerald-800/30 backdrop-blur-sm rounded-lg px-3 py-2 mb-3 border border-emerald-300/30">
                    <h4 className="font-bold text-emerald-200 mb-0 text-sm sm:text-base text-center">
                      Connexion horizontale application ↔ univers
                    </h4>
                  </div>
                  <p className="text-gray-200 text-xs sm:text-sm leading-relaxed font-medium">
                    {currentSectionData.content.connectionHorizontal}
                  </p>
                </div>

                {/* Bouton Rétrécir pour les pages d'échelles */}
                {currentSection < sections.length - 2 && (
                  <div className="flex justify-center mt-4 sm:mt-6 mb-2 sm:mb-3">
                    <button
                      onClick={goToLowerScale}
                      className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full w-20 h-20 sm:w-24 sm:h-24 shadow-2xl transition-all duration-500 transform hover:scale-90 active:scale-95 border-2 border-white/20"
                    >
                      <div className="flex items-center justify-center h-full transition-all duration-500 group-hover:scale-90">
                        <span className="text-xs sm:text-sm font-bold transition-all duration-500 group-hover:text-xs sm:group-hover:text-sm group-hover:font-extrabold text-center leading-tight">Rétrécir</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Indicateurs de navigation */}
        {currentSection !== -1 && (
          <div className="fixed right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-50">
          <div className="flex flex-col space-y-2">
            {sections.slice(1).map((section, index) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(index)} // index direct car on a supprimé l'intro avec slice(1)
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentSection
                    ? `bg-gradient-to-r ${section.color} shadow-lg scale-125`
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
          </div>
        )}

      </div>
    </div>
  );
};