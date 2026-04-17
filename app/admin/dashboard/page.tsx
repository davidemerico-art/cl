"use client";

import { useStore, Product, CalendarSlot } from "@/app/StoreProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Plus, Trash2, Calendar as CalIcon, Scissors, Store, Settings, Search, X } from "lucide-react";

export default function AdminDashboard() {
  const { isAdmin, logoutAdmin, products, addProduct, deleteProduct, slots, addSlot, toggleSlotAvailability, deleteSlot, updateAdminCodes } = useStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"cuts" | "shop" | "calendar" | "settings">("cuts");

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
        <button onClick={() => setActiveTab("settings")} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold min-w-fit transition-colors ${activeTab === "settings" ? "bg-primary text-background" : "bg-card border border-border text-foreground/70 hover:text-white"}`}>
          <Settings size={20} /> Impostazioni
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 flex-1">
        {activeTab === "cuts" && <ProductManager type="cut" items={products} onAdd={addProduct} onDelete={deleteProduct} />}
        {activeTab === "shop" && <ProductManager type="product" items={products} onAdd={addProduct} onDelete={deleteProduct} />}
        {activeTab === "calendar" && <CalendarManager slots={slots} onAdd={addSlot} onToggle={toggleSlotAvailability} onDelete={deleteSlot} />}
        {activeTab === "settings" && <SettingsManager onUpdateCodes={updateAdminCodes} />}
      </div>
    </div>
  );
}

// Composant per gestire i prodotti/tagli
// Componente per gestire i prodotti/tagli
function ProductManager({ type, items, onAdd, onDelete }: { type: "cut"|"product", items: Product[], onAdd: any, onDelete: any }) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filtered = items.filter(i => {
    const matchesType = i.type === type;
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         i.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(""); // Questo conterrà l'URL o il Base64 finale
  const [uploadType, setUploadType] = useState<"url" | "file">("url");

  // Funzione helper per convertire il file in stringa Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string); // Salva il contenuto del file come stringa
      };
      reader.readAsDataURL(file);
    }
  };

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

          {/* Selettore tipo caricamento immagine */}
          <div className="flex gap-4 p-1 bg-secondary rounded-md border border-border">
            <button 
              type="button" 
              onClick={() => { setUploadType("url"); setImage(""); }}
              className={`flex-1 py-1 text-xs rounded ${uploadType === "url" ? "bg-primary text-background font-bold" : "text-foreground/60"}`}
            >
              URL Web
            </button>
            <button 
              type="button" 
              onClick={() => { setUploadType("file"); setImage(""); }}
              className={`flex-1 py-1 text-xs rounded ${uploadType === "file" ? "bg-primary text-background font-bold" : "text-foreground/60"}`}
            >
              Carica File
            </button>
          </div>

          <div>
            <label className="block text-sm mb-1 text-foreground/70">Immagine</label>
            {uploadType === "url" ? (
              <input 
                required 
                type="url" 
                value={image} 
                onChange={e=>setImage(e.target.value)} 
                placeholder="https://..." 
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-white text-sm" 
              />
            ) : (
              <div className="space-y-2">
                <input 
                  required={!image}
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="w-full text-sm text-foreground/60 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-background hover:file:opacity-80"
                />
                {image && <p className="text-[10px] text-green-400">File caricato con successo!</p>}
              </div>
            )}
          </div>

          <button type="submit" className="w-full bg-primary text-background font-bold px-4 py-3 rounded-md flex items-center justify-center gap-2 hover:bg-primary-hover">
            <Plus size={18} /> Aggiungi
          </button>
        </form>
      </div>

      <div className="lg:col-span-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h3 className="font-bold text-xl text-white">Elementi Correnti</h3>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
            <input 
              type="text"
              placeholder="Cerca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-9 pr-8 py-2 text-white focus:outline-none focus:border-primary transition-colors text-xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center p-10 bg-background rounded-xl border border-border text-foreground/50">
            {searchQuery ? `Nessun risultato per "${searchQuery}"` : "Nessun elemento presente."}
          </div>
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
                    <span className="text-primary font-bold text-sm">€{(item.price ?? 0).toFixed(2)}</span>
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

// Composant per gestire le impostazioni admin (cambio password con OTP simulato)
function SettingsManager({ onUpdateCodes }: { onUpdateCodes: (new1: string, new2: string) => void }) {
  const [step, setStep] = useState<"phone" | "otp" | "change">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  
  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulazione controllo che sia il numero autorizzato del proprietario
    if (phone.includes("3249070366")) {
      setErrorMsg("");
      setStep("otp");
    } else {
      setErrorMsg("Numero non autorizzato. Inserisci il numero corretto del proprietario.");
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === "1234") {
      setErrorMsg("");
      setStep("change");
    } else {
      setErrorMsg("Codice OTP errato. Riprova.");
    }
  };

  const handlePassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCodes(code1, code2);
    setSaved(true);
    setCode1("");
    setCode2("");
    setTimeout(() => {
      setSaved(false);
      setStep("phone");
      setPhone("");
      setOtp("");
    }, 3000);
  };

  return (
    <div className="max-w-md mx-auto bg-background p-8 rounded-xl border border-border">
      <h3 className="font-bold text-2xl mb-2 text-white">Sicurezza Account</h3>
      
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-500 rounded-lg text-sm font-medium">
          {errorMsg}
        </div>
      )}

      {step === "phone" && (
        <>
          <p className="text-sm text-foreground/60 mb-6">Per cambiare i codici di accesso, dobbiamo prima verificare la tua identità. Inserisci il tuo numero di telefono.</p>
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-foreground/70">Numero di telefono Proprietario</label>
              <input required type="text" placeholder="+39 324..." value={phone} onChange={e=>setPhone(e.target.value)} className="w-full bg-secondary border border-border rounded-md px-4 py-3 text-white" />
            </div>
            <button type="submit" className="w-full bg-primary text-background font-bold px-4 py-3 rounded-md flex items-center justify-center gap-2 hover:bg-primary-hover mt-4">
              Richiedi OTP su WhatsApp
            </button>
          </form>
        </>
      )}

      {step === "otp" && (
        <>
           <p className="text-sm text-foreground/60 mb-2">Abbiamo inviato un messaggio WhatsApp di sicurezza al tuo numero.</p>
           <p className="text-xs text-primary mb-6">Nota (versione prototipo senza server): Usa il codice standard <b>1234</b>.</p>
           
           <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-foreground/70">Pin Sicurezza a 4 cifre</label>
              <input required type="text" maxLength={4} placeholder="E.g. 1234" value={otp} onChange={e=>setOtp(e.target.value)} className="w-full bg-secondary border border-border rounded-md px-4 py-3 text-white tracking-widest text-center text-xl font-mono" />
            </div>
            <button type="submit" className="w-full bg-primary text-background font-bold px-4 py-3 rounded-md flex items-center justify-center gap-2 hover:bg-primary-hover mt-4">
              Verifica
            </button>
          </form>
        </>
      )}

      {step === "change" && (
        <>
          <p className="text-sm text-green-400 mb-6">Identità confermata! Puoi impostare i nuovi codici.</p>
          {saved && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg text-sm font-medium">
              Codici aggiornati con successo!
            </div>
          )}

          <form onSubmit={handlePassSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-foreground/70">Nuovo Codice 1</label>
              <input required type="text" value={code1} onChange={e=>setCode1(e.target.value)} className="w-full bg-secondary border border-border rounded-md px-4 py-3 text-white" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-foreground/70">Nuovo Codice 2</label>
              <input required type="text" value={code2} onChange={e=>setCode2(e.target.value)} className="w-full bg-secondary border border-border rounded-md px-4 py-3 text-white" />
            </div>
            <button type="submit" className="w-full bg-green-500 text-white font-bold px-4 py-3 rounded-md flex items-center justify-center gap-2 hover:bg-green-600 mt-4 shadow-lg shadow-green-500/20">
              Salva e Blocca
            </button>
          </form>
        </>
      )}
    </div>
  );
}
