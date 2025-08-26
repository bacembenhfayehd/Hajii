"use client"
import React from "react";
import LOGO1 from '../assets/LOGO1.png'
import Image from "next/image";


const Navbar = () => {


  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <div className="flex items-center gap-2">
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

      </div>
      
      <button className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm">logout</button>
    </nav>
  );
};

export default Navbar;