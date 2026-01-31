// 'use client';

// import { useEffect, useState } from 'react';
// import { Activity, Ambulance, Calendar, Clock, User, Phone, AlertCircle, CheckCircle, MapPin } from 'lucide-react';

// type Hospital = {
//   id: string;
//   name: string;
//   address: string;
//   latitude: number;
//   longitude: number;
//   phone: string;
//   emergency_capacity: number;
// };

// type AmbulanceType = {
//   id: string;
//   hospital_id: string;
//   vehicle_number: string;
//   driver_name: string;
//   driver_phone: string;
//   is_available: boolean;
// };

// type SOSEmergency = {
//   id: string;
//   phone_number: string;
//   name: string | null;
//   latitude: number;
//   longitude: number;
//   emergency_level: string;
//   status: string;
//   created_at: string;
//   assigned_hospital_name?: string;
//   assigned_hospital_lat?: number;
//   assigned_hospital_lng?: number;
//   assigned_ambulance_number?: string;
//   driver_name?: string;
//   driver_phone?: string;
// };

// export default function HospitalDashboard() {
//   const [emergencies, setEmergencies] = useState<SOSEmergency[]>([]);
//   const [hospitals, setHospitals] = useState<Hospital[]>([]);
//   const [ambulances, setAmbulances] = useState<AmbulanceType[]>([]);
//   const [showForm, setShowForm] = useState(false);
//   const [timeNow, setTimeNow] = useState('');
//   const [isLoading, setIsLoading] = useState(true);

//   // Form state for new ambulance
//   const [vehicleNumber, setVehicleNumber] = useState('');
//   const [driverName, setDriverName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [selectedHospitalId, setSelectedHospitalId] = useState('');

//   // Fetch hospitals from database
//   useEffect(() => {
//     fetchHospitals();
//   }, []);

//   const fetchHospitals = async () => {
//     try {
//       const res = await fetch('/api/hospitals/manage');
//       const data = await res.json();

//       if (data.success) {
//         setHospitals(data.data);
//         // Set first hospital as default
//         if (data.data.length > 0) {
//           setSelectedHospitalId(data.data[0].id);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching hospitals:', error);
//     }
//   };

//   // Fetch ambulances from database
//   useEffect(() => {
//     fetchAmbulances();
//     const interval = setInterval(fetchAmbulances, 10000); // Refresh every 10 seconds
//     return () => clearInterval(interval);
//   }, []);

//   const fetchAmbulances = async () => {
//     try {
//       const res = await fetch('/api/ambulances');
//       const data = await res.json();

//       if (data.success) {
//         setAmbulances(data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching ambulances:', error);
//     }
//   };

//   // Fetch SOS emergencies
//   useEffect(() => {
//     fetchEmergencies();
//     const interval = setInterval(fetchEmergencies, 5000); // Refresh every 5 seconds
//     return () => clearInterval(interval);
//   }, []);

//   const fetchEmergencies = async () => {
//     try {
//       const res = await fetch('/api/emergency');
//       const data = await res.json();

