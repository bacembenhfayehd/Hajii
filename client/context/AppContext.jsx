"use client";
import { redirect, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();

  const [userData, setUserData] = useState(false);
  const [isSeller, setIsSeller] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [address, setAddress] = useState({
  city: "",
  street: "",
  postalCode: "",
  notes: "",
  phone: "",
});
const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [myorders, setMyorders] = useState([]);
  const [stats, setStats] = useState({});

  // Récupérer le panier depuis l'API
  const fetchCart = useCallback(async () => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) return;

      setLoading(true);
      const response = await fetch("http://localhost:5000/api/cart/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        setCartCount(result.data.cart.itemCount || 0);
        setCartItems(result.data.cart.items || []);
        setTotal(result.data.cart.total);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du panier:", error);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger le panier au montage
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Fonction pour rafraîchir le panier
  const refreshCart = useCallback(() => {
    const token = localStorage.getItem("auth-token");
    if (token) fetchCart();
  }, [fetchCart]);

  const getAllProducts = async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);
      if (filters.category) params.append("category", filters.category);
      if (filters.search) params.append("search", filters.search);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

      const url = `http://localhost:5000/api/admin/products${
        params.toString() ? "?" + params.toString() : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la récupération");
      }

      const result = await response.json();
      return result.data; // Retourner directement { products, pagination }
    } catch (error) {
      throw error;
    }
  };

  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        return addToLocalCart(productId, quantity);
      }

      setLoading(true);

      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          product: productId,
          quantity: quantity,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setCartCount(result.data.cart.itemCount || 0);
        setCartItems(result.data.cart.items || []);
        setTotal(result.data.cart.total);

        return { success: true, message: result.message };
      } else {
        console.error("Erreur lors de l'ajout au panier:", result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      return { success: false, message: "Erreur de connexion" };
    } finally {
      setLoading(false);
    }
  }, []);

  const addToLocalCart = (productId, quantity) => {
    const localCart = JSON.parse(localStorage.getItem("local-cart") || "[]");

    const existingItem = localCart.find((item) => item.product === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      localCart.push({ product: productId, quantity });
    }

    localStorage.setItem("local-cart", JSON.stringify(localCart));

    // Mettre à jour l'état local
    setCartItems(localCart);
    setCartCount(localCart.reduce((sum, item) => sum + item.quantity, 0));

    return { success: true, message: "Produit ajouté au panier" };
  };

  const updateCartItem = useCallback(async (productId, quantity) => {
    try {
      const token = localStorage.getItem("auth-token");

      if (quantity < 1) {
        return {
          success: false,
          message: "La quantité doit être supérieure à 0",
        };
      }

      if (!token) {
        return updateLocalCartItem(productId, quantity);
      }

      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/cart/item/${productId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ quantity }),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Mettre à jour le state local
        setCartCount(result.data.cart.itemCount || 0);
        setCartItems(result.data.cart.items || []);
        setTotal(result.data.cart.total);

        return { success: true, message: result.message };
      } else {
        console.error("Erreur lors de la mise à jour:", result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      return { success: false, message: "Erreur de connexion" };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLocalCartItem = (productId, quantity) => {
    const localCart = JSON.parse(localStorage.getItem("local-cart") || "[]");

    const itemIndex = localCart.findIndex((item) => item.product === productId);
    if (itemIndex !== -1) {
      localCart[itemIndex].quantity = quantity;
      localStorage.setItem("local-cart", JSON.stringify(localCart));

      // Mettre à jour l'état local
      setCartItems(localCart);
      setCartCount(localCart.reduce((sum, item) => sum + item.quantity, 0));

      return { success: true, message: "Quantité mise à jour" };
    }

    return { success: false, message: "Produit non trouvé dans le panier" };
  };

  // Fonction pour diminuer la quantité d'un produit dans le panier
  const decreaseItemQuantity = useCallback(async (productId) => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        return decreaseLocalCartItem(productId);
      }

      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/cart/item/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const result = await response.json();

      if (result.success) {
        // Mettre à jour le state local
        setCartCount(result.data.cart.itemCount || 0);
        setCartItems(result.data.cart.items || []);
        setTotal(result.data.cart.total);

        return { success: true, message: result.message };
      } else {
        console.error("Erreur lors de la diminution:", result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("Erreur lors de la diminution:", error);
      return { success: false, message: "Erreur de connexion" };
    } finally {
      setLoading(false);
    }
  }, []);

  const decreaseLocalCartItem = (productId) => {
    const localCart = JSON.parse(localStorage.getItem("local-cart") || "[]");

    const itemIndex = localCart.findIndex((item) => item.product === productId);
    if (itemIndex !== -1) {
      localCart[itemIndex].quantity -= 1;

      // Si quantité <= 0, supprimer l'item
      if (localCart[itemIndex].quantity <= 0) {
        localCart.splice(itemIndex, 1);
      }

      localStorage.setItem("local-cart", JSON.stringify(localCart));

      // Mettre à jour l'état local
      setCartItems(localCart);
      setCartCount(localCart.reduce((sum, item) => sum + item.quantity, 0));

      return { success: true, message: "Quantité diminuée" };
    }

    return { success: false, message: "Produit non trouvé dans le panier" };
  };

  const increaseItemQuantity = useCallback(
    async (productId) => {
      return await addToCart(productId, 1);
    },
    [addToCart]
  );

  const removeFromCart = useCallback(async (productId) => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        return removeFromLocalCart(productId);
      }
      const response = await fetch(
        `http://localhost:5000/api/cart/remove/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Erreur lors de la suppression",
        };
      }

      setCartItems(data.data.cart.items);
      setCartCount(data.data.cart.itemCount);

      return {
        success: true,
        message: data.message || "Produit supprimé avec succès",
        data: data.data,
      };
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      return {
        success: false,
        message: "Erreur de connexion au serveur",
      };
    }
  }, []);

  const removeFromLocalCart = (productId) => {
    const localCart = JSON.parse(localStorage.getItem("local-cart") || "[]");

    const filteredCart = localCart.filter((item) => item.product !== productId);

    localStorage.setItem("local-cart", JSON.stringify(filteredCart));

    // Mettre à jour l'état local
    setCartItems(filteredCart);
    setCartCount(filteredCart.reduce((sum, item) => sum + item.quantity, 0));

    return {
      success: true,
      message: "Produit supprimé avec succès",
    };
  };

  const processPendingOrders = useCallback(async () => {
    const tempOrders = JSON.parse(localStorage.getItem("temp-orders") || "[]");

    if (tempOrders.length === 0) return;

    try {
      // Process all pending orders
      const results = await Promise.allSettled(
        tempOrders.map(async (tempOrder) => {
          const response = await fetch("http://localhost:5000/api/order/", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(tempOrder.orderData),
          });
          return response.json();
        })
      );

      const successful = results.filter(
        (r) => r.status === "fulfilled" && r.value.success
      );

      if (successful.length > 0) {
        toast.success(
          `${successful.length} commande(s) sauvegardée(s) finalisée(s) !`
        );
        // Update orders state
        const newOrders = successful.map((r) => r.value.data);
        setOrders((prev) => [...newOrders, ...prev]);
      }
    } catch (error) {
      console.error("Erreur lors du traitement des commandes:", error);
    } finally {
      localStorage.removeItem("temp-orders");
    }
  }, [setOrders]);

  const createOrder = useCallback(
    async (orderData) => {
      try {
        const token = localStorage.getItem("auth-token");
       if (!token) {
        
        const tempOrder = {
          orderData,
          cartItems: [...cartItems], 
          timestamp: Date.now(),
          tempId: `temp_${Date.now()}`
        };
        
        const existingTempOrders = JSON.parse(
          localStorage.getItem("temp-orders") || "[]"
        );
        existingTempOrders.push(tempOrder);
        localStorage.setItem("temp-orders", JSON.stringify(existingTempOrders));
        router.push("/auth");
        return { 
          success: false, 
          message: "Commande sauvegardée. Connectez-vous pour finaliser",
          requiresAuth: true 
        };
      }

      
      

        const {
          items,
          shippingAddress,
          paymentMethod,
          notes,
          deliveryType,
          phone,
        } = orderData;

        // Validation du type de livraison
        const validDeliveryTypes = ["delivery", "pickup", "in_store"];
        if (!deliveryType || !validDeliveryTypes.includes(deliveryType)) {
          return { success: false, message: "Type de livraison invalide" };
        }

        if (!phone || phone.trim().length === 0) {
          return { success: false, message: "Numéro de téléphone requis" };
        }

        if (!/^\d{8}$/.test(phone)) {
         return { success: false, message: "Numéro de téléphone invalide " };
        }

        // Validation selon le type de livraison
        if (deliveryType === "delivery") {
          if (!shippingAddress) {
            return { success: false, message: "Adresse de livraison requise" };
          }
          if (!paymentMethod) {
            return { success: false, message: "Mode de paiement requis" };
          }
        } else if (
          (deliveryType === "pickup" || deliveryType === "in_store") &&
          paymentMethod
        ) {
          return {
            success: false,
            message: "Mode de paiement non autorisé pour ce type",
          };
        }

        // Préparer le payload
        const orderPayload = {
          items: items.map((item) => ({
            product: item.product || item._id || item.id,
            quantity: item.quantity || 1,
          })),
          deliveryType,
          phone: phone.trim(),
          notes: notes?.trim() || "",
        };

        // Ajouter les champs conditionnels
        if (deliveryType === "delivery") {
          orderPayload.shippingAddress = shippingAddress;
          orderPayload.paymentMethod = paymentMethod;
        }

        setLoading(true);

        const response = await fetch("http://localhost:5000/api/order/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(orderPayload),
        });

        const result = await response.json();

        if (result.success) {
          setCartItems([]);
          setTotal(0);
          setCartCount(0);
          setOrders((prev) => [result.data, ...prev]);
          return { success: true, message: result.message, data: result.data };
        } else {
          return { success: false, message: result.message };
        }
      } catch (error) {
        console.error("Erreur lors de la création:", error);
        return { success: false, message: "Erreur de connexion" };
      } finally {
        setLoading(false);
      }
    },
    [setCartItems, setLoading, setOrders]
  );

  const clearCart = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("auth-token");

      if (!token) {
        return clearLocalCart();
      }

      const response = await fetch("http://localhost:5000/api/cart/clear", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du vidage du panier");
      }

      const data = await response.json();
      setCartItems([]);
      setCartCount(0);

      return data;
    } catch (err) {
      console.error(err.message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearLocalCart = () => {
    localStorage.removeItem("local-cart");

    // Mettre à jour l'état local
    setCartItems([]);
    setCartCount(0);
    setTotal(0); // si vous avez ce state

    return {
      success: true,
      message: "Panier vidé avec succès",
    };
  };

  const syncCartAfterLogin = useCallback(async () => {
    try {
      const localCart = JSON.parse(localStorage.getItem("local-cart") || "[]");

      if (localCart.length === 0) return;

      const token = localStorage.getItem("auth-token");
      if (!token) return;

      // Récupérer le panier serveur actuel
      const serverCartResponse = await fetch("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const serverCart = await serverCartResponse.json();

      // Ajouter chaque item du panier local au panier serveur
      for (const item of localCart) {
        await addToCart(item.product, item.quantity);
      }

      // Nettoyer le panier local
      localStorage.removeItem("local-cart");
    } catch (error) {
      console.error("Erreur lors de la synchronisation:", error);
    }
  }, [addToCart]);

  const getProductComments = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/product/${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch comments");
      }

      return data.data; // Retourne { comments, pagination, product }
    } catch (error) {
      console.error("Error fetching product comments:", error);
      throw error;
    }
  };

  const addComment = async (productId, content) => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        throw new Error("Veuillez vous connecter pour laisser un avis");
      }
      const response = await fetch("http://localhost:5000/api/user/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add comment");
      }

      return data.data;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("http://localhost:5000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setUserData(data.message.user); // Note: selon votre réponse API, c'est data.message.user
        setMyorders(data.message.recentOrders);
        setStats(data.message.stats);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const updateProfile = async (updateData) => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("http://localhost:5000/api/user/", {
        method: "PUT", // ou 'PATCH' selon votre route
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.success) {
        setUserData(data.message.user);
        setStats(data.message.stats);
        setMyorders(data.message.recentOrders);
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: "Erreur de connexion" };
    }
  };

  const updatePassword = async (passwordData) => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("http://localhost:5000/api/user/password", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, message: data.data };
      } else {
        return { success: false, error: data.message || data.data };
      }
    } catch (error) {
      console.error("Error updating password:", error);
      return { success: false, error: "Erreur de connexion" };
    }
  };

  const value = {
    currency,
    router,
    isSeller,
    myorders,
    stats,
    setIsSeller,
    fetchProfile,
    userData,
    cartItems,
    total,
    setCartItems,
    addToCart,
    removeFromCart,
    getAllProducts,
    cartCount,
    cartItems,
    fetchCart,
    refreshCart,
    setCartCount,
    setCartItems,
    decreaseItemQuantity,
    updateCartItem,
    increaseItemQuantity,
    loading,
    orders,
    createOrder,
    address,
    isSubmitted,
    setIsSubmitted,
    setAddress,
    setIsSubmitted,
    clearCart,
    syncCartAfterLogin,
    getProductComments,
    addComment,
    updateProfile,
    updatePassword,
    processPendingOrders
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
