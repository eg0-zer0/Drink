import React from 'react';
import { usePWA } from '../hooks/usePWA';
import { Download } from 'lucide-react';
import { Button } from './ui/button';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  // Hook PWA pour gérer l'installation
  const { isInstallable, isInstalled, installApp } = usePWA();

  return (
    <div className="mb-8">
      <div className="flex justify-between items-start">
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            🍹 Commandes de Boissons
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Gérez facilement vos commandes de boissons
          </p>
        </div>
        
        {/* Conteneur pour les boutons à droite */}
        <div className="ml-4 flex items-center gap-3">
          {/* Bouton d'installation PWA - n'apparaît que si installable */}
          {isInstallable && !isInstalled && (
            <Button 
              onClick={installApp}
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Installer l'App
            </Button>
          )}
          
          {/* Toggle de thème */}
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Header;
