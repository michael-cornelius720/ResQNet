// components/hospital/AlertsTable.tsx
import { useState } from 'react';
import { Alert } from './types';
import StatusBadge from './StatusBadge';

interface AlertsTableProps {
  alerts: Alert[];
  onAccept: (alertId: string) => void;
  onAssign: (alertId: string) => void;
  onNotifyPolice?: (alert: Alert, stationId: string) => void;
}

interface PoliceStation {
  id: string;
  name: string;
  address: string;
  distance: string;
  responseTime: string;
  availability: 'Available' | 'Busy' | 'Limited';
  phone: string;
}

// Mock police stations data
const mockPoliceStations: PoliceStation[] = [
  {
    id: 'PS001',
    name: 'Central Police Station',
    address: '123 Main Street, Downtown',
    distance: '1.2 km',
    responseTime: '3-5 mins',
    availability: 'Available',
    phone: '911'
  },
  {
    id: 'PS002',
    name: 'North District Police Station',
    address: '456 North Avenue',
    distance: '2.5 km',
    responseTime: '6-8 mins',
    availability: 'Available',
    phone: '911'
  },
  {
    id: 'PS003',
    name: 'East Side Police Department',
    address: '789 East Boulevard',
    distance: '3.8 km',
    responseTime: '8-10 mins',
    availability: 'Limited',
    phone: '911'
  },
  {
    id: 'PS004',
    name: 'South Metro Police Station',
    address: '321 South Street',
    distance: '4.5 km',
    responseTime: '10-12 mins',
    availability: 'Busy',
    phone: '911'
  }
];

