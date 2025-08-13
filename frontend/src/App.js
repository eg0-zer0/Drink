import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Button } from './components/ui/button';
import { Plus } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { useToast } from './hooks/use-toast';
import { mockCategories, mockOrderHistory } from './mock';
import Header from './components/Header';
import CategorySection from './components/CategorySection';
import OrderSummary from './components/OrderSummary';
import OrderHistory from './components/OrderHistory';
import EditDrinkModal from './components/EditDrinkModal';
import EditCategoryModal from './components/EditCategoryModal';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import SortControls from './components/SortControls';
import InstallBanner from './components/InstallBanner';
import InstallPrompt from './components/InstallPrompt';
import './App.css';

// Ton composant principal
const DrinkOrderApp = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState(mockCategories);
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState(mockOrderHistory);
  const [sortBy, setSortBy] = useState('name');

  // ... (tout ton code existant de gestion des boissons et catégories)
  
  // Modals state
  const [editDrinkModal, setEditDrinkModal] = useState({ 
    isOpen: false, 
    drink: null, 
    categoryId: null, 
    mode: 'edit' 
  });
  const [editCategoryModal, setEditCategoryModal] = useState({ isOpen: false, category: null });
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    type: null, // 'drink' or 'category'
    item: null,
    categoryId: null
  });

  // Calculer la popularité des boissons basée sur l'historique
  const drinkPopularity = useMemo(() => {
    const popularity = {};
    
    orderHistory.forEach(order => {
      order.items.forEach(item => {
        const drinkName = item.drinkName;
        if (!popularity[drinkName]) {
          popularity[drinkName] = 0;
        }
        popularity[drinkName] += item.quantity;
      });
    });
    
    // Convertir par ID de boisson
    const popularityById = {};
    categories.forEach(category => {
      category.drinks.forEach(drink => {
        popularityById[drink.id] = popularity[drink.name] || 0;
      });
    });
    
    return popularityById;
  }, [orderHistory, categories]);

  // Fonction de tri des boissons
  const sortDrinks = (drinks, sortBy) => {
    const sorted = [...drinks];
    
    switch (sortBy) {
      case 'popularity':
        return sorted.sort((a, b) => (drinkPopularity[b.id] || 0) - (drinkPopularity[a.id] || 0));
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
      default:
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
  };
  // Fonction qui retourne les catégories triées selon le critère
const getSortedCategories = () => {
  if (sortBy === 'default') {
    // Vue par défaut
    return categories;
  }

  if (sortBy === 'name') {
    // Trier boissons par ordre alphabétique dans chaque catégorie
    return categories.map(category => ({
      ...category,
      drinks: [...category.drinks].sort((a, b) => a.name.localeCompare(b.name))
    }));
  }

  if (sortBy === 'popularity') {
    // Calcul de la popularité par ID à partir de drinkPopularity déjà calculé
    return categories.map(category => ({
      ...category,
      drinks: [...category.drinks].sort((a, b) =>
        (drinkPopularity[b.id] || 0) - (drinkPopularity[a.id] || 0)
      )
    }));
  }

  return categories; // fallback
};


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

    const totalAmount = orders.reduce((sum, order) => sum + (order.price * order.quantity), 0);
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

  const handleEditDrink = (drink, mode = 'edit') => {
    // Find category
    const category = categories.find(cat => cat.drinks.some(d => d.id === drink.id));
    setEditDrinkModal({ 
      isOpen: true, 
      drink, 
      categoryId: category?.id, 
      mode 
    });
  };

  const handleDeleteDrink = (drink) => {
    const category = categories.find(cat => cat.drinks.some(d => d.id === drink.id));
    setDeleteDialog({
      isOpen: true,
      type: 'drink',
      item: drink,
      categoryId: category?.id
    });
  };

  const confirmDeleteDrink = () => {
    const { item: drink, categoryId } = deleteDialog;
    
    const updatedCategories = categories.map(category => 
      category.id === categoryId
        ? {
            ...category,
            drinks: category.drinks.filter(d => d.id !== drink.id)
          }
        : category
    );
    
    setCategories(updatedCategories);
    setDeleteDialog({ isOpen: false, type: null, item: null, categoryId: null });
    
    toast({
      title: "Boisson supprimée",
      description: `${drink.name} a été supprimé du menu`,
    });
  };

  const handleSaveDrink = (updatedDrink) => {
    if (editDrinkModal.mode === 'add' || (updatedDrink.id && updatedDrink.id.startsWith('custom-'))) {
      // Ajouter nouvelle boisson
      const updatedCategories = categories.map(category => 
        category.id === editDrinkModal.categoryId
          ? { 
              ...category, 
              drinks: [...category.drinks, { 
                ...updatedDrink, 
                id: updatedDrink.id || `custom-${Date.now()}` 
              }] 
            }
          : category
      );
      setCategories(updatedCategories);
      
      toast({
        title: "Boisson ajoutée",
        description: `${updatedDrink.name} a été ajouté au menu`,
      });
    } else {
      // Modifier boisson existante
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
    }
  };

  const handleAddDrinkToCategory = (categoryId) => {
    const newDrink = {
      id: `custom-${Date.now()}`,
      name: '',
      price: 0,
      available: true,
    };
    setEditDrinkModal({ 
      isOpen: true, 
      drink: newDrink, 
      categoryId, 
      mode: 'add' 
    });
  };

  const handleEditCategory = (category) => {
    setEditCategoryModal({ isOpen: true, category });
  };

  const handleDeleteCategory = (category) => {
    setDeleteDialog({
      isOpen: true,
      type: 'category',
      item: category,
      categoryId: null
    });
  };

  const confirmDeleteCategory = () => {
    const category = deleteDialog.item;
    
    const updatedCategories = categories.filter(cat => cat.id !== category.id);
    setCategories(updatedCategories);
    setDeleteDialog({ isOpen: false, type: null, item: null, categoryId: null });
    
    toast({
      title: "Catégorie supprimée",
      description: `${category.name} et tous ses articles ont été supprimés`,
    });
  };

  const handleSaveCategory = (updatedCategory) => {
    if (updatedCategory.id && categories.find(cat => cat.id === updatedCategory.id)) {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Menu des Boissons</h2>
              <div className="flex flex-wrap items-center gap-3">
                <SortControls sortBy={sortBy} onSortChange={setSortBy} />
                <Button
                  onClick={handleAddCategory}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white touch-manipulation"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle catégorie
                </Button>
              </div>
            </div>
            
            {categories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                onAddDrink={handleAddDrink}
                onEditDrink={handleEditDrink}
                onToggleCategory={handleToggleCategory}
                onEditCategory={handleEditCategory}
                onAddDrinkToCategory={handleAddDrinkToCategory}
                onDeleteCategory={handleDeleteCategory}
                onDeleteDrink={handleDeleteDrink}
                sortedDrinks={sortDrinks(category.drinks, sortBy)}
                drinkPopularity={drinkPopularity}
              />
            ))}
          </div>
          
          <div className="lg:col-span-1 space-y-6 hidden lg:block">
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
        
        {/* Mobile order summary */}
        <div className="lg:hidden">
          <OrderSummary
            orders={orders}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearAll={handleClearAll}
            onConfirmOrder={handleConfirmOrder}
          />
        </div>
      </div>
      
      {/* Modals */}
      <EditDrinkModal
        drink={editDrinkModal.drink}
        isOpen={editDrinkModal.isOpen}
        mode={editDrinkModal.mode}
        onClose={() => setEditDrinkModal({ isOpen: false, drink: null, categoryId: null, mode: 'edit' })}
        onSave={handleSaveDrink}
      />
      
      <EditCategoryModal
        category={editCategoryModal.category}
        isOpen={editCategoryModal.isOpen}
        onClose={() => setEditCategoryModal({ isOpen: false, category: null })}
        onSave={handleSaveCategory}
      />
      
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, type: null, item: null, categoryId: null })}
        onConfirm={deleteDialog.type === 'drink' ? confirmDeleteDrink : confirmDeleteCategory}
        title={deleteDialog.type === 'drink' 
          ? "Supprimer la boisson" 
          : "Supprimer la catégorie"
        }
        description={
          deleteDialog.type === 'drink'
            ? `Êtes-vous sûr de vouloir supprimer "${deleteDialog.item?.name}" ? Cette action est irréversible.`
            : `Êtes-vous sûr de vouloir supprimer "${deleteDialog.item?.name}" ? Tous les articles de cette catégorie (${deleteDialog.item?.drinks?.length || 0} articles) seront également supprimés. Cette action est irréversible.`
        }
      />
      
      <Toaster />
    </div>
  );

