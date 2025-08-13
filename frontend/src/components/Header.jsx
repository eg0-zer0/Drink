import React from 'react';
import { usePWA } from '../hooks/usePWA';
import { Download, Menu, Volume2, VolumeX, Layout, History } from 'lucide-react';
import { Button } from './ui/button';
import ThemeToggle from './ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu';

const Header = ({
  soundEnabled,
  onToggleSound,
  compactMode,
  onToggleCompact,
  onShowHistory
}) => {
  // Hook PWA pour gérer l'installation
  const { isInstallable, isInstalled, installApp } = usePWA();

  return (
    <div className="mb-8">
      <div className="flex justify-between items-start">
        {/* Titre + sous-titre */}
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            🍹 Commandes de Boissons
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Gérez facilement vos commandes de boissons
          </p>
        </div>

        {/* Boutons/menu à droite */}
        <div className="ml-4 flex items-center gap-3">
          {/* Bouton d'installation PWA */}
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

          {/* Menu hamburger */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="p-2">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
              {/* Toggle du son */}
              <DropdownMenuItem onClick={onToggleSound} className="flex items-center gap-2">
                {soundEnabled ? (
                  <>
                    <Volume2 className="h-4 w-4" />
                    Désactiver le son
                  </>
                ) : (
                  <>
                    <VolumeX className="h-4 w-4" />
                    Activer le son
                  </>
                )}
              </DropdownMenuItem>

              {/* Toggle compact / large */}
              <DropdownMenuItem onClick={onToggleCompact} className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                {compactMode ? 'Vue large' : 'Vue compacte'}
              </DropdownMenuItem>

              {/* Basculer mode clair / sombre */}
              <DropdownMenuItem className="flex items-center gap-2">
                {/* On garde ThemeToggle mais compact */}
                <ThemeToggle />
                <span>Mode clair/sombre</span>
              </DropdownMenuItem>

              {/* Historique */}
              <DropdownMenuItem onClick={onShowHistory} className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Historique commandes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Header;
