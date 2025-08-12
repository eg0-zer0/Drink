import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { useToast } from './hooks/use-toast';
import { mockCategories, mockOrderHistory } from './mock';
import Header from './components/Header';
import CategorySection from './components/CategorySection';
import OrderSummary from './components/OrderSummary';
import OrderHistory from './components/OrderHistory';
import EditDrinkModal from './components/EditDrinkModal';
import EditCategoryModal from './components/EditCategoryModal';
import './App.css';

const DrinkOrderApp = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState(mockCategories);
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState(mockOrderHistory);
  
  // Modals state
  const [editDrinkModal, setEditDrinkModal] = useState({ isOpen: false, drink: null, categoryId: null });
  const [editCategoryModal, setEditCategoryModal] = useState({ isOpen: false, category: null });

  // Calculs pour les statistiques
  const totalOrders = orders.reduce((sum, order) => sum + order.quantity, 0);
  const totalAmount = orders.reduce((sum, order) => sum + (order.price * order.quantity), 0);

  const handleAddDrink = (drink) => {
    const existingOrderIndex = orders.findIndex(order => order.drinkId === drink.id);

    if (existingOrderIndex >= 0) {
      const updatedOrders = [...orders];
      updatedOrders[existingOrderIndex].quantity += 1;
      setOrders(updatedOrders);
    } else {
      const newOrder = {
        drinkId: drink.id,
        drinkName: drink.name,
        price: drink.price,
        quantity: 1,
        addedAt: new Date().toISOString(),
      };
      setOrders([...orders, newOrder]);
    }

    toast({
      title: "Boisson ajoutée",
      description: `${drink.name} ajouté à la commande`,
    });
  };

  const handleUpdateQuantity = (drinkId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(drinkId);
      return;
    }

    const updatedOrders = orders.map(order => 
      order.drinkId === drinkId ? { ...order, quantity: newQuantity } : order
    );
    setOrders(updatedOrders);
  };

  const handleRemoveItem = (drinkId) => {
    const updatedOrders = orders.filter(order => order.drinkId !== drinkId);
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

  const handleConfirmOrder = () => {
    if (orders.length === 0) return;

    const newOrder = {
      id: `order-${Date.now()}`,
      date: new Date().toISOString(),
      items: orders.map(order => ({
        drinkName: order.drinkName,
        quantity: order.quantity,
        price: order.price
      })),
      total: totalAmount
    };

    setOrderHistory([newOrder, ...orderHistory]);
    setOrders([]);
    
    toast({
      title: "Commande confirmée",
      description: `Commande de ${totalAmount.toFixed(2)}€ ajoutée à l'historique`,
    });
  };

  const handleToggleCategory = (categoryId) => {
    const updatedCategories = categories.map(category => 
      category.id === categoryId
        ? { ...category, isCollapsed: !category.isCollapsed }
        : category
    );
    setCategories(updatedCategories);
  };

  const handleEditDrink = (drink) => {
    // Find category
    const category = categories.find(cat => cat.drinks.some(d => d.id === drink.id));
    setEditDrinkModal({ isOpen: true, drink, categoryId: category?.id });
  };

  const handleSaveDrink = (updatedDrink) => {
    const updatedCategories = categories.map(category => ({
      ...category,
      drinks: category.drinks.map(drink => 
        drink.id === updatedDrink.id ? updatedDrink : drink
      )
    }));
    setCategories(updatedCategories);
    
    toast({
      title: "Boisson modifiée",
      description: `${updatedDrink.name} a été mise à jour`,
    });
  };

  const handleAddDrinkToCategory = (categoryId) => {
    const newDrink = {
      id: `custom-${Date.now()}`,
      name: '',
      price: 0,
      available: true,
    };
    setEditDrinkModal({ isOpen: true, drink: newDrink, categoryId });
  };

  const handleSaveNewDrink = (newDrink) => {
    const updatedCategories = categories.map(category => 
      category.id === editDrinkModal.categoryId
        ? { ...category, drinks: [...category.drinks, newDrink] }
        : category
    );
    setCategories(updatedCategories);
    
    toast({
      title: "Boisson ajoutée",
      description: `${newDrink.name} a été ajouté au menu`,
    });
  };

  const handleEditCategory = (category) => {
    setEditCategoryModal({ isOpen: true, category });
  };

  const handleSaveCategory = (updatedCategory) => {
    if (updatedCategory.id) {
      // Modifier catégorie existante
      const updatedCategories = categories.map(category => 
        category.id === updatedCategory.id ? updatedCategory : category
      );
      setCategories(updatedCategories);
      toast({
        title: "Catégorie modifiée",
        description: `${updatedCategory.name} a été mise à jour`,
      });
    } else {
      // Nouvelle catégorie
      const newCategory = {
        ...updatedCategory,
        id: `category-${Date.now()}`,
        color: 'bg-gray-100 text-gray-800',
        isCollapsed: false,
        drinks: []
      };
      setCategories([...categories, newCategory]);
      toast({
        title: "Catégorie ajoutée",
        description: `${newCategory.name} a été créée`,
      });
    }
  };

  const handleAddCategory = () => {
    setEditCategoryModal({ isOpen: true, category: { name: '', icon: '' } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header 
          totalOrders={totalOrders} 
          totalAmount={totalAmount} 
          onAddCategory={handleAddCategory}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Menu des Boissons</h2>
            
            {categories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                onAddDrink={handleAddDrink}
                onEditDrink={handleEditDrink}
                onToggleCategory={handleToggleCategory}
                onEditCategory={handleEditCategory}
                onAddDrinkToCategory={handleAddDrinkToCategory}
              />
            ))}
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <OrderSummary
              orders={orders}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearAll={handleClearAll}
              onConfirmOrder={handleConfirmOrder}
            />
            
            <OrderHistory orderHistory={orderHistory} />
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <EditDrinkModal
        drink={editDrinkModal.drink}
        isOpen={editDrinkModal.isOpen}
        onClose={() => setEditDrinkModal({ isOpen: false, drink: null, categoryId: null })}
        onSave={editDrinkModal.drink?.id && editDrinkModal.drink.id.startsWith('custom-') ? handleSaveNewDrink : handleSaveDrink}
      />
      
      <EditCategoryModal
        category={editCategoryModal.category}
        isOpen={editCategoryModal.isOpen}
        onClose={() => setEditCategoryModal({ isOpen: false, category: null })}
        onSave={handleSaveCategory}
      />
      
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