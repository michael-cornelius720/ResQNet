'use client';

import { useState } from 'react';

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    name: string;
    role: string;
    email: string;
    phone: string;
    department: string;
    joinDate: string;
  };
}

export default function Profile({ isOpen, onClose, user }: ProfileProps) {
  const defaultUser = {
    name: 'Dr. Admin',
    role: 'Emergency Coordinator',
    email: 'admin@citygeneral.com',
    phone: '+1 (555) 123-4567',
    department: 'Emergency Department',
    joinDate: 'January 2020',
  };

  const [profileData, setProfileData] = useState(user || defaultUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(profileData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(profileData);
  };

  const handleSave = () => {
    setProfileData(editedData);
    setIsEditing(false);
    console.log('Profile updated:', editedData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(profileData);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedData({ ...editedData, [field]: value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Profile Details</h2>
              <p className="text-red-100 text-xs sm:text-sm mt-1">Manage your account information</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center text-white transition-all duration-200 hover:rotate-90 flex-shrink-0"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-180px)]">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center sm:space-x-6 mb-6 sm:mb-8 pb-6 border-b border-gray-200 gap-4 sm:gap-0">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-xl ring-4 ring-red-100">
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="absolute -bottom-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
            </div>
            <div className="flex-1 text-center sm:text-left w-full">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editedData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-xl sm:text-2xl font-bold text-gray-900 border-2 border-gray-300 rounded-lg px-3 py-2 w-full focus:border-red-500 focus:outline-none transition-colors"
                    placeholder="Full Name"
                  />
                  <input
                    type="text"
                    value={editedData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="text-sm text-gray-600 border-2 border-gray-300 rounded-lg px-3 py-2 w-full focus:border-red-500 focus:outline-none transition-colors"
                    placeholder="Role/Position"
                  />
                </div>
              ) : (
                <>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{profileData.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 flex items-center justify-center sm:justify-start">
                    <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {profileData.role}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="group">
              <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full text-sm text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-red-500 focus:bg-white focus:outline-none transition-all"
                  placeholder="email@example.com"
                />
              ) : (
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-4 py-3 font-medium">
                  {profileData.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="group">
              <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full text-sm text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-red-500 focus:bg-white focus:outline-none transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              ) : (
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-4 py-3 font-medium">
                  {profileData.phone}
                </p>
              )}
            </div>

            {/* Department */}
            <div className="group">
              <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Department
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full text-sm text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-red-500 focus:bg-white focus:outline-none transition-all"
                  placeholder="Department name"
                />
              ) : (
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-4 py-3 font-medium">
                  {profileData.department}
                </p>
              )}
            </div>

            {/* Join Date */}
            <div className="group">
              <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Joined Date
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-4 py-3 font-medium">
                {profileData.joinDate}
              </p>
            </div>
          </div>

          {/* Stats Section */}
          {!isEditing && (
            <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4">
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 border-t border-gray-200">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 order-1 sm:order-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 order-2 sm:order-1"
              >
                Close
              </button>
              <button
                onClick={handleEdit}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 order-1 sm:order-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit Profile</span>
              </button>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}