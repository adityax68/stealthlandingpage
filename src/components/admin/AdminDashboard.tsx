import React, { useState } from 'react';
import { UserPlus, Users, X } from 'lucide-react';

interface AdminDashboardProps {}

interface OrganisationForm {
  org_name: string;
  hr_email: string;
}

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
    } catch (error) {
      setToastMessage('Network error. Please try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
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
          {/* Future functionalities will go here */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <div className="text-center text-white/70">
              <p className="text-lg mb-4">Admin functionalities will be added here</p>
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