"use client";

import { useStore } from "@/app/StoreProvider";
import { Calendar as CalendarIcon, Clock, CheckCircle, Smartphone } from "lucide-react";
import { useState, useEffect } from "react";

export default function CalendarPage() {
  const { slots } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const availableSlots = slots.filter(s => s.isAvailable).sort((a, b) => {
    return new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime();
  });

  const handleBooking = (date: string, time: string) => {
    const phoneNumber = "39324907366";
    const text = `Ciao! Vorrei prenotare un appuntamento per il giorno ${date} alle ore ${time}. Esiste ancora disponibilità?`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (!mounted) return null;

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-4">Prenota un Appuntamento</h1>
        <p className="text-foreground/70 max-w-2xl mx-auto">
          Cerca uno slot orario libero nel nostro calendario e inviaci una richiesta rapida tramite WhatsApp per bloccare il tuo posto.
        </p>
      </div>

      {availableSlots.length === 0 ? (
        <div className="bg-card border border-border p-12 text-center rounded-2xl">
          <CalendarIcon size={48} className="mx-auto text-foreground/30 mb-4" />
          <h2 className="text-xl font-bold mb-2">Nessun orario disponibile al momento</h2>
          <p className="text-foreground/60">Il parrucchiere è momentaneamente pieno o non ha ancora caricato nuove disponibilità. Riprova più tardi.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableSlots.map((slot) => {
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
