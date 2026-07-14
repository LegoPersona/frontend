import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CommunityPersona } from "@/types/persona";
import { LEGO, timeAgo } from "@/lib/legoTheme";
import { useAuth } from "@/contexts/AuthContext";
import BeforeAfterSlider from "@/pages/home/BeforeAfterSlider";
import UserAvatar from "./UserAvatar";

interface Props {
  persona: CommunityPersona | null;
  onClose: () => void;
  onLike: (personaId: string) => void;
  onComment: (personaId: string, text: string) => void;
}

const PostDetailModal = ({ persona, onClose, onLike, onComment }: Props) => {
  const [text, setText] = useState("");
  const { user } = useAuth();
  if (!persona) return null;

  const name = persona.user.username;

  const submit = () => {
    if (!user || !text.trim()) return;
    onComment(persona.id, text.trim());
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
            <BeforeAfterSlider
              originalImage={persona.originalImageUrl}
              legoImage={persona.legoImageUrl}
              originalAlt="Original uploaded photo"
              legoAlt="Generated LEGO Persona"
            />
          </div>

          {/* צד מידע — מבנה עמודה: כותרת / תגיות / לייק קבועים, תגובות נגללות, אינפוט מוצמד לתחתית */}
          <div className="flex flex-col max-h-[90vh] min-h-[420px]" style={{ fontFamily: "'Nunito', sans-serif" }}>
            {/* כותרת */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <UserAvatar name={name} imageUrl={persona.user.profileImageUrl} />
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate" style={{ fontFamily: "'Fredoka', sans-serif" }}>{name}</div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  🗓 {new Date(persona.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
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
            {persona.tags.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 flex-wrap">
                <span className="text-gray-400">🏷</span>
                {persona.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ background: LEGO.yellow, color: LEGO.dark }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* שורת לייק */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
              <motion.button
                onClick={() => onLike(persona.id)}
                whileTap={{ scale: 0.8 }}
                className="text-2xl leading-none"
                aria-label={persona.isLikedByUser ? "Unlike" : "Like"}
              >
                <motion.span
                  key={persona.isLikedByUser ? "liked" : "unliked"}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="inline-block"
                >
                  {persona.isLikedByUser ? "❤️" : "🤍"}
                </motion.span>
              </motion.button>
              <span className="text-sm font-semibold text-gray-700">
                {persona.likes} {persona.likes === 1 ? "like" : "likes"}
              </span>
            </div>

            {/* תגובות — האזור הנגלל */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {persona.comments.length === 0 ? (
                <div className="h-full min-h-[120px] flex items-center justify-center text-gray-400 text-sm">
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {persona.comments.map((cm) => (
                      <motion.div
                        key={cm.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2"
                      >
                        <UserAvatar name={cm.username} size={28} />
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
