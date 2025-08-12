import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

const DrinkCard = ({ drink, onAdd, categoryColor, onEdit, onDelete }) => {
  return (
    <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1 relative">
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-gray-800 truncate">{drink.name}</h3>
            <p className="text-lg font-bold text-gray-900">{drink.price.toFixed(2)}€</p>
          </div>
          
          <div className="flex items-center gap-1">
            <Badge className={`${categoryColor} border-0 text-xs`}>
              {drink.available ? 'Dispo' : 'Indispo'}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Edit className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(drink, 'edit')}>
                  <Edit className="w-3 h-3 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(drink)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-3 h-3 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <Button 
          onClick={() => onAdd(drink)}
          disabled={!drink.available}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 text-xs h-7"
          size="sm"
        >
          <Plus className="w-3 h-3 mr-1" />
          Ajouter
        </Button>
      </CardContent>
    </Card>
  );
};

export default DrinkCard;