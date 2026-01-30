import { Emergency } from "@/types/Types";

type Props = {
  emergency: Emergency;
  selected: Emergency | null;
  onClick: () => void;
};

export default function EmergencyDetailCard({
  emergency,
  selected,
  onClick,
}: Props) {
  const isSelected = selected?.id === emergency.id;

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl cursor-pointer border transition ${
        emergency.type === "CRITICAL"
          ? "bg-red-50 border-red-200"
          : "bg-yellow-50 border-yellow-200"
      } ${isSelected ? "ring-2 ring-blue-400" : ""}`}
    >
      <p className="font-semibold text-gray-800">{ergency.category}</p>
      <p className="text-sm text-gray-600">{emergency.location}</p>
      <p className="text-sm text-gray-600">{emergency.hospital}</p>
    </div>
  );
}