//       if (data.success) {
//         setEmergencies(data.data);
//       }
//       setIsLoading(false);
//     } catch (error) {
//       console.error('Error fetching emergencies:', error);
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeNow(new Date().toLocaleTimeString());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const approveEmergencyWithHospital = async (emergencyId: string, hospitalId: string) => {
//     const hospital = hospitals.find(h => h.id === hospitalId);
//     if (!hospital) {
//       alert('Please select a hospital');
//       return;
//     }

//     try {
//       const res = await fetch('/api/emergency', {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           id: emergencyId,
//           status: 'acknowledged',
//           assigned_hospital_name: hospital.name,
//           assigned_hospital_lat: hospital.latitude,
//           assigned_hospital_lng: hospital.longitude,
//         }),
//       });

//       if (res.ok) {
//         // Refresh emergencies
//         fetchEmergencies();
//         alert(`Emergency approved and assigned to ${hospital.name}`);
//       } else {
//         alert('Failed to approve emergency');
//       }
//     } catch (error) {
//       console.error('Error approving emergency:', error);
//       alert('Failed to approve emergency');
//     }
//   };

//   const dispatchAmbulance = async (emergencyId: string, ambulanceId: string) => {
//     const selectedAmbulance = ambulances.find(a => a.id === ambulanceId);
//     if (!selectedAmbulance) return;

//     try {
//       const res = await fetch('/api/emergency', {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           id: emergencyId,
//           status: 'dispatched',
//           assigned_ambulance_number: selectedAmbulance.vehicle_number,
//           driver_name: selectedAmbulance.driver_name,
//           driver_phone: selectedAmbulance.driver_phone,
//         }),
//       });

//       if (res.ok) {
//         // Update ambulance availability in database
//         await fetch('/api/ambulances', {
//           method: 'PATCH',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             id: ambulanceId,
//             is_available: false,
//           }),
//         });

//         // Refresh data
//         fetchEmergencies();
//         fetchAmbulances();
//         alert('Ambulance dispatched successfully!');
//       }
//     } catch (error) {
//       console.error('Error dispatching ambulance:', error);
//       alert('Failed to dispatch ambulance');
//     }
//   };

//   const addAmbulance = async () => {
//     if (!vehicleNumber || !driverName || !phone || !selectedHospitalId) {
//       alert('Please fill in all fields');
//       return;
//     }

//     try {
//       const res = await fetch('/api/ambulances', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           hospital_id: selectedHospitalId,
//           vehicle_number: vehicleNumber,
//           driver_name: driverName,
//           driver_phone: phone,
//           is_available: true,
//         }),
//       });

//       if (res.ok) {
//         // Clear form
//         setVehicleNumber('');
//         setDriverName('');
//         setPhone('');
//         setShowForm(false);

//         // Refresh ambulances
//         fetchAmbulances();
//         alert('Ambulance added successfully!');
//       } else {
//         alert('Failed to add ambulance');
//       }
//     } catch (error) {
//       console.error('Error adding ambulance:', error);
//       alert('Failed to add ambulance');
//     }
//   };

//   const availableAmbulances = ambulances.filter(a => a.is_available);

//   const getPriorityStyles = (priority: string) => {
//     switch(priority) {
//       case 'critical':
//         return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200';
//       case 'high':
//         return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200';
//       case 'medium':
//         return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-200';
//       case 'low':
//         return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200';
//       default:
//         return 'bg-gray-500 text-white';
//     }
//   };

//   const formatTime = (dateString: string) => {
//     return new Date(dateString).toLocaleTimeString('en-US', { 
//       hour: '2-digit', 
//       minute: '2-digit' 
//     });
//   };

//   const getStatusBadge = (status: string) => {
//     switch(status) {
//       case 'pending':
//         return { text: 'Pending Review', class: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
//       case 'acknowledged':
//         return { text: 'Acknowledged', class: 'bg-blue-100 text-blue-800 border-blue-300' };
//       case 'dispatched':
//         return { text: 'Dispatched', class: 'bg-green-100 text-green-800 border-green-300' };
//       case 'in_progress':
//         return { text: 'In Progress', class: 'bg-purple-100 text-purple-800 border-purple-300' };
//       case 'resolved':
//         return { text: 'Resolved', class: 'bg-gray-100 text-gray-800 border-gray-300' };
//       default:
//         return { text: status, class: 'bg-gray-100 text-gray-800 border-gray-300' };
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       {/* HEADER */}
//       <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm sticky top-0 z-50">
//         <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
//           <div className="hidden sm:flex justify-between items-center">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200 transform hover:scale-105 transition-transform">
//                 <Activity className="w-7 h-7 text-white" strokeWidth={2.5} />
//               </div>
//               <div>
//                 <h1 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
//                   ResQNet
//                 </h1>
//                 <p className="text-xs lg:text-sm text-gray-600 font-medium">
//                   Smart Emergency Medical Response · Hospital Dashboard
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3 lg:gap-5">
//               <div className="flex items-center gap-2 lg:gap-3 px-3 lg:px-5 py-2 lg:py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200 shadow-sm">
//                 <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
//                 <span className="text-green-800 font-semibold text-xs lg:text-sm">
//                   Online · {timeNow}
//                 </span>
//               </div>

//               <div className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//                 <div className="w-9 lg:w-11 h-9 lg:h-11 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-xl flex items-center justify-center font-bold text-sm lg:text-lg shadow-md">
//                   DA
//                 </div>
//                 <div className="hidden md:block">
//                   <p className="font-bold text-gray-900 text-sm">Dr. Admin</p>
//                   <p className="text-xs text-gray-600">Emergency Coordinator</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-[1600px] mx-auto">
//         {/* STATS CARDS */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
//           <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6 hover:shadow-xl transition-shadow">
//             <div className="flex items-center justify-between mb-2 lg:mb-3">
//               <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-lg lg:rounded-xl flex items-center justify-center">
//                 <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 text-red-600" />
//               </div>
//               <span className="text-2xl lg:text-3xl font-black text-gray-900">
//                 {emergencies.filter(e => e.status === 'pending' || e.status === 'acknowledged').length}
//               </span>
//             </div>
//             <p className="text-xs lg:text-sm font-semibold text-gray-600">Active Emergencies</p>
//           </div>

//           <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6 hover:shadow-xl transition-shadow">
//             <div className="flex items-center justify-between mb-2 lg:mb-3">
//               <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg lg:rounded-xl flex items-center justify-center">
//                 <Ambulance className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
//               </div>
//               <span className="text-2xl lg:text-3xl font-black text-gray-900">{availableAmbulances.length}</span>
//             </div>
//             <p className="text-xs lg:text-sm font-semibold text-gray-600">Available Ambulances</p>
//           </div>

//           <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6 hover:shadow-xl transition-shadow">
//             <div className="flex items-center justify-between mb-2 lg:mb-3">
//               <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg lg:rounded-xl flex items-center justify-center">
//                 <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
//               </div>
//               <span className="text-2xl lg:text-3xl font-black text-gray-900">{hospitals.length}</span>
//             </div>
//             <p className="text-xs lg:text-sm font-semibold text-gray-600">Registered Hospitals</p>
//           </div>

//           <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6 hover:shadow-xl transition-shadow">
//             <div className="flex items-center justify-between mb-2 lg:mb-3">
//               <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg lg:rounded-xl flex items-center justify-center">
//                 <Ambulance className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
//               </div>
//               <span className="text-2xl lg:text-3xl font-black text-gray-900">
//                 {emergencies.filter(e => e.status === 'dispatched').length}
//               </span>
//             </div>
//             <p className="text-xs lg:text-sm font-semibold text-gray-600">Dispatched Units</p>
//           </div>
//         </div>

//         {/* SOS EMERGENCIES */}
//         <section className="bg-white rounded-xl lg:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//           <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6 bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
//             <div className="flex items-center gap-2 lg:gap-3">
//               <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg">
//                 <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
//               </div>
//               <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900">
//                 SOS Emergency Alerts
//               </h2>
//             </div>
//             <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 sm:px-4 lg:px-5 py-1.5 lg:py-2 rounded-full text-sm font-bold shadow-lg">
//               {emergencies.length} Total
//             </span>
//           </div>

//           <div className="divide-y divide-gray-100">
//             {isLoading ? (
//               <div className="p-8 text-center">
//                 <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
//                 <p className="text-gray-600">Loading emergencies...</p>
//               </div>
//             ) : emergencies.length === 0 ? (
//               <div className="p-8 text-center text-gray-500">
//                 <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
//                 <p>No emergency alerts at the moment</p>
//               </div>
//             ) : (
//               emergencies.map((emergency) => {
//                 const statusBadge = getStatusBadge(emergency.status);
//                 return (
//                   <div 
//                     key={emergency.id} 
//                     className="p-4 sm:p-6 lg:p-8 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200"
//                   >
//                     <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-4 lg:mb-5">
//                       <div className="flex items-center gap-3 lg:gap-4 flex-1">
//                         <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl lg:rounded-2xl flex items-center justify-center border border-gray-200 shadow-sm">
//                           <MapPin className="w-6 h-6 lg:w-7 lg:h-7 text-gray-700" />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="font-black text-base sm:text-lg lg:text-xl text-gray-900 mb-1 truncate">
//                             {emergency.name || 'Anonymous'}
//                           </p>
//                           <p className="text-sm text-gray-600 font-semibold truncate">
//                             📞 {emergency.phone_number}
//                           </p>
//                           <div className="flex items-center gap-2 text-gray-600 mt-1">
//                             <Clock className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
//                             <p className="text-xs sm:text-sm font-semibold">{formatTime(emergency.created_at)}</p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex flex-col gap-2">
//                         <span className={`px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 rounded-lg lg:rounded-xl text-xs sm:text-sm font-black whitespace-nowrap ${getPriorityStyles(emergency.emergency_level)}`}>
//                           {emergency.emergency_level.toUpperCase()}
//                         </span>
//                         <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${statusBadge.class}`}>
//                           {statusBadge.text}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Show assigned hospital if available */}
//                     {emergency.assigned_hospital_name && (
//                       <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
//                         <p className="text-sm font-bold text-blue-900">
//                           🏥 Assigned Hospital: {emergency.assigned_hospital_name}
//                         </p>
//                       </div>
//                     )}

//                     <div className="flex flex-col sm:flex-row gap-3">
//                       {emergency.status === 'pending' && (
//                         <div className="flex flex-col sm:flex-row gap-3 w-full">
//                           <select
//                             className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 font-semibold focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm"
//                             defaultValue=""
//                             id={`hospital-select-${emergency.id}`}
//                           >
//                             <option value="" disabled>
//                               🏥 Select Hospital
//                             </option>
//                             {hospitals.map(h => (
//                               <option key={h.id} value={h.id}>
//                                 {h.name} - {h.address}
//                               </option>
//                             ))}
//                           </select>
//                           <button
//                             onClick={() => {
//                               const select = document.getElementById(`hospital-select-${emergency.id}`) as HTMLSelectElement;
//                               const hospitalId = select.value;
//                               if (hospitalId) {
//                                 approveEmergencyWithHospital(emergency.id, hospitalId);
//                               } else {
//                                 alert('Please select a hospital');
//                               }
//                             }}
//                             className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-blue-200 hover:shadow-xl transform hover:scale-105 transition-all whitespace-nowrap"
//                           >
//                             ✓ Approve & Assign
//                           </button>
//                         </div>
//                       )}

//                       {emergency.status === 'acknowledged' && (
//                         <select
//                           className="w-full sm:w-auto border-2 border-gray-300 rounded-lg px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 text-sm text-gray-900 font-semibold focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm"
//                           onChange={e => dispatchAmbulance(emergency.id, e.target.value)}
//                           defaultValue=""
//                         >
//                           <option value="" disabled>
//                             🚑 Assign Ambulance
//                           </option>
//                           {availableAmbulances.map(a => (
//                             <option key={a.id} value={a.id}>
//                               {a.vehicle_number} · {a.driver_name}
//                             </option>
//                           ))}
//                         </select>
//                       )}

//                       {emergency.status === 'dispatched' && emergency.assigned_ambulance_number && (
//                         <div className="flex items-center gap-2 lg:gap-3 px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg lg:rounded-xl border-2 border-green-300 shadow-md">
//                           <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-700 flex-shrink-0" />
//                           <p className="font-black text-xs sm:text-sm text-green-800">
//                             Dispatched: {emergency.assigned_ambulance_number}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </section>

//         {/* AMBULANCE MANAGEMENT */}
//         <section className="bg-white rounded-xl lg:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
//             <div className="flex items-center gap-2 lg:gap-3">
//               <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-emerald-500 to-green-700 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg">
//                 <Ambulance className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
//               </div>
//               <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900">
//                 Ambulance Management
//               </h2>
//             </div>

//             <button
//               onClick={() => setShowForm(!showForm)}
//               className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-lg lg:rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 hover:shadow-xl transform hover:scale-105 transition-all"
//             >
//               + Add Ambulance
//             </button>
//           </div>

//           {showForm && (
//             <div className="mt-4 sm:mt-6 bg-gradient-to-br from-emerald-50 to-green-50 p-4 sm:p-5 lg:p-6 rounded-xl lg:rounded-2xl border-2 border-emerald-200">
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
//                 <div>
//                   <label className="text-xs font-bold text-gray-700 mb-2 block">Hospital</label>
//                   <select
//                     className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-900 font-semibold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
//                     value={selectedHospitalId}
//                     onChange={e => setSelectedHospitalId(e.target.value)}
//                   >
//                     {hospitals.map(h => (
//                       <option key={h.id} value={h.id}>
//                         {h.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="text-xs font-bold text-gray-700 mb-2 block">Vehicle Number</label>
//                   <input
//                     className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-900 font-semibold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
//                     placeholder="e.g., MH-12-AB-1234"
//                     value={vehicleNumber}
//                     onChange={e => setVehicleNumber(e.target.value)}
//                   />
//                 </div>
//                 <div>
//                   <label className="text-xs font-bold text-gray-700 mb-2 block">Driver Name</label>
//                   <input
//                     className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-900 font-semibold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
//                     placeholder="e.g., John Smith"
//                     value={driverName}
//                     onChange={e => setDriverName(e.target.value)}
//                   />
//                 </div>
//                 <div>
//                   <label className="text-xs font-bold text-gray-700 mb-2 block">Driver Phone</label>
//                   <input
//                     className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-900 font-semibold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
//                     placeholder="e.g., +91 98765 43210"
//                     value={phone}
//                     onChange={e => setPhone(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <button
//                 onClick={addAmbulance}
//                 className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2.5 sm:py-3 rounded-lg lg:rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
//               >
//                 Save Ambulance
//               </button>
//             </div>
//           )}

//           {/* AMBULANCE LIST */}
//           {ambulances.length > 0 && (
//             <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//               {ambulances.map(amb => (
//                 <div key={amb.id} className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-5 rounded-xl lg:rounded-2xl border-2 border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all">
//                   <div className="flex items-start justify-between mb-3 gap-3">
//                     <div className="flex items-center gap-3 flex-1 min-w-0">
//                       <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
//                         <Ambulance className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//                       </div>
//                       <div className="min-w-0 flex-1">
//                         <p className="font-black text-base sm:text-lg text-gray-900 truncate">{amb.vehicle_number}</p>
//                         <p className="text-xs sm:text-sm text-gray-600 font-semibold truncate">{amb.driver_name}</p>
//                       </div>
//                     </div>
//                     <span className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg lg:rounded-full font-bold text-xs whitespace-nowrap flex-shrink-0 ${
//                       amb.is_available
//                         ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-300'
//                         : 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-2 border-orange-300'
//                     }`}>
//                       {amb.is_available ? 'Available' : 'On Route'}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm">
//                     <Phone className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
//                     <span className="font-semibold truncate">{amb.driver_phone}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }


'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, Ambulance, Clock, AlertCircle, CheckCircle, MapPin, Phone, Hospital as HospitalIcon } from 'lucide-react';
import { getHospitalSession, clearHospitalSession, type HospitalSession } from '@/lib/auth';

type AmbulanceType = {
  id: string;
  hospital_id: string;
  vehicle_number: string;
  driver_name: string;
  driver_phone: string;
  is_available: boolean;
};

type SOSEmergency = {
  id: string;
  phone_number: string;
  name: string | null;
  latitude: number;
  longitude: number;
  emergency_level: string;
  status: string;
  created_at: string;
  assigned_hospital_name?: string;
  assigned_hospital_lat?: number;
  assigned_hospital_lng?: number;
  assigned_ambulance_number?: string;
  driver_name?: string;
  driver_phone?: string;
  description?: string;
  blood_group?: string;
  allergies?: string;
  medical_conditions?: string;
  hospital_id?: string;
  notified_hospitals?: string[];
};

type Appointment = {
  id: string;
  user_phone: string;
  user_name: string | null;
  blood_group: string | null;
  medical_conditions: string | null;
  issue_type: string;
  description: string | null;
  hospital_name: string;
  hospital_lat: number;
  hospital_lng: number;
  user_lat: number;
  user_lng: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  appointment_time: string | null;
  assigned_doctor: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export default function HospitalDashboard() {
  const router = useRouter();
  const [hospitalInfo, setHospitalInfo] = useState<HospitalSession | null>(null);
  const [emergencies, setEmergencies] = useState<SOSEmergency[]>([]);
  const [ambulances, setAmbulances] = useState<AmbulanceType[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [timeNow, setTimeNow] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Form state for new ambulance
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [phone, setPhone] = useState('');

  // Appointment modal state
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [assignedDoctor, setAssignedDoctor] = useState('');
  const [appointmentDateTime, setAppointmentDateTime] = useState('');

  // Check authentication on mount
  useEffect(() => {
    const session = getHospitalSession();
    if (!session) {
      router.push('/login');
      return;
    }
    setHospitalInfo(session);
  }, [router]);

  // Fetch emergencies specific to this hospital
  const fetchEmergencies = useCallback(async () => {
    if (!hospitalInfo) return;

    try {
      const res = await fetch(`/api/emergency?hospital_id=${hospitalInfo.id}`);
      const data = await res.json();

      if (data.success) {
        setEmergencies(data.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching emergencies:', error);
      setIsLoading(false);
    }
  }, [hospitalInfo]);

  useEffect(() => {
    if (!hospitalInfo) return;

    fetchEmergencies();
    const interval = setInterval(fetchEmergencies, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [hospitalInfo, fetchEmergencies]);

  // Fetch ambulances for this hospital
  const fetchAmbulances = useCallback(async () => {
    if (!hospitalInfo) return;

    try {
      const res = await fetch(`/api/ambulances?hospital_id=${hospitalInfo.id}`);
      const data = await res.json();

      if (data.success) {
        setAmbulances(data.data);
      }
    } catch (error) {
      console.error('Error fetching ambulances:', error);
    }
  }, [hospitalInfo]);

  useEffect(() => {
    if (!hospitalInfo) return;

    fetchAmbulances();
    const interval = setInterval(fetchAmbulances, 10000);
    return () => clearInterval(interval);
  }, [hospitalInfo, fetchAmbulances]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeNow(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    clearHospitalSession();
    router.push('/login');
  };


  const approveEmergency = async (emergencyId: string) => {
    if (!hospitalInfo) {
      alert('Please select a hospital first');
      return;
    }

    try {
      const res = await fetch('/api/emergency', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: emergencyId,
          status: 'acknowledged',
          hospital_id: hospitalInfo.id,
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        // Already assigned to another hospital
        alert(`Emergency already assigned to: ${data.assigned_to}`);
        fetchEmergencies(); // Refresh to show updated status
        return;
      }

      if (res.ok) {
        fetchEmergencies();
        alert(`Emergency approved and assigned to ${hospitalInfo.name}`);
      } else {
        alert(data.error || 'Failed to approve emergency');
      }
    } catch (error) {
      console.error('Error approving emergency:', error);
      alert('Failed to approve emergency');
    }
  };

  const dispatchAmbulance = async (emergencyId: string, ambulanceId: string) => {
    const selectedAmbulance = ambulances.find(a => a.id === ambulanceId);
    if (!selectedAmbulance) return;

    try {
      const res = await fetch('/api/emergency', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: emergencyId,
          status: 'dispatched',
          assigned_ambulance_number: selectedAmbulance.vehicle_number,
          driver_name: selectedAmbulance.driver_name,
          driver_phone: selectedAmbulance.driver_phone,
        }),
      });

      if (res.ok) {
        await fetch('/api/ambulances', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: ambulanceId,
            is_available: false,
          }),
        });

        fetchEmergencies();
        fetchAmbulances();
        alert('Ambulance dispatched successfully!');
      }
    } catch (error) {
      console.error('Error dispatching ambulance:', error);
      alert('Failed to dispatch ambulance');
    }
  };

  const addAmbulance = async () => {
    if (!vehicleNumber || !driverName || !phone || !hospitalInfo) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch('/api/ambulances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospital_id: hospitalInfo.id,
          vehicle_number: vehicleNumber,
          driver_name: driverName,
          driver_phone: phone,
          is_available: true,
        }),
      });

      if (res.ok) {
        setVehicleNumber('');
        setDriverName('');
        setPhone('');
        setShowForm(false);
        fetchAmbulances();
        alert('Ambulance added successfully!');
      } else {
        alert('Failed to add ambulance');
      }
    } catch (error) {
      console.error('Error adding ambulance:', error);
      alert('Failed to add ambulance');
    }
  };

  const availableAmbulances = ambulances.filter(a => a.is_available);

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200';
      case 'high':
        return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-200';
      case 'low':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: 'Pending Approval', class: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
      case 'acknowledged':
        return { text: 'Acknowledged', class: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'dispatched':
        return { text: 'Dispatched', class: 'bg-green-100 text-green-800 border-green-300' };
      case 'in_progress':
        return { text: 'In Progress', class: 'bg-purple-100 text-purple-800 border-purple-300' };
      case 'resolved':
        return { text: 'Resolved', class: 'bg-gray-100 text-gray-800 border-gray-300' };
      default:
        return { text: status, class: 'bg-gray-100 text-gray-800 border-gray-300' };
    }
  };

  // Redirect to login if not authenticated
  if (!hospitalInfo) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200">
                <Activity className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                  {hospitalInfo.name}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  Emergency Response Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-800 font-semibold text-sm">
                  {timeNow}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-bold text-gray-700 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-[1600px] mx-auto">
        {/* STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-3xl font-black text-gray-900">
                {emergencies.filter(e => e.status === 'pending').length}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-600">Pending Requests</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-3xl font-black text-gray-900">
                {emergencies.filter(e => e.status === 'acknowledged').length}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-600">Acknowledged</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <Ambulance className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-3xl font-black text-gray-900">{availableAmbulances.length}</span>
            </div>
            <p className="text-sm font-semibold text-gray-600">Available Ambulances</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <Ambulance className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-3xl font-black text-gray-900">
                {emergencies.filter(e => e.status === 'dispatched').length}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-600">Dispatched</p>
          </div>
        </div>

        {/* EMERGENCY ALERTS */}
        <section className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-black text-gray-900">
                Emergency Alerts for Your Hospital
              </h2>
            </div>
            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              {emergencies.length} Total
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading emergencies...</p>
              </div>
            ) : emergencies.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="font-semibold">No emergency alerts for your hospital</p>
                <p className="text-sm mt-1">New emergencies will appear here automatically</p>
              </div>
            ) : (
              emergencies.map((emergency) => {
                const statusBadge = getStatusBadge(emergency.status);
                const isAssignedToAnotherHospital = emergency.assigned_hospital_name &&
                  emergency.assigned_hospital_name !== hospitalInfo.name;

                return (
                  <div
                    key={emergency.id}
                    className={`p-6 hover:bg-gray-50 transition-all ${isAssignedToAnotherHospital ? 'opacity-50' : ''
                      }`}
                  >
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center border border-gray-200 shadow-sm">
                          <MapPin className="w-7 h-7 text-gray-700" />
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-lg text-gray-900">
                            {emergency.name || 'Anonymous'}
                          </p>
                          <p className="text-sm text-gray-600 font-semibold">
                            📞 {emergency.phone_number}
                          </p>
                          <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <Clock className="w-4 h-4" />
                            <p className="text-sm font-semibold">{formatTime(emergency.created_at)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className={`px-4 py-2 rounded-xl text-sm font-black whitespace-nowrap ${getPriorityStyles(emergency.emergency_level)}`}>
                          {emergency.emergency_level.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${statusBadge.class}`}>
                          {statusBadge.text}
                        </span>
                      </div>
                    </div>

                    {/* Medical Info */}
                    {(emergency.blood_group || emergency.allergies || emergency.medical_conditions) && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm">
                        {emergency.blood_group && (
                          <p><span className="font-bold">Blood Group:</span> {emergency.blood_group}</p>
                        )}
                        {emergency.allergies && (
                          <p><span className="font-bold">Allergies:</span> {emergency.allergies}</p>
                        )}
                        {emergency.medical_conditions && (
                          <p><span className="font-bold">Conditions:</span> {emergency.medical_conditions}</p>
                        )}
                      </div>
                    )}

                    {/* Assignment Status */}
                    {isAssignedToAnotherHospital && (
                      <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-sm font-bold text-orange-900">
                          ⚠️ Assigned to: {emergency.assigned_hospital_name}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      {emergency.status === 'pending' && !isAssignedToAnotherHospital && (
                        <button
                          onClick={() => approveEmergency(emergency.id)}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                        >
                          ✓ Approve & Accept Emergency
                        </button>
                      )}

                      {emergency.status === 'acknowledged' &&
                        emergency.assigned_hospital_name === hospitalInfo.name && (
                          <select
                            className="border-2 border-gray-300 rounded-xl px-5 py-3 text-sm text-gray-900 font-semibold focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm"
                            onChange={e => dispatchAmbulance(emergency.id, e.target.value)}
                            defaultValue=""
                          >
                            <option value="" disabled>
                              🚑 Assign Ambulance
                            </option>
                            {availableAmbulances.map(a => (
                              <option key={a.id} value={a.id}>
                                {a.vehicle_number} · {a.driver_name}
                              </option>
                            ))}
                          </select>
                        )}

                      {emergency.status === 'dispatched' && emergency.assigned_ambulance_number && (
                        <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border-2 border-green-300 shadow-md">
                          <CheckCircle className="w-6 h-6 text-green-700" />
                          <p className="font-black text-sm text-green-800">
                            Dispatched: {emergency.assigned_ambulance_number}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* AMBULANCE MANAGEMENT */}
        <section className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <Ambulance className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-black text-gray-900">
                Your Ambulances
              </h2>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              + Add Ambulance
            </button>
          </div>

          {showForm && (
            <div className="mt-6 bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border-2 border-emerald-200 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-2 block">Vehicle Number</label>
                  <input
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 font-semibold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                    placeholder="e.g., MH-12-AB-1234"
                    value={vehicleNumber}
                    onChange={e => setVehicleNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-2 block">Driver Name</label>
                  <input
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 font-semibold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                    placeholder="e.g., John Smith"
                    value={driverName}
                    onChange={e => setDriverName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-2 block">Driver Phone</label>
                  <input
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 font-semibold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                    placeholder="e.g., +91 98765 43210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={addAmbulance}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
              >
                Save Ambulance
              </button>
            </div>
          )}

          {ambulances.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ambulances.map(amb => (
                <div key={amb.id} className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-2xl border-2 border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                        <Ambulance className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-lg text-gray-900">{amb.vehicle_number}</p>
                        <p className="text-sm text-gray-600 font-semibold">{amb.driver_name}</p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full font-bold text-xs whitespace-nowrap ${amb.is_available
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-300'
                      : 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-2 border-orange-300'
                      }`}>
                      {amb.is_available ? 'Available' : 'On Route'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Phone className="w-4 h-4" />
                    <span className="font-semibold">{amb.driver_phone}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Ambulance className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No ambulances added yet</p>
            </div>
          )}
        </section>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-500 mt-6 pb-6">
          © {new Date().getFullYear()} ResQNet. All rights reserved. Saving lives, one second at a time.
        </p>
      </main>
    </div>
  );
}