import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Search, 
  Trash2, 
  RefreshCw, 
  Database, 
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

interface Document {
  document_id: string;
  title: string;
  category: string;
  chunks: Array<{
    chunk_id: string;
    content: string;
    chunk_index: number;
  }>;
  total_chunks: number;
}

interface KnowledgeBaseStats {
  total_documents: number;
  collection_name: string;
  data_directory: string;
}

interface SearchResult {
  content: string;
  metadata: {
    title: string;
    category: string;
    document_id: string;
  };
  similarity_score: number;
}

const RAGKnowledgeBase: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<KnowledgeBaseStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState('general');
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: 'general', label: 'General Mental Health' },
    { value: 'depression', label: 'Depression' },
    { value: 'anxiety', label: 'Anxiety' },
    { value: 'stress', label: 'Stress Management' },
    { value: 'trauma', label: 'Trauma & PTSD' },
    { value: 'crisis', label: 'Crisis Intervention' },
    { value: 'treatment', label: 'Treatment Guidelines' },
    { value: 'assessment', label: 'Assessment Tools' },
    { value: 'research', label: 'Research Papers' }
  ];

  useEffect(() => {
    fetchStats();
    fetchDocuments();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/v1/admin/rag/knowledge-base/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/v1/admin/rag/knowledge-base/documents', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('category', category);

      const token = localStorage.getItem('access_token');
      
      // Debug logging
      console.log('🚀 Making POST request to upload-document');
      console.log('📁 File:', selectedFile.name);
      console.log('📂 Category:', category);
      console.log('🔑 Token exists:', !!token);
      
      const response = await fetch('/api/v1/admin/rag/upload-document', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response method:', response.status === 405 ? 'GET (ERROR!)' : 'POST (OK)');

      const data = await response.json();

      if (response.ok) {
        setUploadMessage({ type: 'success', text: 'Document uploaded and processed successfully!' });
        setSelectedFile(null);
        setCategory('general');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        fetchStats();
        fetchDocuments();
      } else {
        setUploadMessage({ type: 'error', text: data.detail || 'Upload failed' });
      }
    } catch (error) {
      setUploadMessage({ type: 'error', text: 'Upload failed. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setShowSearchResults(true);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/v1/admin/rag/test-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: searchQuery, n_results: 5 })
      });

      const data = await response.json();

      if (response.ok) {
        setSearchResults(data.results);
      } else {
        setUploadMessage({ type: 'error', text: data.detail || 'Search failed' });
      }
    } catch (error) {
      setUploadMessage({ type: 'error', text: 'Search failed. Please try again.' });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`/api/v1/admin/rag/knowledge-base/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setUploadMessage({ type: 'success', text: 'Document deleted successfully!' });
        fetchStats();
        fetchDocuments();
      } else {
        const data = await response.json();
        setUploadMessage({ type: 'error', text: data.detail || 'Delete failed' });
      }
    } catch (error) {
      setUploadMessage({ type: 'error', text: 'Delete failed. Please try again.' });
    }
  };

  const handleResetKnowledgeBase = async () => {
    if (!confirm('Are you sure you want to reset the entire knowledge base? This will delete ALL documents and cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/v1/admin/rag/knowledge-base/reset', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setUploadMessage({ type: 'success', text: 'Knowledge base reset successfully!' });
        fetchStats();
        fetchDocuments();
        setSearchResults([]);
        setShowSearchResults(false);
      } else {
        const data = await response.json();
        setUploadMessage({ type: 'error', text: data.detail || 'Reset failed' });
      }
    } catch (error) {
      setUploadMessage({ type: 'error', text: 'Reset failed. Please try again.' });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">RAG Knowledge Base</h1>
        <p className="text-gray-600">Manage your mental health research documents and knowledge base for AI-powered responses</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_documents}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Collection</p>
                <p className="text-lg font-semibold text-gray-900">{stats.collection_name}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-center">
              <Info className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Data Directory</p>
                <p className="text-sm font-mono text-gray-900 truncate">{stats.data_directory}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Document</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File (PDF, DOCX, TXT, MD)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.md"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="-ml-1 mr-2 h-4 w-4" />
                Upload Document
              </>
            )}
          </button>
        </div>

        {uploadMessage && (
          <div className={`mt-4 p-4 rounded-md ${
            uploadMessage.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex">
              {uploadMessage.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  uploadMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {uploadMessage.text}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Search</h2>
        
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for mental health topics, symptoms, treatments..."
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!searchQuery.trim() || searchLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {searchLoading ? (
              <>
                <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Searching...
              </>
            ) : (
              <>
                <Search className="-ml-1 mr-2 h-4 w-4" />
                Search
              </>
            )}
          </button>
        </div>

        {showSearchResults && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Search Results</h3>
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((result, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{result.metadata.title}</h4>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {result.metadata.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Similarity: {(result.similarity_score * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {result.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No results found</p>
            )}
          </div>
        )}
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-lg shadow-md border">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Knowledge Base Documents</h2>
          <div className="flex space-x-2">
            <button
              onClick={fetchDocuments}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <RefreshCw className={`-ml-1 mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleResetKnowledgeBase}
              className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="-ml-1 mr-2 h-4 w-4" />
              Reset All
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Loading documents...</p>
            </div>
          ) : documents.length > 0 ? (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.document_id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{doc.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Category: {doc.category} • Chunks: {doc.total_chunks}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        ID: {doc.document_id}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteDocument(doc.document_id)}
                      className="ml-4 inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No documents in knowledge base</p>
              <p className="text-sm text-gray-400 mt-2">Upload your first document to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RAGKnowledgeBase;
