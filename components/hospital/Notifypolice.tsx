'use client';

import { useState } from 'react';
import { Alert, PoliceNotification } from '@/types';

interface NotifyPoliceProps {
  alerts: Alert[];
}

export default function NotifyPolice({ alerts }: NotifyPoliceProps) {
  const [notifications, setNotifications] = useState<PoliceNotification[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const criticalAlerts = alerts.filter(
    alert => alert.severity === 'Critical' || alert.severity === 'High'
  );

  const handleNotifyPolice = (e: React.FormEvent) => {
    e.preventDefault();
    const alert = alerts.find(a => a.id === selectedAlert);
    
    if (alert && description.trim()) {
      const newNotification: PoliceNotification = {
        id: `POLICE-${Date.now()}`,
        alertId: alert.id,
        location: alert.location,
        severity: alert.severity,
        description: description.trim(),
        status: 'Notified',
        timestamp: new Date().toLocaleString()
      };

      setNotifications([newNotification, ...notifications]);
      setSelectedAlert('');
      setDescription('');
      setIsFormOpen(false);
    }
  };

  return (
    <div className="mb-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-rose-700 rounded-t-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Police Notification System</h2>
              <p className="text-red-100 text-sm mt-1">Coordinate with law enforcement for critical emergencies</p>
            </div>
          </div>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
              isFormOpen
                ? 'bg-white text-red-600 hover:bg-red-50'
                : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30 backdrop-blur-sm'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span>{isFormOpen ? 'Close Form' : 'Notify Police'}</span>
          </button>
        </div>
      </div>

      {/* Notification Form */}
      {isFormOpen && (
        <div className="bg-white rounded-none shadow-xl border-x-2 border-red-100 animate-slideDown">
          <form onSubmit={handleNotifyPolice} className="p-8">
            <div className="space-y-6">
              {/* Alert Selection */}
              <div className="group">
                <label className="flex items-center text-sm font-bold text-gray-700 mb-2.5">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-2.5 shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  Select Emergency Alert *
                </label>
                <div className="relative">
                  <select
                    value={selectedAlert}
                    onChange={(e) => setSelectedAlert(e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 focus:outline-none transition-all bg-gray-50 focus:bg-white group-hover:border-gray-300 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Choose an alert to notify police...</option>
                    {criticalAlerts.map((alert) => (
                      <option key={alert.id} value={alert.id}>
                        {alert.patientId} - {alert.location} ({alert.severity})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {criticalAlerts.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    No high-priority alerts available
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="group">
                <label className="flex items-center text-sm font-bold text-gray-700 mb-2.5">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-2.5 shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  Incident Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the situation requiring police assistance (e.g., traffic accident, violent incident, crowd control needed)..."
                  rows={4}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 focus:outline-none transition-all bg-gray-50 focus:bg-white group-hover:border-gray-300 resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  {description.length} / 500 characters
                </p>
              </div>

              {/* Warning Box */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-amber-900">Important Notice</p>
                    <p className="text-sm text-amber-700 mt-1">Police will be immediately notified about this emergency. Only submit genuine incidents that require law enforcement assistance.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t-2 border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setSelectedAlert('');
                  setDescription('');
                }}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={!selectedAlert || !description.trim()}
                className={`px-6 py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 ${
                  selectedAlert && description.trim()
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span>Send Notification</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications History */}
      <div className="bg-white rounded-b-2xl shadow-lg border-x-2 border-b-2 border-red-100">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Recent Police Notifications</h3>
            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
              {notifications.length} Total
            </span>
          </div>
        </div>
        
        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">No Notifications Yet</h4>
            <p className="text-gray-600 text-sm max-w-md mx-auto">Police notifications will appear here once submitted. Use the form above to notify law enforcement about critical incidents.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification, index) => (
              <div
                key={notification.id}
                className="p-6 hover:bg-gray-50 transition-colors"
                style={{
                  animation: `fadeIn 0.3s ease-in ${index * 0.1}s backwards`
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-rose-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-base font-bold text-gray-900">
                          Alert: {notification.alertId}
                        </h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          notification.severity === 'Critical'
                            ? 'bg-red-100 text-red-700 ring-1 ring-red-300'
                            : 'bg-orange-100 text-orange-700 ring-1 ring-orange-300'
                        }`}>
                          {notification.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {notification.location}
                      </p>
                      <div className="bg-gray-100 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-800 leading-relaxed">
                          {notification.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 text-xs">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold ring-1 ring-green-300">
                          <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {notification.status}
                        </span>
                        <span className="text-gray-500 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {notification.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
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