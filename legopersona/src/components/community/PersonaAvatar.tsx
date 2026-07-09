import type { PersonaAttributes } from "@/types/persona";
import { LEGO, HAIR_HEX, SKIN_HEX } from "@/lib/legoTheme";

interface Props {
  attributes: PersonaAttributes;
  size?: string | number;
}

const PersonaAvatar = ({ attributes, size = "100%" }: Props) => {
  const { hairColor, hasGlasses, hasBeard, beardColor, skinTone } = attributes;
  const hair = HAIR_HEX[hairColor];
  const skin = SKIN_HEX[skinTone] ?? SKIN_HEX.light;
  const beard = (beardColor && HAIR_HEX[beardColor]) || "#7B4A21";

  return (
    <svg viewBox="0 0 200 220" width={size} height={size} role="img" aria-label="LEGO persona preview">
      <rect x="62" y="18" width="24" height="12" rx="3" fill={hair ?? skin} />
      <rect x="114" y="18" width="24" height="12" rx="3" fill={hair ?? skin} />
      {hair && <rect x="48" y="28" width="104" height="34" rx="8" fill={hair} />}
      <rect x="52" y={hair ? 54 : 28} width="96" height={hair ? 76 : 102} rx="10" fill={skin} />
      {hasGlasses ? (
        <g stroke={LEGO.dark} strokeWidth="5" fill="none">
          <circle cx="80" cy="90" r="13" />
          <circle cx="120" cy="90" r="13" />
          <line x1="93" y1="90" x2="107" y2="90" />
          <circle cx="80" cy="90" r="4" fill={LEGO.dark} stroke="none" />
          <circle cx="120" cy="90" r="4" fill={LEGO.dark} stroke="none" />
        </g>
      ) : (
        <g fill={LEGO.dark}>
          <circle cx="80" cy="90" r="6" />
          <circle cx="120" cy="90" r="6" />
        </g>
      )}
      {hasBeard ? (
        <path d="M64 108 h72 v14 a14 14 0 0 1 -14 14 h-44 a14 14 0 0 1 -14 -14 z" fill={beard} />
      ) : (
        <path d="M86 112 q14 10 28 0" stroke={LEGO.dark} strokeWidth="4" fill="none" strokeLinecap="round" />
      )}
      <rect x="40" y="138" width="120" height="58" rx="8" fill={LEGO.blue} />
      <rect x="72" y="132" width="56" height="10" rx="3" fill={skin} />
      <rect x="58" y="150" width="18" height="9" rx="2" fill="#0a5a94" />
      <rect x="91" y="150" width="18" height="9" rx="2" fill="#0a5a94" />
      <rect x="124" y="150" width="18" height="9" rx="2" fill="#0a5a94" />
    </svg>
  );
};

export default PersonaAvatar;