"use client";


import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

export const AdminContext = createContext();

export const useAdminContext = () => {
  return useContext(AdminContext);
};

export const AdminContextProvider = (props) => {

    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
  const [pagination, setPagination] = useState({});
  const [statistics, setStatistics] = useState({});
   const [cp, setCp] = useState({});
  const [cs, setCs] = useState({});
  const [loading, setLoading] = useState(true);


  const createProduct = async (productData, imageFiles) => {
    const formData = new FormData();

    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });

    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    try {
      const response = await fetch("http://localhost:5000/api/admin/products", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la création");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

 const updateProduct = async (productId, updateData) => {
  try {
    // Pour update, utiliser FormData au cas où ton backend l'attend
    const formData = new FormData();
    
    // Ajouter seulement les champs modifiés
    Object.keys(updateData).forEach(key => {
      formData.append(key, updateData[key]);
    });
    
    const response = await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
      method: 'PUT',
      body: formData, // Pas de Content-Type header, laisse le navigateur gérer
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la mise à jour');
    }
    
    const result = await response.json();
    return result.data;
    
  } catch (error) {
    throw error;
  }
};

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

  const getAllOrders = async (page = 1) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/orders?page=${page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la récupération");
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      throw error;
    }
  };

   const fetchUsers = async ({ page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "desc" } = {}) => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        params: { page, limit, search, sortBy, sortOrder }
      });

      if (res.data.success) {
        setUsers(res.data.data.users);
        setPagination(res.data.data.pagination);
        setStatistics(res.data.data.statistics);
      }
    } catch (error) {
      console.error("Erreur API:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async ({ page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "desc" } = {}) => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/", {
        params: { page, limit, search, sortBy, sortOrder }
      });

      if (res.data.success) {
        setComments(res.data.data.comments);
        setCp(res.data.data.pagination);
        setCs(res.data.data.stats);
        
      }
    } catch (error) {
      console.error("Erreur API:", error);
    } finally {
      setLoading(false);
    }
  };


  const deleteComment = async (commentId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/admin/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la suppression du commentaire');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur deleteComment:', error);
    throw error;
  }
};

 const deleteUser = async (userId) => {
  try {
    console.log('=== DEBUG COMPLET ===');
    console.log('ID utilisateur:', userId);
    console.log('Type ID:', typeof userId);
    
    const response = await fetch(`http://localhost:5000/api/admin/usersdelete/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    // Lire la réponse brute
    const responseText = await response.text();
    console.log('Response brute:', responseText);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error('Erreur deleteUser:', error);
    throw error;
  }
};

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    // Replace with your actual API endpoint
    const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus })
    });

    await getAllOrders();
    
    if (!response.ok) {
      throw new Error('Failed to update order status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

   useEffect(() => {
    fetchUsers();
    fetchComments()
    
  }, []);

  const value = {
    createProduct,
    getAllProducts,
    getAllOrders,
    updateProduct,fetchUsers,pagination,statistics,users,loading,fetchComments,comments,cp,cs,deleteComment,deleteUser,updateOrderStatus
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};
