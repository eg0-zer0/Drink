import React, { useState } from 'react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Share2, Mail, MessageSquare, Phone, Copy, Check } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const ShareButtons = ({ order, isCurrentOrder = false }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const formatOrderSummary = (orderData) => {
    const isArray = Array.isArray(orderData);
    const items = isArray ? orderData : orderData.items;
    const total = isArray 
      ? orderData.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      : orderData.total;
    
    const date = isArray ? new Date().toLocaleDateString('fr-FR') : new Date(orderData.date).toLocaleDateString('fr-FR');
    const time = isArray ? new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : new Date(orderData.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    let summary = `🍹 Commande de Boissons\n`;
    summary += `📅 ${date} à ${time}\n\n`;
    summary += `📝 Détail de la commande:\n`;
    
    items.forEach(item => {
      const itemName = isArray ? item.drinkName : item.drinkName;
      const quantity = item.quantity;
      const price = item.price;
      const itemTotal = quantity * price;
      summary += `• ${quantity}x ${itemName} - ${itemTotal.toFixed(2)}€\n`;
    });
    
    summary += `\n💰 Total: ${total.toFixed(2)}€`;
    summary += `\n\n📱 Généré via l'app Commandes de Boissons`;
    
    return summary;
  };

  const shareText = formatOrderSummary(order);
  const encodedText = encodeURIComponent(shareText);

  const handleShare = async (platform) => {
    switch (platform) {
      case 'native':
        if (navigator.share) {
          try {
            await navigator.share({
              title: '🍹 Commande de Boissons',
              text: shareText,
            });
            toast({
              title: "Partagé avec succès",
              description: "La commande a été partagée",
            });
          } catch (error) {
            console.log('Partage annulé ou échoué');
          }
        } else {
          toast({
            title: "Partage non supporté",
            description: "Votre navigateur ne supporte pas le partage natif",
            variant: "destructive"
          });
        }
        break;

      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodedText}`, '_blank');
        break;

      case 'sms':
        window.open(`sms:?body=${encodedText}`, '_blank');
        break;

      case 'email':
        const subject = encodeURIComponent('🍹 Commande de Boissons');
        const body = encodeURIComponent(shareText.replace(/\n/g, '%0A'));
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
        break;

      case 'messenger':
        // Utilise l'API de partage Messenger si disponible, sinon copie le texte
        if (navigator.share) {
          try {
            await navigator.share({
              title: '🍹 Commande de Boissons',
              text: shareText,
            });
          } catch (error) {
            handleCopyToClipboard();
          }
        } else {
          handleCopyToClipboard();
          toast({
            title: "Texte copié",
            description: "Collez le texte dans Messenger",
          });
        }
        break;

      case 'copy':
        handleCopyToClipboard();
        break;

      default:
        break;
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copié dans le presse-papiers",
        description: "Le résumé de la commande a été copié",
      });
    } catch (error) {
      toast({
        title: "Erreur de copie",
        description: "Impossible de copier le texte",
        variant: "destructive"
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          Partager
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {navigator.share && (
          <DropdownMenuItem onClick={() => handleShare('native')}>
            <Share2 className="w-4 h-4 mr-2" />
            Partage natif
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
          <MessageSquare className="w-4 h-4 mr-2 text-green-600" />
          WhatsApp
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleShare('messenger')}>
          <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
          Messenger
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleShare('sms')}>
          <Phone className="w-4 h-4 mr-2 text-green-500" />
          SMS
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleShare('email')}>
          <Mail className="w-4 h-4 mr-2 text-red-500" />
          Email
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleShare('copy')}>
          {copied ? (
            <Check className="w-4 h-4 mr-2 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 mr-2" />
          )}
          {copied ? 'Copié !' : 'Copier le texte'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButtons;