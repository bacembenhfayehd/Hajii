'use client'
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'temp-order-form';
const DEBOUNCE_DELAY = 500;

export const usePersistentOrderForm = () => {
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {
        address: { city: "", street: "", postalCode: "", notes: "", phone: "" },
        deliveryType: "",
        paymentMethod: "",
        selectedAddress: null,
        isSubmitted: false 
      };
    } catch {
      return {
        address: { city: "", street: "", postalCode: "", notes: "", phone: "" },
        deliveryType: "",
        paymentMethod: "",
        selectedAddress: null,
        isSubmitted: false
      };
    }
  });

  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [formData]);

  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const clearFormData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData({
      address: { city: "", street: "", postalCode: "", notes: "", phone: "" },
      deliveryType: "",
      paymentMethod: "",
      selectedAddress: null
    });
  }, []);

  return { formData, updateFormData, clearFormData };
};