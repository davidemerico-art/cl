"use client";

import Link from "next/link";
import { useStore } from "@/app/StoreProvider";
import { ShoppingCart, Calendar, Scissors, Store, Shield } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const { cart, isAdmin } = useStore();
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-secondary/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <Link href="/" className="flex items-center gap-3 group">
            <Image 
              src="/imagine negozio.png" 
              alt="Logo Negozio" 
              width={40} 
              height={40} 
              className="rounded-full shadow-lg shadow-primary/20 group-hover:shadow-primary/50 transition-all duration-300"
            />
            <span className="font-bold text-xl tracking-wider text-foreground group-hover:text-primary transition-colors">SALON LOUNGE</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link href="/shop" className="text-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium">
              <Store size={18} /> <span className="hidden md:inline">Shop & Tagli</span>
            </Link>
            
            <Link href="/calendar" className="text-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium">
              <Calendar size={18} /> <span className="hidden md:inline">Appuntamenti</span>
            </Link>

            <Link href="/cart" className="relative text-foreground hover:text-primary transition-colors flex items-center p-2 rounded-full hover:bg-border">
              <ShoppingCart size={22} />
              {totalCartItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-background bg-primary rounded-full transform translate-x-1/4 -translate-y-1/4">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {isAdmin && (
              <Link href="/admin/dashboard" className="text-primary hover:text-primary-hover transition-colors flex items-center gap-2 text-sm font-medium bg-primary/10 px-3 py-1.5 rounded-md">
                <Shield size={18} /> <span className="hidden md:inline">Admin</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
