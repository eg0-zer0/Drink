import React from 'react';
import DrinkCard from './DrinkCard';
import { Badge } from './ui/badge';

const CategorySection = ({ category, onAddDrink }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{category.icon}</span>
        <h2 className="text-2xl font-bold text-gray-800">{category.name}</h2>
        <Badge className={`${category.color} border-0`}>
          {category.drinks.length} boissons
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {category.drinks.map((drink) => (
          <DrinkCard
            key={drink.id}
            drink={drink}
            categoryColor={category.color}
            onAdd={onAddDrink}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;