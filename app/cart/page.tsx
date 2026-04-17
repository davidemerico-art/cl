"use client";

import { useStore } from "@/app/StoreProvider";
import { Trash2, MessageCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const handleWhatsappCheckout = () => {
    const phoneNumber = "39324907366";
    
    let text = "Ciao! Vorrei ordinare i seguenti articoli dal sito Salon:\n\n";
    cart.forEach(item => {
      text += `- ${item.quantity}x ${item.name} (€${item.price.toFixed(2)})\n`;
    });
    text += `\n*Totale: €${total.toFixed(2)}*\n\nResto in attesa di conferma!`;
    
    const encodedText = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send/?phone=39324907366&text=${encodedText}`, "_blank");
  };

  if (!mounted) return null;

  return (
    <div className="py-12 px-4 max-w-4xl mx-auto w-full">
      <h1 className="text-4xl font-extrabold text-white mb-8">Il tuo Carrello</h1>
      
      {cart.length === 0 ? (
        <div className="bg-card border border-border p-12 text-center rounded-2xl flex flex-col items-center">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={32} className="text-foreground/50" />
          </div>
          <h2 className="text-xl font-bold mb-2">Il carrello è vuoto</h2>
          <p className="text-foreground/60 mb-6">Non hai ancora aggiunto prodotti o tagli.</p>
          <Link href="/shop" className="bg-primary text-background px-6 py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors">
            Vai allo Shop
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 md:p-8">
            <ul className="divide-y divide-border">
              {cart.map((item) => (
                <li key={item.id} className="py-6 flex justify-between items-center group">
                  <div className="flex flex-col">
                    <span className="font-bold text-lg text-white">{item.name}</span>
                    <span className="text-sm text-foreground/60 capitalize">Quantità: {item.quantity}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-bold text-primary">€{(item.price * item.quantity).toFixed(2)}</span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-foreground/40 hover:text-red-500 transition-colors p-2"
                      title="Rimuovi"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-secondary p-6 md:p-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-sm text-foreground/60 mb-1">Totale Ordine</p>
              <p className="text-3xl font-extrabold text-white">€{total.toFixed(2)}</p>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <button 
                onClick={clearCart}
                className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-card transition-colors flex-1 md:flex-none"
              >
                Svuota
              </button>
              <button 
                onClick={handleWhatsappCheckout}
                className="px-8 py-3 bg-[#25D366] text-white rounded-lg font-bold hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2 flex-1 md:flex-none shadow-lg shadow-[#25D366]/20"
              >
                <MessageCircle size={20} /> Ordina su WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
