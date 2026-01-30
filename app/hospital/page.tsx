// app/hospital/page.tsx
'use client';

import { useState } from 'react';
import Header from '@/components/hospital/Header';
import AlertsTable from '@/components/hospital/AlertsTable';
import AssignModal from '@/components/hospital/AssignModal';
import AddAmbulance from '@/components/hospital/Addambulance';
import NotifyPolice from '@/components/hospital/Notifypolice';
import { mockAlerts, mockAmbulances, mockStats } from '@/components/hospital/mockData';
import { AmbulanceFormData } from '@/types';

export default function HospitalDashboard() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [ambulances, setAmbulances] = useState(mockAmbulances);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAcceptAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'Accepted' }
        : alert
    ));
  };

  const handleAssignAmbulance = (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      setSelectedAlert(alert);
      setIsModalOpen(true);
    }
  };

  const confirmAssignment = (ambulanceId: string) => {
    if (selectedAlert) {
      setAlerts(alerts.map(alert =>
        alert.id === selectedAlert.id
          ? { ...alert, status: 'Dispatched' }
          : alert
      ));
      setAmbulances(ambulances.map(amb =>
        amb.id === ambulanceId
          ? { ...amb, status: 'On Route' }
          : amb
      ));
    }
    setIsModalOpen(false);
    setSelectedAlert(null);
  };

  const handleAddAmbulance = (ambulanceData: AmbulanceFormData) => {
    const newAmbulance = {
      id: `AMB${(ambulances.length + 1).toString().padStart(3, '0')}`,
      vehicleNumber: ambulanceData.vehicleNumber,
      driver: ambulanceData.driver,
      status: 'Available' as const,
      location: ambulanceData.currentLocation || undefined,
    };
    setAmbulances([...ambulances, newAmbulance]);
    console.log('New ambulance added:', newAmbulance);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header hospitalName="City General Hospital" status="Online" />
      
      <main className="flex-1 overflow-y-auto p-8">
        {/* Stats Grid */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Emergencies"
            value={mockStats.activeEmergencies}
            icon="🚨"
            trend="+2 from last hour"
            color="red"
          />
          <StatCard
            title="Available Ambulances"
            value={mockStats.availableAmbulances}
            icon="🚑"
            trend={`${mockStats.totalAmbulances} total`}
            color="blue"
          />
          <StatCard
            title="Available Beds"
            value={mockStats.availableBeds}
            icon="🛏️"
            trend={`${mockStats.totalBeds} total capacity`}
            color="green"
          />
          <StatCard
            title="Doctors On Duty"
            value={mockStats.doctorsOnDuty}
            icon="👨‍⚕️"
            trend="24/7 coverage"
            color="purple"
          />
        </div> */}

        {/* Incoming Alerts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Incoming Alerts</h2>
          <AlertsTable
            alerts={alerts}
            onAccept={handleAcceptAlert}
            onAssign={handleAssignAmbulance}
          />
        </div>

        {/* Notify Police Section */}
        {/* <NotifyPolice alerts={alerts} /> */}

        {/* Add Ambulance Section */}
        <AddAmbulance onAddAmbulance={handleAddAmbulance} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ambulances */}
          {/* <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ambulance Fleet</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ambulances.map(ambulance => (
                <AmbulanceCard key={ambulance.id} ambulance={ambulance} />
              ))}
            </div>
          </div> */}

          {/* Staff & Beds */}
          {/* <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Resources</h2>
            <StaffBeds />
          </div> */}
        </div>
      </main>

      {isModalOpen && selectedAlert && (
        <AssignModal
          alert={selectedAlert}
          ambulances={ambulances.filter(a => a.status === 'Available')}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmAssignment}
        />
      )}
    </div>
  );
}