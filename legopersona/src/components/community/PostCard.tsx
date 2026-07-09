import type { Persona } from "@/types/persona";
import { LEGO } from "@/lib/legoTheme";
import PersonaAvatar from "./PersonaAvatar";

interface Props {
  persona: Persona;
  onLike: (personaId: string) => void;
  onOpen: (persona: Persona) => void;
}

const PostCard = ({ persona, onLike, onOpen }: Props) => {
  const com = persona.modules.community;
  const name = persona.username ?? persona.user_id;
  const initial = name[0].toUpperCase();
  const badge = [LEGO.red, LEGO.blue, LEGO.yellow][name.length % 3];

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onOpen(persona)}
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
        {persona.image ? (
          <img src={persona.image} alt="LEGO persona" className="w-full h-full object-cover rounded-xl" />
        ) : (
          <PersonaAvatar attributes={persona.attributes} />
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ background: badge, fontFamily: "'Fredoka', sans-serif" }}
          >
            {initial}
          </span>
          <span className="font-bold text-sm">{name}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <button
            onClick={(e) => { e.stopPropagation(); onLike(persona._id); }}
            className="flex items-center gap-1 hover:scale-110 transition-transform"
            style={{ color: com.isLikedByUser ? LEGO.red : "#666" }}
            aria-label="Like"
          >
            {com.isLikedByUser ? "❤️" : "🤍"} <b>{com.likes}</b>
          </button>
          <span className="flex items-center gap-1">💬 {com.comments.length}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;