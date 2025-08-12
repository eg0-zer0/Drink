import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Coffee, Clock, TrendingUp, Plus } from 'lucide-react';

const Header = ({ totalOrders, totalAmount, onAddCategory }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🍹 Commandes de Boissons
          </h1>
          <p className="text-gray-600 text-lg">
            Gérez facilement vos commandes de boissons
          </p>
        </div>
        <Button
          onClick={onAddCategory}
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle catégorie
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Articles commandés</p>
                <p className="text-2xl font-bold text-blue-900">{totalOrders}</p>
              </div>
              <Coffee className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total commande</p>
                <p className="text-2xl font-bold text-green-900">{totalAmount.toFixed(2)}€</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Statut</p>
                <Badge className="bg-purple-100 text-purple-800 border-0">
                  {totalOrders > 0 ? 'En cours' : 'Vide'}
                </Badge>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Header;