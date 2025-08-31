'use client'
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AppContext, useAppContext } from "@/context/AppContext";
import { useContext, useEffect, useState } from "react";
import { ChevronDown, Filter, X } from "lucide-react";

const AllProducts = () => {
      const { getAllProducts, router } = useContext(AppContext)
      const [products, setProducts] = useState([]);
      const [filteredProducts, setFilteredProducts] = useState([]);
      const [loading, setLoading] = useState(true);
      const [selectedCategory, setSelectedCategory] = useState('all');
      const [categories, setCategories] = useState(['all']);
      const [isFilterOpen, setIsFilterOpen] = useState(false);
    
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const response = await getAllProducts();
          const productList = response.products || [];
          setProducts(productList);
          setFilteredProducts(productList);
          
          // Extract unique categories from products
          const uniqueCategories = ['all', ...new Set(productList.map(product => product.category).filter(Boolean))];
          setCategories(uniqueCategories);
        } catch (error) {
          console.error("Erreur:", error.message);
          toast.error(`Erreur: ${error.message}`);
        } finally {
          setLoading(false);
        }
      };

      // Filter products based on selected category
      useEffect(() => {
        if (selectedCategory === 'all') {
          setFilteredProducts(products);
        } else {
          setFilteredProducts(products.filter(product => product.category === selectedCategory));
        }
      }, [selectedCategory, products]);
    
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

                {/* Modern Category Filter */}
                <div className="w-full mt-8 mb-6">
                  {/* Mobile Filter Button */}
                  <div className="md:hidden mb-4">
                    <button
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <Filter size={16} />
                      <span className="text-sm font-medium">Filtrer par catégorie</span>
                      <ChevronDown 
                        size={16} 
                        className={`transform transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>

                  {/* Filter Options */}
                  <div className={`
                    ${isFilterOpen ? 'block' : 'hidden'} md:block
                    bg-white rounded-xl border border-gray-100 p-4 shadow-sm
                  `}>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsFilterOpen(false);
                          }}
                          className={`
                            px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 
                            transform hover:scale-105 active:scale-95
                            ${selectedCategory === category
                              ? 'bg-green-600 text-white shadow-lg shadow-green-600/25'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }
                          `}
                        >
                          {category === 'all' ? 'Tous les produits' : category}
                          {selectedCategory === category && (
                            <span className="ml-2 inline-block w-2 h-2 bg-white rounded-full"></span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Active Filter Display */}
                    {selectedCategory !== 'all' && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>Filtré par:</span>
                          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full flex items-center gap-2">
                            {selectedCategory}
                            <button
                              onClick={() => setSelectedCategory('all')}
                              className="hover:bg-green-100 rounded-full p-0.5 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Results Count */}
                  <div className="mt-4 text-sm text-gray-600">
                    {loading ? (
                      <div className="animate-pulse">Chargement des produits...</div>
                    ) : (
                      <span>
                        {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} 
                        {selectedCategory !== 'all' && ` dans "${selectedCategory}"`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-4 pb-14 w-full">
                    {loading ? (
                      // Loading skeleton
                      Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                          <div className="bg-gray-200 rounded-lg h-48 w-full mb-2"></div>
                          <div className="bg-gray-200 rounded h-4 w-3/4 mb-1"></div>
                          <div className="bg-gray-200 rounded h-4 w-1/2"></div>
                        </div>
                      ))
                    ) : filteredProducts.length > 0 ? (
                      filteredProducts.map((product, index) => (
                        <ProductCard key={`${product.id || index}-${selectedCategory}`} product={product} />
                      ))
                    ) : (
                      <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Filter className="text-gray-400" size={24} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Aucun produit trouvé
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {selectedCategory === 'all' 
                            ? "Aucun produit disponible pour le moment"
                            : `Aucun produit dans la catégorie "${selectedCategory}"`
                          }
                        </p>
                        {selectedCategory !== 'all' && (
                          <button
                            onClick={() => setSelectedCategory('all')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Voir tous les produits
                          </button>
                        )}
                      </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AllProducts;