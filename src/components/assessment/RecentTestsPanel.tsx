import React, { useState, useEffect } from 'react';
import { Clock, Brain, Zap, Trash2, RefreshCw, Database, ChevronRight } from 'lucide-react';
import { testCacheService } from '../../services/testCacheService';
import type { TestDetails } from '../../types/testTypes';

interface RecentTestsPanelProps {
  onTestSelect: (testCode: string) => void;
  onRefresh: () => void;
}

const RecentTestsPanel: React.FC<RecentTestsPanelProps> = ({ onTestSelect, onRefresh }) => {
  const [recentTests, setRecentTests] = useState<TestDetails[]>([]);
  const [cacheStats, setCacheStats] = useState({
    totalEntries: 0,
    cacheSize: 0,
    recentTestsCount: 0,
    categoriesCached: false,
    definitionsCached: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecentTests();
    loadCacheStats();
  }, []);

  const loadRecentTests = () => {
    const recent = testCacheService.getRecentTests();
    setRecentTests(recent);
    setIsLoading(false);
  };

  const loadCacheStats = () => {
    const stats = testCacheService.getCacheStats();
    setCacheStats(stats);
  };

  const handleClearCache = () => {
    testCacheService.clearAllCache();
    setRecentTests([]);
    loadCacheStats();
    onRefresh();
  };

  const handleClearRecentTests = () => {
    // Clear recent tests by clearing all cache and reloading
    testCacheService.clearAllCache();
    setRecentTests([]);
    loadCacheStats();
    onRefresh();
  };

  const getTestIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'depression':
        return <Brain className="w-5 h-5 text-blue-500" />;
      case 'anxiety':
        return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'stress':
        return <Clock className="w-5 h-5 text-red-500" />;
      default:
        return <Brain className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTestDisplayName = (test: TestDetails) => {
    return test.test_name || test.test_definition?.test_name || 'Unknown Test';
  };

  const getTestDisplayDescription = (test: TestDetails) => {
    return test.description || test.test_definition?.description || '';
  };

  const getTestDisplayCategory = (test: TestDetails) => {
    return test.test_category || test.test_definition?.test_category || 'unknown';
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'depression':
        return 'bg-blue-100 text-blue-800';
      case 'anxiety':
        return 'bg-yellow-100 text-yellow-800';
      case 'stress':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Tests</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleClearRecentTests}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Clear recent tests"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              loadRecentTests();
              loadCacheStats();
            }}
            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {recentTests.length === 0 ? (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No recent tests found</p>
          <p className="text-gray-400 text-xs mt-1">Take some tests to see them here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentTests.map((test) => (
            <div
              key={test.test_code}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
              onClick={() => onTestSelect(test.test_code)}
            >
              <div className="flex items-center space-x-3">
                {getTestIcon(getTestDisplayCategory(test))}
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {getTestDisplayName(test)}
                  </h4>
                  <p className="text-sm text-gray-500">{getTestDisplayDescription(test)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(getTestDisplayCategory(test))}`}>
                  {getTestDisplayCategory(test)}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cache Statistics */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 mb-3">
          <Database className="w-4 h-4 text-gray-600" />
          <h4 className="text-sm font-medium text-gray-900">Cache Statistics</h4>
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Entries:</span>
            <span className="font-medium">{cacheStats.totalEntries}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Size:</span>
            <span className="font-medium">{cacheStats.cacheSize} KB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Recent:</span>
            <span className="font-medium">{cacheStats.recentTestsCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Categories:</span>
            <span className={`font-medium ${cacheStats.categoriesCached ? 'text-green-600' : 'text-gray-400'}`}>
              {cacheStats.categoriesCached ? 'Cached' : 'Not cached'}
            </span>
          </div>
        </div>
        
        {cacheStats.totalEntries > 0 && (
          <button
            onClick={handleClearCache}
            className="mt-3 w-full text-xs text-red-600 hover:text-red-700 py-1 px-2 rounded border border-red-200 hover:border-red-300 transition-colors"
          >
            Clear All Cache
          </button>
        )}
      </div>
    </div>
  );
};

export default RecentTestsPanel;
