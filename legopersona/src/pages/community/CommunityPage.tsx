import { useState, useCallback, useEffect } from "react";
import type { CommunityPersona, FilterState, FilterOptions, SortOption, PersonaComment } from "@/types/persona";
import { initialFilters } from "@/types/persona";
import { LEGO } from "@/lib/legoTheme";
import { getGallery, getCommunityFilters, likePersona, unlikePersona, addComment } from "@/services/personaApi";
import { useAuth } from "@/contexts/AuthContext";
import FilterSidebar from "@/components/community/FilterSidebar";
import SortDropdown from "@/components/community/SortDropdown";
import PostCard from "@/components/community/PostCard";
import PostDetailModal from "@/components/community/PostDetailModal";

const PAGE_SIZE = 8;

const Stud = ({ color }: { color: string }) => (
  <svg width="34" height="26" viewBox="0 0 34 26">
    <rect x="7" y="0" width="8" height="6" rx="2" fill={color} />
    <rect x="19" y="0" width="8" height="6" rx="2" fill={color} />
    <rect x="2" y="6" width="30" height="20" rx="5" fill={color} />
  </svg>
);

const CommunityPage = () => {
  const { user } = useAuth();
  const [personas, setPersonas] = useState<CommunityPersona[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    getCommunityFilters()
      .then(setFilterOptions)
      .catch((error) => console.error("Failed to load community filters:", error));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    getGallery({ filters, sortBy, skip: 0, limit: displayCount })
      .then(({ personas: nextPersonas, total: nextTotal }) => {
        if (cancelled) return;
        setPersonas(nextPersonas);
        setTotal(nextTotal);
        setLoadFailed(false);
      })
      .catch((error) => {
        console.error("Failed to load community gallery:", error);
        if (!cancelled) setLoadFailed(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filters, sortBy, displayCount]);

  const hasMore = personas.length < total;

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 500 &&
      hasMore &&
      !isLoading
    ) {
      setDisplayCount((prev) => prev + 4);
    }
  }, [hasMore, isLoading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const patchPersona = (personaId: string, patch: (p: CommunityPersona) => CommunityPersona) =>
    setPersonas((prev) => prev.map((p) => (p.id === personaId ? patch(p) : p)));

  const handleLike = (personaId: string) => {
    const target = personas.find((p) => p.id === personaId);
    if (!target) return;
    const wasLiked = target.isLikedByUser;

    // עדכון אופטימי בצד לקוח
    patchPersona(personaId, (p) => ({
      ...p,
      likes: wasLiked ? p.likes - 1 : p.likes + 1,
      isLikedByUser: !wasLiked,
    }));

    const action = wasLiked ? unlikePersona : likePersona;
    action(personaId)
      .then((result) => {
        patchPersona(personaId, (p) => ({ ...p, likes: result.likes, isLikedByUser: result.isLikedByUser }));
      })
      .catch((error) => {
        console.error("Failed to update like:", error);
        // מחזירים את המצב הקודם אם השרת נכשל
        patchPersona(personaId, (p) => ({
          ...p,
          likes: wasLiked ? p.likes + 1 : p.likes - 1,
          isLikedByUser: wasLiked,
        }));
      });
  };

  const handleComment = (personaId: string, text: string) => {
    if (!user) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticComment: PersonaComment = {
      id: tempId,
      userId: user.userId,
      username: user.username,
      text,
      createdAt: new Date().toISOString(),
    };

    // עדכון אופטימי בצד לקוח
    patchPersona(personaId, (p) => ({ ...p, comments: [...p.comments, optimisticComment] }));

    addComment(personaId, text)
      .then((comment) => {
        patchPersona(personaId, (p) => ({
          ...p,
          comments: p.comments.map((c) => (c.id === tempId ? comment : c)),
        }));
      })
      .catch((error) => {
        console.error("Failed to add comment:", error);
        patchPersona(personaId, (p) => ({
          ...p,
          comments: p.comments.filter((c) => c.id !== tempId),
        }));
      });
  };

  const selectedPersona = personas.find((p) => p.id === selectedId) ?? null;

  const activeFilterCount =
    filters.hairColors.length +
    filters.skinTones.length +
    (filters.hasGlasses !== null ? 1 : 0) +
    (filters.hasBeard !== null ? 1 : 0);

  return (
    <div className="min-h-screen pt-20" style={{ background: "#FAFAF7", fontFamily: "'Nunito', sans-serif" }}>
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
        <div className="text-sm text-gray-500">👥 {total} creations shared</div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
        <div className="hidden lg:block">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            options={filterOptions}
            onReset={() => setFilters(initialFilters)}
          />
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
                <b style={{ color: LEGO.red }}>{total}</b> results
              </div>
            </div>
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          {loadFailed ? (
            <div className="bg-white rounded-2xl p-10 text-center text-gray-500">
              Something went wrong loading the community gallery.{" "}
              <button
                className="font-bold underline"
                onClick={() => {
                  setLoadFailed(false);
                  setFilters((f) => ({ ...f })); // מפעיל מחדש את ה-useEffect של הטעינה
                }}
              >
                Try again
              </button>
            </div>
          ) : isLoading && personas.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center text-gray-400">Loading personas...</div>
          ) : personas.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center text-gray-500">
              No personas match these filters.{" "}
              <button className="font-bold underline" onClick={() => setFilters(initialFilters)}>
                Reset filters
              </button>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 xl:columns-3 gap-5 space-y-5">
              {personas.map((p) => (
                <div key={p.id} className="break-inside-avoid">
                  <PostCard persona={p} onLike={handleLike} onOpen={(pp) => setSelectedId(pp.id)} />
                </div>
              ))}
            </div>
          )}

          {hasMore && !loadFailed && (
            <div className="text-center py-8">
              <div className="flex justify-center gap-2 mb-2">
                <Stud color={LEGO.red} />
                <Stud color={LEGO.yellow} />
                <Stud color={LEGO.blue} />
              </div>
              <p className="text-gray-400 text-sm">Loading more...</p>
            </div>
          )}
        </section>
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
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              options={filterOptions}
              onReset={() => setFilters(initialFilters)}
            />
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
