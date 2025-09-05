import React, { useState, useEffect } from 'react';
import { UserPlus, Users, X, User, Building2, Users2, TrendingUp } from 'lucide-react';
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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AdminDashboardProps {}

interface OrganisationForm {
  org_name: string;
  hr_email: string;
}

interface AdminStats {
  totalUsers: number;
  totalEmployees: number;
  totalOrganizations: number;
}

interface WeeklyUserData {
  week: string;
  newUsers: number;
}

interface WeeklyUsersResponse {
  weeklyData: WeeklyUserData[];
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
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  
  // Weekly user data state
  const [weeklyUserData, setWeeklyUserData] = useState<WeeklyUserData[]>([]);
  const [weeklyDataLoading, setWeeklyDataLoading] = useState(true);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  // Fetch admin stats
  const fetchAdminStats = async () => {
    try {
      setStatsLoading(true);
      const token = localStorage.getItem('token');
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
        console.error('Failed to fetch admin stats');
        // Set default values on error
        setAdminStats({
          totalUsers: 0,
          totalEmployees: 0,
          totalOrganizations: 0
        });
      }
    } catch {
      console.error('Error fetching admin stats');
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

  // Fetch weekly user data
  const fetchWeeklyUserData = async () => {
    try {
      setWeeklyDataLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.ADMIN_WEEKLY_USERS, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data: WeeklyUsersResponse = await response.json();
        setWeeklyUserData(data.weeklyData);
      } else {
        console.error('Failed to fetch weekly user data');
        // Set default empty data on error
        setWeeklyUserData([]);
      }
    } catch {
      console.error('Error fetching weekly user data');
      // Set default empty data on error
      setWeeklyUserData([]);
    } finally {
      setWeeklyDataLoading(false);
    }
  };

  // Load admin stats and weekly data on component mount
  useEffect(() => {
    fetchAdminStats();
    fetchWeeklyUserData();
  }, []);

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

  // Chart configuration
  const chartData = {
    labels: weeklyUserData.map(item => item.week),
    datasets: [
      {
        label: 'New Users',
        data: weeklyUserData.map(item => item.newUsers),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(99, 102, 241, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context: { label: string }[]) {
            return `Week: ${context[0].label}`;
          },
          label: function(context: { parsed: { y: number } }) {
            return `New Users: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12,
          },
          beginAtZero: true,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
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
              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Admin Panel
              </h1>
              
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

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Admin Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Users Card */}
            <div className="group relative overflow-hidden bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-white">
                    {statsLoading ? (
                      <div className="animate-pulse bg-white/20 h-8 w-16 rounded"></div>
                    ) : (
                      adminStats.totalUsers.toLocaleString()
                    )}
                  </p>
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

          {/* Weekly User Growth Chart */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="p-2 bg-gradient-to-br from-primary-start/20 to-primary-end/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-primary-start" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Weekly User Growth</h3>
                  <p className="text-white/70 text-sm">New user registrations over time</p>
                </div>
              </div>
              
              {/* Chart Type Toggle */}
              <div className="flex bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    chartType === 'line'
                      ? 'bg-primary-start text-white shadow-lg'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Line
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    chartType === 'bar'
                      ? 'bg-primary-start text-white shadow-lg'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Bar
                </button>
              </div>
            </div>

            {/* Chart Container */}
            <div className="relative h-80">
              {weeklyDataLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-start mx-auto mb-4"></div>
                    <p className="text-white/70">Loading chart data...</p>
                  </div>
                </div>
              ) : weeklyUserData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white/70">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">No data available</p>
                    <p className="text-sm">Weekly user data will appear here once available</p>
                  </div>
                </div>
              ) : (
                <>
                  {chartType === 'line' ? (
                    <Line data={chartData} options={chartOptions} />
                  ) : (
                    <Bar data={chartData} options={chartOptions} />
                  )}
                </>
              )}
            </div>

            {/* Chart Summary */}
            {!weeklyDataLoading && weeklyUserData.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white/70 text-sm mb-1">Total Weeks</p>
                  <p className="text-2xl font-bold text-white">{weeklyUserData.length}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white/70 text-sm mb-1">Total New Users</p>
                  <p className="text-2xl font-bold text-white">
                    {weeklyUserData.reduce((sum, item) => sum + item.newUsers, 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white/70 text-sm mb-1">Average per Week</p>
                  <p className="text-2xl font-bold text-white">
                    {Math.round(weeklyUserData.reduce((sum, item) => sum + item.newUsers, 0) / weeklyUserData.length).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Additional Admin Functionalities */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <div className="text-center text-white/70">
              <p className="text-lg mb-4">Additional Admin Functionalities</p>
              <p className="text-sm">User management, analytics, system monitoring, and more...</p>
            </div>
          </div>
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