import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import LOGO2 from '../assets/LOGO2.png'
import Link from "next/link";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <Link href="/" className="flex items-center gap-2">
  <Image 
    src={LOGO2} 
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
          <p className="mt-6 text-sm">
            Découvrez une sélection soigneusement choisie de produits cosmétiques pour sublimer votre routine beauté.
            Nous croyons en l’harmonie entre qualité, naturel et efficacité. Parce que chaque peau mérite d’être choyée,
            nous vous proposons des soins adaptés à vos besoins, pour une beauté qui vous ressemble.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Entreprise</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline transition" href="#">Accueil</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">A propos</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Contact</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Politique de confidentialté</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Contactez-nous</h2>
            <div className="text-sm space-y-2">
              <p>+216-58021530</p>
              <p>contact@hajicosmetiques.com</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        © 2025 Haji Cosmétiques - Tous droits réservés.
      </p>
    </footer>
  );
};

export default Footer;