'use client';

import { useState } from 'react';
import { AmbulanceFormData } from '@/types';

interface AddAmbulanceProps {
  onAddAmbulance: (ambulance: AmbulanceFormData) => void;
}

export default function AddAmbulance({ onAddAmbulance }: AddAmbulanceProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<AmbulanceFormData>({
    vehicleNumber: '',
    driver: '',
    contactNumber: '',
    equipmentLevel: 'BLS',
    currentLocation: ''
  });

  const handleInputChange = (field: keyof AmbulanceFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.vehicleNumber && formData.driver && formData.contactNumber) {
      onAddAmbulance(formData);
      setFormData({
        vehicleNumber: '',
        driver: '',
        contactNumber: '',
        equipmentLevel: 'BLS',
        currentLocation: ''
      });
      setIsFormOpen(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      vehicleNumber: '',
      driver: '',
      contactNumber: '',
      equipmentLevel: 'BLS',
      currentLocation: ''
    });
    setIsFormOpen(false);
  };

  return (
    <div className="mb-4 sm:mb-8">
      {/* Header Section */}
      <div className="rounded-t-2xl p-4 sm:p-6 text-black">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Add Ambulance
          </h2>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg text-sm sm:text-base ${
              isFormOpen
                ? 'bg-white text-black'
                : 'bg-gray-200 text-black hover:bg-gray-300'
            }`}
          >
            <svg
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${isFormOpen ? 'rotate-45' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>

            <span className="whitespace-nowrap">{isFormOpen ? 'Close Form' : 'Add New Ambulance'}</span>
          </button>
        </div>
      </div>

      {/* Form Section */}
      {isFormOpen && (
        <div className="bg-white rounded-b-2xl text-black shadow-xl border-x-2 border-b-2 border-blue-100 animate-slideDown">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Vehicle Number */}
              <div className="group">
                <label className="flex items-center text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-2 sm:mr-2.5 shadow-sm flex-shrink-0">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  Vehicle Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.vehicleNumber}
                    onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                    placeholder="e.g., RN-1107"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all bg-gray-50 focus:bg-white group-hover:border-gray-300"
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hidden sm:block">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Driver Name */}
              <div className="group">
                <label className="flex items-center text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-2 sm:mr-2.5 shadow-sm flex-shrink-0">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  Driver Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.driver}
                    onChange={(e) => handleInputChange('driver', e.target.value)}
                    placeholder="e.g., Robert Smith"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all bg-gray-50 focus:bg-white group-hover:border-gray-300"
                    required
                  />
                </div>
              </div>

              {/* Contact Number */}
              <div className="group">
                <label className="flex items-center text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-2 sm:mr-2.5 shadow-sm flex-shrink-0">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  Contact Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all bg-gray-50 focus:bg-white group-hover:border-gray-300"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t-2 border-gray-100">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="whitespace-nowrap">Add Ambulance to Fleet</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Empty State when form is closed */}
      {!isFormOpen && (
        <div className="bg-white rounded-b-2xl shadow-lg border-x-2 border-b-2 border-blue-100 p-6 sm:p-8">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m-6-8h6m-7 12h8a2 2 0 002-2V6a2 2 0 00-2-2h-8a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">No Form Active</h3>
            <p className="text-gray-600 text-xs sm:text-sm max-w-md mx-auto px-4 sm:px-0">Click "Add New Ambulance" above to register a new ambulance unit to your fleet. All units will be available for emergency dispatch once added.</p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}