import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { History, Calendar, Receipt } from 'lucide-react';
import ShareButtons from './ShareButtons';

const OrderHistory = ({ orderHistory }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (orderHistory.length === 0) {
    return (
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Historique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">Aucun historique</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Historique des commandes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {orderHistory.map((order) => (
          <div key={order.id} className="border rounded-lg p-3 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">{formatDate(order.date)}</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {order.total.toFixed(2)}€
              </Badge>
            </div>
            
            <div className="space-y-1">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">
                    {item.quantity}x {item.drinkName}
                  </span>
                  <span className="text-gray-600">
                    {(item.quantity * item.price).toFixed(2)}€
                  </span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Receipt className="w-3 h-3" />
                {order.items.reduce((sum, item) => sum + item.quantity, 0)} articles
              </div>
              <span className="font-semibold text-sm">Total: {order.total.toFixed(2)}€</span>
            </div>
            
            {/* Share button for historical order */}
            <div className="flex justify-center mt-3 pt-2 border-t border-gray-200">
              <ShareButtons order={order} isCurrentOrder={false} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default OrderHistory;