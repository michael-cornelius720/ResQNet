export type EmergencyType = "CRITICAL" | "NORMAL";

export type Emergency = {
  id: number;
  type: EmergencyType;
  category: string;
  location: string;
  hospital: string;
  lat: number;
  lng: number;
};
