import type { Dispatch, SetStateAction, ReactNode } from "react";
import type { FilterState, HairColor, SkinTone } from "@/types/persona";
import { LEGO, HAIR_HEX, SKIN_HEX, HAIR_OPTIONS, SKIN_OPTIONS } from "@/lib/legoTheme";

interface ChipProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  swatch?: string | null;
}

const Chip = ({ active, onClick, children, swatch }: ChipProps) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-semibold transition-all"
    style={{
      borderColor: active ? LEGO.red : "#E5E5E5",
      background: active ? "#FFF1F1" : "#fff",
      color: active ? LEGO.red : "#444",
    }}
  >
    {swatch && (
      <span
        className="inline-block w-3.5 h-3.5 rounded-full border"
        style={{ background: swatch, borderColor: "#ddd" }}
      />
    )}
    {children}
  </button>
);

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="mb-5">
    <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#777" }}>
      {title}
    </div>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

interface Props {
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
  onReset: () => void;
}

const FilterSidebar = ({ filters, setFilters, onReset }: Props) => {
  const toggleHair = (value: HairColor) =>
    setFilters((f) => ({
      ...f,
      hairColors: f.hairColors.includes(value)
        ? f.hairColors.filter((v) => v !== value)
        : [...f.hairColors, value],
    }));

  const toggleSkin = (value: SkinTone) =>
    setFilters((f) => ({
      ...f,
      skinTones: f.skinTones.includes(value)
        ? f.skinTones.filter((v) => v !== value)
        : [...f.skinTones, value],
    }));

  const tri = (key: "hasGlasses" | "hasBeard", value: boolean) =>
    setFilters((f) => ({ ...f, [key]: f[key] === value ? null : value }));

  return (
    <aside className="bg-white rounded-2xl shadow-sm p-5 w-full lg:w-64 shrink-0 h-fit">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 font-bold text-lg" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          <span style={{ color: LEGO.red }}>▼</span> Filters
        </div>
        <button onClick={onReset} title="Reset filters" className="text-gray-400 hover:text-gray-700 text-lg">
          ↺
        </button>
      </div>

      <Section title="Hair Color">
        {HAIR_OPTIONS.map((h) => (
          <Chip key={h} active={filters.hairColors.includes(h)} onClick={() => toggleHair(h)} swatch={HAIR_HEX[h] ?? "#FFD500"}>
            {h[0].toUpperCase() + h.slice(1)}
          </Chip>
        ))}
      </Section>

      <Section title="Glasses">
        <Chip active={filters.hasGlasses === true} onClick={() => tri("hasGlasses", true)}>👓 Yes</Chip>
        <Chip active={filters.hasGlasses === false} onClick={() => tri("hasGlasses", false)}>🙂 No</Chip>
      </Section>

      <Section title="Beard">
        <Chip active={filters.hasBeard === true} onClick={() => tri("hasBeard", true)}>🧔 Yes</Chip>
        <Chip active={filters.hasBeard === false} onClick={() => tri("hasBeard", false)}>🙂 No</Chip>
      </Section>

      <Section title="Skin Tone">
        {SKIN_OPTIONS.map((s) => (
          <Chip key={s} active={filters.skinTones.includes(s)} onClick={() => toggleSkin(s)} swatch={SKIN_HEX[s]}>
            {s[0].toUpperCase() + s.slice(1)}
          </Chip>
        ))}
      </Section>
    </aside>
  );
};

export default FilterSidebar;