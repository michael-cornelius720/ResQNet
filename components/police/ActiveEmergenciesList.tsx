import { Emergency } from "@/types/Types";
import EmergencyDetailCard from "./EmergencyDetailCard";

type Props = {
  emergencies: Emergency[];
  selected: Emergency | null;
  setSelected: (e: Emergency) => void;
};

export default function ActiveEmergenciesList({
  emergencies,
  selected,
  setSelected,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-5">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Live Emergencies
      </h2>

      <div className="space-y-3">
        {emergencies.map((e) => (
          <EmergencyDetailCard
            key={e.id}
            emergency={e}
            selected={selected}
            onClick={() => setSelected(e)}
          />
        ))}
      </div>
    </div>
  );
}
