import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';

// Composant pour les chiffres binaires qui se téléportent
const TeleportingBinaryDigits: React.FC = () => {
  // Fonction pour vérifier si deux positions se chevauchent
  const checkCollision = (newTop: number, newLeft: number, existingDigits: any[], minDistance: number = 8) => {
    return existingDigits.some(digit => {
      if (!digit.visible) return false; // Ignore les chiffres invisibles
      const distance = Math.sqrt(
        Math.pow(newTop - digit.top, 2) + Math.pow(newLeft - digit.left, 2)
      );
      return distance < minDistance;
    });
  };

  // Fonction pour générer une position sans collision
  const generateSafePosition = (existingDigits: any[], maxAttempts: number = 50) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const newTop = Math.random() * 90 + 5;
      const newLeft = Math.random() * 90 + 5;
      
      if (!checkCollision(newTop, newLeft, existingDigits)) {
        return { top: newTop, left: newLeft };
      }
    }
    
    // Si aucune position sûre n'est trouvée, retourne une position aléatoire
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
        digit: Math.random() > 0.5 ? '1' : '0',
        top: position.top,
        left: position.left,
        color: ['text-green-400', 'text-green-300', 'text-emerald-400', 'text-lime-400', 'text-green-500'][Math.floor(Math.random() * 5)],
        size: ['text-xl', 'text-2xl', 'text-3xl'][Math.floor(Math.random() * 3)],
        visible: true,
        nextChangeTime: Date.now() + Math.random() * 2000 + 1000 // 1s à 3s
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
                nextChangeTime: now + 1000 // Réapparaître dans exactement 1 seconde
              };
            } else {
              // Réapparaître à un nouvel endroit avec de nouvelles propriétés (sans collision)
              const otherVisibleDigits = prevDigits.filter(d => d.id !== digit.id && d.visible);
              const safePosition = generateSafePosition(otherVisibleDigits);
              
              return {
                ...digit,
                digit: Math.random() > 0.5 ? '1' : '0',
                top: safePosition.top,
                left: safePosition.left,
                color: ['text-green-400', 'text-green-300', 'text-emerald-400', 'text-lime-400', 'text-green-500'][Math.floor(Math.random() * 5)],
                size: ['text-xl', 'text-2xl', 'text-3xl'][Math.floor(Math.random() * 3)],
                visible: true,
                nextChangeTime: now + Math.random() * 2000 + 1000 // Rester visible 1s à 3s avant prochaine téléportation
              };
            }
          }
          return digit;
        })
      );
    }, 100); // Vérification toutes les 100ms

    return () => clearInterval(interval);
  }, [checkCollision, generateSafePosition]);

  return (
    <>
      {digits.map(digit => (
        <div
          key={digit.id}
          className={`absolute ${digit.color} ${digit.size} font-mono font-bold transition-opacity duration-300 drop-shadow-[0_0_8px_currentColor] ${
            digit.visible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            top: `${digit.top}%`,
            left: `${digit.left}%`,
          }}
        >
          {digit.digit}
        </div>
      ))}
    </>
  );
};

export const Navigation: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Fermer le menu lors du changement de route avec un délai pour éviter les conflits
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 50); // Petit délai pour éviter les conflits de rendu
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  const navigationItems = [
    {
      path: '/',
      title: "L'univers est une application",
      shortTitle: "L'univers est une application",
      gradient: 'from-indigo-500/20 to-violet-500/20',
      hoverGradient: 'hover:from-indigo-500/10 hover:to-violet-500/10',
      textColor: 'text-indigo-300',
      hoverTextColor: 'hover:text-indigo-300',
      borderColor: 'border-indigo-400/30',
      hoverBorderColor: 'hover:border-indigo-400/20',
      shadowColor: 'shadow-indigo-500/25',
      hoverShadowColor: 'hover:shadow-indigo-500/20',
      glowFrom: 'from-indigo-400/10',
      glowTo: 'to-violet-400/10',
      hoverGlowFrom: 'from-indigo-400/5',
      hoverGlowTo: 'to-violet-400/5',
      dotColor: 'bg-indigo-400',
      dotColor2: 'bg-violet-400',
      icon: '🌌'
    },
    {
      path: '/relativity',
      title: 'Relativité Restreinte',
      shortTitle: 'Relativité Restreinte',
      gradient: 'from-cyan-500/20 to-blue-500/20',
      hoverGradient: 'hover:from-cyan-500/10 hover:to-blue-500/10',
      textColor: 'text-cyan-300',
      hoverTextColor: 'hover:text-cyan-300',
      borderColor: 'border-cyan-400/30',
      hoverBorderColor: 'hover:border-cyan-400/20',
      shadowColor: 'shadow-cyan-500/25',
      hoverShadowColor: 'hover:shadow-cyan-500/20',
      glowFrom: 'from-cyan-400/10',
      glowTo: 'to-blue-400/10',
      hoverGlowFrom: 'from-cyan-400/5',
      hoverGlowTo: 'to-blue-400/5',
      dotColor: 'bg-cyan-400',
      dotColor2: 'bg-blue-400',
      icon: '⚡'
    },
    {
      path: '/black-hole-concept',
      title: 'Horizon des Événements',
      shortTitle: 'Horizon des Événements',
      gradient: 'from-purple-500/20 to-pink-500/20',
      hoverGradient: 'hover:from-purple-500/10 hover:to-pink-500/10',
      textColor: 'text-purple-300',
      hoverTextColor: 'hover:text-purple-300',
      borderColor: 'border-purple-400/30',
      hoverBorderColor: 'hover:border-purple-400/20',
      shadowColor: 'shadow-purple-500/25',
      hoverShadowColor: 'hover:shadow-purple-500/20',
      glowFrom: 'from-purple-400/10',
      glowTo: 'to-pink-400/10',
      hoverGlowFrom: 'from-purple-400/5',
      hoverGlowTo: 'to-pink-400/5',
      dotColor: 'bg-purple-400',
      dotColor2: 'bg-pink-400',
      icon: '🕳️'
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Barre de navigation principale */}
      <nav className="relative bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-purple-900/95 backdrop-blur-xl border-b border-cyan-500/30 shadow-2xl z-50">
        {/* Effet de grille futuriste en arrière-plan */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
        
        {/* Chiffres binaires 0 et 1 flottants dans la nav bar */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <TeleportingBinaryDigits />
        </div>
        
        {/* Ligne lumineuse animée en haut */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
        
        {/* Ligne lumineuse animée en bas */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-4 sm:py-6 relative">
            
            {/* Bouton Menu Hamburger - affiché uniquement quand le menu est fermé */}
            {!isMobileMenuOpen && (
              <button
                onClick={toggleMobileMenu}
                className="relative group bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-indigo-900/95 hover:from-cyan-600/95 hover:via-purple-600/95 hover:to-pink-600/95 text-white rounded-3xl p-6 sm:p-8 transition-all duration-1000 transform hover:scale-125 active:scale-95 shadow-[0_0_50px_rgba(6,182,212,0.5)] hover:shadow-[0_0_80px_rgba(147,51,234,0.8)] border-4 border-cyan-400/40 hover:border-purple-400/80"
              >
                {/* Fond principal avec gradient animé */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-purple-900/95 via-blue-900/95 to-indigo-900/95 rounded-3xl"></div>
                
                {/* Couche de grille futuriste */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,182,212,0.15)_1px,transparent_1px),linear-gradient(rgba(6,182,212,0.15)_1px,transparent_1px)] bg-[size:15px_15px] rounded-3xl"></div>
                
                {/* Effet de vagues énergétiques */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 via-purple-500/20 via-pink-500/20 to-transparent bg-[length:200%_100%] animate-gradient-x rounded-3xl"></div>
                
                {/* Bordures lumineuses multiples */}
                <div className="absolute inset-0 rounded-3xl border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.4)] group-hover:border-purple-400/70 group-hover:shadow-[0_0_50px_rgba(147,51,234,0.6)] transition-all duration-1000"></div>
                <div className="absolute inset-1 rounded-3xl border border-purple-400/30 shadow-[0_0_20px_rgba(147,51,234,0.2)] group-hover:border-pink-400/50 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-all duration-1000"></div>
                <div className="absolute inset-2 rounded-3xl border border-pink-400/20 shadow-[0_0_15px_rgba(236,72,153,0.15)] group-hover:border-cyan-400/40 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all duration-1000"></div>
                
                {/* Particules flottantes dans le fond */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full animate-ping opacity-40 group-hover:opacity-70 transition-opacity duration-1000"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Effet de scan diagonal */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000 animate-scan rounded-3xl transform rotate-12"></div>
                
                {/* Lueur externe pulsante */}
                <div className="absolute -inset-6 bg-gradient-to-r from-cyan-600/30 via-purple-600/30 via-pink-600/30 to-yellow-600/30 rounded-3xl blur-2xl animate-pulse opacity-40 group-hover:opacity-80 group-hover:blur-3xl transition-all duration-1000"></div>
                
                {/* Effet holographique */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/10 via-purple-300/10 to-transparent bg-[length:300%_100%] animate-gradient-x rounded-3xl opacity-30 group-hover:opacity-60 transition-all duration-1000"></div>
                
                {/* Fond lumineux animé */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-xl animate-pulse group-hover:blur-2xl transition-all duration-1000"></div>
                
                {/* Effet de particules scintillantes */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-0.5 h-0.5 bg-white rounded-full animate-ping opacity-50 group-hover:opacity-90 transition-opacity duration-1000"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${1.5 + Math.random() * 1.5}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Icône Menu avec effets multiples */}
                <div className="relative z-10 transition-all duration-1000 group-hover:scale-110">
                  <div className="relative">
                    {/* Icône principale */}
                    <Menu className="w-8 h-8 sm:w-10 sm:h-10 relative z-10 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] group-hover:drop-shadow-[0_0_25px_rgba(147,51,234,1)] transition-all duration-1000" />
                    
                    {/* Effet de lueur externe sur l'icône */}
                    <div className="absolute inset-0 opacity-30 blur-sm group-hover:opacity-60 transition-all duration-1000">
                      <Menu className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 group-hover:text-purple-400 transition-colors duration-1000" />
                    </div>
                    
                    {/* Bordure lumineuse animée autour de l'icône */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-purple-400 via-pink-400 to-yellow-400 rounded-2xl opacity-20 blur-lg animate-pulse group-hover:opacity-40 group-hover:blur-xl transition-all duration-1000"></div>
                    
                    {/* Effet de scan horizontal sur l'icône */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000 animate-scan rounded-2xl"></div>
                    
                    {/* Reflets cristallins sur l'icône */}
                    <div className="absolute top-0 left-1/4 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-white/90 to-transparent blur-sm opacity-40 group-hover:opacity-80 transition-all duration-1000"></div>
                    <div className="absolute bottom-0 right-1/4 w-1/3 h-0.5 bg-gradient-to-r from-transparent via-cyan-300/90 to-transparent blur-sm opacity-30 group-hover:opacity-70 transition-all duration-1000"></div>
                  </div>
                </div>
                
                {/* Particules orbitales autour du bouton */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-60 group-hover:opacity-90 transition-opacity duration-1000"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-60 group-hover:opacity-90 transition-opacity duration-1000 animation-delay-300"></div>
                <div className="absolute -top-2 -left-2 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-50 group-hover:opacity-80 transition-opacity duration-1000 animation-delay-500"></div>
                <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-50 group-hover:opacity-80 transition-opacity duration-1000 animation-delay-700"></div>
                
                {/* Anneaux énergétiques qui s'étendent au hover */}
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/0 group-hover:border-cyan-400/30 group-hover:scale-150 transition-all duration-1000 animate-pulse"></div>
                <div className="absolute inset-0 rounded-full border border-purple-400/0 group-hover:border-purple-400/20 group-hover:scale-200 transition-all duration-1500 animate-pulse animation-delay-300"></div>
              </button>
            )}
            
            {/* Titre "Menu de Dieu" - affiché uniquement quand le menu est ouvert */}
            {isMobileMenuOpen && (
              <div className="relative group cursor-default">
                {/* Fond principal avec gradient animé */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-purple-900/95 via-blue-900/95 to-indigo-900/95 rounded-3xl"></div>
                
                {/* Couche de grille futuriste */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,182,212,0.15)_1px,transparent_1px),linear-gradient(rgba(6,182,212,0.15)_1px,transparent_1px)] bg-[size:25px_25px] rounded-3xl"></div>
                
                {/* Effet de vagues énergétiques */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 via-purple-500/10 via-pink-500/10 to-transparent bg-[length:200%_100%] animate-gradient-x rounded-3xl"></div>
                
                {/* Bordures lumineuses multiples */}
                <div className="absolute inset-0 rounded-3xl border-2 border-cyan-400/40 shadow-[0_0_30px_rgba(6,182,212,0.3)]"></div>
                <div className="absolute inset-1 rounded-3xl border border-purple-400/30 shadow-[0_0_20px_rgba(147,51,234,0.2)]"></div>
                <div className="absolute inset-2 rounded-3xl border border-pink-400/20 shadow-[0_0_15px_rgba(236,72,153,0.15)]"></div>
                
                {/* Particules flottantes dans le fond */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  {[...Array(30)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full animate-ping opacity-40"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 4}s`,
                        animationDuration: `${3 + Math.random() * 3}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Effet de scan diagonal */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000 animate-scan rounded-3xl transform rotate-12"></div>
                
                {/* Lueur externe pulsante */}
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-600/20 via-purple-600/20 via-pink-600/20 to-yellow-600/20 rounded-3xl blur-xl animate-pulse opacity-60 group-hover:opacity-100 transition-all duration-1000"></div>
                
                {/* Effet holographique */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/5 via-purple-300/5 to-transparent bg-[length:300%_100%] animate-gradient-x rounded-3xl opacity-50 group-hover:opacity-80 transition-all duration-1000"></div>
                
                {/* Fond lumineux animé */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-purple-400/30 to-pink-400/30 rounded-3xl blur-2xl animate-pulse group-hover:blur-xl transition-all duration-1000"></div>
                
                {/* Effet de particules scintillantes */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  {[...Array(50)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full animate-ping opacity-70"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Texte principal avec effets multiples */}
                <h2 className="relative z-10 text-4xl sm:text-5xl font-black mb-0 transform transition-all duration-1000 p-6 rounded-3xl overflow-hidden">
                  <span className="relative z-10 bg-gradient-to-r from-cyan-300 via-purple-300 via-pink-300 to-yellow-300 bg-clip-text text-transparent bg-[length:400%_400%] animate-gradient-x drop-shadow-[0_0_30px_rgba(6,182,212,0.8)] group-hover:drop-shadow-[0_0_50px_rgba(147,51,234,1)] transition-all duration-1000 font-extrabold tracking-wider">
                    Menu de Dieu
                  </span>
                  
                  {/* Effet de lueur externe */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent opacity-30 blur-sm group-hover:opacity-50 transition-all duration-1000 font-black text-4xl sm:text-5xl tracking-wider">
                    Menu de Dieu
                  </div>
                  
                  {/* Bordure lumineuse animée */}
                  <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-purple-400 via-pink-400 to-yellow-400 rounded-3xl opacity-30 blur-2xl animate-pulse group-hover:opacity-60 group-hover:blur-3xl transition-all duration-1000"></div>
                  
                  {/* Effet de scan horizontal */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000 animate-scan rounded-3xl"></div>
                  
                  {/* Reflets cristallins */}
                  <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-white/80 to-transparent blur-sm opacity-60 group-hover:opacity-100 transition-all duration-1000"></div>
                  <div className="absolute bottom-0 right-1/4 w-1/3 h-1 bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent blur-sm opacity-40 group-hover:opacity-80 transition-all duration-1000"></div>
                </h2>
              </div>
            )}
          </div>
        </div>

        {/* Effet de scan horizontal */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent animate-scan pointer-events-none"></div>
      </nav>

      {/* Menu Étendu - S'étend vers le bas depuis la barre de navigation */}
      <div 
        className={`fixed top-0 left-0 right-0 bg-gradient-to-br from-slate-900/98 via-blue-900/98 to-purple-900/98 backdrop-blur-2xl border-b-2 border-cyan-400/40 shadow-2xl transition-all duration-700 ease-in-out z-[99999] ${
          isMobileMenuOpen 
            ? 'h-screen opacity-100 visible overflow-y-auto pointer-events-auto' 
            : 'h-0 opacity-0 invisible overflow-hidden pointer-events-none transform -translate-y-full'
        }`}
        style={{ zIndex: 99999 }}
        onClick={(e) => {
          // Fermer le menu si on clique sur le fond
          if (e.target === e.currentTarget) {
            e.preventDefault();
            e.stopPropagation();
            setIsMobileMenuOpen(false);
          }
        }}
      >
        {/* Effet de grille futuriste en arrière-plan du menu étendu - identique à la nav bar */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
        
        {/* Chiffres binaires 0 et 1 flottants dans l'espace-temps */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <TeleportingBinaryDigits />
        </div>
        
        {/* Contenu du menu avec les liens de navigation */}
        <div 
          className="h-full flex flex-col items-center justify-start p-4 sm:p-8 pt-24 sm:pt-32 pb-20 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Titre "Menu de Dieu" intégré dans le contenu */}
          <div className="absolute top-8 sm:top-16 left-1/2 transform -translate-x-1/2 z-40">
            <div className="relative group cursor-default">
              {/* Fond principal avec gradient animé */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-purple-900/95 via-blue-900/95 to-indigo-900/95 rounded-3xl"></div>
              
              {/* Couche de grille futuriste */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,182,212,0.15)_1px,transparent_1px),linear-gradient(rgba(6,182,212,0.15)_1px,transparent_1px)] bg-[size:25px_25px] rounded-3xl"></div>
              
              {/* Effet de vagues énergétiques */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 via-purple-500/10 via-pink-500/10 to-transparent bg-[length:200%_100%] animate-gradient-x rounded-3xl"></div>
              
              {/* Bordures lumineuses multiples */}
              <div className="absolute inset-0 rounded-3xl border-2 border-cyan-400/40 shadow-[0_0_30px_rgba(6,182,212,0.3)]"></div>
              <div className="absolute inset-1 rounded-3xl border border-purple-400/30 shadow-[0_0_20px_rgba(147,51,234,0.2)]"></div>
              <div className="absolute inset-2 rounded-3xl border border-pink-400/20 shadow-[0_0_15px_rgba(236,72,153,0.15)]"></div>
              
              {/* Particules flottantes dans le fond */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full animate-ping opacity-40"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 4}s`,
                      animationDuration: `${3 + Math.random() * 3}s`
                    }}
                  />
                ))}
              </div>
              
              {/* Effet de scan diagonal */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000 animate-scan rounded-3xl transform rotate-12"></div>
              
              {/* Lueur externe pulsante */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-600/20 via-purple-600/20 via-pink-600/20 to-yellow-600/20 rounded-3xl blur-xl animate-pulse opacity-60 group-hover:opacity-100 transition-all duration-1000"></div>
              
              {/* Effet holographique */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/5 via-purple-300/5 to-transparent bg-[length:300%_100%] animate-gradient-x rounded-3xl opacity-50 group-hover:opacity-80 transition-all duration-1000"></div>
              
              {/* Fond lumineux animé */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-purple-400/30 to-pink-400/30 rounded-3xl blur-2xl animate-pulse group-hover:blur-xl transition-all duration-1000"></div>
              
              {/* Effet de particules scintillantes */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full animate-ping opacity-70"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${2 + Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>
              
              {/* Texte principal avec effets multiples */}
              <h2 className="relative z-10 text-2xl sm:text-5xl font-black mb-0 transform transition-all duration-1000 p-3 sm:p-8 rounded-3xl overflow-hidden">
                <span className="relative z-10 bg-gradient-to-r from-cyan-300 via-purple-300 via-pink-300 to-yellow-300 bg-clip-text text-transparent bg-[length:400%_400%] animate-gradient-x drop-shadow-[0_0_30px_rgba(6,182,212,0.8)] group-hover:drop-shadow-[0_0_50px_rgba(147,51,234,1)] transition-all duration-1000 font-extrabold tracking-wider whitespace-nowrap">
                  Menu de Dieu
                </span>
                
                {/* Effet de lueur externe */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent opacity-30 blur-sm group-hover:opacity-50 transition-all duration-1000 font-black text-2xl sm:text-5xl tracking-wider whitespace-nowrap">
                  Menu de Dieu
                </div>
                
                {/* Bordure lumineuse animée */}
                <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-purple-400 via-pink-400 to-yellow-400 rounded-3xl opacity-30 blur-2xl animate-pulse group-hover:opacity-60 group-hover:blur-3xl transition-all duration-1000"></div>
                
                {/* Effet de scan horizontal */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000 animate-scan rounded-3xl"></div>
                
                {/* Reflets cristallins */}
                <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-white/80 to-transparent blur-sm opacity-60 group-hover:opacity-100 transition-all duration-1000"></div>
                <div className="absolute bottom-0 right-1/4 w-1/3 h-1 bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent blur-sm opacity-40 group-hover:opacity-80 transition-all duration-1000"></div>
              </h2>
            </div>
          </div>
          
          {/* Bouton de fermeture X en haut à droite du contenu */}
          <div className="absolute top-4 right-4 z-50 block sm:block">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMobileMenuOpen(false);
                // Double vérification pour éviter les bugs
                setTimeout(() => {
                  setIsMobileMenuOpen(false);
                }, 50);
              }}
              className="relative group bg-gradient-to-r from-slate-700/80 to-slate-600/80 hover:from-red-600/90 hover:to-pink-600/90 text-white rounded-full p-4 transition-all duration-500 transform hover:scale-110 active:scale-95 shadow-2xl border-2 border-red-400/30 hover:border-red-400/60"
            >
              {/* Effet de lueur rouge pour la fermeture */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              
              {/* Icône X avec animation */}
              <div className="relative z-10 transition-transform duration-300">
                <X className="w-6 h-6 rotate-180 transition-transform duration-300 group-hover:rotate-0" />
              </div>
              
              {/* Particules animées rouges */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-ping opacity-75"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-75 animation-delay-300"></div>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl w-full mt-12 sm:mt-20 flex-shrink-0">
            {navigationItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={(e) => {
                  e.stopPropagation();
                  // Fermeture immédiate pour éviter les bugs de transition
                  setIsMobileMenuOpen(false);
                  // Force le re-rendu après navigation
                  setTimeout(() => {
                    // Assure que le menu reste fermé après navigation
                    setIsMobileMenuOpen(false);
                  }, 100);
                }}
                className={`relative group block p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 sm:duration-700 transform hover:scale-105 active:scale-95 ${
                  location.pathname === item.path
                    ? `bg-gradient-to-br from-slate-800/95 to-slate-700/95 ${item.borderColor} ${item.shadowColor} shadow-2xl`
                    : `bg-slate-800/95 border-slate-600/50 hover:bg-gradient-to-br hover:from-slate-700/95 hover:to-slate-600/95 ${item.hoverBorderColor} ${item.hoverShadowColor} hover:shadow-2xl`
                }`}
              >
                {/* Effet de grille futuriste */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:15px_15px] rounded-2xl sm:rounded-3xl opacity-30"></div>
                
                {/* Effet de lueur */}
                <div className={`absolute inset-0 bg-gradient-to-r ${item.glowFrom} ${item.glowTo} rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-50 transition-all duration-300 sm:duration-700 blur-xl`}></div>
                
                {/* Particules animées */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl">
                  <div className={`absolute -top-1 -right-1 w-3 h-3 ${item.dotColor} rounded-full animate-ping opacity-75`}></div>
                  <div className={`absolute -bottom-1 -left-1 w-3 h-3 ${item.dotColor2} rounded-full animate-ping opacity-75 animation-delay-300`}></div>
                </div>
                
                {/* Contenu */}
                <div className="relative z-10 text-center">
                  <div className="text-5xl sm:text-6xl mb-4 sm:mb-6 transform group-hover:scale-110 transition-transform duration-300 sm:duration-500">
                    {item.icon}
                  </div>
                  <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${item.textColor} group-hover:text-white transition-colors duration-300 sm:duration-500`}>
                    {item.title}
                  </h3>
                  <div className={`w-12 sm:w-16 h-1 bg-gradient-to-r ${item.glowFrom} ${item.glowTo} mx-auto rounded-full group-hover:w-16 sm:group-hover:w-24 transition-all duration-300 sm:duration-500`}></div>
                </div>
                
                {/* Effet de scan */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 sm:duration-1000 animate-scan rounded-2xl sm:rounded-3xl"></div>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </>
  );
};