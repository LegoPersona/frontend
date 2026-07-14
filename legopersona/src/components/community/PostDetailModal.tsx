import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Persona } from "@/types/persona";
import { LEGO, timeAgo } from "@/lib/legoTheme";
import { useAuth } from "@/contexts/AuthContext";
import PersonaAvatar from "./PersonaAvatar";

interface Props {
  persona: Persona | null;
  onClose: () => void;
  onLike: (personaId: string) => void;
  onComment: (personaId: string, text: string) => void;
}

/* אווטאר עיגול עם אות ראשונה — ממוחזר לכותרת ולתגובות */
const InitialBadge = ({ name, size = 40 }: { name: string; size?: number }) => {
  const color = [LEGO.red, LEGO.blue, LEGO.yellow][name.length % 3];
  return (
    <span
      className="rounded-full flex items-center justify-center text-white font-bold shrink-0"
      style={{ background: color, width: size, height: size, fontSize: size * 0.45, fontFamily: "'Fredoka', sans-serif" }}
    >
      {name[0].toUpperCase()}
    </span>
  );
};

const PostDetailModal = ({ persona, onClose, onLike, onComment }: Props) => {
  const [text, setText] = useState("");
  const { user } = useAuth();
  if (!persona) return null;

  const com = persona.modules.community;
  const a = persona.attributes;
  const name = persona.username ?? persona.user_id;

  const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
  const tags = [
    `${cap(a.hairColor)} Hair`,
    ...(a.hasGlasses ? ["Glasses"] : []),
    ...(a.hasBeard ? [`${cap(a.beardColor ?? "brown")} Beard`] : []),
    `${cap(a.skinTone)} Skin`,
  ];

  const submit = () => {
    if (!user || !text.trim()) return;
    onComment(persona._id, text.trim());
    setText("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="grid md:grid-cols-2 max-h-[90vh]">
          {/* צד תמונה */}
          <div className="bg-gray-100 flex items-center justify-center p-6 md:p-8">
            {persona.image ? (
              <img src={persona.image} alt="LEGO persona" className="rounded-2xl w-full object-contain max-h-[80vh]" />
            ) : (
              <PersonaAvatar attributes={a} />
            )}
          </div>

          {/* צד מידע — מבנה עמודה: כותרת / תגיות / לייק קבועים, תגובות נגללות, אינפוט מוצמד לתחתית */}
          <div className="flex flex-col max-h-[90vh] min-h-[420px]" style={{ fontFamily: "'Nunito', sans-serif" }}>
            {/* כותרת */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <InitialBadge name={name} />
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate" style={{ fontFamily: "'Fredoka', sans-serif" }}>{name}</div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  🗓 {new Date(persona.timeStamps.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 text-xl leading-none transition-colors"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* תגיות */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 flex-wrap">
              <span className="text-gray-400">🏷</span>
              {tags.map((t) => (
                <span
                  key={t}
                  className="text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: LEGO.yellow, color: LEGO.dark }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* שורת לייק */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
              <motion.button
                onClick={() => onLike(persona._id)}
                whileTap={{ scale: 0.8 }}
                className="text-2xl leading-none"
                aria-label={com.isLikedByUser ? "Unlike" : "Like"}
              >
                <motion.span
                  key={com.isLikedByUser ? "liked" : "unliked"}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="inline-block"
                >
                  {com.isLikedByUser ? "❤️" : "🤍"}
                </motion.span>
              </motion.button>
              <span className="text-sm font-semibold text-gray-700">
                {com.likes} {com.likes === 1 ? "like" : "likes"}
              </span>
            </div>

            {/* תגובות — האזור הנגלל */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {com.comments.length === 0 ? (
                <div className="h-full min-h-[120px] flex items-center justify-center text-gray-400 text-sm">
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {com.comments.map((cm) => (
                      <motion.div
                        key={cm._id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2"
                      >
                        <InitialBadge name={cm.username} size={28} />
                        <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-3 py-2 max-w-[85%]">
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-xs">{cm.username}</span>
                            <span className="text-[10px] text-gray-400">{timeAgo(cm.createdAt)}</span>
                          </div>
                          <div className="text-sm text-gray-800 break-words">{cm.text}</div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* רשימת חלקים — מוסתרת ב-details כדי לא להעמיס */}
              <details className="mt-4">
                <summary className="text-xs font-bold uppercase tracking-wide text-gray-400 cursor-pointer select-none hover:text-gray-600">
                  Parts list ({persona.partsJson.length})
                </summary>
                <ul className="text-sm space-y-1 mt-2">
                  {persona.partsJson.map((p) => (
                    <li key={p.PartID} className="flex justify-between items-center border-b border-dashed border-gray-200 pb-1">
                      <span className="flex items-center gap-2">
                        <span className="inline-block w-3 h-3 rounded-full border" style={{ background: p.ColorCode, borderColor: "#ddd" }} />
                        {p.PartName} <span className="text-gray-400">({p.Color})</span>
                      </span>
                      <b>×{p.Quantity}</b>
                    </li>
                  ))}
                </ul>
              </details>
            </div>

            {/* שורת כתיבה — מוצמדת לתחתית */}
            <div className="flex items-center gap-2 p-4 border-t border-gray-100">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                disabled={!user}
                placeholder={user ? "Add a comment..." : "Login to comment..."}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 disabled:cursor-not-allowed transition-colors"
              />
              <motion.button
                onClick={submit}
                whileHover={user && text.trim() ? { scale: 1.08 } : {}}
                whileTap={user && text.trim() ? { scale: 0.92 } : {}}
                disabled={!user || !text.trim()}
                className="w-11 h-11 rounded-full flex items-center justify-center text-white shrink-0 transition-opacity disabled:opacity-40"
                style={{ background: LEGO.red }}
                aria-label="Post comment"
              >
                ➤
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PostDetailModal;