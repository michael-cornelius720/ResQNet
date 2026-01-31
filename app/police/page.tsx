"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Shield, MapPin, Clock, AlertCircle, Phone, CheckCircle, Eye, Radio, Siren, Hospital, Navigation } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const PoliceMap = dynamic(() => import("./PoliceMap"), {
  ssr: false,
  loading: () => <div className="h-96 lg:h-[500px] w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400 font-medium">Loading Interactive Map...</div>,
});

/* ---------------- SUPABASE SETUP ---------------- */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ---------------- TYPES ---------------- */
type Hospital = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string | null;
};

type Emergency = {
  id: string;
  phone_number: string;
  name: string | null;
  latitude: number;
  longitude: number;
  location_text: string | null;
  emergency_level: 'low' | 'medium' | 'high' | 'critical';
  emergency_type: string | null;
  description: string | null;
  status: 'pending' | 'acknowledged' | 'dispatched' | 'in_progress' | 'resolved' | 'cancelled';
  assigned_hospital_name: string | null;
  assigned_hospital_lat: number | null;
  assigned_hospital_lng: number | null;
  assigned_ambulance_number: string | null;
  driver_name: string | null;
  driver_phone: string | null;
  blood_group: string | null;
  allergies: string | null;
  medical_conditions: string | null;
  created_at: string;
  updated_at: string;
  hospital_id: string | null;
  hospital?: Hospital;
};

