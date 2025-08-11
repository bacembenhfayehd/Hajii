"use client"
import React from "react";

import Link from "next/link"


const Navbar = () => {


  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Link href='/'><h1 className="text-2xl"><span className="text-orange-600 font-bold">Ha</span>ji cosmétiques</h1></Link>
      <button className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm">logout</button>
    </nav>
  );
};

export default Navbar;