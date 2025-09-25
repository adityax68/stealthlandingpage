import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, User, Mail, Calendar, Loader2 } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
// Removed admin cache service - using direct API calls

interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: string;
  privileges: string[];
  is_active: boolean;
  created_at: string;
}

interface UsersResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = useCallback(async (searchTerm?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const skip = (currentPage - 1) * usersPerPage;
      
      // Removed cache check - using direct API calls with database indexes

      const endpoint = searchTerm 
        ? `${API_ENDPOINTS.ADMIN_USERS_SEARCH}?email=${encodeURIComponent(searchTerm)}&skip=${skip}&limit=${usersPerPage}`
        : `${API_ENDPOINTS.ADMIN_USERS}?skip=${skip}&limit=${usersPerPage}`;

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: UsersResponse = await response.json();
        
        // Handle new API response format with pagination
        if (data.users && data.pagination) {
          setUsers(data.users);
          setTotalPages(data.pagination.total_pages);
          setTotalUsers(data.pagination.total);
          
          // Removed caching - using direct API calls with database indexes
        } else {
          // Fallback for old API format
          setUsers(Array.isArray(data) ? data : []);
          setTotalPages(Math.ceil((Array.isArray(data) ? data.length : 0) / usersPerPage) || 1);
          setTotalUsers(Array.isArray(data) ? data.length : 0);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, usersPerPage]);

  // Debounced search function
  const debouncedSearch = useCallback((searchTerm: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(async () => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        setCurrentPage(1);
        await fetchUsers(searchTerm.trim());
        setIsSearching(false);
      } else {
        setCurrentPage(1);
        await fetchUsers();
      }
    }, 300); // 300ms debounce
    
    setSearchTimeout(timeout as unknown as number);
  }, [fetchUsers, searchTimeout]);

  const handleSearch = () => {
    debouncedSearch(searchEmail);
  };

  const handleClearSearch = () => {
    setSearchEmail('');
    setCurrentPage(1);
    fetchUsers();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-purple-600 text-black border-purple-600';
      case 'hr':
        return 'bg-blue-600 text-black border-blue-600';
      case 'employee':
        return 'bg-green-600 text-black border-green-600';
      case 'counsellor':
        return 'bg-orange-600 text-black border-orange-600';
      default:
        return 'bg-gray-600 text-black border-gray-600';
    }
  };

  // Skeleton loading component
  const SkeletonLoader = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-32"></div>
                <div className="h-3 bg-gray-700 rounded w-48"></div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-6 bg-gray-700 rounded-full w-16"></div>
              <div className="h-6 bg-gray-700 rounded-full w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>
        
        {/* Search skeleton */}
        <div className="flex items-center space-x-4">
          <div className="h-10 bg-gray-700 rounded w-80 animate-pulse"></div>
          <div className="h-10 bg-gray-700 rounded w-24 animate-pulse"></div>
        </div>
        
        {/* Users skeleton */}
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-center">
        <p className="text-red-300 font-medium">{error}</p>
        <button
          onClick={() => fetchUsers()}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-black rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-start/15 to-primary-end/10 backdrop-blur-xl rounded-2xl p-6 border border-primary-start/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">User Management</h2>
            <p className="text-gray-800/70 text-sm">Manage system users and their roles</p>
          </div>
          <div className="text-sm text-gray-800/60">
            Total: {totalUsers} users
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-gradient-to-br from-primary-start/15 to-primary-end/10 backdrop-blur-xl rounded-2xl p-6 border border-primary-start/20">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-800/50" />
              <input
                type="text"
                placeholder="Search by email..."
                value={searchEmail}
                onChange={(e) => {
                  setSearchEmail(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 bg-primary-start/10 border border-white/20 rounded-lg text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-start/50 focus:border-transparent"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800/50 w-4 h-4 animate-spin" />
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end text-gray-800 rounded-lg hover:from-primary-start/90 hover:to-primary-end/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Search
            </button>
            {searchEmail && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 bg-primary-start/10 border border-white/20 text-gray-800 rounded-lg hover:bg-primary-start/20 transition-all duration-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gradient-to-br from-primary-start/10 to-primary-end/5 backdrop-blur-xl rounded-2xl border border-primary-start/20 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-br from-primary-start/10 to-primary-end/5 border-b border-primary-start/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-800/80">User</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-800/80">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-800/80">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-800/80">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-800/80">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gradient-to-br from-primary-start/10 to-primary-end/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-start to-primary-end rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-800" />
                        </div>
                        <div>
                          <div className="text-gray-800 font-medium">{user.full_name}</div>
                          <div className="text-gray-800/60 text-sm">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-800/50" />
                        <span className="text-gray-800/80">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.is_active 
                          ? 'bg-green-600 text-black border border-green-600' 
                          : 'bg-red-600 text-black border border-red-600'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-800/50" />
                        <span className="text-gray-800/80 text-sm">
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden">
          <div className="p-4 space-y-4">
            {users.map((user) => (
              <div key={user.id} className="bg-gradient-to-br from-primary-start/10 to-primary-end/5 rounded-xl p-4 border border-primary-start/20">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-start to-primary-end rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-800" />
                    </div>
                    <div>
                      <div className="text-gray-800 font-medium">{user.full_name}</div>
                      <div className="text-gray-800/60 text-sm">@{user.username}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                    {user.role.toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-800/50" />
                    <span className="text-gray-800/80 text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-800/50" />
                      <span className="text-gray-800/80 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.is_active 
                        ? 'bg-green-600 text-black border border-green-600' 
                        : 'bg-red-600 text-black border border-red-600'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {totalPages >= 1 && (
          <div className="px-6 py-4 border-t border-primary-start/20">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-800/60">
                Page {currentPage} of {totalPages} ({users.length} users)
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 bg-primary-start/10 border border-white/20 rounded-lg text-gray-800/80 hover:bg-primary-start/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        currentPage === page
                          ? 'bg-primary-start text-gray-800'
                          : 'bg-primary-start/10 text-gray-800/80 hover:bg-primary-start/20'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-primary-start/10 border border-white/20 rounded-lg text-gray-800/80 hover:bg-primary-start/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
