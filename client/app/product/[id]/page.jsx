"use client";
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import toast from "react-hot-toast";
import { User } from "lucide-react";

const Product = () => {
  const { id } = useParams();

  const {
    products = [],
    router,
    addToCart,
    getAllProducts,
    getProductComments,
    addComment,
  } = useAppContext();
  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);
  const [content, setContent] = useState("");
  const [commentaires, setCommentaires] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const result = await getProductComments(id);
        setCommentaires(result.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setCommentaires([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [id, getProductComments]);

  const handleSubmit = async () => {
    if (!content?.trim() || !id) return;

    setSubmitting(true);
    setError("");

    try {
      const newComment = await addComment(id, content.trim());

      // Ajouter le nouveau commentaire à la liste existante
      setCommentaires((prev) => [newComment, ...prev]);

      // Réinitialiser le formulaire
      setContent("");

      // Optionnel : afficher un message de succès
      toast.success("Commentaire ajouté avec succès!");
    } catch (error) {
      toast.error(error.message || "Erreur lors de l'ajout du commentaire");
    } finally {
      setSubmitting(false);
    }
  };

  

  const fetchProductData = async () => {
    try {
      const productArray = Array.isArray(products) ? products : [];

      // Recherche dans les produits existants
      let product = productArray.find((product) => product?._id === id);

      // Si non trouvé, fetch depuis l'API
      if (!product) {
        const response = await getAllProducts();
        const apiProducts = response?.products || [];
        product = apiProducts.find((p) => p?._id === id);
      }

      if (product) {
        setProductData(product);
        setMainImage(product.images?.[0]?.url || "/placeholder.jpg");
      } else {
        router.push("/404"); // Redirection si produit non trouvé
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductData();
      
    }
  }, [id, fetchProductData]);

  const handleAddToCart = async (productId) => {
    const result = await addToCart(productId, 1);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return productData ? (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="px-5 lg:px-16 xl:px-20">
            <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
              <Image
                src={mainImage || productData.image[0]}
                alt="alt"
                className="w-full h-auto object-cover mix-blend-multiply"
                width={1280}
                height={720}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
              {productData.name}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <svg
                    key={index}
                    className={`w-4 h-4 ${
                      index < Math.floor(4) ? "text-green-600" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 1.5l2.94 5.95 6.56.96-4.75 4.63 1.12 6.54L10 16.77l-5.87 3.09 1.12-6.54-4.75-4.63 6.56-.96L10 1.5z" />
                  </svg>
                ))}
              </div>
              <p>(4.5)</p>
            </div>
            <p className="text-gray-600 mt-3">{productData.description}</p>
            <p className="text-3xl font-medium mt-6">DT {productData.price}</p>
            <hr className="bg-gray-600 my-6" />
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse w-full max-w-72">
                <tbody>
                  <tr>
                    <td className="text-gray-600 font-medium">Stock</td>
                    <td className="text-gray-800/50 ">{productData.stock}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-600 font-medium">Categorie</td>
                    <td className="text-gray-800/50">{productData.category}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center mt-10 gap-4">
              <button
                onClick={() => handleAddToCart(productData._id)}
                className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
              >
                Ajouter au panier
              </button>
              <button
                onClick={() => {
                  addToCart(productData._id);
                  router.push("/cart");
                }}
                disabled={productData?.stock === 0}
                className={`w-full py-3.5 transition ${
                  productData?.stock === 0
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {productData?.stock === 0 ? "Rupture de stock" : "Acheter"}
              </button>
            </div>
          </div>
        </div>
        <div className="reviews-tab shadow-s3 p-8 rounded-md">
          {/* Formulaire amélioré */}
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h4 className="text-lg font-medium mb-3 text-gray-800">
              Laissez votre avis
            </h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <textarea
                onChange={(e) => setContent(e.target.value)}
                value={content}
                className="border border-gray-300 w-full p-3 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows="3"
                placeholder="Partagez votre expérience avec ce produit..."
                maxLength={300}
              />
              <button
                onClick={handleSubmit}
                disabled={!content?.trim() || submitting}
                className="bg-green hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-md transition-colors duration-200 whitespace-nowrap"
              >
                {submitting ? "Envoi..." : "Envoyer"}
              </button>
            </div>
            <div className="text-right text-sm text-gray-500 mt-1">
              {content?.length || 0}/300 caractères
            </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>

          <hr className="my-6" />

          {/* Section des commentaires */}
          <div>
            <h4 className="text-lg font-medium mb-4 text-gray-800 flex items-center gap-2">
              💬 Avis clients ({commentaires?.length})
            </h4>

            {loading ? (
              <div className="text-center py-8">
                Chargement des commentaires...
              </div>
            ) : commentaires?.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-3">💭</div>
                <p className="text-gray-500 text-lg">
                  Aucun commentaire pour ce produit.
                </p>
                <p className="text-gray-400 text-sm">
                  Soyez le premier à partager votre avis !
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {commentaires.map((comment, index) => (
                  <div
                    key={comment._id || index}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex gap-4">
                       
                      <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-green to-green rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {comment.user?.name || "U"}
                        </div>
                      </div>

                      {/* Contenu du commentaire */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-gray-900">
                            {comment.user?.name || "Utilisateur anonyme"}
                          </h5>
                          <span className="text-sm text-gray-500">
                            {comment.createdAt
                              ? new Date(comment.createdAt).toLocaleDateString(
                                  "fr-FR",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : ""}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-4 mt-16">
            <p className="text-3xl font-medium">
              Featured{" "}
              <span className="font-medium text-green-600">Products</span>
            </p>
            <div className="w-28 h-0.5 bg-green-600 mt-2"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
            {products.slice(0, 5).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
            See more
          </button>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default Product;
