"use client";
import { useContext, useEffect, useState } from "react";
import {
  ShoppingBag,
  CreditCard,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  X,
  Save,
  MapPin,
  Phone,
  Mail,
  Lock,
  User,
  Calendar,
  Star,
  Package,
} from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const {
    userData,
    fetchProfile,
    stats,
    myorders,
    setUserData,
    updateProfile,
    updatePassword,
  } = useContext(AppContext);
  const [showOrders, setShowOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [formData, setFormData] = useState({});
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const statusStyles = {
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    shipped: "bg-blue-50 text-blue-700 border-blue-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const StatusIcon = ({ status }) => {
    switch (status) {
      case "delivered":
        return <CheckCircle size={16} />;
      case "shipped":
        return <Truck size={16} />;
      case "pending":
        return <Clock size={16} />;
      case "cancelled":
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const openEditModal = (section) => {
    setEditModal(section);
    if (section === "personal") {
      setFormData({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
      });
    } else if (section === "address") {
      setFormData({
        line: userData.address?.line || "",
        city: userData.address?.city || "",
        municipality: userData.address?.municipality || "",
        postalCode: userData.address?.postalCode || "",
      });
    }
  };

  const closeModal = () => {
    setEditModal(null);
    setFormData({});
  };

  const handleSave = async () => {
    if (editModal === "password") {
      setIsUpdatingPassword(true);

      const passwordData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      };

      const result = await updatePassword(passwordData);

      if (result.success) {
        closeModal();
        toast.success(result.message || "Mot de passe mis à jour avec succès");
      } else {
        console.error(
          "Erreur lors de la mise à jour du mot de passe:",
          result.error
        );
        toast.error(result.error);
      }

      setIsUpdatingPassword(false);
    } else {
      let updateData = {};

      if (editModal === "personal") {
        // Préparer les données personnelles
        updateData = {
          name: formData.name,
          phone: formData.phone,
          // Note: email souvent non modifiable côté backend
        };
      } else if (editModal === "address") {
        // Préparer les données d'adresse
        updateData = {
          address: {
            line: formData.line,
            city: formData.city,
            municipality: formData.municipality,
            postalCode: formData.postalCode,
          },
        };
      }

      // Appeler l'API d'update
      const result = await updateProfile(updateData);

      if (result.success) {
        closeModal();
        toast.success("Profil mis à jour avec succès");
      } else {
        // Gérer l'erreur
        console.error("Erreur lors de la mise à jour:", result.error);
        toast.error(result.error);
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-green-50">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Profile Header */}
          <div className="bg-white border border-neutral-200 p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <h1 className="text-2xl font-medium text-neutral-900">
                  {userData?.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    Membre depuis{" "}
                    {new Date(userData.createdAt).toLocaleDateString("en-GB")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Package size={14} />
                    {stats.totalOrders} commandes
                  </span>
                  <span className="flex items-center gap-1">
                    <CreditCard size={14} />
                    DT {stats.totalSpent} dépensés
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal("personal")}
                  className="text-sm bg-neutral-900 text-white px-4 py-2 hover:bg-neutral-800 transition-colors"
                >
                  Modifier le profil
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-neutral-100">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wide text-neutral-400">
                      Coordonnées
                    </span>
                    <div className="mt-2 space-y-1">
                      <p className="text-neutral-800 flex items-center gap-2">
                        <Mail size={14} className="text-neutral-400" />
                        {userData.email}
                      </p>
                      <p className="text-neutral-600 flex items-center gap-2">
                        <Phone size={14} className="text-neutral-400" />
                        {userData.phone}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => openEditModal("personal")}
                    className="text-xs text-neutral-500 hover:text-neutral-700 underline"
                  >
                    modifier
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wide text-neutral-400">
                      Adresse de livraison
                    </span>
                    <div className="mt-2 space-y-1 text-neutral-800">
                      <p className="flex items-start gap-2">
                        <MapPin size={14} className="text-neutral-400 mt-0.5" />
                        <span>
                          {userData.address?.line}
                          <br />
                          {userData.address && (
                            <>
                              {userData.address?.city}
                              <br />
                            </>
                          )}
                          {userData.address?.municipality}
                          <br />
                          {userData.address?.postalCode}
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => openEditModal("address")}
                    className="text-xs text-neutral-500 hover:text-neutral-700 underline"
                  >
                    modifier
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100">
              <button
                onClick={() => openEditModal("password")}
                className="text-sm text-neutral-600 hover:text-neutral-800 flex items-center gap-2"
              >
                <Lock size={14} />
                Changer le mot de passe
              </button>
            </div>
          </div>

          {/* Orders Section */}
          <div className="bg-white border border-neutral-200">
            <div className="p-6 border-b border-neutral-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-neutral-900 flex items-center gap-2">
                  <ShoppingBag size={20} />
                  Historique des commandes
                </h2>
                <button
                  onClick={() => setShowOrders(!showOrders)}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  {showOrders ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {showOrders && (
              <div className="divide-y divide-neutral-100">
                {myorders.map((order) => (
                  <div
                    key={order.ref}
                    className="p-6 hover:bg-neutral-25 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm text-neutral-900">
                            {order.ref}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 border rounded-full flex items-center gap-1 ${
                              statusStyles[order.status]
                            }`}
                          >
                            <StatusIcon status={order.status} />
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-500">
                          {new Date(order.date).toLocaleDateString("en-GB")}
                        </p>
                        {order.estimatedDelivery &&
                          order.status === "shipped" && (
                            <p className="text-xs text-blue-600">
                              Est. delivery:{" "}
                              {new Date(
                                order.estimatedDelivery
                              ).toLocaleDateString("en-GB")}
                            </p>
                          )}
                        {order.rating && order.status === "delivered" && (
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {renderStars(order.rating)}
                            </div>
                            <span className="text-xs text-neutral-500">
                              Rated
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="font-medium text-neutral-900">
                          DT {order.amount}
                        </p>
                        <button
                          onClick={() =>
                            setSelectedOrder(
                              selectedOrder === order.ref ? null : order.ref
                            )
                          }
                          className="text-xs text-neutral-500 hover:text-neutral-700 mt-1"
                        >
                          {selectedOrder === order.ref
                            ? "Masquer les détails"
                            : "Afficher les détails"}
                        </button>
                      </div>
                    </div>

                    {selectedOrder === order.ref && (
                      <div className="mt-4 p-4 bg-neutral-50 border border-neutral-100 space-y-3">
                        <div className="space-y-2">
                          {order.items.map((item, itemIdx) => (
                            <div
                              key={itemIdx}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-neutral-700">
                                {item.quantity}× {item.name}
                              </span>
                              <span className="text-neutral-900">
                                DT {item.price}
                              </span>
                            </div>
                          ))}
                        </div>

                        {order.id && (
                          <div className="pt-2 border-t border-neutral-200">
                            <p className="text-xs text-neutral-500">
                              Suivi : {order.id}
                            </p>
                          </div>
                        )}

                        {order.status === "delivered" && !order.rating && (
                          <div className="pt-2 border-t border-neutral-200">
                            <button className="text-xs text-blue-600 hover:text-blue-800">
                              Rate this order
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {editModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-md border border-neutral-200">
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="font-medium text-neutral-900 flex items-center gap-2">
                  {editModal === "personal" && (
                    <>
                      <User size={18} />
                      Modifier les informations personnels
                    </>
                  )}
                  {editModal === "address" && (
                    <>
                      <MapPin size={18} />
                      Modifier l'addresse
                    </>
                  )}
                  {editModal === "password" && (
                    <>
                      <Lock size={18} />
                      Modifier le mot de passe
                    </>
                  )}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {editModal === "personal" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs uppercase tracking-wide text-neutral-400 block mb-2">
                          Nom utilisateur
                        </label>
                        <input
                          type="text"
                          value={formData.name || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wide text-neutral-400 block mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wide text-neutral-400 block mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500"
                      />
                    </div>
                  </>
                )}

                {editModal === "address" && (
                  <>
                    <div>
                      <label className="text-xs uppercase tracking-wide text-neutral-400 block mb-2">
                        Addresse
                      </label>
                      <input
                        type="text"
                        value={formData.line || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            line: e.target.value,
                          }))
                        }
                        className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs uppercase tracking-wide text-neutral-400 block mb-2">
                          Code postal
                        </label>
                        <input
                          type="text"
                          value={formData.postalCode || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              postalCode: e.target.value,
                            }))
                          }
                          className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-wide text-neutral-400 block mb-2">
                          Municipalité
                        </label>
                        <input
                          type="text"
                          value={formData.municipality || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              municipality: e.target.value,
                            }))
                          }
                          className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wide text-neutral-400 block mb-2">
                        Gouvernorat
                      </label>
                      <input
                        type="text"
                        value={formData.city || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500"
                      />
                    </div>
                  </>
                )}

                {editModal === "password" && (
                  <>
                    <div>
                      <label className="text-xs uppercase tracking-wide text-neutral-400 block mb-2">
                        Mot de passe actuel
                      </label>
                      <input
                        type="password"
                        value={formData.currentPassword || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            currentPassword: e.target.value,
                          }))
                        }
                        disabled={isUpdatingPassword}
                        className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500 disabled:bg-neutral-50 disabled:cursor-not-allowed"
                        placeholder="Entrez votre mot de passe actuel"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wide text-neutral-400 block mb-2">
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        value={formData.newPassword || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                        disabled={isUpdatingPassword}
                        className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500 disabled:bg-neutral-50 disabled:cursor-not-allowed"
                        placeholder="Minimum 6 caractères"
                      />
                      {formData.newPassword &&
                        formData.newPassword.length < 6 && (
                          <p className="text-xs text-red-500 mt-1">
                            Le mot de passe doit contenir au moins 6 caractères
                          </p>
                        )}
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wide text-neutral-400 block mb-2">
                        Confirmer nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        value={formData.confirmPassword || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        disabled={isUpdatingPassword}
                        className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500 disabled:bg-neutral-50 disabled:cursor-not-allowed"
                        placeholder="Confirmez le nouveau mot de passe"
                      />
                      {formData.confirmPassword &&
                        formData.newPassword !== formData.confirmPassword && (
                          <p className="text-xs text-red-500 mt-1">
                            Les mots de passe ne correspondent pas
                          </p>
                        )}
                    </div>
                  </>
                )}
              </div>

              <div className="p-6 border-t border-neutral-100 flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-neutral-900 text-white px-4 py-2 text-sm hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={14} />
                  Sauvgarder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
