import React, { useState, useEffect, useRef, useContext } from 'react';
import { Search, X } from 'lucide-react';
import { AppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

const ModernSearchOverlay = () => {
    const { getAllProducts } = useContext(AppContext);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchInputRef = useRef(null);
  const router = useRouter()

 

  // Fonction de recherche simulée
  const searchProducts = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await getAllProducts({ search: query, limit: 10 });
      setSearchResults(response.products || []);
    } catch (error) {
      console.error("Erreur recherche:", error.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce pour la recherche
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchProducts(searchQuery);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Auto-focus quand la recherche s'ouvre
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <>
      {/* Icône de recherche cliquable */}
      <button
        onClick={openSearch}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Search className="w-5 h-5 text-gray-600" />
      </button>

      {/* Overlay de recherche */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header de recherche */}
            <div className="flex items-center p-4 border-b border-gray-100">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Rechercher des produits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-lg outline-none placeholder-gray-400"
              />
              <button
                onClick={closeSearch}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-2"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Contenu des résultats */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : searchQuery && searchResults.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>Aucun produit trouvé pour "{searchQuery}"</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-2">
                  {searchResults.map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      onClick={() => {
                        { router.push('/product/' + product._id); scrollTo(0, 0) }
                        console.log('Naviguer vers:', product);
                        closeSearch();
                      }}
                    >
                      <img
                         src={product.images[0]?.url}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                      />
                      <div className="ml-3 flex-1">
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.price} DT</p>
                      </div>
                      <Search className="w-4 h-4 text-gray-300" />
                    </div>
                  ))}
                </div>
              ) : searchQuery === '' ? (
                <div className="p-6 text-center text-gray-500">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>Commencez à taper pour rechercher...</p>
                </div>
              ) : null}
            </div>

            {/* Suggestions rapides (optionnel) */}
            {!searchQuery && (
              <div className="border-t border-gray-100 p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recherches populaires</h4>
                <div className="flex flex-wrap gap-2">
                  {['ongles-vernis', 'skincare-serum', 'parfums-homme', 'gelnettoyant'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ModernSearchOverlay;