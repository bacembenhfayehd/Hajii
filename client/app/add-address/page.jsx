"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import Link from "next/link";
import toast from "react-hot-toast";
import hello from '@/assets/1746348384818-Photoroom.png'

const AddAddress = () => {
  const { address, isSubmitted, setAddress, setIsSubmitted } =
    useContext(AppContext);
  const onSubmitHandler = () => {
    // Vérifier si un des 3 champs est vide
    if (!address.city || !address.street || !address.postalCode) {
      toast.error("Merci de remplir tous les champs obligatoires");
      return; // ne pas soumettre
    }

    setIsSubmitted(true);
    toast.success("Adresse enregistrée avec succès !");
  };

  const onEditHandler = () => {
    setIsSubmitted(false);
  };

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between">
        <form className="w-full">
          <p className="text-2xl md:text-3xl text-gray-500">
            Ajouter l'adresse de{" "}
            <span className="font-semibold text-green-600">livraison</span>
          </p>
          <div className="space-y-3 max-w-sm mt-10">
            <input
              className="px-2 py-2.5 focus:border-green-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
              type="text"
              placeholder="Gouvernorat"
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              value={address.city}
              disabled={isSubmitted}
            />
            <input
              className="px-2 py-2.5 focus:border-green-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
              type="text"
              placeholder="Rue"
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
              value={address.street}
              disabled={isSubmitted}
            />
            <input
              className="px-2 py-2.5 focus:border-green-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
              type="text"
              placeholder="Code postal"
              onChange={(e) =>
                setAddress({ ...address, postalCode: e.target.value })
              }
              value={address.postalCode}
              disabled={isSubmitted}
            />
            <input
              className="px-2 py-2.5 focus:border-green-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
              type="text"
              placeholder="Téléphone"
              onChange={(e) =>
                setAddress({ ...address, phone: e.target.value })
              }
              value={address.phone}
              disabled={isSubmitted}
            />
            <textarea
              className="px-2 py-2.5 focus:border-green-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500 resize-none"
              type="text"
              rows={4}
              placeholder="Notes (Avis et commentaires)"
              onChange={(e) =>
                setAddress({ ...address, notes: e.target.value })
              }
              value={address.notes}
              disabled={isSubmitted}
            ></textarea>
          </div>
          {!isSubmitted ? (
            <button
              onClick={() => onSubmitHandler()}
              className="max-w-sm w-full mt-6 bg-green-600 text-white py-3 hover:bg-green-700 uppercase"
            >
              Confirmer
            </button>
          ) : (
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => onEditHandler()}
                className="max-w-sm w-full mt-6 bg-gray-400 text-white py-3 hover:bg-gray-400 uppercase"
              >
                Changer les valeurs
              </button>
              <Link href="/cart">
                <button
                  type="button"
                  className="max-w-sm w-full mt-6 bg-green-600 text-white py-3 hover:bg-green-700 uppercase"
                >
                  Continuer le processus
                </button>
              </Link>
            </div>
          )}
        </form>
        <Image
          className="md:mr-16 mt-16 md:mt-0"
          src={hello}
          alt="my_location_image"
        />
      </div>
      <Footer />
    </>
  );
};

export default AddAddress;
