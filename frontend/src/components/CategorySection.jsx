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
  drinkPopularity = {},
  orders = [],            // Liste des articles actuellement dans le panier
  soundEnabled = true,    // Active/désactive le son quand on clique
  compactMode = false     // 🆕 Mode compact ou large
}) => {
  
  // Si le tri est appliqué, on prend sortedDrinks, sinon la liste brute
  const drinksToShow = sortedDrinks.length > 0 ? sortedDrinks : category.drinks;

  return (
    <div className="mb-6">
      
      {/* === HEADER DE CATEGORIE === */}
      <div className="flex items-center justify-between mb-4">
        
        <div className="flex items-center gap-3">
          {/* Bouton pour plier/déplier la catégorie */}
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

          {/* Icône catégorie + nom */}
          <span className="text-2xl">{category.icon}</span>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            {category.name}
          </h2>

          {/* Badge nombre de boissons */}
          <Badge className={`${category.color} border-0 dark:bg-opacity-80`}>
            {category.drinks.length} boissons
          </Badge>
        </div>

        {/* Menu d’actions sur la catégorie */}
        <div className="flex items-center gap-2">
          
          {/* Bouton ajout de boisson */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddDrinkToCategory(category.id)}
            className="text-xs dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <Plus className="w-3 h-3 mr-1" />
            Ajouter
          </Button>

          {/* Menu contextuel catégorie */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs dark:hover:bg-gray-700">
                <Edit className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
              <DropdownMenuItem
                onClick={() => onEditCategory(category)}
                className="dark:hover:bg-gray-700"
              >
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

      {/* === LISTE DES BOISSONS === */}
      {!category.isCollapsed && (
        <div
          className={`grid gap-3 ${
            compactMode
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' // mode compact → plus de colonnes
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' // mode large → moins de colonnes
          }`}
        >
          {drinksToShow.map((drink) => {
            // Trouver la quantité de cet article dans la commande
            const orderItem = orders.find((o) => o.drinkId === drink.id);
            const quantityInOrder = orderItem ? orderItem.quantity : 0;

            return (
              <DrinkCard
                key={drink.id}
                drink={drink}
                categoryColor={category.color}
                onAdd={onAddDrink}
                onEdit={onEditDrink}
                onDelete={onDeleteDrink}
                popularityScore={drinkPopularity[drink.id] || 0}
                quantityInOrder={quantityInOrder} // badge compteur déjà dans DrinkCard
                soundEnabled={soundEnabled}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategorySection;