export default function AlertsTable({ alerts, onAccept, onAssign, onNotifyPolice }: AlertsTableProps) {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPoliceModalOpen, setIsPoliceModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<string>('');

  const handleRowClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAlert(null);
  };

  const handleNotifyPoliceClick = () => {
    setIsModalOpen(false);
    setIsPoliceModalOpen(true);
  };

  const handleClosePoliceModal = () => {
    setIsPoliceModalOpen(false);
    setSelectedStation('');
    setSelectedAlert(null);
  };

  const handleConfirmNotification = () => {
    if (selectedAlert && selectedStation) {
      if (onNotifyPolice) {
        onNotifyPolice(selectedAlert, selectedStation);
      }
      const station = mockPoliceStations.find(s => s.id === selectedStation);
      alert(`Police notification sent to ${station?.name}!`);
    }
    handleClosePoliceModal();
  };

  const handleAccept = (e: React.MouseEvent, alertId: string) => {
    e.stopPropagation();
    onAccept(alertId);
    handleCloseModal();
  };

  const handleAssign = (e: React.MouseEvent, alertId: string) => {
    e.stopPropagation();
    onAssign(alertId);
    handleCloseModal();
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Active Emergency Alerts
            </h3>
            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
              {alerts.length} Active
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {alerts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 text-sm">No active emergency alerts</p>
            </div>
          ) : (
            alerts.map((alert, index) => (
              <div
                key={alert.id}
                onClick={() => handleRowClick(alert)}
                className="px-6 py-5 hover:bg-gray-50 transition-all cursor-pointer group"
                style={{
                  animation: `fadeIn 0.3s ease-in ${index * 0.1}s backwards`
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      alert.severity === 'Critical' ? 'bg-red-500 animate-pulse' :
                      alert.severity === 'High' ? 'bg-orange-500 animate-pulse' :
                      alert.severity === 'Medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    
                    <div>
                      <div className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {alert.patientId}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{alert.timestamp}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <StatusBadge status={alert.severity} type="severity" />
                    <StatusBadge status={alert.status} type="alert" />
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <style jsx>{`
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
        `}</style>
      </div>

      {/* Alert Details Modal */}
      {isModalOpen && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slideUp">
            <div className={`px-6 py-5 relative overflow-hidden ${
              selectedAlert.severity === 'Critical' ? 'bg-gradient-to-r from-red-600 via-red-700 to-red-800' :
              selectedAlert.severity === 'High' ? 'bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800' :
              selectedAlert.severity === 'Medium' ? 'bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800' :
              'bg-gradient-to-r from-green-600 via-green-700 to-green-800'
            }`}>
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  
                  <div>
                    <h2 className="text-2xl font-bold text-white">Emergency Alert Details</h2>
                    <p className="text-white text-opacity-90 text-sm mt-1">{selectedAlert.patientId}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <label className="flex items-center text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    Patient ID
                  </label>
                  <p className="text-lg font-bold text-gray-900">{selectedAlert.patientId}</p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <label className="flex items-center text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Severity Level
                  </label>
                  <StatusBadge status={selectedAlert.severity} type="severity" />
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <label className="flex items-center text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Location
                  </label>
                  <p className="text-sm font-semibold text-gray-900">{selectedAlert.location}</p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <label className="flex items-center text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    GPS Coordinates
                  </label>
                  <p className="text-sm font-mono font-semibold text-gray-900">{selectedAlert.gps}</p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <label className="flex items-center text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Estimated Time
                  </label>
                  <p className="text-lg font-bold text-gray-900">{selectedAlert.eta}</p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <label className="flex items-center text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Current Status
                  </label>
                  <StatusBadge status={selectedAlert.status} type="alert" />
                </div>

                <div className="md:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <label className="flex items-center text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Alert Received
                  </label>
                  <p className="text-sm font-semibold text-gray-900">{selectedAlert.timestamp}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-5 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex space-x-3">
                  {selectedAlert.status === 'Pending' && (
                    <button
                      onClick={(e) => handleAccept(e, selectedAlert.id)}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Accept Alert</span>
                    </button>
                  )}
                  {selectedAlert.status === 'Accepted' && (
                    <button
                      onClick={(e) => handleAssign(e, selectedAlert.id)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Assign Ambulance</span>
                    </button>
                  )}
                  {(selectedAlert.severity === 'Critical' || selectedAlert.severity === 'High') && (
                    <button
                      onClick={handleNotifyPoliceClick}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-rose-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>Notify Police</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={handleCloseModal}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-200"
                >
                  Close
                </button>
              </div>
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
      )}

      {/* Police Stations Modal */}
      {isPoliceModalOpen && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 via-red-700 to-rose-700 px-6 py-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  
                  <div>
                    <h2 className="text-2xl font-bold text-white">Select Police Station</h2>
                    <p className="text-white text-opacity-90 text-sm mt-1">Choose nearest station for {selectedAlert.patientId}</p>
                  </div>
                </div>
                
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
              {/* Alert Summary */}
              <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-red-900">Emergency Location</p>
                    <p className="text-sm text-red-700 mt-1">{selectedAlert.location} • {selectedAlert.gps}</p>
                  </div>
                </div>
              </div>

              {/* Police Stations List */}
              <div className="space-y-4">
                {mockPoliceStations.map((station, index) => (
                  <button
                    key={station.id}
                    onClick={() => setSelectedStation(station.id)}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                      selectedStation === station.id
                        ? 'border-red-600 bg-red-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                    style={{
                      animation: `fadeIn 0.3s ease-in ${index * 0.1}s backwards`
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          selectedStation === station.id
                            ? 'bg-red-600'
                            : 'bg-gray-100'
                        }`}>
                          <svg className={`w-6 h-6 ${selectedStation === station.id ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-gray-900 mb-1">{station.name}</h4>
                          <p className="text-sm text-gray-600 mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {station.address}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                              {station.distance}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {station.responseTime}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              station.availability === 'Available' ? 'bg-green-100 text-green-700' :
                              station.availability === 'Limited' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              <span className={`w-2 h-2 rounded-full mr-1.5 ${
                                station.availability === 'Available' ? 'bg-green-500' :
                                station.availability === 'Limited' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}></span>
                              {station.availability}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {station.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-4 flex-shrink-0 ${
                        selectedStation === station.id
                          ? 'border-red-600 bg-red-600'
                          : 'border-gray-300'
                      }`}>
                        {selectedStation === station.id && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-5 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleClosePoliceModal}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmNotification}
                  disabled={!selectedStation}
                  className={`px-6 py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 ${
                    selectedStation
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}