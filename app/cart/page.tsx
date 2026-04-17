"use client";

import { useStore } from "@/app/StoreProvider";
import { Trash2, MessageCircle, AlertCircle, CalendarClock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, slots } = useStore();
  const [mounted, setMounted] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const total = cart.reduce((acc, item) => acc + ((item.price ?? 0) * item.quantity), 0);
  const hasCut = cart.some(item => item.type === "cut");
  const availableSlots = slots.filter(s => s.isAvailable).sort((a, b) => {
    return new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime();
  });
  
  const handleWhatsappCheckout = () => {
    if (hasCut && !selectedSlotId) return;

    let text = "Ciao! Vorrei ordinare i seguenti articoli dal sito LC Hair Boutique:\n\n";
    cart.forEach(item => {
      text += `- ${item.quantity}x ${item.name} (€${(item.price ?? 0).toFixed(2)})\n`;
    });

    if (hasCut && selectedSlotId) {
      const slot = availableSlots.find(s => s.id === selectedSlotId);
      if (slot) {
        const dateObj = new Date(slot.date);
        const formattedDate = dateObj.toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
        text += `\n*APPUNTAMENTO RICHIESTO:*\n- Giorno: ${formattedDate}\n- Ora: ${slot.time}\n`;
      }
    }

    text += `\n*Totale: €${total.toFixed(2)}*\n\nResto in attesa di conferma!`;
    
    const encodedText = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send/?phone=393249070366&text=${encodedText}`, "_blank");
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
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-white">{item.name}</span>
                      {item.type === "cut" && (
                        <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded">SERVIZIO</span>
                      )}
                    </div>
                    <span className="text-sm text-foreground/60 capitalize mt-1">Quantità: {item.quantity}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-bold text-primary">€{((item.price ?? 0) * item.quantity).toFixed(2)}</span>
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
          
          {hasCut && (
            <div className="p-6 md:p-8 bg-background border-t border-border">
              <div className="flex items-start gap-4 flex-col sm:flex-row">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <CalendarClock className="text-primary" size={24} />
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-lg font-bold text-white mb-2">Scegli l'Appuntamento</h3>
                  <p className="text-sm text-foreground/60 mb-4">
                    Hai inserito un taglio/servizio nel carrello. Per completare la richiesta su WhatsApp, seleziona una data e ora tra quelle disponibili.
                  </p>
                  
                  {availableSlots.length === 0 ? (
                    <div className="p-4 border border-red-500/30 bg-red-500/10 text-red-500 rounded-lg text-sm font-medium">
                      Nessun orario disponibile al momento. Non è possibile prenotare questo servizio.
                    </div>
                  ) : (
                    <select 
                      className="w-full bg-secondary border border-border text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary cursor-pointer"
                      value={selectedSlotId}
                      onChange={(e) => setSelectedSlotId(e.target.value)}
                    >
                      <option value="" disabled>-- Seleziona una disponibilità --</option>
                      {availableSlots.map(slot => {
                        const dateObj = new Date(slot.date);
                        const dayName = dateObj.toLocaleDateString('it-IT', { weekday: 'long' });
                        const formattedDate = dateObj.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
                        return (
                          <option key={slot.id} value={slot.id}>
                            {dayName.toUpperCase()} {formattedDate} - Ore {slot.time}
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>
              </div>
            </div>
          )}

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
                disabled={hasCut && (!selectedSlotId || availableSlots.length === 0)}
                className={`px-8 py-3 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2 flex-1 md:flex-none shadow-lg ${
                  hasCut && (!selectedSlotId || availableSlots.length === 0)
                    ? "bg-foreground/20 text-foreground/40 cursor-not-allowed shadow-none"
                    : "bg-[#25D366] hover:bg-[#20bd5a] shadow-[#25D366]/20"
                }`}
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