/* ---------------- MAP COMPONENT WITH ROUTE ---------------- */
const EmergencyRouteMap = ({
  emergencyLat,
  emergencyLng,
  hospitalLat,
  hospitalLng,
  hospitalName,
}: {
  emergencyLat: number;
  emergencyLng: number;
  hospitalLat?: number | null;
  hospitalLng?: number | null;
  hospitalName?: string | null;
}) => {
  if (hospitalLat && hospitalLng) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Navigation className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900">Emergency Location & Route</h3>
          </div>
          <PoliceMap
            userLat={Number(emergencyLat)}
            userLng={Number(emergencyLng)}
            hospitalLat={Number(hospitalLat)}
            hospitalLng={Number(hospitalLng)}
          />
          <div className="mt-3 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-red-600" />
              <span>Emergency: {emergencyLat.toFixed(4)}, {emergencyLng.toFixed(4)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Hospital className="w-4 h-4 text-blue-600" />
              <span>{hospitalName || 'Hospital'}: {hospitalLat.toFixed(4)}, {hospitalLng.toFixed(4)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <iframe
        className="w-full h-96 lg:h-[500px] rounded-xl border-0 shadow-inner"
        loading="lazy"
        src={`https://maps.google.com/maps?q=${emergencyLat},${emergencyLng}&output=embed`}
      />
      <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-xl flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-orange-600" />
        <p className="text-orange-800 font-semibold text-sm">
          {hospitalName ? "Fetching hospital location details..." : "No hospital assigned to this emergency yet."}
        </p>
      </div>
    </div>
  );
};

/* ---------------- UTILITY FUNCTIONS ---------------- */
const getTimeAgo = (timestamp: string) => {
  const now = new Date();
  const created = new Date(timestamp);
  const diffMs = now.getTime() - created.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(2)}km`;
};

export default function PoliceDashboard() {
  const [timeNow, setTimeNow] = useState("");
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [selected, setSelected] = useState<Emergency | null>(null);
  const [loading, setLoading] = useState(true);
  const [assignedHospital, setAssignedHospital] = useState<Hospital | null>(null);

  /* ---------------- LIVE CLOCK ---------------- */
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeNow(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /* ---------------- FETCH EMERGENCIES WITH HOSPITAL DATA ---------------- */
  const fetchEmergencies = async () => {
    try {
      const { data, error } = await supabase
        .from('sos_emergencies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const newEmergencies = data || [];
      setEmergencies(newEmergencies);

      // Automatically update selected emergency if data changed
      if (selected) {
        const updated = newEmergencies.find(e => e.id === selected.id);
        if (updated) {
          if (updated.hospital_id !== selected.hospital_id ||
            updated.assigned_hospital_name !== selected.assigned_hospital_name ||
            updated.status !== selected.status) {
            console.log('Assignment or status change detected, refreshing view...');
            viewLocation(updated);
          } else {
            setSelected(updated);
          }
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching emergencies:', error);
      setLoading(false);
    }
  };

  /* ---------------- FETCH HOSPITAL BY ID ---------------- */
  const fetchHospitalById = async (hospitalId: string) => {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .eq('id', hospitalId)
        .single();

      if (error) {
        console.error('Hospital fetch error:', error);
        return null;
      }

      return data as Hospital;
    } catch (err) {
      console.error('Error fetching hospital:', err);
      return null;
    }
  };

  /* ---------------- FETCH HOSPITAL BY NAME ---------------- */
  const fetchHospitalByName = async (name: string) => {
    try {
      // 1. Try exact (case-insensitive) match
      const { data: exactMatch, error: exactError } = await supabase
        .from('hospitals')
        .select('*')
        .ilike('name', name)
        .maybeSingle();

      if (!exactError && exactMatch) return exactMatch as Hospital;

      // 2. Try relaxed match (remove spaces/dots and use ilike with wildcards)
      const _cleanName = name.replace(/[^a-zA-Z0-9]/g, '');
      const { data: fuzzyMatches, error: fuzzyError } = await supabase
        .from('hospitals')
        .select('*')
        .ilike('name', `%${name.split(' ')[0]}%`)
        .limit(5);

      if (!fuzzyError && fuzzyMatches && fuzzyMatches.length > 0) {
        // Find best match if multiple
        return fuzzyMatches[0] as Hospital;
      }

      return null;
    } catch (err) {
      console.error('Error fetching hospital by name:', err);
      return null;
    }
  };

  /* ---------------- REAL-TIME SUBSCRIPTION ---------------- */
  useEffect(() => {
    fetchEmergencies();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('sos_emergencies_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sos_emergencies'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchEmergencies(); // Refresh data on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- UPDATE STATUS ---------------- */
  const updateStatus = async (id: string, newStatus: Emergency['status']) => {
    try {
      const { error } = await supabase
        .from('sos_emergencies')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Optimistic update
      setEmergencies(prev =>
        prev.map(e => e.id === id ? { ...e, status: newStatus } : e)
      );

      if (selected?.id === id) {
        setSelected(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const markAcknowledged = (id: string) => updateStatus(id, 'acknowledged');
  const markInProgress = (id: string) => updateStatus(id, 'in_progress');
  const markResolved = (id: string) => updateStatus(id, 'resolved');

  /* ---------------- VIEW LOCATION ---------------- */
  const viewLocation = async (emergency: Emergency) => {
    setSelected(emergency);

    console.log('Selected emergency:', emergency);
    console.log('Hospital name:', emergency.assigned_hospital_name);
    console.log('Hospital lat:', emergency.assigned_hospital_lat);
    console.log('Hospital lng:', emergency.assigned_hospital_lng);

    // Check if we have hospital coordinates in the emergency record
    if (emergency.assigned_hospital_lat && emergency.assigned_hospital_lng) {
      const hospitalData = {
        id: '',
        name: emergency.assigned_hospital_name || 'Assigned Hospital',
        address: '',
        latitude: emergency.assigned_hospital_lat,
        longitude: emergency.assigned_hospital_lng,
        phone: null
      };
      console.log('Setting hospital data:', hospitalData);
      setAssignedHospital(hospitalData);
    } else if (emergency.hospital_id) {
      console.log('Fetching hospital data from hospitals table for ID:', emergency.hospital_id);
      const hospitalData = await fetchHospitalById(emergency.hospital_id);
      if (hospitalData) {
        console.log('Successfully fetched hospital fallback data by ID:', hospitalData);
        setAssignedHospital(hospitalData);
      } else {
        console.log('Failed to fetch hospital fallback data by ID');
        setAssignedHospital(null);
      }
    } else if (emergency.assigned_hospital_name) {
      console.log('Fetching hospital data by name:', emergency.assigned_hospital_name);
      const hospitalData = await fetchHospitalByName(emergency.assigned_hospital_name);
      if (hospitalData) {
        console.log('Successfully fetched hospital fallback data by Name:', hospitalData);
        setAssignedHospital(hospitalData);
      } else {
        console.log('Failed to fetch hospital fallback data by Name');
        setAssignedHospital(null);
      }
    } else {
      console.log('No hospital coordinates, hospital_id, or hospital_name found');
      setAssignedHospital(null);
    }

    setTimeout(() => {
      const mapSection = document.getElementById('location-map-section');
      if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  /* ---------------- COMPUTED VALUES ---------------- */
  const getPriorityStyles = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200';
      case 'high':
        return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-200';
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200';
    }
  };

  const activeEmergencies = emergencies.filter(e =>
    ['pending', 'acknowledged', 'dispatched', 'in_progress'].includes(e.status)
  );
  const criticalCount = emergencies.filter(e =>
    e.emergency_level === 'critical' &&
    ['pending', 'acknowledged', 'dispatched', 'in_progress'].includes(e.status)
  ).length;
  const resolvedCount = emergencies.filter(e => e.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* ================= HEADER ================= */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          {/* Mobile Layout */}
          <div className="flex flex-col gap-3 sm:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                  <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-xl font-black bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                    ResQNet Police
                  </h1>
                  <p className="text-xs text-gray-600 font-medium">
                    Emergency Response
                  </p>
                </div>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-md">
                PC
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200 shadow-sm self-start">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-800 font-semibold text-xs">
                Online · {timeNow}
              </span>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 transform hover:scale-105 transition-transform">
                <Shield className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                  ResQNet Police
                </h1>
                <p className="text-xs lg:text-sm text-gray-600 font-medium">
                  Emergency Response · Help Citizens in Need
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-5">
              <div className="flex items-center gap-2 lg:gap-3 px-3 lg:px-5 py-2 lg:py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200 shadow-sm">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-800 font-semibold text-xs lg:text-sm">
                  Online · {timeNow}
                </span>
              </div>

              <div className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-9 lg:w-11 h-9 lg:h-11 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-xl flex items-center justify-center font-bold text-sm lg:text-lg shadow-md">
                  PC
                </div>
                <div className="hidden md:block">
                  <p className="font-bold text-gray-900 text-sm">Officer John</p>
                  <p className="text-xs text-gray-600">Police Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-[1600px] mx-auto">

        {/* ========== STATS CARDS ========== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2 lg:mb-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-lg lg:rounded-xl flex items-center justify-center">
                <Siren className="w-5 h-5 lg:w-6 lg:h-6 text-red-600" />
              </div>
              <span className="text-2xl lg:text-3xl font-black text-gray-900">{activeEmergencies.length}</span>
            </div>
            <p className="text-xs lg:text-sm font-semibold text-gray-600">Active Emergencies</p>
          </div>

          <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2 lg:mb-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg lg:rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
              </div>
              <span className="text-2xl lg:text-3xl font-black text-gray-900">{criticalCount}</span>
            </div>
            <p className="text-xs lg:text-sm font-semibold text-gray-600">Critical Cases</p>
          </div>

          <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2 lg:mb-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg lg:rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
              </div>
              <span className="text-2xl lg:text-3xl font-black text-gray-900">{resolvedCount}</span>
            </div>
            <p className="text-xs lg:text-sm font-semibold text-gray-600">Resolved Cases</p>
          </div>

          <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2 lg:mb-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg lg:rounded-xl flex items-center justify-center">
                <Radio className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-600" />
              </div>
              <span className="text-2xl lg:text-3xl font-black text-gray-900">{emergencies.length}</span>
            </div>
            <p className="text-xs lg:text-sm font-semibold text-gray-600">Total Cases</p>
          </div>
        </div>

        {/* ========== LIVE EMERGENCIES ========== */}
        <section className="bg-white rounded-xl lg:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6 bg-gradient-to-r from-red-50 to-orange-100 border-b border-red-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg">
                <Siren className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900">
                Live Emergency Alerts
              </h2>
            </div>
            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 sm:px-4 lg:px-5 py-1.5 lg:py-2 rounded-full text-sm font-bold shadow-lg">
              {activeEmergencies.length} Active
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading emergencies...</div>
            ) : emergencies.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No emergencies at this time</div>
            ) : (
              emergencies.map((e, index) => (
                <div
                  key={e.id}
                  onClick={() => viewLocation(e)}
                  className={`p-4 sm:p-6 lg:p-8 cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200 ${selected?.id === e.id ? "bg-gradient-to-r from-indigo-50 to-transparent border-l-4 border-indigo-500" : ""
                    }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-4">
                    <div className="flex items-start gap-3 lg:gap-4 flex-1">
                      <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl lg:rounded-2xl flex items-center justify-center border border-gray-200 shadow-sm flex-shrink-0">
                        <AlertCircle className={`w-6 h-6 lg:w-7 lg:h-7 ${e.emergency_level === 'critical' ? 'text-red-600' :
                          e.emergency_level === 'high' ? 'text-orange-600' :
                            e.emergency_level === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                          }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-base sm:text-lg lg:text-xl text-gray-900 mb-2">
                          {e.emergency_type || 'Emergency Alert'}
                        </p>
                        <div className="space-y-1.5">
                          {e.name && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <Eye className="w-4 h-4 flex-shrink-0 text-gray-500" />
                              <p className="text-xs sm:text-sm font-semibold truncate">{e.name}</p>
                            </div>
                          )}
                          {e.phone_number && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <Phone className="w-4 h-4 flex-shrink-0 text-gray-500" />
                              <p className="text-xs sm:text-sm font-semibold truncate">{e.phone_number}</p>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-gray-700">
                            <MapPin className="w-4 h-4 flex-shrink-0 text-gray-500" />
                            <p className="text-xs sm:text-sm font-semibold truncate">
                              {e.location_text || `${e.latitude.toFixed(4)}, ${e.longitude.toFixed(4)}`}
                            </p>
                          </div>
                          {e.assigned_hospital_name && (
                            <div className="flex items-center gap-2 text-blue-700">
                              <Hospital className="w-4 h-4 flex-shrink-0 text-blue-500" />
                              <p className="text-xs sm:text-sm font-semibold truncate">{e.assigned_hospital_name}</p>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-gray-500">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <p className="text-xs font-medium">{getTimeAgo(e.created_at)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className={`px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 rounded-lg lg:rounded-xl text-xs sm:text-sm font-black whitespace-nowrap flex-shrink-0 uppercase ${getPriorityStyles(e.emergency_level)}`}>
                        {e.emergency_level}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold text-center">
                        {e.status}
                      </span>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  {['pending', 'acknowledged', 'in_progress'].includes(e.status) && (
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <button
                        onClick={(ev) => {
                          ev.stopPropagation();
                          viewLocation(e);
                        }}
                        className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg lg:rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:shadow-xl transform hover:scale-105 transition-all"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>View Route</span>
                      </button>
                      {e.status === 'pending' && (
                        <button
                          onClick={(ev) => {
                            ev.stopPropagation();
                            markAcknowledged(e.id);
                          }}
                          className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg lg:rounded-xl text-sm font-bold shadow-lg shadow-green-200 hover:shadow-xl transform hover:scale-105 transition-all"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Acknowledge</span>
                        </button>
                      )}
                      {e.status === 'acknowledged' && (
                        <button
                          onClick={(ev) => {
                            ev.stopPropagation();
                            markInProgress(e.id);
                          }}
                          className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg lg:rounded-xl text-sm font-bold shadow-lg shadow-orange-200 hover:shadow-xl transform hover:scale-105 transition-all"
                        >
                          <Radio className="w-4 h-4" />
                          <span>En Route</span>
                        </button>
                      )}
                      <button
                        onClick={(ev) => {
                          ev.stopPropagation();
                          markResolved(e.id);
                        }}
                        className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white rounded-lg lg:rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark Resolved</span>
                      </button>
                    </div>
                  )}

                  {e.status === 'resolved' && (
                    <div className="flex items-center gap-2 lg:gap-3 px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg lg:rounded-xl border-2 border-green-300 shadow-md">
                      <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-700 flex-shrink-0" />
                      <p className="font-black text-xs sm:text-sm text-green-800">
                        Emergency Resolved
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* ========== MAP SECTION ========== */}
        {selected && (
          <section id="location-map-section" className="bg-white rounded-xl lg:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 mb-4 lg:mb-6">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg">
                  <MapPin className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900">
                  Emergency Location & Route
                </h2>
              </div>

              {/* Location Info Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1">INCIDENT LOCATION</p>
                    <p className="font-bold text-gray-900 text-lg">{selected.emergency_type || 'Emergency'}</p>
                    <p className="text-sm text-gray-700 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {selected.location_text || `${selected.latitude.toFixed(6)}, ${selected.longitude.toFixed(6)}`}
                    </p>
                  </div>

                  {/* Patient Contact */}
                  {selected.phone_number && (
                    <div className="pt-2 border-t border-blue-200">
                      <p className="text-xs font-semibold text-gray-600 mb-1">PATIENT CONTACT</p>
                      <a
                        href={`tel:${selected.phone_number}`}
                        className="text-blue-700 font-bold text-lg hover:text-blue-900 flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        {selected.phone_number}
                      </a>
                      {selected.name && (
                        <p className="text-sm text-gray-700 mt-1">{selected.name}</p>
                      )}
                    </div>
                  )}

                  {/* Hospital Info */}
                  {assignedHospital && (
                    <div className="pt-2 border-t border-blue-200">
                      <p className="text-xs font-semibold text-gray-600 mb-1">ASSIGNED HOSPITAL</p>
                      <div className="flex items-center gap-2 mb-1">
                        <Hospital className="w-4 h-4 text-blue-600" />
                        <p className="font-bold text-gray-900 text-lg">{assignedHospital.name}</p>
                      </div>
                      {assignedHospital.latitude && assignedHospital.longitude && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Navigation className="w-3 h-3" />
                          <span>Distance: </span>
                          <span className="font-bold text-blue-700">
                            {calculateDistance(
                              selected.latitude,
                              selected.longitude,
                              assignedHospital.latitude,
                              assignedHospital.longitude
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {selected.description && (
                    <div className="pt-2 border-t border-blue-200">
                      <p className="text-xs font-semibold text-gray-600">Description:</p>
                      <p className="text-sm text-gray-700 mt-1">{selected.description}</p>
                    </div>
                  )}
                </div>

                {/* Police Action Alert */}
                <div className="mt-4 p-3 bg-indigo-100 border-2 border-indigo-400 rounded-lg">
                  <p className="text-indigo-800 font-bold text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    🚔 Police assistance requested - Clear the route for ambulance
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl lg:rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg">

              <EmergencyRouteMap
                emergencyLat={selected.latitude}
                emergencyLng={selected.longitude}
                hospitalLat={assignedHospital?.latitude}
                hospitalLng={assignedHospital?.longitude}
                hospitalName={assignedHospital?.name}
              />
            </div>
          </section>
        )}

      </main>
    </div>
  );
}