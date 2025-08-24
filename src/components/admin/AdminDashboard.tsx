import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle, XCircle, AlertCircle, Shield, Users, BarChart3 } from 'lucide-react';

interface AdminDashboardProps {}

interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  created_at: string;
  role: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; text: string } | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAssessments: 0,
    activeUsers: 0
  });

  useEffect(() => {
    // Load admin dashboard data
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // In a real app, you would fetch this data from your API
      // For now, we'll use mock data
      setStats({
        totalUsers: 1250,
        totalAssessments: 3420,
        activeUsers: 89
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showMessage('error', 'Failed to load dashboard data');
    }
  };

  const showMessage = (type: 'success' | 'error' | 'warning' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 8000);
  };

  if (!hasPrivilege('admin_access')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white text-xl">Access Denied</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Shield className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">System Administration & Monitoring</h2>
            <p className="text-white/70 text-lg">Manage users, monitor system health, and view analytics</p>
          </div>
        </div>
        
        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-500/30 text-green-300'
              : message.type === 'warning'
              ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-300'
              : message.type === 'info'
              ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300'
              : 'bg-red-500/20 border border-red-500/30 text-red-300'
          }`}>
            {message.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {message.type === 'warning' && <AlertCircle className="w-5 h-5" />}
            {message.type === 'info' && <AlertCircle className="w-5 h-5" />}
            {message.type === 'error' && <XCircle className="w-5 h-5" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-4">
              <Users className="w-12 h-12 text-blue-400" />
              <div>
                <p className="text-white/70 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-4">
              <BarChart3 className="w-12 h-12 text-green-400" />
              <div>
                <p className="text-white/70 text-sm">Total Assessments</p>
                <p className="text-3xl font-bold text-white">{stats.totalAssessments.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-4">
              <Brain className="w-12 h-12 text-purple-400" />
              <div>
                <p className="text-white/70 text-sm">Active Users</p>
                <p className="text-3xl font-bold text-white">{stats.activeUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* User Management Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">👥 User Management</h2>
            <p className="text-white/70 text-sm mb-6">
              Manage user accounts, roles, and permissions
            </p>
            
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h3 className="text-blue-300 font-medium mb-2">Available Actions:</h3>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• View all registered users</li>
                  <li>• Manage user roles and permissions</li>
                  <li>• Suspend or activate user accounts</li>
                  <li>• View user activity and assessments</li>
                </ul>
              </div>
              
              <button
                onClick={() => showMessage('info', 'User management features coming soon')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center font-medium"
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </button>
            </div>
          </div>

          {/* System Monitoring Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">📊 System Monitoring</h2>
            <p className="text-white/70 text-sm mb-6">
              Monitor system health, performance, and analytics
            </p>
            
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <h3 className="text-green-300 font-medium mb-2">Monitoring Features:</h3>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• System performance metrics</li>
                  <li>• Database health and optimization</li>
                  <li>• API usage statistics</li>
                  <li>• Error logs and alerts</li>
                </ul>
              </div>
              
              <button
                onClick={() => showMessage('info', 'System monitoring features coming soon')}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center font-medium"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-8 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-4">🚀 More Features Coming Soon</h2>
            <p className="text-white/70 text-sm mb-4">
              We're working on additional admin features to help you manage the platform more effectively
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white/70">Advanced Analytics</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white/70">Bulk Operations</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white/70">Audit Logs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to check admin privileges
const hasPrivilege = (privilege: string): boolean => {
  // In a real app, this would check the user's actual privileges
  // For now, we'll assume the user has admin access if they can access this component
  return true;
};

export default AdminDashboard; 