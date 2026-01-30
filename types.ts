export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type AlertStatus = 'Pending' | 'Accepted' | 'Dispatched' | 'Arrived';
export type AmbulanceStatus = 'Available' | 'On Route' | 'Busy';

export interface Alert {
  id: string;
  patientId: string;
  location: string;
  gps: string;
  severity: SeverityLevel;
  eta: string;
  status: AlertStatus;
  timestamp: string;
}

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  driver: string;
  status: AmbulanceStatus;
  location?: string;
}

export interface Stats {
  activeEmergencies: number;
  availableAmbulances: number;
  totalAmbulances: number;
  availableBeds: number;
  totalBeds: number;
  doctorsOnDuty: number;
}

export interface AmbulanceFormData {
  vehicleNumber: string;
  driver: string;
  contactNumber: string;
  equipmentLevel: 'BLS' | 'ALS' | 'Critical Care';
  currentLocation: string;
}

export interface PoliceNotification {
  id: string;
  alertId: string;
  location: string;
  severity: SeverityLevel;
  description: string;
  status: 'Pending' | 'Notified' | 'Acknowledged';
  timestamp: string;
}