// ... tout le contenu de DrinkOrderApp ici ...

  return (
    <div className="container mx-auto p-4">
      <Header />
      <CategorySection
  categories={getSortedCategories()}
  onEditDrink={handleEditDrink}
  onDeleteDrink={handleDeleteDrink}
  onAddDrink={handleAddDrinkToCategory}
  onToggleCategory={handleToggleCategory}
  sortBy={sortBy}
  sortDrinks={sortDrinks}
/>


      <SortControls sortBy={sortBy} setSortBy={setSortBy} />

      <OrderSummary
        orders={orders}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearAll={handleClearAll}
        onConfirmOrder={handleConfirmOrder}
      />

      <OrderHistory history={orderHistory} />

      {/* Modals */}
      <EditDrinkModal {...editDrinkModal} onSave={handleSaveDrink} onClose={() => setEditDrinkModal({ isOpen: false })} />
      <EditCategoryModal {...editCategoryModal} onSave={handleSaveCategory} onClose={() => setEditCategoryModal({ isOpen: false })} />
      <DeleteConfirmDialog {...deleteDialog} onConfirm={deleteDialog.type === 'drink' ? confirmDeleteDrink : confirmDeleteCategory} onCancel={() => setDeleteDialog({ isOpen: false })} />
    </div>
  );
}; // ← fermeture correcte de DrinkOrderApp


// 🆕 Composant App principal
function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <InstallBanner />
        <Routes>
          <Route path="/" element={<DrinkOrderApp />} />
        </Routes>
        <InstallPrompt />
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;