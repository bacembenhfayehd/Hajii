"use client";
import React, { useContext, useEffect, useState } from "react";
import { assets, productsDummyData } from "@/assets/assets";
import Image from "next/image";
import Loading from "@/components/Loading";
import { AdminContext } from "@/context/AdminContext";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import EditProductModal from "@/components/EditProductModal";

const ProductList = () => {
  const { getAllProducts,updateProduct } = useContext(AdminContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);


  const handleEditClick = (product) => {
  setSelectedProduct(product);
  setIsModalOpen(true);
};

const handleModalClose = () => {
  setIsModalOpen(false);
  setSelectedProduct(null);
};

const handleUpdate = async (updatedData) => {
  try {
    // Filtrer les champs modifiés seulement (optionnel)
    const changedFields = {};
    if (updatedData.name !== selectedProduct.name) changedFields.name = updatedData.name;
    if (updatedData.category !== selectedProduct.category) changedFields.category = updatedData.category;
    if (updatedData.price !== selectedProduct.price) changedFields.price = parseFloat(updatedData.price);
    
    // Utiliser toast.promise pour UX
    await toast.promise(
      updateProduct(selectedProduct._id, changedFields),
      {
        loading: 'Mise à jour en cours...',
        success: 'Produit mis à jour avec succès!',
        error: (err) => `Erreur: ${err.message}`,
      }
    );
    fetchProducts();
    
  } catch (error) {
    toast.error(error.message)
  }
};

 

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { products: fetchedProducts } = await getAllProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Erreur:", error.message);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pdtID) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/products/${pdtID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Échec de la suppression");
      }
      const result = await response.json();
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== pdtID)
      );
      toast.success(result.message);
    } catch (error) {
      console.error("Erreur:", error);
      fetchProducts();
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:p-10 p-4">
          <h2 className="pb-4 text-lg font-medium">Liste des produits</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className=" table-fixed w-full overflow-hidden">
              <thead className="text-gray-900 text-sm text-left">
                <tr>
                  <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">
                    Produit
                  </th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">
                    Catégorie
                  </th>
                  <th className="px-4 py-3 font-medium truncate">Prix</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {products.map((product, index) => (
                  <tr
                    key={product._id || index}
                    className="border-t border-gray-500/20"
                  >
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="bg-gray-500/10 rounded p-2">
                        <Image
                          src={
                            product.images && product.images.length > 0
                              ? product.images[0].url
                              : "/placeholder-image.jpg"
                          }
                          alt={
                            product.images && product.images.length > 0
                              ? product.images[0].alt
                              : product.name
                          }
                          className="w-16"
                          width={1280}
                          height={720}
                        />
                      </div>
                      <span className="truncate w-full">{product.name}</span>
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">
                      {product.category}
                    </td>
                    <td className="px-4 py-3">${product.price}</td>
                    <td className="px-4 py-3 max-sm:hidden">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(product) }
                          className="p-2 cursor-pointer text-black-600 hover:bg-black-50 rounded-md transition-colors"
                          title="Modifier"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-2 cursor-pointer text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <EditProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default ProductList;
