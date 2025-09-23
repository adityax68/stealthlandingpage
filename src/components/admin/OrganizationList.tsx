import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Building2, Mail, Calendar, Hash, Loader2, Plus } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
// Removed admin cache service - using direct API calls

interface Organization {
  id: number;
  org_id: string;
  org_name: string;
  hr_email: string;
  created_at: string;
  updated_at: string;
}

interface OrganizationsResponse {
  organisations: Organization[];  // Note: API uses British spelling
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

const OrganizationList: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchOrgId, setSearchOrgId] = useState('');
  const [searchHrEmail, setSearchHrEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrganizations, setTotalOrganizations] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState<'org_id' | 'hr_email'>('org_id');

  const organizationsPerPage = 10;

  useEffect(() => {
    fetchOrganizations();
  }, [currentPage]);

  const fetchOrganizations = async (orgId?: string, hrEmail?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const skip = (currentPage - 1) * organizationsPerPage;
      
      // Removed cache check - using direct API calls with database indexes

      let endpoint = `${API_ENDPOINTS.ADMIN_ORGANISATIONS}?skip=${skip}&limit=${organizationsPerPage}`;
      
      if (orgId || hrEmail) {
        endpoint = `${API_ENDPOINTS.ADMIN_ORGANISATIONS_SEARCH}?skip=${skip}&limit=${organizationsPerPage}`;
        if (orgId) endpoint += `&org_id=${encodeURIComponent(orgId)}`;
        if (hrEmail) endpoint += `&hr_email=${encodeURIComponent(hrEmail)}`;
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: OrganizationsResponse = await response.json();
        setOrganizations(data.organisations);  // Use British spelling from API
        
        // Use pagination data from API response
        if (data.pagination) {
          setTotalPages(data.pagination.total_pages);
          setTotalOrganizations(data.pagination.total);
          
          // Removed caching - using direct API calls with database indexes
        } else {
          // Fallback for search results
          setTotalPages(Math.ceil(data.organisations.length / organizationsPerPage) || 1);
          setTotalOrganizations(data.organisations.length);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to fetch organizations');
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      setError('Failed to fetch organizations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchOrgId.trim() || searchHrEmail.trim()) {
      setIsSearching(true);
      setCurrentPage(1);
      await fetchOrganizations(searchOrgId.trim(), searchHrEmail.trim());
      setIsSearching(false);
    } else {
      setCurrentPage(1);
      await fetchOrganizations();
    }
  };

  const handleClearSearch = () => {
    setSearchOrgId('');
    setSearchHrEmail('');
    setCurrentPage(1);
    fetchOrganizations();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading organizations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-center">
        <p className="text-red-300 font-medium">{error}</p>
        <button
          onClick={() => fetchOrganizations()}
          className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Organization Management</h2>
            <p className="text-white/70 text-sm">Manage registered organizations and their HR contacts</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-white/60">
              Total: {totalOrganizations} organizations
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-lg hover:from-primary-start/90 hover:to-primary-end/90 transition-all duration-300 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Organization
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="space-y-4">
          {/* Search Type Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setSearchType('org_id')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                searchType === 'org_id'
                  ? 'bg-primary-start text-white'
                  : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
              }`}
            >
              Search by Org ID
            </button>
            <button
              onClick={() => setSearchType('hr_email')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                searchType === 'hr_email'
                  ? 'bg-primary-start text-white'
                  : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
              }`}
            >
              Search by HR Email
            </button>
          </div>

          {/* Search Input */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                {searchType === 'org_id' ? (
                  <input
                    type="text"
                    placeholder="Search by organization ID..."
                    value={searchOrgId}
                    onChange={(e) => setSearchOrgId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-start/50 focus:border-transparent"
                  />
                ) : (
                  <input
                    type="email"
                    placeholder="Search by HR email..."
                    value={searchHrEmail}
                    onChange={(e) => setSearchHrEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-start/50 focus:border-transparent"
                  />
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-lg hover:from-primary-start/90 hover:to-primary-end/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Search
              </button>
              {(searchOrgId || searchHrEmail) && (
                <button
                  onClick={handleClearSearch}
                  className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Organization</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Organization ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">HR Email</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Created</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {organizations.map((org) => (
                  <tr key={org.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-accent-start to-accent-end rounded-lg flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{org.org_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4 text-white/50" />
                        <span className="text-white/80 font-mono text-sm">{org.org_id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-white/50" />
                        <span className="text-white/80">{org.hr_email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-white/50" />
                        <span className="text-white/80 text-sm">
                          {new Date(org.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-white/50" />
                        <span className="text-white/80 text-sm">
                          {new Date(org.updated_at).toLocaleDateString()}
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
            {organizations.map((org) => (
              <div key={org.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-accent-start to-accent-end rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{org.org_name}</div>
                      <div className="text-white/60 text-sm">ID: {org.org_id}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-white/50" />
                    <span className="text-white/80 text-sm">{org.hr_email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-white/50" />
                    <span className="text-white/80 text-sm">
                      Created: {new Date(org.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-white/50" />
                    <span className="text-white/80 text-sm">
                      Updated: {new Date(org.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {totalPages >= 1 && (
          <div className="px-6 py-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="text-sm text-white/60">
                Page {currentPage} of {totalPages} ({organizations.length} organizations)
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 bg-white/10 border border-white/20 rounded-lg text-white/80 hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          ? 'bg-primary-start text-white'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white/10 border border-white/20 rounded-lg text-white/80 hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default OrganizationList;
