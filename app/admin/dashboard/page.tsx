"use client";

import { useStore, Product, CalendarSlot } from "@/app/StoreProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Plus, Trash2, Calendar as CalIcon, Scissors, Store } from "lucide-react";

export default function AdminDashboard() {
  const { isAdmin, logoutAdmin, products, addProduct, deleteProduct, slots, addSlot, toggleSlotAvailability, deleteSlot } = useStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"cuts" | "shop" | "calendar">("cuts");

  useEffect(() => {
    if (!isAdmin) {
      router.push("/admin/login");
    }
  }, [isAdmin, router]);

  if (!isAdmin) return null;

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto w-full flex flex-col h-full">
      <div className="flex justify-between items-center mb-8 bg-card p-6 rounded-2xl border border-border">
        <div>
          <h1 className="text-3xl font-bold text-white">Pannello di Controllo</h1>
          <p className="text-foreground/60 text-sm">Versione Admin Privata</p>
        </div>
        <button 
          onClick={logoutAdmin}
          className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-lg font-medium hover:bg-red-500/20 transition-colors"
        >
          <LogOut size={18} /> Esci
        </button>
      </div>

      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        <button onClick={() => setActiveTab("cuts")} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold min-w-fit transition-colors ${activeTab === "cuts" ? "bg-primary text-background" : "bg-card border border-border text-foreground/70 hover:text-white"}`}>
          <Scissors size={20} /> Gestione Tagli
        </button>
        <button onClick={() => setActiveTab("shop")} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold min-w-fit transition-colors ${activeTab === "shop" ? "bg-primary text-background" : "bg-card border border-border text-foreground/70 hover:text-white"}`}>
          <Store size={20} /> Gestione Negozio
        </button>
        <button onClick={() => setActiveTab("calendar")} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold min-w-fit transition-colors ${activeTab === "calendar" ? "bg-primary text-background" : "bg-card border border-border text-foreground/70 hover:text-white"}`}>
          <CalIcon size={20} /> Calendario
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 flex-1">
        {activeTab === "cuts" && <ProductManager type="cut" items={products} onAdd={addProduct} onDelete={deleteProduct} />}
        {activeTab === "shop" && <ProductManager type="product" items={products} onAdd={addProduct} onDelete={deleteProduct} />}
        {activeTab === "calendar" && <CalendarManager slots={slots} onAdd={addSlot} onToggle={toggleSlotAvailability} onDelete={deleteSlot} />}
      </div>
    </div>
  );
}

// Composant per gestire i prodotti/tagli
function ProductManager({ type, items, onAdd, onDelete }: { type: "cut"|"product", items: Product[], onAdd: any, onDelete: any }) {
  const filtered = items.filter(i => i.type === type);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ name, description: desc, price: parseFloat(price), image, type });
    setName(""); setDesc(""); setPrice(""); setImage("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-background p-6 rounded-xl border border-border h-fit">
        <h3 className="font-bold text-xl mb-4 text-white">Aggiungi Nuovo {type === "cut" ? "Taglio" : "Prodotto"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-foreground/70">Nome</label>
            <input required type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-foreground/70">Descrizione</label>
            <textarea required value={desc} onChange={e=>setDesc(e.target.value)} className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-white resize-none" rows={3}></textarea>
          </div>
          <div>
            <label className="block text-sm mb-1 text-foreground/70">Prezzo (€)</label>
            <input required type="number" step="0.01" value={price} onChange={e=>setPrice(e.target.value)} className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-foreground/70">URL Immagine</label>
            <input required type="url" value={image} onChange={e=>setImage(e.target.value)} placeholder="https://..." className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-white text-sm" />
          </div>
          <button type="submit" className="w-full bg-primary text-background font-bold px-4 py-3 rounded-md flex items-center justify-center gap-2 hover:bg-primary-hover">
            <Plus size={18} /> Aggiungi
          </button>
        </form>
      </div>

      <div className="lg:col-span-2">
        <h3 className="font-bold text-xl mb-4 text-white">Elementi Correnti</h3>
        {filtered.length === 0 ? (
          <div className="text-center p-10 bg-background rounded-xl border border-border text-foreground/50">Nessun elemento presente.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(item => (
              <div key={item.id} className="bg-background border border-border rounded-lg p-4 flex flex-col gap-3">
                <div className="flex gap-4 items-start">
                  <div className="w-16 h-16 bg-secondary rounded overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white leading-tight">{item.name}</h4>
                    <span className="text-primary font-bold text-sm">€{item.price.toFixed(2)}</span>
                  </div>
                </div>
                <button onClick={() => onDelete(item.id)} className="mt-auto flex items-center justify-center gap-2 w-full py-2 bg-red-500/10 text-red-500 rounded text-sm hover:bg-red-500/20 font-medium">
                  <Trash2 size={16} /> Elimina
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Composant per gestire il calendario
function CalendarManager({ slots, onAdd, onToggle, onDelete }: { slots: CalendarSlot[], onAdd: any, onToggle: any, onDelete: any }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(date, time);
    setTime(""); // keep the date to easily add multiple slots
  };

  const sortedSlots = [...slots].sort((a,b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-background p-6 rounded-xl border border-border h-fit">
        <h3 className="font-bold text-xl mb-4 text-white">Nuova Disponibilità</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-foreground/70">Data</label>
            <input required type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-foreground/70">Ora</label>
            <input required type="time" value={time} onChange={e=>setTime(e.target.value)} className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-white" />
          </div>
          <button type="submit" className="w-full bg-primary text-background font-bold px-4 py-3 rounded-md flex items-center justify-center gap-2 hover:bg-primary-hover">
            <Plus size={18} /> Aggiungi Slot
          </button>
        </form>
      </div>

      <div className="lg:col-span-2">
        <h3 className="font-bold text-xl mb-4 text-white">Slot Caricati</h3>
        {sortedSlots.length === 0 ? (
           <div className="text-center p-10 bg-background rounded-xl border border-border text-foreground/50">Nessun orario presente.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedSlots.map(slot => (
              <div key={slot.id} className={`border rounded-lg p-4 flex justify-between items-center transition-colors ${slot.isAvailable ? 'bg-background border-primary/30' : 'bg-red-950/20 border-red-900/30'}`}>
                <div>
                  <div className="font-bold text-white text-lg">{new Date(slot.date).toLocaleDateString('it-IT')}</div>
                  <div className="font-mono text-primary">{slot.time} - {slot.isAvailable ? 'Libero' : 'Occupato'}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onToggle(slot.id)} className="px-3 py-2 bg-secondary rounded text-sm hover:text-white" title="Cambia Stato">
                    {slot.isAvailable ? 'Blocca' : 'Sblocca'}
                  </button>
                  <button onClick={() => onDelete(slot.id)} className="px-3 py-2 bg-red-500/10 text-red-500 rounded text-sm hover:bg-red-500/20" title="Elimina">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
