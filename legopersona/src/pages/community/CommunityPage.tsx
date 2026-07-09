import { useState, useMemo, useCallback, useEffect } from "react";
import type { Persona, FilterState, SortOption } from "@/types/persona";
import { initialFilters } from "@/types/persona";
import { LEGO } from "@/lib/legoTheme";
import { mockPersonas } from "@/data/mockPersonas";
// חיבור לשרת: בטל הערה כשה-API מוכן
// import { getGallery, likePersona, unlikePersona, addComment } from "@/services/personaApi";
import { useAuth } from "@/contexts/AuthContext";
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
  const { user } = useAuth();
  const [personas, setPersonas] = useState<Persona[]>(mockPersonas);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(8);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);

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
    if (!user) return;
    
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
                  _id: `c-${Date.now()}`,
                  user_id: user.userId,
                  username: user.username,
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

  const activeFilterCount =
    filters.hairColors.length +
    filters.skinTones.length +
    (filters.hasGlasses !== null ? 1 : 0) +
    (filters.hasBeard !== null ? 1 : 0);

  return (
  <div className="min-h-screen pt-20" style={{ background: "#FAFAF7", fontFamily: "'Nunito', sans-serif" }}>      <header
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
<div className="hidden lg:block">
          <FilterSidebar filters={filters} setFilters={setFilters} onReset={() => setFilters(initialFilters)} />
        </div>
        <section className="flex-1">
<div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden flex items-center gap-2 border rounded-2xl px-4 py-2 text-sm font-bold bg-white"
                style={{ borderColor: LEGO.red, color: LEGO.red }}
                onClick={() => setFilterSidebarOpen(true)}
              >
                ▼ Filters
                {activeFilterCount > 0 && (
                  <span className="text-white text-xs px-1.5 py-0.5 rounded-full" style={{ background: LEGO.red }}>
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <div className="text-sm">
                <b style={{ color: LEGO.red }}>{filteredAndSorted.length}</b> results
              </div>
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
<div className="columns-1 sm:columns-2 xl:columns-3 gap-5 space-y-5">
              {displayed.map((p) => (
                <div key={p._id} className="break-inside-avoid">
                  <PostCard persona={p} onLike={handleLike} onOpen={(pp) => setSelectedId(pp._id)} />
                </div>
              ))}
            </div>
          )}

{hasMore && (
            <div className="text-center py-8">
              <div className="flex justify-center gap-2 mb-2">
                <Stud color={LEGO.red} />
                <Stud color={LEGO.yellow} />
                <Stud color={LEGO.blue} />
              </div>
              <p className="text-gray-400 text-sm">Loading more...</p>
            </div>
          )}        </section>
      </main>

 {filterSidebarOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={() => setFilterSidebarOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="mb-2 text-gray-400 hover:text-gray-800 text-2xl leading-none"
              onClick={() => setFilterSidebarOpen(false)}
              aria-label="Close filters"
            >
              ×
            </button>
            <FilterSidebar filters={filters} setFilters={setFilters} onReset={() => setFilters(initialFilters)} />
          </div>
        </div>
      )}

{filterSidebarOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={() => setFilterSidebarOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="mb-2 text-gray-400 hover:text-gray-800 text-2xl leading-none"
              onClick={() => setFilterSidebarOpen(false)}
              aria-label="Close filters"
            >
              ×
            </button>
            <FilterSidebar filters={filters} setFilters={setFilters} onReset={() => setFilters(initialFilters)} />
          </div>
        </div>
      )}

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