import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TestTube, Users, TrendingUp, Calendar, AlertTriangle, Building2 } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
// Removed admin cache service - using direct API calls

interface TestAnalytics {
  total_tests: number;
  employee_tests: number;
  recent_tests: number;
  tests_by_type: Array<{ type: string; count: number }>;
  tests_by_organization: Array<{ org_id: string; count: number }>;
  tests_by_severity: Array<{ severity: string; count: number }>;
}

const TestAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<TestAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTestAnalytics();
  }, []);

  const fetchTestAnalytics = async () => {
    try {
      setIsLoading(true);
      
      // Removed cache check - using direct API calls with database indexes

      console.log('🌐 Fetching test analytics from API');
      const token = localStorage.getItem('access_token');
      const response = await fetch(API_ENDPOINTS.ADMIN_TEST_ANALYTICS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch test analytics');
      }

      const data = await response.json();
      setAnalytics(data);
      
      // Removed caching - using direct API calls with database indexes
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'low':
        return '#10B981'; // green
      case 'moderate':
        return '#F59E0B'; // yellow
      case 'high':
        return '#EF4444'; // red
      case 'severe':
        return '#DC2626'; // dark red
      default:
        return '#6B7280'; // gray
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'phq9':
        return '#3B82F6'; // blue
      case 'gad7':
        return '#8B5CF6'; // purple
      case 'pss10':
        return '#06B6D4'; // cyan
      case 'comprehensive':
        return '#F59E0B'; // amber
      default:
        return '#6B7280'; // gray
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-start"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-400 mb-2">Error loading test analytics</div>
        <div className="text-white/60 text-sm">{error}</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <div className="text-white/60">No test analytics data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <TestTube className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold text-lg">{analytics.total_tests}</div>
              <div className="text-white/60 text-sm">Total Tests</div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold text-lg">{analytics.employee_tests}</div>
              <div className="text-white/60 text-sm">Employee Tests</div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold text-lg">{analytics.recent_tests}</div>
              <div className="text-white/60 text-sm">Recent (30 days)</div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold text-lg">
                {analytics.total_tests > 0 ? Math.round((analytics.employee_tests / analytics.total_tests) * 100) : 0}%
              </div>
              <div className="text-white/60 text-sm">Employee Ratio</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tests by Type */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <TestTube className="w-5 h-5 mr-2" />
            Tests by Type
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.tests_by_type}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="type" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tick={{ fill: '#9CA3AF' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tests by Severity */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Tests by Severity
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.tests_by_severity}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.severity}: ${entry.count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.tests_by_severity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getSeverityColor(entry.severity)} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tests by Organization */}
      {analytics.tests_by_organization.length > 0 && (
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            Tests by Organization
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.tests_by_organization}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="org_id" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tick={{ fill: '#9CA3AF' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test Types Breakdown */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-4">Test Types Breakdown</h3>
          <div className="space-y-3">
            {analytics.tests_by_type.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getTypeColor(item.type) }}
                  ></div>
                  <span className="text-white/80 capitalize">{item.type}</span>
                </div>
                <span className="text-white font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Severity Breakdown */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-4">Severity Breakdown</h3>
          <div className="space-y-3">
            {analytics.tests_by_severity.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getSeverityColor(item.severity) }}
                  ></div>
                  <span className="text-white/80 capitalize">{item.severity || 'Unknown'}</span>
                </div>
                <span className="text-white font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAnalytics;
