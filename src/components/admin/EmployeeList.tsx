import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, Users, Mail, Calendar, Building, Loader2, UserCheck } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
// Removed admin cache service - using direct API calls

interface Employee {
  id: number;
  employee_code: string;
  full_name: string;
  email: string;
  department: string;
  position: string;
  hr_email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface EmployeesResponse {
  employees: Employee[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchEmployeeCode, setSearchEmployeeCode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

  const employeesPerPage = 10;

  useEffect(() => {
    fetchEmployees();
  }, [currentPage]);

  const fetchEmployees = useCallback(async (searchTerm?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const skip = (currentPage - 1) * employeesPerPage;
      
      // Removed cache check - using direct API calls with database indexes

      console.log('🌐 Fetching employees from API');
      const endpoint = searchTerm 
        ? `${API_ENDPOINTS.ADMIN_EMPLOYEES_SEARCH}?employee_code=${encodeURIComponent(searchTerm)}&skip=${skip}&limit=${employeesPerPage}`
        : `${API_ENDPOINTS.ADMIN_EMPLOYEES}?skip=${skip}&limit=${employeesPerPage}`;

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: EmployeesResponse = await response.json();
        
        // Handle new API response format with pagination
        if (data.employees && data.pagination) {
          setEmployees(data.employees);
          setTotalPages(data.pagination.total_pages);
          setTotalEmployees(data.pagination.total);
          
          // Removed caching - using direct API calls with database indexes
        } else {
          // Fallback for old API format
          setEmployees(Array.isArray(data) ? data : []);
          setTotalPages(Math.ceil((Array.isArray(data) ? data.length : 0) / employeesPerPage) || 1);
          setTotalEmployees(Array.isArray(data) ? data.length : 0);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to fetch employees');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to fetch employees. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, employeesPerPage]);

  // Debounced search function
  const debouncedSearch = useCallback((searchTerm: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(async () => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        setCurrentPage(1);
        await fetchEmployees(searchTerm.trim());
        setIsSearching(false);
      } else {
        setCurrentPage(1);
        await fetchEmployees();
      }
    }, 300); // 300ms debounce
    
    setSearchTimeout(timeout as unknown as number);
  }, [fetchEmployees, searchTimeout]);

  const handleSearch = () => {
    debouncedSearch(searchEmployeeCode);
  };

  const handleClearSearch = () => {
    setSearchEmployeeCode('');
    setCurrentPage(1);
    fetchEmployees();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
        
        {/* Employees skeleton */}
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-center">
        <p className="text-red-300 font-medium">{error}</p>
        <button
          onClick={() => fetchEmployees()}
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
            <h2 className="text-2xl font-bold text-white mb-2">Employee Management</h2>
            <p className="text-white/70 text-sm">Manage organization employees and their information</p>
          </div>
          <div className="text-sm text-white/60">
            Total: {totalEmployees} employees
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                placeholder="Search by employee code..."
                value={searchEmployeeCode}
                onChange={(e) => setSearchEmployeeCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-start/50 focus:border-transparent"
              />
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
            {searchEmployeeCode && (
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

      {/* Employees Table */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Employee</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Employee Code</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Position</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-secondary-start to-secondary-end rounded-lg flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{employee.full_name}</div>
                          <div className="flex items-center space-x-1 text-white/60 text-sm">
                            <Mail className="w-3 h-3" />
                            <span>{employee.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/80 font-mono text-sm">{employee.employee_code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-white/50" />
                        <span className="text-white/80">{employee.department}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/80">{employee.position}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        employee.is_active 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {employee.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-white/50" />
                        <span className="text-white/80 text-sm">
                          {new Date(employee.created_at).toLocaleDateString()}
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
            {employees.map((employee) => (
              <div key={employee.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-secondary-start to-secondary-end rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{employee.full_name}</div>
                      <div className="text-white/60 text-sm">{employee.employee_code}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    employee.is_active 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {employee.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-white/50" />
                    <span className="text-white/80 text-sm">{employee.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-white/50" />
                    <span className="text-white/80 text-sm">{employee.department}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-white/50" />
                    <span className="text-white/80 text-sm">{employee.position}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-white/50" />
                    <span className="text-white/80 text-sm">
                      {new Date(employee.created_at).toLocaleDateString()}
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
                Page {currentPage} of {totalPages} ({employees.length} employees)
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

export default EmployeeList;
