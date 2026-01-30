import { Alert, Ambulance, Stats } from './types';

export const mockAlerts: Alert[] = [
  {
    id: 'ALT001',
    patientId: 'PT-2024-001',
    location: 'Main St & 5th Ave',
    gps: '40.7128, -74.0060',
    severity: 'Critical',
    eta: '8 mins',
    status: 'Pending',
    timestamp: '2024-01-30 14:32'
  },
  {
    id: 'ALT002',
    patientId: 'PT-2024-002',
    location: 'Central Park West',
    gps: '40.7829, -73.9654',
    severity: 'High',
    eta: '12 mins',
    status: 'Accepted',
    timestamp: '2024-01-30 14:28'
  },
  {
    id: 'ALT003',
    patientId: 'PT-2024-003',
    location: 'Broadway & 42nd St',
    gps: '40.7580, -73.9855',
    severity: 'Medium',
    eta: '15 mins',
    status: 'Dispatched',
    timestamp: '2024-01-30 14:20'
  },
  {
    id: 'ALT004',
    patientId: 'PT-2024-004',
    location: 'Times Square',
    gps: '40.7580, -73.9855',
    severity: 'Low',
    eta: '20 mins',
    status: 'Pending',
    timestamp: '2024-01-30 14:15'
  },
  {
    id: 'ALT005',
    patientId: 'PT-2024-005',
    location: 'East Village',
    gps: '40.7264, -73.9818',
    severity: 'High',
    eta: '10 mins',
    status: 'Pending',
    timestamp: '2024-01-30 14:10'
  }
];

export const mockAmbulances: Ambulance[] = [
  {
    id: 'AMB001',
    vehicleNumber: 'RN-1101',
    driver: 'John Martinez',
    status: 'Available',
  },
  {
    id: 'AMB002',
    vehicleNumber: 'RN-1102',
    driver: 'Sarah Johnson',
    status: 'On Route',
    location: 'En route to Main St'
  },
  {
    id: 'AMB003',
    vehicleNumber: 'RN-1103',
    driver: 'Michael Chen',
    status: 'Available',
  },
  {
    id: 'AMB004',
    vehicleNumber: 'RN-1104',
    driver: 'Emily Davis',
    status: 'Busy',
    location: 'At Emergency Scene'
  },
  {
    id: 'AMB005',
    vehicleNumber: 'RN-1105',
    driver: 'David Wilson',
    status: 'Available',
  },
  {
    id: 'AMB006',
    vehicleNumber: 'RN-1106',
    driver: 'Lisa Anderson',
    status: 'On Route',
    location: 'Returning to base'
  }
];

export const mockStats: Stats = {
  activeEmergencies: 5,
  availableAmbulances: 3,
  totalAmbulances: 6,
  availableBeds: 12,
  totalBeds: 50,
  doctorsOnDuty: 8
};
