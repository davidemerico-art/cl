"use client";

import { Product } from "@/app/StoreProvider";
import { X, ShoppingBag, Plus, Minus, Check } from "lucide-react";
import { useState, useEffect } from "react";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [added, setAdded] = useState(false);

  // Gestione chiusura con animazione
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const handleAddToCart = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Chiudi con il tasto ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${isClosing ? "opacity-0" : "opacity-100"}`}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div 
        className={`relative bg-card border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col md:flex-row transition-all duration-300 ${isClosing ? "scale-95 translate-y-4" : "scale-100 translate-y-0"}`}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-white/10 text-white rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-secondary overflow-hidden">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-foreground/20 italic">
              Nessuna immagine disponibile
            </div>
          )}
          <div className="absolute top-4 left-4">
             <span className="bg-primary text-background text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-sm shadow-lg">
                {product.type === "cut" ? "Stile / Taglio" : "Prodotto Salon"}
             </span>
          </div>
        </div>

        {/* Right Side: Info */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-white mb-2 leading-tight">{product.name}</h2>
            <div className="text-2xl font-bold text-primary">
              €{(product.price ?? 0).toFixed(2)}
            </div>
          </div>

          <div className="flex-1">
            <h4 className="text-xs uppercase tracking-widest text-foreground/40 font-bold mb-3">Descrizione</h4>
            <p className="text-foreground/70 leading-relaxed whitespace-pre-line text-lg">
              {product.description || "Nessuna descrizione disponibile per questo articolo."}
            </p>
          </div>

          <div className="mt-10 pt-6 border-t border-border">
            <button 
              onClick={handleAddToCart}
              disabled={added}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] ${
                added 
                ? "bg-green-600 text-white" 
                : "bg-primary text-background hover:bg-primary-hover shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              }`}
            >
              {added ? (
                <>
                  <Check size={20} /> Aggiunto con successo!
                </>
              ) : (
                <>
                  <ShoppingBag size={20} /> Aggiungi al Carrello
                </>
              )}
            </button>
            <p className="text-center text-xs text-foreground/30 mt-4">
              Pagamento sicuro al momento del servizio o della consegna.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
