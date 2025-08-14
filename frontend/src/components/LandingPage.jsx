// src/components/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePWA } from '../hooks/usePWA';
import { Button } from './ui/button';

export default function LandingPage() {
  const { isInstallable, installApp } = usePWA();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center px-6">
      {/* Logo / Titre */}
      <div className="mb-6">
        <img
          src={`${process.env.PUBLIC_URL}/icons/icon-192x192.png`}
          alt="Logo Drink Order"
          className="w-24 h-24 mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          🍹 Drink Order
        </h1>
      </div>

      {/* Description */}
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mb-10">
        Gérez facilement vos commandes de boissons, consultez votre historique
        et profitez d'une expérience fluide sur tous vos appareils.
      </p>

      {/* Boutons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {isInstallable && (
          <Button
            onClick={installApp} 
            aria-label="Installer l'application Drink Order"
            className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-6 py-3"
          >
            Installer l’App
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => navigate('/app')}
          className="text-lg px-6 py-3"
        >
          Accéder à l’application
        </Button>
      </div>

      {/* Astuce */}
      {!isInstallable && (
        <p className="text-sm text-gray-500 mt-6">
          💡 Astuce : Vous pouvez aussi installer cette application depuis le
          menu de votre navigateur.
        </p>
      )}
    </div>
  );
}
