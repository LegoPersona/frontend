import type { CommunityPersona } from "@/types/persona";
import { LEGO } from "@/lib/legoTheme";
import BeforeAfterSlider from "@/pages/home/BeforeAfterSlider";
import UserAvatar from "./UserAvatar";

interface Props {
  persona: CommunityPersona;
  onLike: (personaId: string) => void;
  onOpen: (persona: CommunityPersona) => void;
}

const PostCard = ({ persona, onLike, onOpen }: Props) => {
  const name = persona.user.username;

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onOpen(persona)}
    >
      {/* stopPropagation: dragging the slider must not open the modal */}
      <div onClick={(e) => e.stopPropagation()}>
        <BeforeAfterSlider
          originalImage={persona.originalImageUrl}
          legoImage={persona.legoImageUrl}
          originalAlt="Original uploaded photo"
          legoAlt="Generated LEGO Persona"
          compact
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <UserAvatar name={name} imageUrl={persona.user.profileImageUrl} size={28} />
          <span className="font-bold text-sm">{name}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <button
            onClick={(e) => { e.stopPropagation(); onLike(persona.id); }}
            className="flex items-center gap-1 hover:scale-110 transition-transform"
            style={{ color: persona.isLikedByUser ? LEGO.red : "#666" }}
            aria-label="Like"
          >
            {persona.isLikedByUser ? "❤️" : "🤍"} <b>{persona.likes}</b>
          </button>
          <span className="flex items-center gap-1">💬 {persona.comments.length}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
