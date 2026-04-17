"use client";

import { useStore } from "@/app/StoreProvider";
import { Calendar as CalendarIcon, Clock, CheckCircle, Smartphone, Filter, Scissors } from "lucide-react";
import { useState, useEffect } from "react";

export default function CalendarPage() {
  const { slots, products } = useStore();
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedCutId, setSelectedCutId] = useState<string>("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const cuts = products.filter(p => p.type === "cut");

  const now = new Date();
  const availableSlots = slots
    .filter(s => {
      const slotDateTime = new Date(`${s.date}T${s.time}`);
      return s.isAvailable && slotDateTime > now;
    })
    .sort((a, b) => {
      return new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime();
    });

  const filteredSlots = selectedDate 
    ? availableSlots.filter(s => s.date === selectedDate)
    : availableSlots;

  const handleBooking = (date: string, time: string) => {
    if (!selectedCutId) return; // Disattiva premo se nessun taglio
    
    const cut = cuts.find(c => c.id === selectedCutId);
    const cutName = cut ? cut.name : "Servizio Generico";

    const text = `Ciao! Vorrei prenotare il servizio *"${cutName}"* per il giorno ${date} alle ore ${time}. Esiste ancora disponibilità?`;
    window.open(`https://api.whatsapp.com/send/?phone=393249070366&text=${encodeURIComponent(text)}`, "_blank");
  };

  if (!mounted) return null;

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-4">Prenota un Appuntamento</h1>
        <p className="text-foreground/70 max-w-2xl mx-auto mb-8">
          Cerca uno slot orario libero nel nostro calendario e inviaci una richiesta rapida tramite WhatsApp per bloccare il tuo posto.
        </p>

        <div className="bg-card w-full max-w-2xl mx-auto p-4 rounded-xl border border-border shadow-md flex flex-col md:flex-row gap-4">
          
          <div className="flex-1 flex items-center gap-3 bg-background p-3 rounded-lg border border-border">
            <Scissors className="text-primary flex-shrink-0" size={20} />
            <div className="w-full text-left">
              <label className="block text-xs font-medium text-foreground/50 mb-1 uppercase tracking-wider">Quale taglio desideri?</label>
              <select 
                value={selectedCutId}
                onChange={(e) => setSelectedCutId(e.target.value)}
                className="w-full bg-transparent text-white font-bold focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="" disabled className="bg-card text-foreground">-- Seleziona il Servizio --</option>
                {cuts.map(cut => (
                  <option key={cut.id} value={cut.id} className="bg-card text-white">{cut.name} (€{(cut.price ?? 0).toFixed(2)})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 flex items-center gap-3 bg-background p-3 rounded-lg border border-border">
            <Filter className="text-primary flex-shrink-0" size={20} />
            <div className="w-full text-left">
              <label className="block text-xs font-medium text-foreground/50 mb-1 uppercase tracking-wider">Filtra per Data (Opzionale)</label>
              <input 
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-transparent text-white font-bold focus:outline-none focus:border-primary transition-colors cursor-pointer"
              />
            </div>
            {selectedDate && (
               <button onClick={() => setSelectedDate("")} className="text-sm text-red-400 hover:text-red-300 transition-colors ml-2 font-bold">X</button>
            )}
          </div>
        </div>
        
        {!selectedCutId && (
          <p className="mt-4 text-primary font-bold text-sm animate-pulse">Devi prima selezionare un servizio dal menu qui sopra per poter richiedere l'appuntamento!</p>
        )}
      </div>

      {filteredSlots.length === 0 ? (
        <div className="bg-card border border-border p-12 text-center rounded-2xl">
          <CalendarIcon size={48} className="mx-auto text-foreground/30 mb-4" />
          <h2 className="text-xl font-bold mb-2">
            {selectedDate ? "Nessun orario per la data selezionata" : "Nessun orario disponibile al momento"}
          </h2>
          <p className="text-foreground/60">
            {selectedDate 
              ? "Prova a cercare in un altro giorno o elimina il filtro." 
              : "Il parrucchiere è momentaneamente pieno o non ha ancora caricato nuove disponibilità. Riprova più tardi."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSlots.map((slot) => {
             // Formattazione basica della data
             const dateObj = new Date(slot.date);
             const dayName = dateObj.toLocaleDateString('it-IT', { weekday: 'long' });
             const formattedDate = dateObj.toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });

             return (
               <div key={slot.id} className="bg-card border border-primary/20 p-6 rounded-2xl hover:border-primary/60 transition-all group flex flex-col items-center">
                 <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                   <Clock size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-white capitalize">{dayName}</h3>
                 <p className="text-foreground/60 text-sm mb-4">{formattedDate}</p>
                 <div className="bg-background px-4 py-2 rounded-lg font-mono font-bold text-lg text-primary border border-border mb-6">
                   {slot.time}
                 </div>
                 <button 
                   onClick={() => handleBooking(formattedDate, slot.time)}
                   className="w-full flex items-center justify-center gap-2 bg-primary text-background py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
                 >
                   <Smartphone size={18} /> Richiedi su WhatsApp
                 </button>
               </div>
             )
          })}
        </div>
      )}
    </div>
  );
}
