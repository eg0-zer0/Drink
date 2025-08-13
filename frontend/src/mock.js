export const mockCategories = [
  {
    id: 'soft',
    name: 'Soft Drinks',
    icon: '🥤',
    color: 'bg-blue-100 text-blue-800',
    isCollapsed: false,
    drinks: [
      { id: 'soft-coca-cola', name: 'Coca Cola', price: 2.50 },
      { id: 'soft-sprite', name: 'Sprite', price: 2.50 },
      { id: 'soft-fanta-orange', name: 'Fanta Orange', price: 2.50 },
      { id: 'soft-eau-plate', name: 'Eau plate', price: 1.50 },
      { id: 'soft-jus-orange', name: "Jus d'orange", price: 2.50 },
      { id: 'soft-ice-tea', name: 'Ice Tea', price: 2.50 }
    ]
  },
  {
    id: 'cafe',
    name: 'Café',
    icon: '☕',
    color: 'bg-amber-100 text-amber-800',
    isCollapsed: false,
    drinks: [
      { id: 'cafe-espresso', name: 'Espresso', price: 2.00 },
      { id: 'cafe-americano', name: 'Americano', price: 2.50 },
      { id: 'cafe-latte', name: 'Latte', price: 3.50 },
      { id: 'cafe-cappuccino', name: 'Cappuccino', price: 3.00 },
      { id: 'cafe-macchiato', name: 'Macchiato', price: 3.50 },
      { id: 'cafe-mocha', name: 'Mocha', price: 4.00 }
    ]
  },
  {
    id: 'bieres',
    name: 'Bières',
    icon: '🍺',
    color: 'bg-yellow-100 text-yellow-800',
    isCollapsed: true,
    drinks: [
      { id: 'bieres-heineken', name: 'Heineken', price: 4.50 },
      { id: 'bieres-stella-artois', name: 'Stella Artois', price: 4.50 },
      { id: 'bieres-corona', name: 'Corona', price: 5.00 },
      { id: 'bieres-leffe-blonde', name: 'Leffe Blonde', price: 5.50 },
      { id: 'bieres-guinness', name: 'Guinness', price: 6.00 }
    ]
  },
  {
    id: 'cocktails',
    name: 'Cocktails',
    icon: '🍸',
    color: 'bg-pink-100 text-pink-800',
    isCollapsed: true,
    drinks: [
      { id: 'cocktails-mojito', name: 'Mojito', price: 8.00 },
      { id: 'cocktails-cosmopolitan', name: 'Cosmopolitan', price: 9.00 },
      { id: 'cocktails-margarita', name: 'Margarita', price: 8.50 },
      { id: 'cocktails-pina-colada', name: 'Pina Colada', price: 9.50 },
      { id: 'cocktails-daiquiri', name: 'Daiquiri', price: 8.50 }
    ]
  },
  {
    id: 'alcools',
    name: 'Alcools',
    icon: '🥃',
    color: 'bg-orange-100 text-orange-800',
    isCollapsed: true,
    drinks: [
      { id: 'alcools-whisky', name: 'Whisky', price: 6.00 },
      { id: 'alcools-vodka', name: 'Vodka', price: 5.50 },
      { id: 'alcools-gin', name: 'Gin', price: 5.50 },
      { id: 'alcools-rhum', name: 'Rhum', price: 5.50 },
      { id: 'alcools-brandy', name: 'Brandy', price: 7.00 }
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
      { drinkName: 'Eau plate', quantity: 1, price: 1.50 }
    ],
    total: 15.00
  }
];

export const mockOrders = [];
