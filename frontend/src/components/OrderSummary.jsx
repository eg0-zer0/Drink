import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trash2, Minus, Plus, Receipt, ShoppingCart, X } from 'lucide-react';
import ShareButtons from './ShareButtons';

const OrderSummary = ({ orders, onUpdateQuantity, onRemoveItem, onClearAll, onConfirmOrder }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalAmount = orders.reduce((sum, order) => sum + (order.price * order.quantity), 0);
  const totalItems = orders.reduce((sum, order) => sum + order.quantity, 0);

  // Mobile: Show as overlay when there are items
  const isMobile = window.innerWidth < 1024;

  if (orders.length === 0) {
    return (
      <Card className="sticky top-4 dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-gray-200">
            <ShoppingCart className="w-5 h-5" />
            Commande actuelle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">Aucune commande en cours</p>
        </CardContent>
      </Card>
    );
  }

  // Mobile floating summary
  if (isMobile && !isExpanded) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 lg:hidden">
        <Card 
          className="bg-blue-600 text-white border-0 cursor-pointer touch-manipulation"
          onClick={() => setIsExpanded(true)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5" />
                <div>
                  <p className="font-semibold">{totalItems} article{totalItems > 1 ? 's' : ''}</p>
                  <p className="text-sm opacity-90">{totalAmount.toFixed(2)}€</p>
                </div>
              </div>
              <Button size="sm" className="bg-white text-blue-600 hover:bg-gray-100">
                Voir
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-lg max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold dark:text-gray-200">Commande actuelle</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsExpanded(false)}
                className="p-1 dark:hover:bg-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <OrderContent 
                orders={orders}
                totalItems={totalItems}
                totalAmount={totalAmount}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveItem={onRemoveItem}
                onClearAll={onClearAll}
                onConfirmOrder={onConfirmOrder}
                onClose={() => setIsExpanded(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop view */}
      <Card className="sticky top-4 dark:bg-gray-800 dark:border-gray-700 hidden lg:block">
        <CardHeader>
          <CardTitle className="flex items-center justify-between dark:text-gray-200">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Commande actuelle
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {totalItems} article{totalItems > 1 ? 's' : ''}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <OrderContent 
            orders={orders}
            totalItems={totalItems}
            totalAmount={totalAmount}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
            onClearAll={onClearAll}
            onConfirmOrder={onConfirmOrder}
          />
        </CardContent>
      </Card>
    </>
  );
};

const OrderContent = ({ orders, totalAmount, onUpdateQuantity, onRemoveItem, onClearAll, onConfirmOrder, onClose }) => {
  return (
    <>
      <div className="space-y-3">
        {orders.map((order, index) => (
          <div key={`${order.drinkId}-${index}`} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-sm dark:text-gray-200">{order.drinkName}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{order.price.toFixed(2)}€ / unité</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateQuantity(order.drinkId, order.quantity - 1)}
                  className="h-6 w-6 p-0 touch-manipulation dark:border-gray-500 dark:hover:bg-gray-600"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                
                <span className="text-sm font-medium w-8 text-center dark:text-gray-200">
                  {order.quantity}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateQuantity(order.drinkId, order.quantity + 1)}
                  className="h-6 w-6 p-0 touch-manipulation dark:border-gray-500 dark:hover:bg-gray-600"
                >
                  <Plus className="w-3 h-3" />
                </Button>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemoveItem(order.drinkId)}
                  className="h-6 w-6 p-0 ml-1 touch-manipulation"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-4 mt-4 dark:border-gray-600">
        <div className="flex justify-between items-center text-lg font-bold dark:text-gray-200">
          <span>Total:</span>
          <span>{totalAmount.toFixed(2)}€</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={() => {
            onConfirmOrder();
            if (onClose) onClose();
          }}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white touch-manipulation"
        >
          <Receipt className="w-4 h-4 mr-2" />
          Confirmer
        </Button>
        <Button 
          onClick={onClearAll}
          variant="destructive"
          size="sm"
          className="touch-manipulation"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="pt-2 border-t dark:border-gray-600">
        <div className="flex justify-center">
          <ShareButtons order={orders} isCurrentOrder={true} />
        </div>
      </div>
    </>
  );
};

export default OrderSummary;