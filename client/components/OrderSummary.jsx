import { addressDummyData } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const OrderSummary = ({ cartCount, cartItems }) => {
  const { router, total, address, createOrder, setAddress } = useAppContext();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState("");
  const [isDeliveryDropdownOpen, setIsDeliveryDropdownOpen] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  // Validation du formulaire
  const isFormValid = () => {
    if (!deliveryType) return false;
    if (!address.phone.trim()) return false;
    if (!cartItems || cartItems.length === 0) return false;

    if (deliveryType === "delivery") {
      if (!selectedAddress && !address.city) return false;
      if (!paymentMethod) return false;
    }

    return true;
  };

  const handleCreateOrder = async () => {
    if (!isFormValid()) {
      alert("Veuillez remplir tous les champs requis");
      return;
    }

    setIsCreatingOrder(true);

    try {
      const orderData = {
        items: cartItems.map((item, index) => {
          const productId = item.product?._id || item.product;

          console.log(`Mapping cart item ${index}:`, {
            cartItemId: item._id,
            productId: productId,
            productName: item.product?.name,
            quantity: item.quantity,
          });

          if (!productId) {
            throw new Error(
              `ID du produit manquant pour l'item: ${
                item.product?.name || "Sans nom"
              }`
            );
          }

          return {
            product: productId,
            quantity: item.quantity || 1,
          };
        }),
        deliveryType,
        phone: address.phone.replace(/\s+/g, ""),
        notes: address.notes.trim(),
      };

      // Ajouter les champs conditionnels pour la livraison
      if (deliveryType === "delivery") {
        const shippingAddress = selectedAddress || {
          street: address.street,
          city: address.city,
          postalCode: address.postalCode,
        };

        orderData.shippingAddress = shippingAddress;
        orderData.paymentMethod = paymentMethod;
      }

      const result = await createOrder(orderData);

      if (result.success) {
        toast.success("Commande créée avec succès !");
        // Rediriger vers la page de confirmation ou des commandes
      } else {
        toast.error(result.message || "Erreur lors de la création de la commande");
      }
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  useEffect(() => {
    console.log("Cart count changed:", cartCount);
    console.log("Total changed:", total);
  }, [cartCount, total]);

  const taxAmount = useMemo(() => Math.floor(total * 0.02), [total]);
  const shippingCost = useMemo(() => {
    return deliveryType === "pickup" || deliveryType === "in_store" ? 0 : 7;
  }, [deliveryType]);
  const finalTotal = useMemo(
    () => total + taxAmount + shippingCost,
    [total, taxAmount, shippingCost]
  );

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Détails de la commande
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Type de livraison
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDeliveryDropdownOpen(!isDeliveryDropdownOpen)}
            >
              <span>
                {deliveryType === "delivery"
                  ? "Livraison à domicile"
                  : deliveryType === "pickup"
                  ? "Retrait en magasin"
                  : deliveryType === "in_store"
                  ? "Achat en magasin"
                  : "Sélectionner le type de livraison"}
              </span>
              <svg
                className={`w-5 h-5 inline float-right transition-transform duration-200 ${
                  isDeliveryDropdownOpen ? "rotate-0" : "-rotate-90"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#6B7280"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDeliveryDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                <li
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                  onClick={() => {
                    setDeliveryType("delivery");
                    setIsDeliveryDropdownOpen(false);
                  }}
                >
                  Livraison à domicile
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                  onClick={() => {
                    setDeliveryType("pickup");
                    setSelectedAddress(null);
                    setIsDropdownOpen(false);
                    setPaymentMethod(""); // Reset payment method
                    setIsDeliveryDropdownOpen(false);
                  }}
                >
                  Retrait en magasin
                </li>
              </ul>
            )}
          </div>
        </div>
        {deliveryType === "delivery" && (
          <div>
            <label className="text-base font-medium uppercase text-gray-600 block mb-2">
              Adresse
            </label>
            <div className="relative inline-block w-full text-sm border">
              <button
                className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>
                  {selectedAddress
                    ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                    : "Addresse"}
                </span>
                <svg
                  className={`w-5 h-5 inline float-right transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-0" : "-rotate-90"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#6B7280"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                  <li>
                    {address.city} {address.street} {address.postalCode}{" "}
                  </li>

                  <li
                    onClick={() => router.push("/add-address")}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                  >
                    + Ajouter votre addresse
                  </li>
                </ul>
              )}
            </div>
          </div>
        )}
        {/* Mode de paiement (seulement pour livraison) */}
        {deliveryType === "delivery" && (
          <div>
            <label className="text-base font-medium uppercase text-gray-600 block mb-2">
              Mode de paiement *
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash_on_delivery"
                  checked={paymentMethod === "cash_on_delivery"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                Paiement à la livraison
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={paymentMethod === "bank_transfer"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                Virement bancaire
              </label>
            </div>
          </div>
        )}
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Téléphone
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="+216 XX XXX XXX"
              value={address.phone}
              onChange={(e) =>
                setAddress({ ...address, phone: e.target.value })
              }
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
            />
            {/* <button className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700">
              Apply
            </button>*/}
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Articles</p>
            <p className="text-gray-800">{cartCount}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Sous-total</p>
            <p className="font-medium text-gray-800">DT {total}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Frais de livraison</p>
            {shippingCost === 0 ? "Gratuit" : `DT ${shippingCost}`}
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">DT {taxAmount}</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>DT {finalTotal}</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleCreateOrder}
        disabled={!isFormValid() || isCreatingOrder}
        className={`w-full py-3 mt-5 text-white transition-colors ${
          isFormValid() && !isCreatingOrder
            ? "bg-green-600 hover:bg-green-700 cursor-pointer"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {isCreatingOrder ? "Création en cours..." : "Passer la commande"}
      </button>
    </div>
  );
};

export default OrderSummary;
