// React & routing
import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Contexts & hooks
import { ThemeProvider } from './contexts/ThemeContext';
import { useToast } from './hooks/use-toast';

// UI components
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { Plus } from 'lucide-react';

// App components
import Header from './components/Header';
import CategorySection from './components/CategorySection';
import OrderSummary from './components/OrderSummary';
import OrderHistory from './components/OrderHistory';
import ConfirmOrderModal from './components/ConfirmOrderModal';
import EditDrinkModal from './components/EditDrinkModal';
import EditCategoryModal from './components/EditCategoryModal';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import SortControls from './components/SortControls';
import InstallBanner from './components/InstallBanner';
import InstallPrompt from './components/InstallPrompt';

// Data & utils
import { mockCategories, mockOrderHistory } from './mock';
import { generateDrinkId } from './utils/id';

// Styles
import './App.css';


// ==========================
//      COMPOSANT PRINCIPAL
// ==========================
const DrinkOrderApp = () => {
  const { toast } = useToast();

  // ---- ÉTATS ----
  const [categories, setCategories] = useState(mockCategories); // liste des catégories et boissons
  const [orders, setOrders] = useState([]); // panier actuel
  const [orderHistory, setOrderHistory] = useState(mockOrderHistory); // historique des commandes
  const [sortBy, setSortBy] = useState('name'); // critère de tri
  const [soundEnabled, setSoundEnabled] = useState(true); // activation/désactivation du son
  const [compactMode, setCompactMode] = useState(false); // 🆕 affichage compact ou large
  const [showHistory, setShowHistory] = useState(false); // 🆕 modal historique
  const [showConfirmModal, setShowConfirmModal] = useState(false); // 🆕 modal recap commande

  // États pour les modals d'édition/suppression
  const [editDrinkModal, setEditDrinkModal] = useState({ isOpen: false, drink: null, categoryId: null, mode: 'edit' });
  const [editCategoryModal, setEditCategoryModal] = useState({ isOpen: false, category: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, type: null, item: null, categoryId: null });

  // ==========================
  //  CALCULS MÉMOS
  // ==========================
  // Table de popularité calculée à partir de l'historique
  const drinkPopularity = useMemo(() => {
    const popularity = {};
    // Compter par nom
    orderHistory.forEach(order => {
      order.items.forEach(item => {
        popularity[item.drinkName] = (popularity[item.drinkName] || 0) + item.quantity;
      });
    });
    // Mapper par ID
    const byId = {};
    categories.forEach(c => {
      c.drinks.forEach(d => {
        byId[d.id] = popularity[d.name] || 0;
      });
    });
    return byId;
  }, [orderHistory, categories]);

  // ==========================
  //  TRI DES BOISSONS
  // ==========================
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

  // Renvoie les catégories avec boissons triées selon le critère
  const getSortedCategories = () => {
    if (sortBy === 'default') return categories;
    if (sortBy === 'name' || sortBy === 'popularity') {
      return categories.map(c => ({
        ...c,
        drinks: sortDrinks(c.drinks, sortBy)
      }));
    }
    return categories;
  };

  // ==========================
  //  GESTION PANIER
  // ==========================
  const handleAddDrink = (drink) => {
    const idx = orders.findIndex(order => order.drinkId === drink.id);
    if (idx >= 0) {
      const updated = [...orders];
      updated[idx].quantity += 1;
      setOrders(updated);
    } else {
      setOrders([...orders, {
        drinkId: drink.id,
        drinkName: drink.name,
        price: drink.price,
        quantity: 1,
        addedAt: new Date().toISOString()
      }]);
    }
    toast({ title: "Boisson ajoutée", description: `${drink.name} ajouté à la commande` });
  };

  const handleUpdateQuantity = (drinkId, qty) => {
    if (qty <= 0) return handleRemoveItem(drinkId);
    setOrders(orders.map(o => o.drinkId === drinkId ? { ...o, quantity: qty } : o));
  };

  const handleRemoveItem = (drinkId) => {
    setOrders(orders.filter(o => o.drinkId !== drinkId));
    toast({ title: "Article supprimé", description: "L'article a été retiré" });
  };

  const handleClearAll = () => {
    setOrders([]);
    toast({ title: "Commande vidée", description: "Toutes les commandes ont été supprimées" });
  };

  // Ouvre le recap avant validation
  const handleConfirmOrderClick = () => {
    if (!orders.length) return;
    setShowConfirmModal(true);
  };

  // Validation finale de commande
  const finalizeOrder = () => {
    const total = orders.reduce((sum, o) => sum + o.price * o.quantity, 0);
    const newOrder = {
      id: `order-${Date.now()}`,
      date: new Date().toISOString(),
      items: orders.map(o => ({ drinkName: o.drinkName, quantity: o.quantity, price: o.price })),
      total
    };
    setOrderHistory([newOrder, ...orderHistory]);
    setOrders([]);
    setShowConfirmModal(false);
    toast({ title: "Commande confirmée", description: `Total: ${total.toFixed(2)}€` });
  };

  // ==========================
  //  GESTION CATEGORIES / BOISSONS
  // ==========================
  const handleToggleCategory = (id) => {
    setCategories(categories.map(c => c.id === id ? { ...c, isCollapsed: !c.isCollapsed } : c));
  };

  const handleEditDrink = (drink, mode = 'edit') => {
    const cat = categories.find(c => c.drinks.some(d => d.id === drink.id));
    setEditDrinkModal({ isOpen: true, drink, categoryId: cat?.id, mode });
  };

  const handleDeleteDrink = (drink) => {
    const cat = categories.find(c => c.drinks.some(d => d.id === drink.id));
    setDeleteDialog({ isOpen: true, type: 'drink', item: drink, categoryId: cat?.id });
  };

  const confirmDeleteDrink = () => {
    const { item, categoryId } = deleteDialog;
    setCategories(categories.map(c =>
      c.id === categoryId ? { ...c, drinks: c.drinks.filter(d => d.id !== item.id) } : c
    ));
    setDeleteDialog({ isOpen: false, type: null, item: null, categoryId: null });
    toast({ title: "Boisson supprimée", description: `${item.name} a été retirée du menu` });
  };

  const handleSaveDrink = (updated) => {
    if (editDrinkModal.mode === 'add') {
      setCategories(categories.map(c =>
        c.id === editDrinkModal.categoryId
          ? { ...c, drinks: [...c.drinks, { ...updated, id: generateDrinkId(updated.name, c.id) }] }
          : c
      ));
      toast({ title: "Boisson ajoutée", description: `${updated.name} ajouté au menu` });
    } else {
      setCategories(categories.map(c => ({
        ...c,
        drinks: c.drinks.map(d => d.id === updated.id ? updated : d)
      })));
      toast({ title: "Boisson modifiée", description: `${updated.name} modifiée` });
    }
  };

  const handleAddDrinkToCategory = (categoryId) => {
    setEditDrinkModal({ isOpen: true, drink: { id: '', name: '', price: 0 }, categoryId, mode: 'add' });
  };

  const handleEditCategory = (cat) => setEditCategoryModal({ isOpen: true, category: cat });
  const handleDeleteCategory = (cat) => setDeleteDialog({ isOpen: true, type: 'category', item: cat });

  const confirmDeleteCategory = () => {
    const cat = deleteDialog.item;
    setCategories(categories.filter(c => c.id !== cat.id));
    setDeleteDialog({ isOpen: false, type: null, item: null });
    toast({ title: "Catégorie supprimée", description: `${cat.name} supprimée` });
  };

  const handleSaveCategory = (cat) => {
    if (categories.some(c => c.id === cat.id)) {
      setCategories(categories.map(c => c.id === cat.id ? cat : c));
      toast({ title: "Catégorie modifiée", description: `${cat.name} mise à jour` });
    } else {
      setCategories([...categories, { ...cat, id: `cat-${Date.now()}`, drinks: [], isCollapsed: false }]);
      toast({ title: "Catégorie ajoutée", description: `${cat.name} créée` });
    }
  };

  const handleAddCategory = () => setEditCategoryModal({ isOpen: true, category: { name: '', icon: '' } });

  // ==========================
  //  RENDU JSX
  // ==========================
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* HEADER avec menu hamburger */}
        <Header
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(s => !s)}
          compactMode={compactMode}
          onToggleCompact={() => setCompactMode(c => !c)}
          onShowHistory={() => setShowHistory(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne catégories */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">Menu des Boissons</h2>
              <div className="flex flex-wrap gap-3">
                <SortControls sortBy={sortBy} onSortChange={setSortBy} />
                <Button onClick={handleAddCategory} className="bg-purple-600 text-white">
                  <Plus className="w-4 h-4 mr-2" /> Nouvelle catégorie
                </Button>
              </div>
            </div>

            {getSortedCategories().map(c => (
              <CategorySection
                key={c.id}
                category={c}
                onAddDrink={handleAddDrink}
                onEditDrink={handleEditDrink}
                onToggleCategory={handleToggleCategory}
                onEditCategory={handleEditCategory}
                onAddDrinkToCategory={handleAddDrinkToCategory}
                onDeleteCategory={handleDeleteCategory}
                onDeleteDrink={handleDeleteDrink}
                sortedDrinks={sortDrinks(c.drinks, sortBy)}
                drinkPopularity={drinkPopularity}
                orders={orders}
                soundEnabled={soundEnabled}
                compactMode={compactMode} // 🆕
              />
            ))}
          </div>

          {/* Colonne Summary Desktop */}
          <div className="lg:col-span-1 space-y-6 hidden lg:block">
            <OrderSummary
              orders={orders}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearAll={handleClearAll}
              onConfirmOrder={handleConfirmOrderClick}
            />
          </div>
        </div>

        {/* Summary Mobile */}
        <div className="lg:hidden">
          <OrderSummary
            orders={orders}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearAll={handleClearAll}
            onConfirmOrder={handleConfirmOrderClick}
          />
        </div>
      </div>

      {/* === Modals === */}
      <EditDrinkModal {...editDrinkModal} onClose={() => setEditDrinkModal({ isOpen: false, drink: null, categoryId: null, mode: 'edit' })} onSave={handleSaveDrink} />
      <EditCategoryModal {...editCategoryModal} onClose={() => setEditCategoryModal({ isOpen: false, category: null })} onSave={handleSaveCategory} />
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, type: null, item: null, categoryId: null })}
        onConfirm={deleteDialog.type === 'drink' ? confirmDeleteDrink : confirmDeleteCategory}
        title={deleteDialog.type === 'drink' ? "Supprimer la boisson" : "Supprimer la catégorie"}
        description={deleteDialog.type === 'drink'
          ? `Êtes-vous sûr de vouloir supprimer "${deleteDialog.item?.name}" ?`
          : `Supprimer "${deleteDialog.item?.name}" supprimera aussi ${deleteDialog.item?.drinks?.length || 0} boissons.`}
      />

      {/* Modal Historique */}
      {showHistory && (
        <OrderHistory
          orderHistory={orderHistory}
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
        />
      )}

      {/* Modal Récapitulatif Commande */}
      {showConfirmModal && (
        <ConfirmOrderModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          orders={orders}
          onConfirm={finalizeOrder}
        />
      )}

      <Toaster />
    </div>
  );
};

// ==========================
//  ROUTAGE PRINCIPAL
// ==========================
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
