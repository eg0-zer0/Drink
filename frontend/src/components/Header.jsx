import React, { useState } from 'react';
import { usePWA } from '../hooks/usePWA';
import { Download, Menu, Volume2, VolumeX, Layout, History, Sun, Moon, Home } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from './ui/dropdown-menu';

const Header = ({
  soundEnabled,
  onToggleSound,
  compactMode,
  onToggleCompact,
  onShowHistory
}) => {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // État d'ouverture du menu pour fermeture automatique
  const [menuOpen, setMenuOpen] = useState(false);

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
          {/* Bouton installation PWA */}
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
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="p-2">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
              {/* Lien vers l'accueil */}
              <DropdownMenuItem
                onClick={() => {
                  navigate('/');
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Retour à l’accueil
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-2 h-px bg-gray-300 dark:bg-gray-600" />

              {/* Toggle du son */}
              <DropdownMenuItem asChild>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onToggleSound();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-sm"
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  {soundEnabled ? 'Désactiver le son' : 'Activer le son'}
                </button>
              </DropdownMenuItem>

              {/* Toggle compact / large */}
              <DropdownMenuItem asChild>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onToggleCompact();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-sm"
                >
                  <Layout className="h-4 w-4" />
                  {compactMode ? 'Vue large' : 'Vue compacte'}
                </button>
              </DropdownMenuItem>

              {/* Toggle clair / sombre */}
              <DropdownMenuItem asChild>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleTheme();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-sm"
                >
                  {isDark ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-gray-500" />}
                  {isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
                </button>
              </DropdownMenuItem>

              {/* Séparateur */}
              <DropdownMenuSeparator className="my-2 h-px bg-gray-300 dark:bg-gray-600" />

              {/* Historique */}
              <DropdownMenuItem
                onClick={() => {
                  onShowHistory();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2"
              >
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
