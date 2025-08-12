import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Plus, Edit, Trash2, TrendingUp } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

const DrinkCard = ({ drink, onAdd, categoryColor, onEdit, onDelete, popularityScore = 0 }) => {
  const [startX, setStartX] = useState(null);
  const [currentX, setCurrentX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(false);
  };

  const handleTouchMove = (e) => {
    if (startX === null) return;
    
    const currentX = e.touches[0].clientX;
    const diffX = startX - currentX;
    
    if (Math.abs(diffX) > 10) {
      setIsDragging(true);
      setCurrentX(currentX);
      
      if (cardRef.current) {
        cardRef.current.style.transform = `translateX(${-Math.min(Math.max(diffX, 0), 100)}px)`;
      }
    }
  };

  const handleTouchEnd = () => {
    if (isDragging && startX && currentX) {
      const diffX = startX - currentX;
      
      if (diffX > 50) {
        // Swipe gauche détecté - afficher les options
        setTimeout(() => {
          if (cardRef.current) {
            cardRef.current.style.transform = 'translateX(0)';
          }
        }, 200);
      }
    }
    
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateX(0)';
    }
    
    setStartX(null);
    setCurrentX(null);
    setIsDragging(false);
  };

  const getPopularityLevel = (score) => {
    if (score >= 10) return { label: 'TOP', color: 'bg-red-500 text-white' };
    if (score >= 5) return { label: 'HOT', color: 'bg-orange-500 text-white' };
    if (score >= 2) return { label: 'POP', color: 'bg-blue-500 text-white' };
    return null;
  };

  const popularity = getPopularityLevel(popularityScore);

  return (
    <Card 
      ref={cardRef}
      className="hover:shadow-md transition-all duration-200 hover:-translate-y-1 relative touch-manipulation"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">{drink.name}</h3>
              {popularity && (
                <Badge className={`${popularity.color} border-0 text-xs px-1 py-0 h-4`}>
                  {popularity.label}
                </Badge>
              )}
              {popularityScore > 0 && (
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {popularityScore}
                </div>
              )}
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{drink.price.toFixed(2)}€</p>
          </div>
          
          <div className="flex items-center gap-1">
            <Badge className={`${categoryColor} border-0 text-xs dark:bg-opacity-80`}>
              {drink.available ? 'Dispo' : 'Indispo'}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 dark:hover:bg-gray-700">
                  <Edit className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                <DropdownMenuItem onClick={() => onEdit(drink, 'edit')} className="dark:hover:bg-gray-700">
                  <Edit className="w-3 h-3 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(drink)}
                  className="text-red-600 focus:text-red-600 dark:text-red-400"
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
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 text-xs h-7 touch-manipulation"
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