import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trash2, Minus, Plus, Users, Receipt } from 'lucide-react';

const OrderSummary = ({ orders, onUpdateQuantity, onRemoveItem, onClearAll }) => {
  const totalAmount = orders.reduce((sum, order) => sum + (order.price * order.quantity), 0);
  const totalItems = orders.reduce((sum, order) => sum + order.quantity, 0);

  const ordersByFriend = orders.reduce((acc, order) => {
    if (!acc[order.friendName]) {
      acc[order.friendName] = [];
    }
    acc[order.friendName].push(order);
    return acc;
  }, {});

  if (orders.length === 0) {
    return (
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Récapitulatif
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
            <Receipt className="w-5 h-5" />
            Récapitulatif
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {totalItems} article{totalItems > 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(ordersByFriend).map(([friendName, friendOrders]) => (
          <div key={friendName} className="border rounded-lg p-3 bg-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4" />
              <h4 className="font-semibold text-gray-800">{friendName}</h4>
            </div>
            
            {friendOrders.map((order) => (
              <div key={`${order.drinkId}-${order.friendName}`} className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <p className="font-medium text-sm">{order.drinkName}</p>
                  <p className="text-xs text-gray-600">{order.price.toFixed(2)}€ / unité</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateQuantity(order.drinkId, order.friendName, order.quantity - 1)}
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
                    onClick={() => onUpdateQuantity(order.drinkId, order.friendName, order.quantity + 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveItem(order.drinkId, order.friendName)}
                    className="h-6 w-6 p-0 ml-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ))}
        
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total:</span>
            <span>{totalAmount.toFixed(2)}€</span>
          </div>
        </div>
        
        <Button 
          onClick={onClearAll}
          variant="destructive"
          className="w-full"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Vider la commande
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;