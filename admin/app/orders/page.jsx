'use client';
import React, { useContext, useEffect, useState } from "react";
import { assets, orderDummyData} from "@/assets/assets";
import Image from "next/image";


import Loading from "@/components/Loading";
import { AdminContext } from "@/context/AdminContext";

const Orders = () => {
    const {getAllOrders} = useContext(AdminContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
  currentPage: 1,
  totalPages: 1,
  totalOrders: 0,
  hasNext: false,
  hasPrev: false
});
    const fetchOrders = async (page = 1) => {
  try {
    setLoading(true);
    const response = await getAllOrders(page); 
    if (response?.orders && response?.pagination) {
      setOrders(response.orders);
      setPagination(response.pagination);
    } else {
      throw new Error('Structure de réponse inattendue');
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
      hasPrev: false
    });
  } finally {
    setLoading(false);
  }
};


   

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
            {loading ? <Loading /> : <div className="md:p-10 p-4 space-y-5">
                <h2 className="text-lg font-medium">Orders</h2>
                <div className="max-w-4xl rounded-md">
                    {orders.map((order) => (
                        <div key={order._id} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300">
                            <div className="flex-1 flex gap-5 max-w-80">
                                <Image
                                    className="max-w-16 max-h-16 object-cover"
                                    src={assets.box_icon}
                                    alt="box_icon"
                                />
                                <p className="flex flex-col gap-3">
                                    <span className="font-medium">
                                        {order.items.map((item) => `${item.name} x ${item.quantity}`).join(", ")}
                                    </span>
                                    <span>Items : {order.items.length}</span>
                                </p>
                            </div>
                            <div>
                                <p>
                                    <span className="font-medium">{order.user?.name}</span>
                                    <br />
                                    <span >{order.shippingAddress.street}</span>
                                    <br />
                                    <span>{`${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`}</span>
                                    <br />
                                    <span>{order.user?.email}</span>
                                </p>
                            </div>
                            <p className="font-medium my-auto">${order.totalAmount.toFixed(2)}</p>
                            <div>
                                <p className="flex flex-col">
                                    <span>Method : {order.paymentMethod === 'cash_on_delivery' ? 'COD' : order.paymentMethod}</span>
                                    <span>Date : {new Date(order.orderDate).toLocaleDateString()}</span>
                                    <span>Statut : {order.status === 'pending' ? 'En attente' : 
                        order.status === 'cancelled' ? 'Annulé' : 
                        'Complété'}</span>

                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>}
            
        </div>
    );
};

export default Orders;