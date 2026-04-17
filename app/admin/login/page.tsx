"use client";

import { useState } from "react";
import { useStore } from "@/app/StoreProvider";
import { useRouter } from "next/navigation";
import { ShieldAlert, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const { loginAdmin, isAdmin } = useStore();
  const router = useRouter();
  
  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [error, setError] = useState(false);

  // If already admin, redirect
  if (isAdmin) {
    router.push("/admin/dashboard");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(code1, code2);
    if (success) {
      router.push("/admin/dashboard");
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md p-8 rounded-2xl border border-border shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-primary"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white text-center">Accesso Riservato</h1>
          <p className="text-foreground/50 text-sm mt-2 text-center">Inserisci i due codici di sicurezza forniti dallo sviluppatore per accedere alla gestione del locale.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">
            Codici non validi. Riprova.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">padrone</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
              <input 
                type="password"
                value={code1}
                onChange={e => setCode1(e.target.value)}
                className="w-full bg-background border border-border rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Inserisci il primo codice"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">toria</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
              <input 
                type="password"
                value={code2}
                onChange={e => setCode2(e.target.value)}
                className="w-full bg-background border border-border rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Inserisci il secondo codice"
                required
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-primary hover:from-red-500 hover:to-primary-hover text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-red-500/20 mt-4"
          >
            Accedi come Admin
          </button>
        </form>
      </div>
    </div>
  );
}
