"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: "product" | "cut";
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: "product" | "cut";
};

export type CalendarSlot = {
  id: string;
  date: string;
  time: string;
  isAvailable: boolean;
  blockedName?: string | null;
};

type StoreContextType = {
  cart: CartItem[];
  addToCart: (item: Product) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  isAdmin: boolean;
  loginAdmin: (code1: string, code2: string) => boolean;
  logoutAdmin: () => void;
  updateAdminCodes: (newCode1: string, newCode2: string) => void;

  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  deleteProduct: (id: string) => void;

  slots: CalendarSlot[];
  addSlot: (date: string, time: string) => void;
  toggleSlotAvailability: (id: string, name?: string | null) => void;
  deleteSlot: (id: string) => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCode1, setAdminCode1] = useState("lorenzo");
  const [adminCode2, setAdminCode2] = useState("davide");
  const [products, setProducts] = useState<Product[]>([]);
  const [slots, setSlots] = useState<CalendarSlot[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Inizializzazione dati da Database e LocalStorage (per il carrello)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch prodotti
        const resProd = await fetch("/api/products");
        const dataProd = await resProd.json();
        if (Array.isArray(dataProd)) {
          setProducts(dataProd.map((p: any) => ({ ...p, price: Number(p.price || 0) })));
        }

        // Fetch slot calendario
        const resSlots = await fetch("/api/slots");
        const dataSlots = await resSlots.json();
        if (Array.isArray(dataSlots)) setSlots(dataSlots);

        // Fetch impostazioni admin
        const resSettings = await fetch("/api/settings");
        const dataSettings = await resSettings.json();
        if (dataSettings.code1) setAdminCode1(dataSettings.code1);
        if (dataSettings.code2) setAdminCode2(dataSettings.code2);

        // Carrello rimane su LocalStorage (sessione utente)
        const storedCart = localStorage.getItem("salon_cart");
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          if (Array.isArray(parsedCart)) {
            setCart(parsedCart.map((item: any) => ({ ...item, price: Number(item.price || 0) })));
          }
        }

        // Stato Admin (se era già loggato in questa sessione)
        const storedAdmin = localStorage.getItem("salon_isAdmin");
        if (storedAdmin === "true") setIsAdmin(true);

        setIsLoaded(true);
      } catch (err) {
        console.error("Errore caricamento dati iniziali:", err);
        setIsLoaded(true);
      }
    };

    fetchData();
  }, []);

  // Sync Cart to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("salon_cart", JSON.stringify(cart));
      localStorage.setItem("salon_isAdmin", isAdmin ? "true" : "false");
    }
  }, [cart, isAdmin, isLoaded]);

  const loginAdmin = (code1: string, code2: string) => {
    if (code1 === adminCode1 && code2 === adminCode2) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => setIsAdmin(false);

  const updateAdminCodes = async (newCode1: string, newCode2: string) => {
    try {
      await fetch("/api/settings", {
        method: "POST",
        body: JSON.stringify({ code1: newCode1, code2: newCode2 })
      });
      setAdminCode1(newCode1);
      setAdminCode2(newCode2);
    } catch (err) {
      console.error("Errore update codici:", err);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, type: product.type, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
  
  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const addProduct = async (productData: Omit<Product, "id">) => {
    const newProduct = { ...productData, id: Date.now().toString() };
    try {
      await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify(newProduct)
      });
      setProducts(prev => [newProduct, ...prev]);
    } catch (err) {
      console.error("Errore aggiunta prodotto:", err);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await fetch("/api/products", {
        method: "DELETE",
        body: JSON.stringify({ id })
      });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Errore delete prodotto:", err);
    }
  };

  const addSlot = async (date: string, time: string) => {
    const newSlot = { id: Date.now().toString(), date, time, isAvailable: true };
    try {
      await fetch("/api/slots", {
        method: "POST",
        body: JSON.stringify(newSlot)
      });
      setSlots(prev => [...prev, newSlot]);
    } catch (err) {
      console.error("Errore aggiunta slot:", err);
    }
  };

  const toggleSlotAvailability = async (id: string, name: string | null = null) => {
    try {
      await fetch("/api/slots", {
        method: "PATCH",
        body: JSON.stringify({ id, blockedName: name })
      });
      setSlots(prev => prev.map(s => {
        if (s.id === id) {
          // Se name è null, stiamo sbloccando -> isAvailable = true
          // Se name ha valore, stiamo bloccando -> isAvailable = false
          const isAvailable = name === null ? true : false;
          return { ...s, isAvailable, blockedName: name };
        }
        return s;
      }));
    } catch (err) {
      console.error("Errore toggle slot:", err);
    }
  };

  const deleteSlot = async (id: string) => {
    try {
      await fetch("/api/slots", {
        method: "DELETE",
        body: JSON.stringify({ id })
      });
      setSlots(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error("Errore delete slot:", err);
    }
  };

  return (
    <StoreContext.Provider value={{
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
      isAdmin, loginAdmin, logoutAdmin, updateAdminCodes,
      products, addProduct, deleteProduct,
      slots, addSlot, toggleSlotAvailability, deleteSlot
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
