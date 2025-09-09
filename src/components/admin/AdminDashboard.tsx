import React, { useState, useEffect } from 'react';
import { UserPlus, Users, X, User, Building2, Users2, TrendingUp, ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Import components directly for now
import UserList from './UserList';
import EmployeeList from './EmployeeList';
import OrganizationList from './OrganizationList';
import TestAnalytics from './TestAnalytics';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AdminDashboardProps {}

type AdminTab = 'overview' | 'users' | 'employees' | 'organizations' | 'test-analytics'

interface OrganisationForm {
  org_name: string;
  hr_email: string;
}

interface AdminStats {
  totalUsers: number;
  totalEmployees: number;
  totalOrganizations: number;
}

interface MonthlyUserData {
  week: string; // Backend returns 'week' field but contains monthly data
  newUsers: number;
}

interface MonthlyUsersResponse {
  weeklyData: MonthlyUserData[]; // Backend returns weeklyData field but contains monthly data
}

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  
  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/', { replace: true });
      return;
    }
    
    try {
      const parsedUserData = JSON.parse(userData);
      if (parsedUserData.role !== 'admin') {
        navigate('/dashboard', { replace: true });
        return;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/', { replace: true });
      return;
    }
  }, [navigate]);
  const [formData, setFormData] = useState<OrganisationForm>({
    org_name: '',
    hr_email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  
  // Admin stats state
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 0,
    totalEmployees: 0,
    totalOrganizations: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  
  // Monthly user data state
  const [monthlyUserData, setMonthlyUserData] = useState<MonthlyUserData[]>([]);
  const [monthlyDataLoading, setMonthlyDataLoading] = useState(true);
  const [monthlyDataError, setMonthlyDataError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  // Fetch admin stats
  const fetchAdminStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(API_ENDPOINTS.ADMIN_STATS, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAdminStats(data);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch admin stats:', response.status, errorText);
        setStatsError(`Failed to load stats: ${response.status}`);
        // Set default values on error
        setAdminStats({
          totalUsers: 0,
          totalEmployees: 0,
          totalOrganizations: 0
        });
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      setStatsError('Network error loading stats');
      // Set default values on error
      setAdminStats({
        totalUsers: 0,
        totalEmployees: 0,
        totalOrganizations: 0
      });
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch monthly user data
  const fetchMonthlyUserData = async () => {
    try {
      setMonthlyDataLoading(true);
      setMonthlyDataError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(API_ENDPOINTS.ADMIN_MONTHLY_USERS, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data: MonthlyUsersResponse = await response.json();
        setMonthlyUserData(data.weeklyData); // Backend returns weeklyData field but contains monthly data
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch monthly user data:', response.status, errorText);
        setMonthlyDataError(`Failed to load monthly data: ${response.status}`);
        // Set default empty data on error
        setMonthlyUserData([]);
      }
    } catch (error) {
      console.error('Error fetching monthly user data:', error);
      setMonthlyDataError('Network error loading monthly data');
      // Set default empty data on error
      setMonthlyUserData([]);
    } finally {
      setMonthlyDataLoading(false);
    }
  };

  // Load admin stats and monthly data on component mount
  useEffect(() => {
    fetchAdminStats();
    fetchMonthlyUserData();
  }, []);

  // Add a loading state to prevent white page
  if (statsLoading && monthlyDataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-start/30 border-t-primary-start mx-auto mb-6"></div>
          <p className="text-white text-xl">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  const handleBackToDashboard = () => {
    navigate('/dashboard', { replace: true });
  };

  const handleAddOrganisation = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ org_name: '', hr_email: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/admin/organisations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setToastMessage('Organisation added successfully!');
        setToastType('success');
        setShowToast(true);
        handleCloseModal();
        
        // Hide toast after 3 seconds
        setTimeout(() => setShowToast(false), 3000);
      } else {
        const errorData = await response.json();
        setToastMessage(errorData.detail || 'Failed to add organisation');
        setToastType('error');
        setShowToast(true);
      }
    } catch {
      setToastMessage('Network error. Please try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Chart configuration with enhanced styling
  const chartData = {
    labels: monthlyUserData.map(item => item.week), // Backend returns 'week' field but contains monthly data
    datasets: [
      {
        label: 'New Users',
        data: monthlyUserData.map(item => item.newUsers),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: chartType === 'line' 
          ? 'rgba(99, 102, 241, 0.15)' 
          : 'rgba(99, 102, 241, 0.8)',
        borderWidth: chartType === 'line' ? 4 : 0,
        fill: chartType === 'line',
        tension: 0.4,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointHoverBackgroundColor: 'rgb(99, 102, 241)',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 4,
        // Bar chart specific styling
        borderRadius: chartType === 'bar' ? 8 : 0,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(99, 102, 241, 0.8)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        padding: 8,
        titleFont: {
          size: 12,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 11,
        },
        callbacks: {
          title: function(context: { label: string }[]) {
            return `Month: ${context[0].label}`;
          },
          label: function(context: { parsed: { y: number } }) {
            return `New Users: ${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
          lineWidth: 0.5,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            size: 10,
            weight: 'normal' as const,
          },
          padding: 4,
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
          lineWidth: 0.5,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            size: 10,
            weight: 'normal' as const,
          },
          padding: 4,
          beginAtZero: true,
          callback: function(value: string | number) {
            return typeof value === 'number' ? value.toLocaleString() : value;
          },
        },
        border: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    elements: {
      point: {
        hoverBackgroundColor: 'rgb(99, 102, 241)',
        hoverBorderColor: '#ffffff',
        hoverBorderWidth: 2,
        radius: 3,
        hoverRadius: 5,
      },
    },
    animation: {
      duration: 500,
      easing: 'easeInOutQuart' as const,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Orbs - Consistent with main website */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-48 h-48 md:top-20 md:left-20 md:w-72 md:h-72 bg-gradient-to-br from-primary-start/20 to-primary-end/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 md:bottom-20 md:right-20 md:w-96 md:h-96 bg-gradient-to-br from-secondary-start/20 to-secondary-end/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 md:w-80 md:h-80 bg-gradient-to-br from-accent-start/15 to-accent-end/15 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-primary-start/10 to-accent-start/10 rounded-full blur-2xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-secondary-start/15 to-primary-end/15 rounded-full blur-2xl animate-float-delayed"></div>
        <div className="absolute top-3/4 left-1/3 w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-accent-start/20 to-secondary-start/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-start/5 via-transparent to-accent-start/5 animate-water-flow"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header Section */}
        <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Back Button and Title */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToDashboard}
                  className="group relative overflow-hidden bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-white/25 flex items-center space-x-2"
                >
                  <div className="relative z-10 flex items-center space-x-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Dashboard</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Admin Panel
                </h1>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Add Organisation Button */}
                <button 
                  onClick={handleAddOrganisation}
                  className="group relative overflow-hidden bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-start/90 hover:to-primary-end/90 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary-start/25 flex items-center space-x-2"
                >
                  <div className="relative z-10 flex items-center space-x-2">
                    <UserPlus className="w-4 h-4" />
                    <span>Add Organisation</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>

                {/* Add Counsellor Button */}
                <button className="group relative overflow-hidden bg-gradient-to-r from-secondary-start to-secondary-end hover:from-secondary-start/90 hover:to-secondary-end/90 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-secondary-start/25 flex items-center space-x-2">
                  <div className="relative z-10 flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Add Counsellor</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-2 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-primary-start to-primary-end text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'users'
                    ? 'bg-gradient-to-r from-primary-start to-primary-end text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('employees')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'employees'
                    ? 'bg-gradient-to-r from-primary-start to-primary-end text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Employees
              </button>
              <button
                onClick={() => setActiveTab('organizations')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'organizations'
                    ? 'bg-gradient-to-r from-primary-start to-primary-end text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Organizations
              </button>
              <button
                onClick={() => setActiveTab('test-analytics')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'test-analytics'
                    ? 'bg-gradient-to-r from-primary-start to-primary-end text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Test Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {activeTab === 'overview' && (
            <>
              {/* Admin Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Total Users Card */}
            <div className="group relative overflow-hidden bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-white">
                    {statsLoading ? (
                      <div className="animate-pulse bg-white/20 h-8 w-16 rounded"></div>
                    ) : statsError ? (
                      <span className="text-red-400 text-sm">Error</span>
                    ) : (
                      adminStats.totalUsers.toLocaleString()
                    )}
                  </p>
                  {statsError && (
                    <div className="mt-2">
                      <p className="text-red-400 text-xs">{statsError}</p>
                      <button 
                        onClick={fetchAdminStats}
                        className="mt-1 px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs rounded transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-gradient-to-br from-primary-start/20 to-primary-end/20 rounded-xl">
                  <User className="w-6 h-6 text-primary-start" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-start/5 via-transparent to-primary-end/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Total Employees Card */}
            <div className="group relative overflow-hidden bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium mb-1">Total Employees</p>
                  <p className="text-3xl font-bold text-white">
                    {statsLoading ? (
                      <div className="animate-pulse bg-white/20 h-8 w-16 rounded"></div>
                    ) : statsError ? (
                      <span className="text-red-400 text-sm">Error</span>
                    ) : (
                      adminStats.totalEmployees.toLocaleString()
                    )}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-secondary-start/20 to-secondary-end/20 rounded-xl">
                  <Users2 className="w-6 h-6 text-secondary-start" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-start/5 via-transparent to-secondary-end/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Total Organizations Card */}
            <div className="group relative overflow-hidden bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium mb-1">Total Organizations</p>
                  <p className="text-3xl font-bold text-white">
                    {statsLoading ? (
                      <div className="animate-pulse bg-white/20 h-8 w-16 rounded"></div>
                    ) : statsError ? (
                      <span className="text-red-400 text-sm">Error</span>
                    ) : (
                      adminStats.totalOrganizations.toLocaleString()
                    )}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-accent-start/20 to-accent-end/20 rounded-xl">
                  <Building2 className="w-6 h-6 text-accent-start" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-accent-start/5 via-transparent to-accent-end/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

              {/* Monthly User Growth Chart - Compact */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 mb-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                    <div className="p-2 bg-gradient-to-br from-primary-start/20 to-primary-end/20 rounded-lg shadow-lg">
                      <TrendingUp className="w-4 h-4 text-primary-start" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">User Growth</h3>
                      <p className="text-white/70 text-xs">Monthly registrations</p>
                    </div>
                  </div>
                  
                  {/* Chart Type Toggle */}
                  <div className="flex bg-white/10 rounded-lg p-1">
                    <button
                      onClick={() => setChartType('line')}
                      className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                        chartType === 'line'
                          ? 'bg-primary-start text-white shadow-lg'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      Line
                    </button>
                    <button
                      onClick={() => setChartType('bar')}
                      className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                        chartType === 'bar'
                          ? 'bg-primary-start text-white shadow-lg'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      Bar
                    </button>
                  </div>
                </div>

                {/* Chart Container - Smaller */}
                <div className="relative h-48 bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-3 border border-white/10">
              {monthlyDataLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-start/30 border-t-primary-start mx-auto mb-6"></div>
                    <p className="text-white/80 text-lg font-medium">Loading monthly data...</p>
                    <p className="text-white/60 text-sm mt-2">Fetching user registration trends</p>
                  </div>
                </div>
              ) : monthlyDataError ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-red-400">
                    <div className="p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <AlertCircle className="w-10 h-10 text-red-400" />
                    </div>
                    <p className="text-xl font-semibold mb-2">Error Loading Data</p>
                    <p className="text-sm text-red-300">{monthlyDataError}</p>
                    <button 
                      onClick={fetchMonthlyUserData}
                      className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : monthlyUserData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white/70">
                    <div className="p-4 bg-gradient-to-br from-primary-start/10 to-primary-end/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <TrendingUp className="w-10 h-10 text-primary-start/60" />
                    </div>
                    <p className="text-xl font-semibold mb-2">No monthly data available</p>
                    <p className="text-sm">Monthly user registration data will appear here once available</p>
                  </div>
                </div>
              ) : (
                <div className="h-full">
                  {chartType === 'line' ? (
                    <Line data={chartData} options={chartOptions} />
                  ) : (
                    <Bar data={chartData} options={chartOptions} />
                  )}
                </div>
              )}
            </div>

                {/* Chart Summary - Compact */}
                {!monthlyDataLoading && monthlyUserData.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-lg p-3 border border-white/20 shadow-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1 bg-gradient-to-br from-primary-start/20 to-primary-end/20 rounded">
                          <TrendingUp className="w-3 h-3 text-primary-start" />
                        </div>
                        <p className="text-white/80 text-xs font-medium">Months</p>
                      </div>
                      <p className="text-lg font-bold text-white">{monthlyUserData.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-lg p-3 border border-white/20 shadow-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1 bg-gradient-to-br from-secondary-start/20 to-secondary-end/20 rounded">
                          <Users className="w-3 h-3 text-secondary-start" />
                        </div>
                        <p className="text-white/80 text-xs font-medium">New Users</p>
                      </div>
                      <p className="text-lg font-bold text-white">
                        {monthlyUserData.reduce((sum, item) => sum + item.newUsers, 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-lg p-3 border border-white/20 shadow-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1 bg-gradient-to-br from-accent-start/20 to-accent-end/20 rounded">
                          <Building2 className="w-3 h-3 text-accent-start" />
                        </div>
                        <p className="text-white/80 text-xs font-medium">Avg/Month</p>
                      </div>
                      <p className="text-lg font-bold text-white">
                        {Math.round(monthlyUserData.reduce((sum, item) => sum + item.newUsers, 0) / monthlyUserData.length).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Tab Content */}
          {activeTab === 'users' && <UserList />}
          {activeTab === 'employees' && <EmployeeList />}
          {activeTab === 'organizations' && <OrganizationList />}
          {activeTab === 'test-analytics' && <TestAnalytics />}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 w-full max-w-md">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Modal Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Add Organisation</h2>
              <p className="text-white/70 text-sm">Enter organisation details</p>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Organisation Name */}
              <div>
                <label htmlFor="org_name" className="block text-sm font-medium text-white/90 mb-2">
                  Organisation Name
                </label>
                <input
                  type="text"
                  id="org_name"
                  name="org_name"
                  value={formData.org_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-start/50 focus:border-transparent transition-all"
                  placeholder="Enter organisation name"
                />
              </div>
              
              {/* HR Email */}
              <div>
                <label htmlFor="hr_email" className="block text-sm font-medium text-white/90 mb-2">
                  HR Email
                </label>
                <input
                  type="email"
                  id="hr_email"
                  name="hr_email"
                  value={formData.hr_email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-start/50 focus:border-transparent transition-all"
                  placeholder="Enter HR email address"
                />
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-start/90 hover:to-primary-end/90 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? 'Adding...' : 'Add Organisation'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-6 py-4 rounded-xl shadow-lg backdrop-blur-xl border ${
            toastType === 'success' 
              ? 'bg-green-500/20 border-green-500/30 text-green-300' 
              : 'bg-red-500/20 border-red-500/30 text-red-300'
          }`}>
            <p className="font-medium">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 