import React from 'react';
import DrinkCard from './DrinkCard';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ChevronDown, ChevronRight, Edit, Plus, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

const CategorySection = ({ 
  category, 
  onAddDrink, 
  onEditDrink, 
  onToggleCategory, 
  onEditCategory, 
  onAddDrinkToCategory, 
  onDeleteCategory, 
  onDeleteDrink,
  sortedDrinks = [],
  drinkPopularity = {}
}) => {
  const drinksToShow = sortedDrinks.length > 0 ? sortedDrinks : category.drinks;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleCategory(category.id)}
            className="p-1 h-8 dark:hover:bg-gray-700"
          >
            {category.isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
          
          <span className="text-2xl">{category.icon}</span>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{category.name}</h2>
          <Badge className={`${category.color} border-0 dark:bg-opacity-80`}>
            {category.drinks.length} boissons
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddDrinkToCategory(category.id)}
            className="text-xs dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <Plus className="w-3 h-3 mr-1" />
            Ajouter
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs dark:hover:bg-gray-700">
                <Edit className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
              <DropdownMenuItem onClick={() => onEditCategory(category)} className="dark:hover:bg-gray-700">
                <Edit className="w-3 h-3 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDeleteCategory(category)}
                className="text-red-600 focus:text-red-600 dark:text-red-400 dark:hover:bg-gray-700"
              >
                <Trash2 className="w-3 h-3 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {!category.isCollapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {drinksToShow.map((drink) => (
            <DrinkCard
              key={drink.id}
              drink={drink}
              categoryColor={category.color}
              onAdd={onAddDrink}
              onEdit={onEditDrink}
              onDelete={onDeleteDrink}
              popularityScore={drinkPopularity[drink.id] || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySection;