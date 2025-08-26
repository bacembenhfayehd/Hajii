import React from "react";
import parfum from '../assets/parfum.jpg'
import mascara from '../assets/mascara.jpg'
import teint from '../assets/kkk.jpg'
import Image from "next/image";
import { assets } from "@/assets/assets";

const products = [
  {
    id: 1,
    image: parfum,
    title: "L'Art olfactif ultime",
    description: "Compositions parfumées d'exception.",
  },
  {
    id: 2,
    image: mascara,
    title: "Cils d'enfer, instantané",
    description: "Volume radical, allonge spectaculaire – sans compromis.",
  },
  {
    id: 3,
    image: teint,
    title: "Rituel luxueux",
    description: "Le soin qui devient obsession.",
  },
];

const FeaturedProduct = () => {
  return (
    <div className="mt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Sélection Exclusive</p>
        <div className="w-28 h-0.5 bg-green-600 mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
        {products.map(({ id, image, title, description }) => (
          <div key={id} className="relative group">
            <Image
              src={image}
              alt={title}
              className="group-hover:brightness-75 transition duration-300 w-full h-auto object-cover"
            />
            <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2">
              <p className="font-medium text-xl lg:text-2xl">{title}</p>
              <p className="text-sm lg:text-base leading-5 max-w-60">
                {description}
              </p>
              <button className="flex items-center gap-1.5 bg-green-600 px-4 py-2 rounded">
                Acheter <Image className="h-3 w-3" src={assets.redirect_icon} alt="Redirect Icon" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;
