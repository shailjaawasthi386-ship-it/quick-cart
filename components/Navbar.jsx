"use client"
import React from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";

const Navbar = () => {
  const { router, getCartCount } = useAppContext();
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();
  const cartCount = getCartCount();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md flex items-center justify-between px-4 md:px-12 lg:px-24 py-3 border-b border-emerald-100 shadow-sm text-gray-700">
      {/* Brand Logo */}
      <Image
        className="cursor-pointer w-28 md:w-32 h-auto"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
      />

      {/* Nav Links */}
      <div className="flex items-center gap-4 lg:gap-6 max-md:hidden text-sm font-semibold">
        <Link href="/" className="hover:text-emerald-600 transition">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-emerald-600 transition">
          All Products
        </Link>
        {isSignedIn && (
          <Link href="/my-orders" className="hover:text-emerald-600 transition">
            My Orders
          </Link>
        )}
      </div>

      {/* Cart & Account */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.push('/cart')}
          className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full font-bold text-xs shadow-md transition"
        >
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="bg-amber-400 text-emerald-950 text-[11px] font-extrabold px-1.5 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </button>

        {isSignedIn ? (
          <div className="flex items-center gap-2">
            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <button 
            onClick={() => openSignIn()}
            className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-bold border border-emerald-300 px-4 py-2 rounded-full text-xs hover:bg-emerald-100 transition shadow-sm"
          >
            <Image src={assets.user_icon} alt="user icon" className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;