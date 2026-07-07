import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Headline, Lead } from "@/components/shared/Typography";
import { EmptyState } from "@/components/shared/EmptyState";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryTabs } from "@/components/CategoryTabs";
import { SkeletonCard } from "@/components/SkeletonCard";
import { SummaryPanel } from "@/components/SummaryPanel";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  useBookmarks,
  useHistory,
  useSummary,
  useKeyboardShortcuts,
} from "@/lib/hooks";
import { fetchArticles } from "@/lib/api/news";
import { summarizeArticle } from "@/lib/api/groq";
import CacheRepository from "@/lib/storage/CacheRepository";
import { Newspaper } from "lucide-react";
import type { Article, Summary } from "@/lib/types/index";

const cacheRepo = new CacheRepository();

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("latest");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [currentSummary, setCurrentSummary] = useState<Summary | undefined>();
  const [summaryLoading, setSummaryLoading] = useState(false);

  const { bookmarks, addBookmark, removeBookmark, isBookmarked } =
    useBookmarks();
  const { addReadingEntry, addSummaryEntry } = useHistory();
  const { getSummary, saveSummary } = useSummary();

  useEffect(() => {
    let cancelled = false;

    const cached = cacheRepo.getArticles(activeCategory);
    if (cached) {
      setArticles(cached);
      return;
    }

    setLoading(true);
    fetchArticles(activeCategory)
      .then(fetched => {
        if (cancelled) return;
        setArticles(fetched);
        cacheRepo.setArticles(activeCategory, 1, fetched);
      })
      .catch(error => {
        if (cancelled) return;
        console.error(error);
        toast.error(
          error instanceof Error ? error.message : "Failed to load news"
        );
        setArticles([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeCategory]);

  const handleArticleClick = useCallback(
    (article: Article) => {
      setSelectedArticle(article);
      addReadingEntry(article);
    },
    [addReadingEntry]
  );

  const handleBookmark = useCallback(
    (article: Article) => {
      if (isBookmarked(article.url)) {
        const bookmark = bookmarks.find(b => b.article.url === article.url);
        if (bookmark) removeBookmark(bookmark.id);
      } else {
        addBookmark(article);
      }
    },
    [bookmarks, isBookmarked, addBookmark, removeBookmark]
  );

  const handleSummarize = useCallback(
    (article: Article) => {
      setSelectedArticle(article);
      setShowSummary(true);

      const cached = getSummary(article.id);
      if (cached) {
        setCurrentSummary(cached);
        return;
      }

      setSummaryLoading(true);
      summarizeArticle(
        article.title,
        article.content || article.description,
        article.url
      )
        .then(summary => {
          setCurrentSummary(summary);
          saveSummary(summary);
          addSummaryEntry(article, summary);
        })
        .catch(error => {
          console.error(error);
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to generate summary"
          );
          setShowSummary(false);
        })
        .finally(() => setSummaryLoading(false));
    },
    [getSummary, saveSummary, addSummaryEntry]
  );

  useKeyboardShortcuts({
    "search-modal": () => {
      // TODO: Open search modal
    },
    "search-focus": () => {
      // TODO: Focus search bar
    },
    bookmark: () => {
      if (selectedArticle) {
        handleBookmark(selectedArticle);
      }
    },
    summarize: () => {
      if (selectedArticle) {
        handleSummarize(selectedArticle);
      }
    },
    close: () => {
      setShowSummary(false);
      setSelectedArticle(null);
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar
        title="News Feed"
        bookmarkCount={bookmarks.length}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        showMenu={sidebarOpen}
      />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1">
          <div className="container max-w-6xl py-12 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Headline className="mb-2">Latest News</Headline>
              <Lead className="text-foreground/60 mb-8">
                Stay informed with the latest stories from around the world.
              </Lead>
            </motion.div>

            {/* Category tabs */}
            <CategoryTabs
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            {/* Articles grid */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : articles.length > 0 ? (
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="initial"
                animate="animate"
                variants={{
                  animate: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {articles.map(article => (
                  <motion.div
                    key={article.id}
                    variants={{
                      initial: { opacity: 0, y: 20 },
                      animate: { opacity: 1, y: 0 },
                    }}
                  >
                    <ArticleCard
                      article={article}
                      isBookmarked={isBookmarked(article.url)}
                      onBookmark={() => handleBookmark(article)}
                      onSummarize={() => handleSummarize(article)}
                      onClick={() => handleArticleClick(article)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <EmptyState
                icon={Newspaper}
                title="No articles found"
                description="Try selecting a different category or search for specific topics."
              />
            )}
          </div>
        </main>
      </div>

      {/* Summary panel */}
      <SummaryPanel
        summary={currentSummary}
        isLoading={summaryLoading}
        onClose={() => {
          setShowSummary(false);
          setCurrentSummary(undefined);
        }}
        onSummarize={() => {
          if (selectedArticle) {
            handleSummarize(selectedArticle);
          }
        }}
      />
    </div>
  );
}
