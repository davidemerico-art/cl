"use client";

import { useStore, Product } from "@/app/StoreProvider";
import { ShoppingCart, Plus } from "lucide-react";
import { useState } from "react";

export default function ShopPage() {
  const { products, addToCart } = useStore();
  const [filter, setFilter] = useState<"all" | "product" | "cut">("all");

  const filteredProducts = products.filter(p => filter === "all" || p.type === filter);

  const handleAdd = (product: Product) => {
    addToCart(product);
  };

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2">Shop & Lavori</h1>
          <p className="text-foreground/70">Esplora i nostri stili o acquista i prodotti usati in salone.</p>
        </div>
        
        <div className="flex bg-secondary p-1 rounded-lg mt-6 md:mt-0">
          <button 
            onClick={() => setFilter("all")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === "all" ? "bg-primary text-background" : "hover:text-primary"}`}
          >
            Tutto
          </button>
          <button 
            onClick={() => setFilter("cut")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === "cut" ? "bg-primary text-background" : "hover:text-primary"}`}
          >
            Tagli
          </button>
          <button 
            onClick={() => setFilter("product")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === "product" ? "bg-primary text-background" : "hover:text-primary"}`}
          >
            Prodotti
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border">
          <p className="text-foreground/50">Nessun elemento presente al momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-card rounded-xl border border-border hover:border-primary/50 transition-all overflow-hidden flex flex-col group">
              <div className="relative h-48 w-full overflow-hidden bg-secondary">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-foreground/30">Nessuna immagine</div>
                )}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded border border-white/10 uppercase tracking-widest">
                  {product.type === "cut" ? "Stile" : "Prodotto"}
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-white leading-tight">{product.name}</h3>
                  <span className="font-bold text-primary whitespace-nowrap ml-3">€{(product.price ?? 0).toFixed(2)}</span>
                </div>
                <p className="text-foreground/60 text-sm flex-1">{product.description}</p>
                
                <button 
                  onClick={() => handleAdd(product)}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-secondary border border-border hover:border-primary text-white py-2 rounded-lg font-medium transition-colors hover:text-primary group-hover:bg-primary/10"
                >
                  <Plus size={16} /> Aggiungi
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
