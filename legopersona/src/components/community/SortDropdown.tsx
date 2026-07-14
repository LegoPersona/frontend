import { useState } from "react";
import type { SortOption } from "@/types/persona";
import { LEGO } from "@/lib/legoTheme";

const OPTIONS: [SortOption, string][] = [
  ["newest", "Newest"],
  ["popularity", "Most Popular"],
  ["most-discussed", "Most Discussed"],
];

interface Props {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SortDropdown = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const label = OPTIONS.find(([v]) => v === value)?.[1] ?? "Newest";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 border rounded-2xl px-4 py-2 text-sm font-bold bg-white"
        style={{ borderColor: LEGO.red, color: LEGO.red }}
      >
        🕒 {label} ▾
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bg-white border rounded-xl shadow-lg overflow-hidden z-30 w-44">
          {OPTIONS.map(([v, l]) => (
            <button
              key={v}
              onClick={() => { onChange(v); setOpen(false); }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 font-semibold"
              style={{ color: value === v ? LEGO.red : "#444" }}
            >
              {l}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;