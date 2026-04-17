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
};

type StoreContextType = {
  cart: CartItem[];
  addToCart: (item: Product) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  
  isAdmin: boolean;
  loginAdmin: (code1: string, code2: string) => boolean;
  logoutAdmin: () => void;

  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  deleteProduct: (id: string) => void;

  slots: CalendarSlot[];
  addSlot: (date: string, time: string) => void;
  toggleSlotAvailability: (id: string) => void;
  deleteSlot: (id: string) => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  // Pre-load state from LocalStorage if available, otherwise defaults
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [slots, setSlots] = useState<CalendarSlot[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from local storage
    const storedCart = localStorage.getItem("salon_cart");
    const storedAdmin = localStorage.getItem("salon_isAdmin");
    const storedProducts = localStorage.getItem("salon_products");
    const storedSlots = localStorage.getItem("salon_slots");

    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedAdmin === "true") setIsAdmin(true);
    
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      // Dummy data se non ci sono dati
      setProducts([
        { id: "1", name: "Taglio Sfumato", description: "Sfumatura a pelle e styling macchinetta", price: 20, image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&h=300", type: "cut" },
        { id: "2", name: "Cera Opaca Premium", description: "Tenuta forte effetto naturale", price: 15, image: "https://images.unsplash.com/photo-1626897505254-e0f811aa9bf7?auto=format&fit=crop&q=80&h=300", type: "product" }
      ]);
    }

    if (storedSlots) {
      setSlots(JSON.parse(storedSlots));
    } else {
      // Dummy slots
      setSlots([
        { id: "1", date: "2026-04-20", time: "10:00", isAvailable: true },
        { id: "2", date: "2026-04-20", time: "11:00", isAvailable: false },
        { id: "3", date: "2026-04-20", time: "16:00", isAvailable: true }
      ]);
    }
    
    setIsLoaded(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {if(isLoaded) localStorage.setItem("salon_cart", JSON.stringify(cart))}, [cart, isLoaded]);
  useEffect(() => {if(isLoaded) localStorage.setItem("salon_isAdmin", isAdmin ? "true" : "false")}, [isAdmin, isLoaded]);
  useEffect(() => {if(isLoaded) localStorage.setItem("salon_products", JSON.stringify(products))}, [products, isLoaded]);
  useEffect(() => {if(isLoaded) localStorage.setItem("salon_slots", JSON.stringify(slots))}, [slots, isLoaded]);

  const loginAdmin = (code1: string, code2: string) => {
    // Harcoded come richiesto
    if (code1 === "ADMIN1" && code2 === "ADMIN2") {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => setIsAdmin(false);

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
  const clearCart = () => setCart([]);

  const addProduct = (product: Omit<Product, "id">) => {
    setProducts(prev => [{ ...product, id: Date.now().toString() }, ...prev]);
  };
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

  const addSlot = (date: string, time: string) => {
    setSlots(prev => [...prev, { id: Date.now().toString(), date, time, isAvailable: true }]);
  };
  const toggleSlotAvailability = (id: string) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, isAvailable: !s.isAvailable } : s));
  };
  const deleteSlot = (id: string) => setSlots(prev => prev.filter(s => s.id !== id));

  return (
    <StoreContext.Provider value={{
      cart, addToCart, removeFromCart, clearCart,
      isAdmin, loginAdmin, logoutAdmin,
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
