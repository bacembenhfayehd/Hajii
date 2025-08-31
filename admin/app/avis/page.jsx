'use client'

import React, { useContext, useState } from 'react';
import { Search, Filter, Trash2, Star, MessageSquare, AlertTriangle, CheckCircle, Calendar, User } from 'lucide-react';
import { AdminContext } from '@/context/AdminContext';
import Loading from '@/components/Loading';
import toast from 'react-hot-toast';

const CommentsPage = () => {
  const {comments,setComments,cp,cs,loading,deleteComment,fetchComments} = useContext(AdminContext)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedComments, setSelectedComments] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

 

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || comment.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleSelectComment = (commentId) => {
    setSelectedComments(prev => 
      prev.includes(commentId) 
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const handleDeleteComment = (commentId) => {
  console.log('handleDeleteComment appelé avec:', commentId);
  setCommentToDelete(commentId);
  setShowDeleteModal(true);
};

  

  const handleBulkDelete = () => {
    setComments(prev => prev.filter(comment => !selectedComments.includes(comment.id)));
    setSelectedComments([]);
  };



  
const confirmDelete = async () => {
  if (commentToDelete) {
    setIsDeleting(true);
    try {
      console.log('Commentaire à supprimer:', commentToDelete);
      
      // Appel de l'API pour supprimer le commentaire
      await deleteComment(commentToDelete);
      
      // Mise à jour de l'état local après succès - SUPPRESSION de setComments
      // setComments(prev => prev.filter(comment => comment._id !== commentToDelete));
      setSelectedComments(prev => prev.filter(id => id !== commentToDelete));
      
      // Afficher un message de succès
      toast.success('Commentaire supprimé avec succès');
      await fetchComments();
      
      console.log('Commentaire supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      
      // Vérifier si l'erreur contient "Comment not found" mais que la suppression a réussi
      if (error.message.includes('Comment not found')) {
        // Le commentaire a probablement été supprimé, on met à jour l'état
        // setComments(prev => prev.filter(comment => comment._id !== commentToDelete));
        setSelectedComments(prev => prev.filter(id => id !== commentToDelete));
        toast.success('Commentaire supprimé avec succès');
      } else {
        toast.error('Erreur lors de la suppression du commentaire');
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setCommentToDelete(null);
    }
  }
};


  

  return (
    <div className="min-h-screen p-6">
      
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-lg font-medium mb-2">Gestion des commentaires </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border  border-gray-300 p-6 ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-900">{cs.totalComments}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </div>
          
         {/* <div className="bg-white border  border-gray-300 p-6 ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Approved</p>
                <p className="text-2xl font-bold text-green-700">
                  {comments.filter(c => c.status === 'approved').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {comments.filter(c => c.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>*/}

          <div className="bg-white border  border-gray-300 p-6 ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Supprimés</p>
                <p className="text-2xl font-bold text-red-600">
                  {comments.filter(c => c.status === 'flagged').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        
        <div className="bg-white border border-gray-300 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search comments, products, or customers..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none w-full sm:w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  className="pl-10 pr-8 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-white"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">Tous</option>
                  <option value="flagged">supprimés</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              {selectedComments.length > 0 && (
                <button 
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected ({selectedComments.length})
                </button>
              )}
            </div>
          </div>
        </div>

        
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <div key={comment._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    checked={selectedComments.includes(comment._id)}
                    onChange={() => handleSelectComment(comment._id)}
                  />
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{comment.user.name}</h3>
                    <p className="text-sm text-gray-500">{comment.user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{comment.product.name}</h4>
                  {/*<div className="flex items-center space-x-1">
                    {renderStars(comment.rating)}
                    <span className="text-sm text-gray-600 ml-2">({comment.rating}/5)</span>
                  </div>*/}
                </div>
                
                <p className="text-gray-700 leading-relaxed">{comment.content}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {comment.createdAt}
                  </span>
                 {/* <span>{comment.helpful} people found this helpful</span>*/}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredComments.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun commentaire trouvé</h3>
            <p className="text-gray-500">Essai plus tard ou par filtrage</p>
          </div>
        )}

       
        {filteredComments.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Affiche <span className="font-medium">1</span> a <span className="font-medium">{filteredComments.length}</span> de{' '}
                <span className="font-medium">{filteredComments.length}</span> commentaires
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                  Précedent
                </button>
                <button className="px-3 py-1 text-sm bg-green-700 text-white rounded hover:bg-green-800 transition-colors">
                  1
                </button>
                <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                  Prochain
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

     
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Supprimer commentaire</h3>
            <p className="text-gray-600 text-center mb-6">
              Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default CommentsPage;