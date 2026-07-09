import type { Persona, PersonaComment, HairColor, SkinTone } from "@/types/persona";
import { HAIR_HEX, SKIN_HEX } from "@/lib/legoTheme";

let idSeq = 0;
const cid = () => `c_${++idSeq}`;

function comment(user_id: string, username: string, text: string): PersonaComment {
  return { _id: cid(), user_id, username, text, createdAt: new Date().toISOString() };
}

function mk(
  user_id: string,
  username: string,
  hairColor: HairColor,
  hasGlasses: boolean,
  hasBeard: boolean,
  beardColor: HairColor | null,
  skinTone: SkinTone,
  likes: number,
  comments: PersonaComment[],
  createdAt: string
): Persona {
  const hairHex = HAIR_HEX[hairColor] ?? "#FFD500";
  const skinHex = SKIN_HEX[skinTone];
  const beardHex = (beardColor && HAIR_HEX[beardColor]) || "#7B4A21";

  return {
    _id: `p_${user_id}`,
    user_id,
    username,
    attributes: { hairColor, hasGlasses, hasBeard, beardColor, skinTone },
    modules: { community: { likes, isLikedByUser: false, comments } },
    image: null,
    partsJson: [
      { PartID: "3001", PartName: "Brick 2x4", Color: hairColor === "bald" ? "yellow" : hairColor, ColorCode: hairHex, Quantity: 6 },
      { PartID: "3022", PartName: "Plate 2x2", Color: skinTone, ColorCode: skinHex, Quantity: 8 },
      { PartID: "3070", PartName: "Eye tile 1x1", Color: "black", ColorCode: "#1B1B1B", Quantity: 2 },
      ...(hasGlasses ? [{ PartID: "728", PartName: "Glasses piece", Color: "black", ColorCode: "#1B1B1B", Quantity: 1 }] : []),
      ...(hasBeard ? [{ PartID: "3040", PartName: "Beard slope 1x2", Color: beardColor ?? "brown", ColorCode: beardHex, Quantity: 3 }] : []),
    ],
    timeStamps: { createdAt, updatedAt: createdAt },
  };
}

export const mockPersonas: Persona[] = [
  mk("u_001", "PlasticDreamer", "black", false, false, null, "light", 34, [], "2025-12-27T18:00:00Z"),
  mk("u_002", "BricksByBella", "brown", true, false, null, "medium", 78, [comment("u_009", "StudMuffin", "Love the glasses!")], "2025-12-26T14:30:00Z"),
  mk("u_003", "CreativeBuilder", "blonde", false, true, "blonde", "light", 89, [comment("u_002", "BricksByBella", "Amazing beard build 🔥")], "2025-12-25T10:15:00Z"),
  mk("u_004", "MiniFigMaster", "red", true, true, "red", "medium", 45, [], "2025-12-24T20:45:00Z"),
  mk("u_005", "BlockParty", "gray", false, false, null, "dark", 120, [comment("u_001", "PlasticDreamer", "Best one yet"), comment("u_004", "MiniFigMaster", "How did you get the hair piece?")], "2025-12-23T09:00:00Z"),
  mk("u_006", "StudFinder", "bald", true, true, "gray", "light", 56, [], "2025-12-22T16:20:00Z"),
  mk("u_007", "YellowHead", "brown", false, false, null, "dark", 67, [comment("u_003", "CreativeBuilder", "Clean build!")], "2025-12-21T11:10:00Z"),
  mk("u_008", "BrickWizard", "white", false, true, "white", "medium", 23, [], "2025-12-20T08:05:00Z"),
];