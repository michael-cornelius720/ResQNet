"use client";

import { useState } from "react";
import { Emergency } from "@/Types";

import DashboardHeader from "@/components/DashboardHeader";
import ActiveEmergenciesList from "@/components/ActiveEmergenciesList";
import PoliceMap from "@/components/PoliceMap";
import ActionPanel from "@/components/ActionPanel";

export default function PoliceDashboard() {
  const [selected, setSelected] = useState<Emergency | null>(null);

  const emergencies: Emergency[] = [
    {
      id: 1,
      type: "CRITICAL",
      category: "Fire Emergency",
      location: "Kankanady, Mangaluru",
      hospital: "KMC Hospital",
      lat: 12.8717,
      lng: 74.8486,
    },
    {
      id: 2,
      type: "NORMAL",
      category: "Medical Emergency",
      location: "Attavar, Mangaluru",
      hospital: "Yenepoya Hospital",
      lat: 12.8702,
      lng: 74.8495,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <DashboardHeader />

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-6">
        <ActiveEmergenciesList
          emergencies={emergencies}
          selected={selected}
          setSelected={setSelected}
        />

        <PoliceMap selected={selected} />
      </div>

      <ActionPanel />
    </div>
  );
}
