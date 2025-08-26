'use client'
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AppContext, useAppContext } from "@/context/AppContext";
import { useContext, useEffect, useState } from "react";

const AllProducts = () => {

      const { getAllProducts, router } = useContext(AppContext)
      const [products, setProducts] = useState([]);
      const [loading, setLoading] = useState(true);
    
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const response = await getAllProducts({
            limit: 10
          });
          setProducts(response.products || []);
        } catch (error) {
          console.error("Erreur:", error.message);
          toast.error(`Erreur: ${error.message}`);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchProducts();
      }, []); 

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                <div className="flex flex-col items-end pt-12">
                    <p className="text-2xl font-medium">Tous les produits</p>
                    <div className="w-32 h-0.5 bg-green-600 rounded-full "></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
                    {products.map((product, index) => <ProductCard key={index} product={product} />)}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AllProducts;
