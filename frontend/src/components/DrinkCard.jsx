import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Plus } from 'lucide-react';

const DrinkCard = ({ drink, onAdd, categoryColor }) => {
  return (
    <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-800">{drink.name}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{drink.price.toFixed(2)}€</p>
          </div>
          <Badge className={`${categoryColor} border-0`}>
            {drink.available ? 'Disponible' : 'Indisponible'}
          </Badge>
        </div>
        
        <Button 
          onClick={() => onAdd(drink)}
          disabled={!drink.available}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </CardContent>
    </Card>
  );
};

export default DrinkCard;