import { useState, useMemo, useCallback, useEffect } from "react";
import type { Persona, FilterState, SortOption } from "@/types/persona";
import { initialFilters } from "@/types/persona";
import { LEGO } from "@/lib/legoTheme";
import { mockPersonas } from "@/data/mockPersonas";
// חיבור לשרת: בטל הערה כשה-API מוכן
// import { getGallery, likePersona, unlikePersona, addComment } from "@/services/personaApi";
import FilterSidebar from "@/components/community/FilterSidebar";
import SortDropdown from "@/components/community/SortDropdown";
import PostCard from "@/components/community/PostCard";
import PostDetailModal from "@/components/community/PostDetailModal";

const Stud = ({ color }: { color: string }) => (
  <svg width="34" height="26" viewBox="0 0 34 26">
    <rect x="7" y="0" width="8" height="6" rx="2" fill={color} />
    <rect x="19" y="0" width="8" height="6" rx="2" fill={color} />
    <rect x="2" y="6" width="30" height="20" rx="5" fill={color} />
  </svg>
);

const CommunityPage = () => {
  const [personas, setPersonas] = useState<Persona[]>(mockPersonas);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(8);

  /* ---- חיבור לשרת (מחליף את הפילטור המקומי כשה-API מוכן) ----
  useEffect(() => {
    getGallery({ filters, sortBy, skip: 0, limit: displayCount })
      .then(({ personas }) => setPersonas(personas))
      .catch(console.error);
  }, [filters, sortBy, displayCount]);
  ------------------------------------------------------------- */

  const filteredAndSorted = useMemo(() => {
    const result = personas.filter((p) => {
      const a = p.attributes;
      if (filters.hairColors.length && !filters.hairColors.includes(a.hairColor)) return false;
      if (filters.hasGlasses !== null && a.hasGlasses !== filters.hasGlasses) return false;
      if (filters.hasBeard !== null && a.hasBeard !== filters.hasBeard) return false;
      if (filters.skinTones.length && !filters.skinTones.includes(a.skinTone)) return false;
      return true;
    });
    switch (sortBy) {
      case "popularity":
        result.sort((x, y) => y.modules.community.likes - x.modules.community.likes);
        break;
      case "most-discussed":
        result.sort((x, y) => y.modules.community.comments.length - x.modules.community.comments.length);
        break;
      default:
        result.sort(
          (x, y) => new Date(y.timeStamps.createdAt).getTime() - new Date(x.timeStamps.createdAt).getTime()
        );
    }
    return result;
  }, [personas, filters, sortBy]);

  const displayed = filteredAndSorted.slice(0, displayCount);
  const hasMore = displayCount < filteredAndSorted.length;

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 500 &&
      hasMore
    ) {
      setDisplayCount((prev) => prev + 4);
    }
  }, [hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleLike = (personaId: string) => {
    // שומרים את המצב לפני העדכון האופטימי — נחוץ לבחירת like/unlike מול השרת
    const wasLiked = personas.find((x) => x._id === personaId)?.modules.community.isLikedByUser ?? false;

    // עדכון אופטימי בצד לקוח
    setPersonas((prev) =>
      prev.map((p) => {
        if (p._id !== personaId) return p;
        const com = p.modules.community;
        return {
          ...p,
          modules: {
            ...p.modules,
            community: {
              ...com,
              likes: com.isLikedByUser ? com.likes - 1 : com.likes + 1,
              isLikedByUser: !com.isLikedByUser,
            },
          },
        };
      })
    );

    // חיבור לשרת:
    // const action = wasLiked ? unlikePersona : likePersona;
    // action(personaId).catch(console.error);
    void wasLiked; // מונע אזהרת unused עד חיבור השרת — מחק שורה זו כשמבטלים את ההערה
  };

  const handleComment = (personaId: string, text: string) => {
    setPersonas((prev) =>
      prev.map((p) => {
        if (p._id !== personaId) return p;
        const com = p.modules.community;
        return {
          ...p,
          modules: {
            ...p.modules,
            community: {
              ...com,
              comments: [
                ...com.comments,
                {
                  _id: Math.random().toString(36).slice(2),
                  user_id: "me",
                  username: "You",
                  text,
                  createdAt: new Date().toISOString(),
                },
              ],
            },
          },
        };
      })
    );
    // חיבור לשרת:
    // addComment(personaId, text).catch(console.error);
  };

  const selectedPersona = personas.find((p) => p._id === selectedId) ?? null;

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF7", fontFamily: "'Nunito', sans-serif" }}>
      <header
        className="text-center py-12 px-4"
        style={{ background: "linear-gradient(120deg, #FDECEC, #FFF9DE, #E9F3FB)" }}
      >
        <div className="flex justify-center gap-2 mb-3">
          <Stud color={LEGO.red} />
          <Stud color={LEGO.yellow} />
          <Stud color={LEGO.blue} />
        </div>
        <h1
          className="text-4xl md:text-5xl font-bold mb-3"
          style={{ fontFamily: "'Fredoka', sans-serif", color: LEGO.dark }}
        >
          Community Gallery
        </h1>
        <p className="text-gray-600 max-w-md mx-auto mb-3">
          Explore amazing LEGO Personas created by our community. Like, comment, and get inspired!
        </p>
        <div className="text-sm text-gray-500">👥 {personas.length} creations shared</div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
        <FilterSidebar filters={filters} setFilters={setFilters} onReset={() => setFilters(initialFilters)} />

        <section className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm">
              <b style={{ color: LEGO.red }}>{filteredAndSorted.length}</b> results
            </div>
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          {displayed.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center text-gray-500">
              No personas match these filters.{" "}
              <button className="font-bold underline" onClick={() => setFilters(initialFilters)}>
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {displayed.map((p) => (
                <PostCard key={p._id} persona={p} onLike={handleLike} onOpen={(pp) => setSelectedId(pp._id)} />
              ))}
            </div>
          )}

          {hasMore && <div className="text-center text-gray-400 text-sm py-6">Scroll for more…</div>}
        </section>
      </main>

      <PostDetailModal
        persona={selectedPersona}
        onClose={() => setSelectedId(null)}
        onLike={handleLike}
        onComment={handleComment}
      />
    </div>
  );
};

export default CommunityPage;