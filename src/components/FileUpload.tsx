import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Image, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import { useToast } from '../contexts/ToastContext';

interface FileUploadProps {
  onFileUploaded: (fileId: number, filename: string) => void;
  onRemoveFile: () => void;
  disabled?: boolean;
  maxSize?: number; // in MB
}

interface UploadedFile {
  file_id: number;
  filename: string;
  file_size: number;
  file_type: string;
  upload_url: string;
  created_at: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileUploaded, 
  onRemoveFile, 
  disabled = false,
  maxSize = 10 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const ALLOWED_TYPES = [
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    // Images
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp'
  ];

  const ALLOWED_EXTENSIONS = [
    '.pdf', '.doc', '.docx', '.txt',
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'
  ];

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size exceeds ${maxSize}MB limit`;
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `File type not supported. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`;
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(API_ENDPOINTS.CHAT_UPLOAD, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      const uploadedFileData: UploadedFile = await response.json();
      setUploadedFile(uploadedFileData);
      onFileUploaded(uploadedFileData.file_id, uploadedFileData.filename);
      showToast('File uploaded successfully!', 'success');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = useCallback((file: File) => {
    uploadFile(file);
  }, [maxSize]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [disabled, handleFileSelect]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setError(null);
    onRemoveFile();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    } else if (fileType === 'application/pdf') {
      return <FileText className="w-4 h-4" />;
    } else {
      return <File className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (uploadedFile) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-green-600">
            {getFileIcon(uploadedFile.file_type)}
          </div>
          <div>
            <p className="text-sm font-medium text-green-800">{uploadedFile.filename}</p>
            <p className="text-xs text-green-600">{formatFileSize(uploadedFile.file_size)}</p>
          </div>
          <CheckCircle className="w-4 h-4 text-green-600" />
        </div>
        <button
          onClick={handleRemoveFile}
          disabled={disabled}
          className="text-green-600 hover:text-green-800 transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          isDragOver
            ? 'border-cyan-400 bg-cyan-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <div className="text-center">
          <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragOver ? 'text-cyan-500' : 'text-gray-400'}`} />
          <p className="text-sm text-gray-600 mb-1">
            {isUploading ? 'Uploading...' : 'Drop files here or click to upload'}
          </p>
          <p className="text-xs text-gray-500">
            Max {maxSize}MB • {ALLOWED_EXTENSIONS.join(', ')}
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_EXTENSIONS.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {isUploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="text-sm text-blue-700">Uploading file...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
