import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header = () => {
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
        <div className="ml-4">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Header;