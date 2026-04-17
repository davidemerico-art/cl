"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "./StoreProvider";
import { Scissors, ShoppingBag, ArrowRight } from "lucide-react";

export default function Home() {
  const { products } = useStore();
  
  // Filtriamo solo i tagli ("cut") per la Home
  const cuts = products.filter(p => p.type === "cut").slice(0, 3); // Mostriamo max 3 in home

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/imagine negozio.png" 
            alt="Salone Sfondo" 
            fill
            className="object-cover opacity-30 object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <div className="w-24 h-24 mb-6 rounded-full overflow-hidden border-2 border-primary shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <Image 
              src="/imagine negozio.png" 
              alt="Icona Salone" 
              width={96}
              height={96}
              className="object-cover"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-4 drop-shadow-xl tracking-tight">
            Il Tuo Stile. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-hover">La Nostra Arte.</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl font-light">
            Entra in una dimensione dove eleganza e professionalità si incontrano. 
            Scopri i nostri ultimi tagli, acquista i migliori prodotti e prenota il tuo momento di relax.
          </p>
          <div className="flex gap-4">
            <Link href="/calendar" className="px-8 py-4 bg-primary text-background font-bold rounded-lg hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-primary/20 flex items-center gap-2">
              <Scissors size={20} /> Prenota Ora
            </Link>
            <Link href="/shop" className="px-8 py-4 bg-secondary text-foreground font-bold rounded-lg border border-border hover:border-primary transition-all duration-300 flex items-center gap-2">
              <ShoppingBag size={20} /> Entra nello Shop
            </Link>
          </div>
        </div>
      </section>

      {/* RECENT WORK SECTION */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 inline-block mb-2">Ultimi Lavori</h2>
            <p className="text-foreground/60">I tagli e le sfumature più richieste del momento.</p>
          </div>
          <Link href="/shop" className="text-primary hover:text-white transition-colors flex items-center gap-1 font-medium group">
            Vedi tutti <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {cuts.length === 0 ? (
          <div className="text-center py-10 bg-card rounded-2xl border border-border">
            <p className="text-foreground/50">Ancora nessun lavoro caricato. L'admin posterà presto nuovi stili!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cuts.map(cut => (
              <div key={cut.id} className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-colors">
                <div className="relative h-64 w-full overflow-hidden">
                  <img 
                    src={cut.image} 
                    alt={cut.name} 
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent"></div>
                </div>
                <div className="p-6 relative">
                  <div className="absolute -top-6 right-6 bg-primary text-background font-bold px-4 py-2 rounded-full shadow-lg">
                    €{(cut.price ?? 0).toFixed(2)}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{cut.name}</h3>
                  <p className="text-foreground/70 text-sm line-clamp-2">{cut.description}</p>
                  <Link href={`/shop`} className="mt-4 inline-flex text-primary text-sm font-semibold hover:underline">
                    Richiedi questo stile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
