import { SeverityLevel, AlertStatus, AmbulanceStatus } from './types';

interface StatusBadgeProps {
  status: SeverityLevel | AlertStatus | AmbulanceStatus;
  type: 'severity' | 'alert' | 'ambulance';
}

const severityStyles: Record<SeverityLevel, string> = {
  Critical: 'bg-red-100 text-red-700 border-red-300',
  High: 'bg-orange-100 text-orange-700 border-orange-300',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  Low: 'bg-green-100 text-green-700 border-green-300',
};

const alertStyles: Record<AlertStatus, string> = {
  Pending: 'bg-gray-100 text-gray-700 border-gray-300',
  Accepted: 'bg-blue-100 text-blue-700 border-blue-300',
  Dispatched: 'bg-purple-100 text-purple-700 border-purple-300',
  Arrived: 'bg-green-100 text-green-700 border-green-300',
};

const ambulanceStyles: Record<AmbulanceStatus, string> = {
  Available: 'bg-green-100 text-green-700 border-green-300',
  'On Route': 'bg-blue-100 text-blue-700 border-blue-300',
  Busy: 'bg-red-100 text-red-700 border-red-300',
};

export default function StatusBadge({ status, type }: StatusBadgeProps) {
  const getStyle = () => {
    switch (type) {
      case 'severity':
        return severityStyles[status as SeverityLevel];
      case 'alert':
        return alertStyles[status as AlertStatus];
      case 'ambulance':
        return ambulanceStyles[status as AmbulanceStatus];
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStyle()}`}>
      {status}
    </span>
  );
}
