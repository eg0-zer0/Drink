import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trash2, Minus, Plus, Receipt, ShoppingCart } from 'lucide-react';
import ShareButtons from './ShareButtons';

const OrderSummary = ({ orders, onUpdateQuantity, onRemoveItem, onClearAll, onConfirmOrder }) => {
  const totalAmount = orders.reduce((sum, order) => sum + (order.price * order.quantity), 0);
  const totalItems = orders.reduce((sum, order) => sum + order.quantity, 0);

  if (orders.length === 0) {
    return (
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Commande actuelle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">Aucune commande en cours</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Commande actuelle
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {totalItems} article{totalItems > 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {orders.map((order, index) => (
            <div key={`${order.drinkId}-${index}`} className="border rounded-lg p-3 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm">{order.drinkName}</p>
                  <p className="text-xs text-gray-600">{order.price.toFixed(2)}€ / unité</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateQuantity(order.drinkId, order.quantity - 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  
                  <span className="text-sm font-medium w-8 text-center">
                    {order.quantity}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateQuantity(order.drinkId, order.quantity + 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveItem(order.drinkId)}
                    className="h-6 w-6 p-0 ml-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total:</span>
            <span>{totalAmount.toFixed(2)}€</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={onConfirmOrder}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
          >
            <Receipt className="w-4 h-4 mr-2" />
            Confirmer
          </Button>
          <Button 
            onClick={onClearAll}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Share buttons for current order */}
        <div className="pt-2 border-t">
          <div className="flex justify-center">
            <ShareButtons order={orders} isCurrentOrder={true} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;