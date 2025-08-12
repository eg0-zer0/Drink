export const mockCategories = [
  {
    id: 'soft',
    name: 'Soft Drinks',
    icon: '🥤',
    color: 'bg-blue-100 text-blue-800',
    isCollapsed: false,
    drinks: [
      { id: 'coca', name: 'Coca Cola', price: 2.50, available: true },
      { id: 'sprite', name: 'Sprite', price: 2.50, available: true },
      { id: 'fanta', name: 'Fanta Orange', price: 2.50, available: true },
      { id: 'water', name: 'Eau minérale', price: 1.50, available: true },
      { id: 'juice', name: 'Jus d\'orange', price: 3.00, available: true },
      { id: 'ice_tea', name: 'Ice Tea', price: 2.80, available: true }
    ]
  },
  {
    id: 'cafe',
    name: 'Café',
    icon: '☕',
    color: 'bg-amber-100 text-amber-800',
    isCollapsed: false,
    drinks: [
      { id: 'espresso', name: 'Espresso', price: 2.00, available: true },
      { id: 'americano', name: 'Americano', price: 2.50, available: true },
      { id: 'latte', name: 'Latte', price: 3.50, available: true },
      { id: 'cappuccino', name: 'Cappuccino', price: 3.00, available: true },
      { id: 'macchiato', name: 'Macchiato', price: 3.50, available: true },
      { id: 'mocha', name: 'Mocha', price: 4.00, available: true }
    ]
  },
  {
    id: 'bieres',
    name: 'Bières',
    icon: '🍺',
    color: 'bg-yellow-100 text-yellow-800',
    isCollapsed: true,
    drinks: [
      { id: 'heineken', name: 'Heineken', price: 4.50, available: true },
      { id: 'stella', name: 'Stella Artois', price: 4.50, available: true },
      { id: 'corona', name: 'Corona', price: 5.00, available: true },
      { id: 'leffe', name: 'Leffe Blonde', price: 5.50, available: true },
      { id: 'guinness', name: 'Guinness', price: 6.00, available: true }
    ]
  },
  {
    id: 'cocktail',
    name: 'Cocktails',
    icon: '🍸',
    color: 'bg-pink-100 text-pink-800',
    isCollapsed: true,
    drinks: [
      { id: 'mojito', name: 'Mojito', price: 8.00, available: true },
      { id: 'cosmopolitan', name: 'Cosmopolitan', price: 9.00, available: true },
      { id: 'margarita', name: 'Margarita', price: 8.50, available: true },
      { id: 'pinacolada', name: 'Pina Colada', price: 9.50, available: true },
      { id: 'daiquiri', name: 'Daiquiri', price: 8.50, available: true }
    ]
  },
  {
    id: 'alcool',
    name: 'Alcools',
    icon: '🥃',
    color: 'bg-orange-100 text-orange-800',
    isCollapsed: true,
    drinks: [
      { id: 'whisky', name: 'Whisky', price: 6.00, available: true },
      { id: 'vodka', name: 'Vodka', price: 5.50, available: true },
      { id: 'gin', name: 'Gin', price: 5.50, available: true },
      { id: 'rum', name: 'Rhum', price: 5.50, available: true },
      { id: 'brandy', name: 'Brandy', price: 7.00, available: true }
    ]
  }
];

export const mockOrderHistory = [
  {
    id: 'order-1',
    date: '2024-01-12T14:30:00Z',
    items: [
      { drinkName: 'Coca Cola', quantity: 2, price: 2.50 },
      { drinkName: 'Espresso', quantity: 1, price: 2.00 }
    ],
    total: 7.00
  },
  {
    id: 'order-2',
    date: '2024-01-11T16:45:00Z',
    items: [
      { drinkName: 'Latte', quantity: 1, price: 3.50 },
      { drinkName: 'Mojito', quantity: 1, price: 8.00 }
    ],
    total: 11.50
  },
  {
    id: 'order-3',
    date: '2024-01-10T12:15:00Z',
    items: [
      { drinkName: 'Heineken', quantity: 3, price: 4.50 },
      { drinkName: 'Eau minérale', quantity: 1, price: 1.50 }
    ],
    total: 15.00
  }
];

export const mockOrders = [];