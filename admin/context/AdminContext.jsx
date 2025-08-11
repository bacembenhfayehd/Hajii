"use client";
import { productsDummyData, userDummyData } from "@/assets/assets";

import { createContext, useContext, useEffect, useState } from "react";

export const AdminContext = createContext();

export const useAdminContext = () => {
  return useContext(AdminContext);
};

export const AdminContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(false);
  const [cartItems, setCartItems] = useState({});

  const fetchProductData = async () => {
    setProducts(productsDummyData);
  };

  const fetchUserData = async () => {
    setUserData(userDummyData);
  };

  const createProduct = async (productData, imageFiles) => {
  const formData = new FormData();
  
  Object.keys(productData).forEach(key => {
    formData.append(key, productData[key]);
  });
  
  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach(file => {
      formData.append('images', file);
    });
  }
  
  try {
    const response = await fetch('http://localhost:5000/api/admin/products', {
      method: 'POST',
      body: formData,
      
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la création');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};


  const getAllProducts = async (filters = {}) => {
    try {
     
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      
      const url = `http://localhost:5000/api/admin/products${params.toString() ? '?' + params.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération');
      }
      
      const result = await response.json();
      return result.data; // Retourner directement { products, pagination }
      
    } catch (error) {
      throw error;
    }
  };


  /*  const addToCart = async (itemId) => {

        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        }
        else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);

    }

    const updateCartQuantity = async (itemId, quantity) => {

        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)

    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }*/

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    fetchUserData();
  }, []);

  const value = {
    userData,
    createProduct,
    fetchUserData,
    products,
    fetchProductData,
    cartItems,
    setCartItems,
    getAllProducts
    /*addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,*/
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};
