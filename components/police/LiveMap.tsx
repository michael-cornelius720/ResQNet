'use client';

import { Emergency, TrafficSignal, VehiclePosition } from './types';

interface LiveMapProps {
  emergency: Emergency;
  vehiclePosition: VehiclePosition;
  trafficSignals: TrafficSignal[];
  greenCorridorActive: boolean;
}

export default function LiveMap({ 
  emergency, 
  vehiclePosition, 
  trafficSignals,
  greenCorridorActive 
}: LiveMapProps) {
  return (
    <div className="relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden h-full">
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-gray-900 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-sm">🗺️</span>
            </div>
            <h3 className="text-sm font-bold text-white">Live Route Tracking</h3>
          </div>
          <div className="flex items-center gap-2">
            {greenCorridorActive && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-900/50 border border-green-800 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-green-400">GREEN CORRIDOR ACTIVE</span>
              </div>
            )}
            <div className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg">
              <span className="text-xs font-semibold text-gray-300">REAL-TIME</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Content - Placeholder for actual map */}
      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}></div>

        {/* Simulated Map Elements */}
        <div className="relative w-full h-full p-8">
          {/* Route Line */}
          <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#10B981', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path
              d="M 100 200 Q 300 100, 500 300 T 900 400"
              stroke="url(#routeGradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray="10,5"
              className="animate-pulse"
            />
          </svg>

          {/* Incident Location Marker */}
          <div className="absolute" style={{ left: '10%', top: '30%' }}>
            <div className="relative">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-900/50 border-4 border-red-900 animate-pulse">
                <span className="text-xl">📍</span>
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 border border-red-800 px-2 py-1 rounded text-xs text-white">
                Incident
              </div>
            </div>
          </div>

          {/* Vehicle Position */}
          <div className="absolute" style={{ left: '45%', top: '45%' }}>
            <div className="relative">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/50 border-4 border-blue-900 animate-pulse">
                <span className="text-2xl">🚑</span>
              </div>
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-blue-600 px-3 py-1.5 rounded text-xs text-white font-bold shadow-lg">
                {emergency.vehicleId} • {vehiclePosition.speed} km/h
              </div>
              <div className="absolute inset-0 w-16 h-16 bg-blue-500 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>

          {/* Hospital Destination */}
          <div className="absolute" style={{ left: '80%', top: '50%' }}>
            <div className="relative">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-900/50 border-4 border-green-900">
                <span className="text-xl">🏥</span>
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 border border-green-800 px-2 py-1 rounded text-xs text-white">
                {emergency.destinationHospital.name}
              </div>
            </div>
          </div>

          {/* Traffic Signals */}
          {trafficSignals.map((signal, idx) => (
            <div
              key={signal.id}
              className="absolute"
              style={{
                left: `${30 + idx * 15}%`,
                top: `${40 + (idx % 2) * 10}%`
              }}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 shadow-lg ${
                signal.status === 'GREEN' 
                  ? 'bg-green-500 border-green-700 shadow-green-900/50' 
                  : signal.status === 'RED'
                  ? 'bg-red-500 border-red-700 shadow-red-900/50'
                  : 'bg-yellow-500 border-yellow-700 shadow-yellow-900/50'
              }`}>
                <div className={`w-3 h-3 rounded-full ${
                  signal.status === 'GREEN' ? 'bg-green-200' : 'bg-white'
                } ${signal.status === 'GREEN' ? 'animate-pulse' : ''}`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <button className="w-10 h-10 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg flex items-center justify-center text-white transition-colors">
            <span className="text-lg">+</span>
          </button>
          <button className="w-10 h-10 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg flex items-center justify-center text-white transition-colors">
            <span className="text-lg">−</span>
          </button>
          <button className="w-10 h-10 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg flex items-center justify-center text-white transition-colors">
            <span className="text-sm">📍</span>
          </button>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-gray-900/90 border border-gray-800 rounded-lg p-3">
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span className="text-gray-300">Incident Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span className="text-gray-300">Emergency Vehicle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span className="text-gray-300">Destination</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-300">Green Signal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}