"use client";
import React, { useContext, useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { AppContext } from "@/context/AppContext";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import LOGO1 from '../assets/LOGO1.png'
import LOGO2 from '../assets/LOGO2.png'
import ModernSearchOverlay from "./ModernSearchOverlay";
import AboutModal from "./AboutModal";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const { cartCount, refreshCart } = useContext(AppContext);

  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem("auth-token");
      const userData = localStorage.getItem("user");

      setIsLoggedIn(!!(token && token !== "undefined"));

      if (userData && userData !== "undefined") {
        try {
          setUser(JSON.parse(userData));
        } catch {
          setUser(null);
          localStorage.removeItem("user");
        }
      } else {
        setUser(null);
      }
    };

    // Charger au montage
    loadUser();

    // 🔄 Recharger quand "storage" est dispatché
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);
  useEffect(() => {
    if (isLoggedIn) {
      refreshCart();
    }
  }, [isLoggedIn, refreshCart]);
  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      // Appel API logout pour supprimer le refreshToken du serveur et du cookie
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        credentials: "include", // Important pour envoyer les cookies
        body: JSON.stringify({ userId: user.id }),
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      // Nettoyer seulement le localStorage (les cookies sont gérés par le serveur)
      localStorage.removeItem("auth-token");
      localStorage.removeItem("user");

      setIsLoggedIn(false);
      setUser(null);
      window.location.href = "/";
    }
  };

  const handleAuthAction = (e) => {
    if (isLoggedIn) {
      handleLogout(e);
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
     <Link href="/" className="flex items-center gap-2">
  <Image 
    src={LOGO1} 
    width={50} 
    height={50} 
    alt="Logo Haji cosmétiques"
    className="rounded-full shadow-sm"
  />
  <h1 className="text-xl font-semibold tracking-wide">
    <span className="text-green-700">Haji</span>
    <span className="text-gray-800"> cosmétiques</span>
  </h1>
</Link>
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Accueil
        </Link>
        <Link href="all-products" className="hover:text-gray-900 transition">
          Boutique
        </Link>
        <AboutModal />
        <Link href="/contact" className="hover:text-gray-900 transition">
          Contact
        </Link>

        {/*{isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Seller Dashboard</button>}*/}
      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        <ModernSearchOverlay/>
        {isLoggedIn &&  <Link href='/profile'><Image src={assets.user_icon} alt="user icon" /></Link>}
        <Link
          href={isLoggedIn ? "#" : "/auth"}
          onClick={handleAuthAction}
          className="flex items-center gap-2 hover:text-gray-900 transition"
        >
          {isLoggedIn
            ? `Déconnexion ${user?.name ? ` (${user.name})` : ""}`
            : "Connexion"}
        </Link>
        <Link href="/cart">
            <div className="relative cursor-pointer group">
              <ShoppingCart className="w-5 h-5 transition-colors group-hover:text-green-700" />
              <div className="absolute -top-2 -right-2 min-w-[20px] h-[20px] flex items-center justify-center rounded-full text-xs font-semibold bg-green-700 text-white border-2 border-white shadow-lg transform transition-transform group-hover:scale-110">
                {cartCount}
              </div>
            </div>
        </Link>
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {/*{isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Seller Dashboard</button>}*/}

        <button className="flex items-center gap-2 hover:text-gray-900 transition">
          <Image src={assets.user_icon} alt="user icon" />
          {isLoggedIn ? "déconnexion" : "connexion"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
