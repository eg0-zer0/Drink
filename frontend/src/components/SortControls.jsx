import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ArrowUpDown, TrendingUp, AlphabeticallyIcon as SortAlphabetical, DollarSign } from 'lucide-react';

const SortControls = ({ sortBy, onSortChange }) => {
  const sortOptions = [
    { value: 'name', label: 'Alphabétique', icon: SortAlphabetical },
    { value: 'popularity', label: 'Popularité', icon: TrendingUp },
    { value: 'price-asc', label: 'Prix ↗', icon: DollarSign },
    { value: 'price-desc', label: 'Prix ↘', icon: DollarSign },
  ];

  const currentSort = sortOptions.find(option => option.value === sortBy);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowUpDown className="w-4 h-4" />
          Trier par: {currentSort?.label || 'Défaut'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {sortOptions.map((option) => {
          const Icon = option.icon;
          return (
            <DropdownMenuItem 
              key={option.value} 
              onClick={() => onSortChange(option.value)}
              className={sortBy === option.value ? 'bg-accent' : ''}
            >
              <Icon className="w-4 h-4 mr-2" />
              {option.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortControls;