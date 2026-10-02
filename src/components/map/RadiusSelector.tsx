"use client";

interface RadiusSelectorProps {
  radius: number;
  onChange: (radius: number) => void;
  options?: number[];
}

export default function RadiusSelector({
  radius,
  onChange,
  options = [1, 2, 3, 5],
}: RadiusSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      {options.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`rounded-2xl px-4 py-2.5 text-xs font-bold transition ${
            radius === item
              ? "bg-black text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {item}km
        </button>
      ))}
    </div>
  );
}
