import React, { useState, useRef } from 'react'
import { Upload, Download, CheckCircle, XCircle, AlertCircle, FileText, Users } from 'lucide-react'
import { API_ENDPOINTS } from '../../config/api'
import { useToast } from '../../contexts/ToastContext'

interface BulkEmployeeUploadProps {
  onUploadComplete: () => void
}

interface BulkEmployeeResult {
  email: string
  employee_code: string
  status: string
  message: string
  user_id?: number
  employee_id?: number
}

interface BulkEmployeeResponse {
  total_processed: number
  successful: number
  failed: number
  results: BulkEmployeeResult[]
  summary: string
}

const BulkEmployeeUpload: React.FC<BulkEmployeeUploadProps> = ({ onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<BulkEmployeeResponse | null>(null)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      const errorMessage = 'Please select a CSV file'
      setError(errorMessage)
      showToast(errorMessage, 'error')
      return
    }

    // Check file size (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
    if (file.size > MAX_FILE_SIZE) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1)
      const errorMessage = `File size exceeds 10MB limit. Your file is ${fileSizeMB}MB. Please use a smaller file.`
      setError(errorMessage)
      showToast(errorMessage, 'error')
      return
    }

    setIsUploading(true)
    setError('')
    setUploadResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const token = localStorage.getItem('access_token')
      if (!token) {
        setError('No authentication token found')
        return
      }

      const response = await fetch(API_ENDPOINTS.HR_BULK_EMPLOYEE_ACCESS, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        const result: BulkEmployeeResponse = await response.json()
        setUploadResult(result)
        
        // Show success toast
        if (result.successful > 0) {
          if (result.failed === 0) {
            // All employees uploaded successfully
            showToast(`Successfully uploaded ${result.successful} employee(s)!`, 'success')
          } else {
            // Partial success
            showToast(`Uploaded ${result.successful} employee(s) successfully. ${result.failed} failed.`, 'success')
          }
          onUploadComplete() // Refresh employee list
        } else {
          // No successful uploads
          showToast('No employees were uploaded successfully.', 'error')
        }
      } else {
        let errorMessage = 'Upload failed'
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.detail || errorData.error || 'Upload failed'
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || 'Upload failed'
        }
        
        setError(errorMessage)
        showToast(errorMessage, 'error')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      const errorMessage = 'Failed to upload file. Please try again.'
      setError(errorMessage)
      showToast(errorMessage, 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const downloadTemplate = () => {
    const csvContent = `email,employee_code,full_name,age,department,position,hire_date,country,state,city,pincode
john.doe@company.com,EMP001,John Doe,28,IT,Developer,2024-01-15,USA,CA,San Francisco,94105
jane.smith@company.com,EMP002,Jane Smith,32,HR,Manager,2024-01-20,USA,NY,New York,10001
bob.wilson@company.com,EMP003,Bob Wilson,30,Finance,Analyst,2024-01-25,USA,TX,Houston,77001`

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'employee_template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const resetUpload = () => {
    setUploadResult(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-primary-start/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
            <Users className="w-7 h-7" />
            <span>Bulk Employee Upload</span>
          </h2>
          <p className="text-gray-800/70 mt-1">Upload a CSV file to add multiple employees at once. Required fields: email, employee_code, full_name</p>
        </div>
        <button
          onClick={downloadTemplate}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-gray-800 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
        >
          <Download className="w-4 h-4" />
          <span>Download Template</span>
        </button>
      </div>

      {!uploadResult ? (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragActive
              ? 'border-primary-start bg-primary-start/10'
              : 'border-white/20 hover:border-white/40'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-start to-primary-end rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-800" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {isUploading ? 'Uploading...' : 'Upload CSV File'}
              </h3>
              <p className="text-gray-800/70 mb-4">
                Drag and drop your CSV file here, or click to browse
              </p>
              <p className="text-gray-800/50 text-sm">
                Maximum file size: 10MB • Maximum employees: 100 per upload
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
              disabled={isUploading}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-6 py-3 bg-gradient-to-r from-primary-start to-primary-end text-gray-800 rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Uploading...</span>
                </div>
              ) : (
                'Choose File'
              )}
            </button>

            {error && (
              <div className={`mt-4 p-4 rounded-lg border ${
                error.includes('Rate limit') 
                  ? 'bg-yellow-500/10 border-yellow-500/20' 
                  : error.includes('file size') || error.includes('Too many employees')
                  ? 'bg-orange-500/10 border-orange-500/20'
                  : error.includes('Access denied') || error.includes('permission')
                  ? 'bg-red-500/10 border-red-500/20'
                  : 'bg-red-500/10 border-red-500/20'
              }`}>
                <div className={`flex items-center space-x-2 ${
                  error.includes('Rate limit') 
                    ? 'text-yellow-600' 
                    : error.includes('file size') || error.includes('Too many employees')
                    ? 'text-orange-600'
                    : error.includes('Access denied') || error.includes('permission')
                    ? 'text-red-600'
                    : 'text-red-600'
                }`}>
                  <AlertCircle className="w-5 h-5" />
                  <div>
                    <p className="font-medium">{error}</p>
                    {error.includes('Rate limit') && (
                      <p className="text-sm mt-1 opacity-80">
                        Please wait a few minutes before trying again.
                      </p>
                    )}
                    {error.includes('file size') && (
                      <p className="text-sm mt-1 opacity-80">
                        Please reduce your file size to under 10MB.
                      </p>
                    )}
                    {error.includes('Too many employees') && (
                      <p className="text-sm mt-1 opacity-80">
                        Please split your CSV into smaller files with maximum 100 employees each.
                      </p>
                    )}
                    {error.includes('Missing required CSV headers') && (
                      <p className="text-sm mt-1 opacity-80">
                        Please download the template and ensure your CSV has the required columns.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl rounded-xl p-4 border border-primary-start/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-800" />
                </div>
                <div>
                  <p className="text-gray-800/70 text-sm">Total Processed</p>
                  <p className="text-xl font-bold text-gray-800">{uploadResult.total_processed}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-xl rounded-xl p-4 border border-primary-start/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-gray-800" />
                </div>
                <div>
                  <p className="text-gray-800/70 text-sm">Successful</p>
                  <p className="text-xl font-bold text-gray-800">{uploadResult.successful}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-xl rounded-xl p-4 border border-primary-start/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-gray-800" />
                </div>
                <div>
                  <p className="text-gray-800/70 text-sm">Failed</p>
                  <p className="text-xl font-bold text-gray-800">{uploadResult.failed}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Message */}
          <div className="p-4 bg-gradient-to-r from-primary-start/10 to-primary-end/10 border border-primary-start/20 rounded-lg">
            <p className="text-gray-800 font-medium">{uploadResult.summary}</p>
          </div>

          {/* Results Table */}
          {uploadResult.results.length > 0 && (
            <div className="bg-gradient-to-br from-primary-start/10 to-primary-end/5 rounded-xl border border-primary-start/20 overflow-hidden">
              <div className="p-4 border-b border-primary-start/20">
                <h3 className="text-lg font-semibold text-gray-800">Upload Results</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-br from-primary-start/10 to-primary-end/5 border-b border-primary-start/20">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800/80">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800/80">Employee Code</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800/80">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800/80">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {uploadResult.results.map((result, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-gray-800/90">{result.email}</td>
                        <td className="px-4 py-3 text-gray-800/90">{result.employee_code}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            {result.status === 'success' ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="text-green-400 text-sm">Success</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 text-red-400" />
                                <span className="text-red-400 text-sm">Failed</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-800/70 text-sm">{result.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={resetUpload}
              className="px-6 py-3 bg-primary-start/10 text-gray-800 rounded-lg hover:bg-primary-start/20 transition-all duration-200"
            >
              Upload Another File
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BulkEmployeeUpload
