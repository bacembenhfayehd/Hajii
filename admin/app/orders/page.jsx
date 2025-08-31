"use client";
import React, { useContext, useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";

import Loading from "@/components/Loading";
import { AdminContext } from "@/context/AdminContext";
import { ChevronDown, Package } from "lucide-react";

const Orders = () => {
  const { getAllOrders,updateOrderStatus } = useContext(AdminContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasNext: false,
    hasPrev: false,
  });
  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getAllOrders(page);
      if (response?.orders && response?.pagination) {
        setOrders(response.orders);
        setPagination(response.pagination);
      } else {
        throw new Error("Structure de réponse inattendue");
      }
    } catch (error) {
      console.error("Erreur:", error.message);
      toast.error(`Erreur: ${error.message}`);

      setOrders([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalOrders: 0,
        hasNext: false,
        hasPrev: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const StatusDropdown = ({ order, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'En attente', color: 'text-yellow-600' },
    { value: 'confirmed', label: 'Confirmé', color: 'text-green-600' },
    { value: 'cancelled', label: 'Annulé', color: 'text-red-600' }
  ];

  const currentStatus = statusOptions.find(option => option.value === order.status);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === order.status) {
      setIsOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      await updateOrderStatus(order._id, newStatus);
      onStatusChange(order._id, newStatus);
      setIsOpen(false);
    } catch (error) {
      // Handle error (show toast notification, etc.)
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-medium hover:bg-gray-50 transition-colors ${
          isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } ${currentStatus?.color || 'text-gray-600'}`}
      >
        <span>Statut : {currentStatus?.label || order.status}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 min-w-32">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  option.value === order.status ? 'bg-gray-100 font-medium' : ''
                } ${option.color}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};


   const handleStatusChange = (orderId, newStatus) => {
    // Update the orders state with the new status
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order._id === orderId 
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-5">
          <h2 className="text-lg font-medium">Orders</h2>
          <div className="max-w-4xl rounded-md">
            {orders.map((order) => (
              <div
                key={order._id}
                className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300"
              >
                <div className="flex-1 flex gap-5 max-w-80">
                  <Package className="w-12 h-12 text-green-700 flex-shrink-0 mt-1" />
                  <p className="flex flex-col gap-3">
                    <span className="font-medium">
                      {order.items
                        .map((item) => `${item.name} x ${item.quantity}`)
                        .join(", ")}
                    </span>
                    <span>Articles : {order.items.length}</span>
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-medium">{order.user?.name}</span>
                    <br />
                    <span className="font-medium">{order?.phone}</span>
                    <br />
                    {order.deliveryType === "delivery" &&
                    order.shippingAddress ? (
                      <>
                        <span>{order.shippingAddress.street}</span>
                        <br />
                        <span>{`${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`}</span>
                        <br />
                      </>
                    ) : (
                      <span className="text-gray-500">Retrait en magasin</span>
                    )}
                    <br />
                    <span>{order.user?.email}</span>
                  </p>
                </div>
                <p className="font-medium my-auto">
                  DT {order.totalAmount.toFixed(2)}
                </p>
                <div>
                  <div className="flex flex-col">
                    <span>
                      Method :{" "}
                      {order.paymentMethod === "cash_on_delivery"
                        ? "COD"
                        : order.paymentMethod}
                    </span>
                    <span>
                      Date : {new Date(order.orderDate).toLocaleDateString()}
                    </span>
                    
                    <StatusDropdown 
                      order={order} 
                      onStatusChange={handleStatusChange}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
