import React from 'react';
import { Target } from 'lucide-react';
import SpaceTimeTrajectoryVisual from '../components/SpaceTimeTrajectoryVisual';

export const BlackHoleConceptPage: React.FC = () => {
  // Force le re-rendu propre de la page
  React.useEffect(() => {
    // Assure que la page est correctement montée
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pt-20">
        {/* En-tête */}
        <header className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 px-2">
            Horizon des Événements
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-purple-200 max-w-4xl mx-auto px-4">
            Découvrez comment l'espace et le temps échangent leurs rôles au passage de l'horizon des événements
          </p>
        </header>

        {/* Contenu principal */}
        <div className="max-w-7xl mx-auto">
          {/* Section d'introduction */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center flex-wrap">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-purple-400 flex-shrink-0" />
              L'Idée Centrale
            </h2>
            <div className="text-sm sm:text-base lg:text-lg text-gray-200 space-y-3 sm:space-y-4">
              <p>
                Cette visualisation illustre le phénomène fascinant qui se produit à l'horizon des événements d'un trou noir :
                l'inversion des propriétés fondamentales de l'espace et du temps.
              </p>
              <div className="bg-purple-900/30 p-4 sm:p-6 rounded-lg sm:rounded-xl border-l-4 border-purple-400">
                <p className="font-semibold text-purple-200 text-sm sm:text-base">
                  Avant l'horizon : l'espace permet la liberté de mouvement, le temps s'écoule inexorablement.
                  <br className="hidden sm:block" /><br className="hidden sm:block" />
                  Après l'horizon : <span className="text-white">les rôles s'inversent</span> - ce qui était spatial 
                  devient temporel, ce qui était temporel devient spatial, forçant toute matière vers la singularité.
                </p>
              </div>
            </div>
          </div>

          {/* Visualisation interactive */}
          <div className="mb-6 lg:mb-8">
            <SpaceTimeTrajectoryVisual />
          </div>

        </div>
      </div>
    </div>
  );
};