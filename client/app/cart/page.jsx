"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

const Cart = () => {
  const {
    router,
    cartItems,
    cartCount,
    getAllProducts,
    decreaseItemQuantity,
    increaseItemQuantity,
    removeFromCart,
    clearCart,
  } = useAppContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [getAllProducts]);

  const handleDecrease = async (productId) => {
    if (isUpdating) return;

    setIsUpdating(true);
    const result = await decreaseItemQuantity(productId);

    if (result.success) {
      // La quantité sera mise à jour automatiquement par le contexte
      console.log("Quantité diminuée avec succès");
    } else {
      console.error(result.message);
      // Afficher un toast d'erreur si vous en avez un
    }
    setIsUpdating(false);
  };

  const handleIncrease = async (productId) => {
    if (isUpdating) return;

    setIsUpdating(true);

    try {
      const result = await increaseItemQuantity(productId);

      if (result.success) {
        console.log("Quantité augmentée avec succès");

        // Mettre à jour l'état local du panier si nécessaire
        // setCart(result.data.cart);
      } else {
        console.error("Erreur:", result.message);

        // Toast d'erreur avec message spécifique
        if (result.error?.type === "STOCK_ERROR") {
          toast.error(`❌ ${result.message}`, {
            duration: 4000,
            style: {
              background: "#fee2e2",
              color: "#dc2626",
              border: "1px solid #fecaca",
            },
          });
        } else {
          toast.error(`Erreur: ${result.message}`);
        }
      }
    } catch (error) {
      console.error("Erreur inattendue:", error);
      toast.error("Une erreur inattendue s'est produite");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    const result = await removeFromCart(productId);

    if (result.success) {
      toast.success(` produit supprimé du panier`, {
        duration: 3000,
        icon: "🗑️",
      });
    } else {
      toast.error(`Erreur: ${result.message}`, {
        duration: 4000,
      });
    }

    return result;
  };

  const handleClearCart = async () => {
    try {
      setIsClearing(true);
      await clearCart();
      // Optionnel : afficher un message de succès
      toast.success("Panier vidé avec succès !");
    } catch (error) {
      // Optionnel : afficher un message d'erreur
      toast.error("Erreur lors du vidage du panier : " + error.message);
    } finally {
      setIsClearing(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Chargement...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
            <p className="text-2xl md:text-3xl text-gray-500">
              Votre <span className="font-medium text-green-600">Panier</span>
            </p>
            <p className="text-lg md:text-xl text-gray-500/80">
              {cartCount} articles
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="text-left">
                <tr>
                  <th className="text-nowrap pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Détails des produits
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Prix
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Quantité
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Sous-total
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((cartItem) => {
                  const productId = cartItem.product?._id || cartItem.product; // local n'a que l'ID
  const product = products.find((p) => p._id === productId);

                  if (!product) return null;

                  return (
                    <tr key={productId}>
                      <td className="flex items-center gap-4 py-4 md:px-4 px-1">
                        <div>
                          <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
                            {product.images?.[0]?.url ? (
                              <Image
                                src={product.images[0].url}
                                alt={product.name}
                                className="w-16 h-auto object-cover mix-blend-multiply"
                                width={64}
                                height={64}
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded">
                                <span className="text-gray-400 text-xs">
                                  Pas d'image
                                </span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveFromCart(productId)}
                            className="md:hidden text-xs text-green-600 mt-1"
                          >
                            Supprimer
                          </button>
                        </div>
                        <div className="text-sm hidden md:block">
                          <p className="text-gray-800">{product.name}</p>
                          <button
                            onClick={() => handleRemoveFromCart(productId)}
                            className="text-xs text-green-600 mt-1"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                      <td className="py-4 md:px-4 px-1 text-gray-600">
                        DT {product.price}
                      </td>
                      <td className="py-4 md:px-4 px-1">
                        <div className="flex items-center md:gap-2 gap-1">
                          <button
                            onClick={() => handleDecrease(productId)}
                            disabled={isUpdating || loading}
                          >
                            <Image
                              src={assets.decrease_arrow}
                              alt="decrease_arrow"
                              className="w-4 h-4"
                            />
                          </button>
                          <input
                            type="number"
                            value={cartItem.quantity}
                            readOnly
                            className="w-8 border text-center appearance-none"
                          ></input>
                          <button
                            onClick={() => handleIncrease(productId)}
                            disabled={isUpdating || loading}
                          >
                            <Image
                              src={assets.increase_arrow}
                              alt="increase_arrow"
                              className="w-4 h-4"
                            />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 md:px-4 px-1 text-gray-600">
                        DT {(product.price * cartItem.quantity).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between">
             <button
            onClick={() => router.push("/")}
            className="group flex items-center mt-6 gap-2 text-green-600"
          >
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0l2 2-6 6h14v2H6l6 6-2 2-10-10 10-10z" />
            </svg>
            Continuer votre achat
          </button>
<button
            onClick={handleClearCart}
            disabled={loading || isClearing}
            className="group flex items-center mt-4 gap-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2
              className={`w-4 h-4 transition-transform ${
                isClearing ? "animate-spin" : "group-hover:scale-110"
              }`}
            />
            {isClearing ? "..." : "Vider le panier"}
          </button>
         
        </div>
          </div>
          
        <OrderSummary cartItems={cartItems} cartCount={cartCount} />
      </div>
    </>
  );
};

export default Cart;
