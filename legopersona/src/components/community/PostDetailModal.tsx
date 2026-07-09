import { useState } from "react";
import type { Persona } from "@/types/persona";
import { LEGO, timeAgo } from "@/lib/legoTheme";
import PersonaAvatar from "./PersonaAvatar";

interface Props {
  persona: Persona | null;
  onClose: () => void;
  onLike: (personaId: string) => void;
  onComment: (personaId: string, text: string) => void;
}

const PostDetailModal = ({ persona, onClose, onLike, onComment }: Props) => {
  const [text, setText] = useState("");
  if (!persona) return null;

  const com = persona.modules.community;
  const a = persona.attributes;
  const tags = [
    `hair: ${a.hairColor}`,
    a.hasGlasses ? "glasses" : null,
    a.hasBeard ? `beard: ${a.beardColor ?? "brown"}` : null,
    `skin: ${a.skinTone}`,
  ].filter(Boolean) as string[];

  const submit = () => {
    if (!text.trim()) return;
    onComment(persona._id, text.trim());
    setText("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="grid md:grid-cols-2">
          <div className="bg-gray-100 flex items-center justify-center p-8 rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
            {persona.image ? (
              <img src={persona.image} alt="LEGO persona" className="rounded-xl w-full" />
            ) : (
              <PersonaAvatar attributes={a} />
            )}
          </div>

          <div className="p-6 flex flex-col">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  {persona.username ?? persona.user_id}
                </h2>
                <div className="text-xs text-gray-400">{timeAgo(persona.timeStamps.createdAt)}</div>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-800 text-2xl leading-none" aria-label="Close">
                ×
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 my-3">
              {tags.map((t) => (
                <span key={t} className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: "#FFF6CC", color: "#8a6d00" }}>
                  {t}
                </span>
              ))}
            </div>

            <button
              onClick={() => onLike(persona._id)}
              className="self-start flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white mb-4"
              style={{ background: com.isLikedByUser ? "#999" : LEGO.red }}
            >
              {com.isLikedByUser ? "Unlike" : "❤️ Like"} · {com.likes}
            </button>

            <div className="mb-4">
              <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Parts list</div>
              <ul className="text-sm space-y-1">
                {persona.partsJson.map((p) => (
                  <li key={p.PartID} className="flex justify-between items-center border-b border-dashed border-gray-200 pb-1">
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block w-3 h-3 rounded-full border"
                        style={{ background: p.ColorCode, borderColor: "#ddd" }}
                      />
                      {p.PartName} <span className="text-gray-400">({p.Color})</span>
                    </span>
                    <b>×{p.Quantity}</b>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1">
              <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">
                Comments ({com.comments.length})
              </div>
              <div className="space-y-2 mb-3">
                {com.comments.length === 0 && (
                  <div className="text-sm text-gray-400">Be the first to comment.</div>
                )}
                {com.comments.map((cm) => (
                  <div key={cm._id} className="text-sm bg-gray-50 rounded-xl px-3 py-2">
                    <b>{cm.username}</b> — {cm.text}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="Add a comment…"
                  className="flex-1 border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2"
                  style={{ borderColor: "#E5E5E5" }}
                />
                <button
                  onClick={submit}
                  className="px-4 py-2 rounded-xl text-white font-bold text-sm"
                  style={{ background: LEGO.blue }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;