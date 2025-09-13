"use client";
import React, { useContext, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { AdminContext } from "@/context/AdminContext";
import toast from "react-hot-toast";

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Parfum homme");
  const [price, setPrice] = useState("");

  const { createProduct } = useContext(AdminContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validFiles = files.filter(
      (file) => file !== null && file !== undefined
    );
    const productData = {
      name,
      description,
      category,
      price,
      stock,
    };

  
  toast.promise(
    createProduct(productData, validFiles),
    {
      loading: 'Création du produit en cours...',
      success: 'Produit créé avec succès!',
      error: (err) => {
      if (err.response?.data?.data?.errors) {
        const errorMessages = err.response.data.data.errors
          .map(error => `${error.field}: ${error.message}`)
          .join('\n');
        
        return `Erreurs de validation:\n${errorMessages}`;
      }
      
      return `Erreur: ${err.message}`;
    }
  
    }
  ).then(() => {
    
    setFiles([]);
    setName("");
    setDescription("");
    setCategory("Parfum homme");
    setPrice("");
    setStock("");
  }).catch(() => {
    
  });

  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Images</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input
                  onChange={(e) => {
                    const updatedFiles = [...files];
                    updatedFiles[index] = e.target.files[0];
                    setFiles(updatedFiles);
                  }}
                  type="file"
                  id={`image${index}`}
                  hidden
                />
                <Image
                  key={index}
                  className="max-w-24 cursor-pointer"
                  src={
                    files[index]
                      ? URL.createObjectURL(files[index])
                      : assets.upload_area
                  }
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Nom du produit
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="produit"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Categorie
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              defaultValue={category}
            >
              <option value="Parfum homme">Parfum homme</option>
              <option value="Parfum femme">Parfum femme</option>
              <option value="Teint">Teint</option>
              <option value="Lèvres">Lèvres</option>
              <option value="Yeux">Yeux</option>
              <option value="Ongles">Ongles</option>
              <option value="Autres">Autres</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Prix
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Stock
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setStock(e.target.value)}
              value={stock}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-8 py-2.5 bg-green-600 text-white font-medium rounded"
        >
          Ajouter
        </button>
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default AddProduct;
