import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { useToast } from './hooks/use-toast';
import { mockCategories } from './mock';
import Header from './components/Header';
import CategorySection from './components/CategorySection';
import OrderSummary from './components/OrderSummary';
import FriendSelector from './components/FriendSelector';
import AddDrinkModal from './components/AddDrinkModal';
import './App.css';

const DrinkOrderApp = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState(mockCategories);
  const [orders, setOrders] = useState([]);
  const [friends, setFriends] = useState(['Moi']);
  const [selectedFriend, setSelectedFriend] = useState('Moi');

  // Calculs pour les statistiques
  const totalOrders = orders.reduce((sum, order) => sum + order.quantity, 0);
  const totalAmount = orders.reduce((sum, order) => sum + (order.price * order.quantity), 0);

  const handleAddDrink = (drink) => {
    if (!selectedFriend) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner pour qui commander",
        variant: "destructive",
      });
      return;
    }

    const existingOrderIndex = orders.findIndex(
      order => order.drinkId === drink.id && order.friendName === selectedFriend
    );

    if (existingOrderIndex >= 0) {
      // Augmenter la quantité si l'article existe déjà
      const updatedOrders = [...orders];
      updatedOrders[existingOrderIndex].quantity += 1;
      setOrders(updatedOrders);
    } else {
      // Ajouter un nouvel article
      const newOrder = {
        drinkId: drink.id,
        drinkName: drink.name,
        price: drink.price,
        quantity: 1,
        friendName: selectedFriend,
        addedAt: new Date().toISOString(),
      };
      setOrders([...orders, newOrder]);
    }

    toast({
      title: "Boisson ajoutée",
      description: `${drink.name} ajouté pour ${selectedFriend}`,
    });
  };

  const handleUpdateQuantity = (drinkId, friendName, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(drinkId, friendName);
      return;
    }

    const updatedOrders = orders.map(order => 
      order.drinkId === drinkId && order.friendName === friendName
        ? { ...order, quantity: newQuantity }
        : order
    );
    setOrders(updatedOrders);
  };

  const handleRemoveItem = (drinkId, friendName) => {
    const updatedOrders = orders.filter(
      order => !(order.drinkId === drinkId && order.friendName === friendName)
    );
    setOrders(updatedOrders);
    
    toast({
      title: "Article supprimé",
      description: "L'article a été retiré de la commande",
    });
  };

  const handleClearAll = () => {
    setOrders([]);
    toast({
      title: "Commande vidée",
      description: "Toutes les commandes ont été supprimées",
    });
  };

  const handleAddFriend = (friendName) => {
    if (!friends.includes(friendName)) {
      setFriends([...friends, friendName]);
      toast({
        title: "Ami ajouté",
        description: `${friendName} a été ajouté à la liste`,
      });
    }
  };

  const handleAddCustomDrink = (drink, categoryId) => {
    const updatedCategories = categories.map(category => 
      category.id === categoryId
        ? { ...category, drinks: [...category.drinks, drink] }
        : category
    );
    setCategories(updatedCategories);
    
    toast({
      title: "Boisson ajoutée",
      description: `${drink.name} a été ajouté au menu`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header totalOrders={totalOrders} totalAmount={totalAmount} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <FriendSelector
              friends={friends}
              selectedFriend={selectedFriend}
              onSelectFriend={setSelectedFriend}
              onAddFriend={handleAddFriend}
            />
            
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Menu des Boissons</h2>
              <AddDrinkModal categories={categories} onAddCustomDrink={handleAddCustomDrink} />
            </div>
            
            {categories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                onAddDrink={handleAddDrink}
              />
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <OrderSummary
              orders={orders}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearAll={handleClearAll}
            />
          </div>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DrinkOrderApp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;