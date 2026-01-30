'use client';

import { useState } from 'react';
import { Alert, Ambulance } from './types';
import StatusBadge from './StatusBadge';

interface AssignModalProps {
  alert: Alert;
  ambulances: Ambulance[];
  onClose: () => void;
  onConfirm: (ambulanceId: string) => void;
}

export default function AssignModal({ alert, ambulances, onClose, onConfirm }: AssignModalProps) {
  const [selectedAmbulance, setSelectedAmbulance] = useState<string>('');

  const handleConfirm = () => {
    if (selectedAmbulance) {
      onConfirm(selectedAmbulance);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 text-white">
          <h2 className="text-2xl font-bold">Assign Ambulance</h2>
          <p className="text-sm text-red-100 mt-1">Select an available ambulance for this emergency</p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Alert Details */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
              Emergency Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Patient ID</p>
                <p className="text-sm font-semibold text-gray-900">{alert.patientId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Severity</p>
                <StatusBadge status={alert.severity} type="severity" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <p className="text-sm text-gray-900">{alert.location}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">ETA</p>
                <p className="text-sm font-semibold text-gray-900">{alert.eta}</p>
              </div>
            </div>
          </div>

          {/* Available Ambulances */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
              Available Ambulances ({ambulances.length})
            </h3>
            
            {ambulances.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No ambulances available at the moment
              </div>
            ) : (
              <div className="space-y-3">
                {ambulances.map((ambulance) => (
                  <button
                    key={ambulance.id}
                    onClick={() => setSelectedAmbulance(ambulance.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedAmbulance === ambulance.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                          🚑
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{ambulance.vehicleNumber}</p>
                          <p className="text-sm text-gray-500">{ambulance.driver}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedAmbulance === ambulance.id
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300'
                      }`}>
                        {selectedAmbulance === ambulance.id && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedAmbulance}
            className={`px-5 py-2.5 font-semibold rounded-lg transition-colors ${
              selectedAmbulance
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Confirm Assignment
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
