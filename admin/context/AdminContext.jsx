"use client";


import { createContext, useContext } from "react";

export const AdminContext = createContext();

export const useAdminContext = () => {
  return useContext(AdminContext);
};

export const AdminContextProvider = (props) => {
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

  const value = {
    createProduct,
    getAllProducts,
    getAllOrders,
    updateProduct
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};
