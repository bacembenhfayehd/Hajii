'use client'
import React, { useContext, useState } from 'react';
import { Search, Filter, MoreVertical, Mail, Phone, MapPin, Calendar, ShoppingBag, Eye, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { AdminContext } from '@/context/AdminContext';
import Loading from '@/components/Loading';
import toast from 'react-hot-toast'; // AJOUT: Import de toast

const UsersPage = () => {
  const {users, statistics, loading, deleteUser, fetchUsers} = useContext(AdminContext)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
  selectedFilter === 'all' || 
  (selectedFilter === 'bloqués' ? !user.isActive : user.isActive);
    return matchesSearch && matchesFilter;
  });

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const getStatusColor = (isActive) => {
  return isActive 
    ? 'bg-green-100 text-green-700 border-green-200'
    : 'bg-red-100 text-red-700 border-red-200';
};

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  
  const handleDeleteUser = (userId) => {
    console.log('handleDeleteUser appelé avec:', userId);
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  
  const confirmDelete = async () => {
    if (userToDelete) {
      setIsDeleting(true);
      try {
        console.log('Utilisateur à supprimer:', userToDelete);
        
        
        await deleteUser(userToDelete);
        
        
        await fetchUsers();
        
       
        setSelectedUsers(prev => prev.filter(id => id !== userToDelete));
        
        
        toast.success('Utilisateur supprimé avec succès');
        
        console.log('Utilisateur supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error(error.message)
        
        
        if (error.message.includes('User not found')) {
          // L'utilisateur a probablement été supprimé, on recharge
          await fetchUsers();
          toast.success('Utilisateur supprimé avec succès');
        } 
      } finally {
        setIsDeleting(false);
        setShowDeleteModal(false);
        setUserToDelete(null);
      }
    }
  };

  return (

    
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-lg font-medium mb-2">Clients</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ce mois-ci</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.newUsersThisMonth}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Bloqués</p>
                <p className="text-2xl font-bold text-red-600">{statistics.deletedUsers}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <UserX className="w-6 h-6 text-red-600" />
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
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none w-full sm:w-64"
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
                  <option value="bloqués">Bloqués</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="px-4 py-2 text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map(u => u.id)); 
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Etat</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Commandes</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dépenses</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user,index) => (
                  <tr key={user.id || index} className="hover:bg-gray-50 transition-colors"> 
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        checked={selectedUsers.includes(user.id)} 
                        onChange={() => handleSelectUser(user.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: #{user.id}</div> 
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          {user.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          {user.city}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(user.isActive)}`}>
                        {user.isActive ? 'Actif' : 'Bloqué'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <ShoppingBag className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{user.analytics?.totalOrders || 0}</span>
                      </div>
                      <div className="text-xs text-gray-500">dernière: {user.analytics?.lastOrderDate || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{user.analytics?.totalSpent || 0} DT</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {user.createdAt}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                    
                        <button 
                          onClick={() => handleDeleteUser(user.id)} 
                          className="p-2 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
                <span className="font-medium">{filteredUsers.length}</span> results
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-white transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1 text-sm bg-green-700 text-white rounded hover:bg-green-800 transition-colors">
                  1
                </button>
                <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-white transition-colors">
                  2
                </button>
                <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-white transition-colors">
                  3
                </button>
                <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-white transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <Trash2 className="w-6 h-6 green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Supprimer utilisateur</h3>
            <p className="text-gray-600 text-center mb-6">
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isDeleting}
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;