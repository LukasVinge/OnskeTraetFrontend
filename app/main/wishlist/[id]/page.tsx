"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Star,
  TreePine,
  Share2,
  Dumbbell,
  Palette,
  Shirt,
  Smartphone,
  Plane,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { WishCard, Wish } from "@components/WishCard/WishCard";
import { AddWishDialog } from "@components/AddWishDialog";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { FilterBar, FilterOptions } from "@components/FilterBar";
import { toast, Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@components/ui/card";
import { Navigation } from "@components/Navigation";
import { useUser } from "@supabase/auth-helpers-react";
import { useParams } from "next/navigation";

const categories = [
  { name: "Sport", icon: Dumbbell, color: "from-blue-500 to-cyan-500" },
  { name: "Hobby", icon: Palette, color: "from-purple-500 to-pink-500" },
  { name: "Clothes", icon: Shirt, color: "from-rose-500 to-orange-500" },
  { name: "Electronics", icon: Smartphone, color: "from-indigo-500 to-blue-500" },
  { name: "Travel", icon: Plane, color: "from-green-500 to-emerald-500" },
  { name: "Other", icon: MoreHorizontal, color: "from-gray-500 to-slate-500" },
];

const API_BASE_URL = "https://onsketraetbackend.onrender.com/api/Wishes";

export default function WishlistPage() {
  const params = useParams();
  const wishlistIdParam = params?.id;
  const user = useUser();

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    priorities: [],
    priceRange: [0, 5000],
    favoritesOnly: false,
  });
  const [currentPage, setCurrentPage] = useState("wishlist");

  if (!wishlistIdParam || Array.isArray(wishlistIdParam)) {
    return <div className="text-center py-20 text-red-500">Invalid wishlist ID</div>;
  }
  const wishlistId = wishlistIdParam;

  const priorityToStars = (priority: "low" | "medium" | "high") => {
    if (priority === "low") return 1;
    if (priority === "medium") return 2;
    return 3;
  };

  useEffect(() => {
    const fetchWishes = async () => {
      try {
        if (!user?.id) return;
        const res = await fetch(`${API_BASE_URL}/user/${user.id}`);
        if (!res.ok) throw new Error("Failed to fetch wishes for user");
        const data: any[] = await res.json();

        const filtered = data.filter((w) => w.wishListId === wishlistId);

        const mapped: Wish[] = filtered.map((w: any) => {
          const priority = ["low", "medium", "high"].includes(w.priority?.toLowerCase())
            ? (w.priority.toLowerCase() as "low" | "medium" | "high")
            : "medium";

          return {
            id: w.wishId,
            title: w.wishName || "",
            description: w.description || "",
            category: w.type || "Other",
            imageUrl: w.image || "/placeholder.png",
            priority,
            stars: priorityToStars(priority), // always add stars
            isFavorite: false,
            isReserved: w.reserved || false,
            price: w.price || 0,
            link: w.link || "",
            comments: w.comments || "",
          };
        });

        setWishes(mapped);
      } catch (err) {
        console.error(err);
        toast.error("Could not load wishes");
      } finally {
        setLoading(false);
      }
    };

    fetchWishes();
  }, [user?.id, wishlistId]);

  const maxPrice = useMemo(() => {
    const prices = wishes.map((w) => w.price || 0);
    return Math.max(Math.ceil(Math.max(...prices, 0) / 1000) * 1000, 5000);
  }, [wishes]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, priceRange: [prev.priceRange[0], maxPrice] }));
  }, [maxPrice]);

  const handleAddWish = (newWish: Omit<Wish, "id" | "isFavorite" | "isReserved" | "stars">) => {
    const tempId = crypto.randomUUID();
    const priority = newWish.priority || "medium";
    const completeWish: Wish = {
      id: tempId,
      title: newWish.title,
      description: newWish.description || "",
      category: newWish.category || "Other",
      imageUrl: newWish.imageUrl || "/placeholder.png",
      priority,
      stars: priorityToStars(priority), // always include stars
      isFavorite: false,
      isReserved: false,
      price: newWish.price || 0,
      link: newWish.link || "",
      comments: newWish.comments || "",
    };
    setWishes((prev) => [completeWish, ...prev]);
    toast.success("Wish added successfully!");
  };

  const handleToggleFavorite = (id: string) =>
    setWishes((prev) => prev.map((w) => (w.id === id ? { ...w, isFavorite: !w.isFavorite } : w)));

  const handleDelete = async (id: string) => {
    const prevWishes = [...wishes];
    setWishes((prev) => prev.filter((w) => w.id !== id));
    toast.success("Wish deleted");

    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete wish");
    } catch {
      setWishes(prevWishes);
      toast.error("Failed to delete wish from API");
    }
  };

  const handleToggleReserve = (id: string) =>
    setWishes((prev) => prev.map((w) => (w.id === id ? { ...w, isReserved: !w.isReserved } : w)));

  const handleUpdateComments = (id: string, comments: string) =>
    setWishes((prev) => prev.map((w) => (w.id === id ? { ...w, comments } : w)));

  const handleShareWishlist = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      } catch {
        toast.error("Failed to copy link");
      }
    }
  };

  const filteredWishes = useMemo(() => {
    return wishes.filter((w) => {
      if (selectedCategories.length && !selectedCategories.includes(w.category)) return false;
      if (filters.priorities.length > 0 && !filters.priorities.includes(w.priority)) return false;
      if (w.price! < filters.priceRange[0] || w.price! > filters.priceRange[1]) return false;
      if (filters.favoritesOnly && !w.isFavorite) return false;
      return true;
    });
  }, [wishes, filters, selectedCategories]);

  const favoriteCount = wishes.filter((w) => w.isFavorite).length;
  const getCategoryStats = (categoryName: string) => {
    const catWishes = wishes.filter((w) => w.category === categoryName);
    return {
      count: catWishes.length,
      totalValue: catWishes.reduce((sum, w) => sum + (w.price || 0), 0),
      highPriority: catWishes.filter((w) => w.priority === "high").length,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-rose-50">
      <Toaster richColors position="top-center" />
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading wishes...</div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                    <TreePine className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                    My Wishlist
                  </h1>
                </div>
                <p className="text-gray-600">Keep track of all the things you wish for</p>
              </div>

              <Button
                variant="outline"
                onClick={handleShareWishlist}
                className="gap-2 border-green-200 hover:bg-green-50 hover:border-green-300"
              >
                <Share2 className="w-4 h-4" />
                Share Wishlist
              </Button>
            </div>

            {/* Stats & Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge className="gap-1 bg-gradient-to-r from-green-600 to-green-700 text-white border-none px-4 py-2">
                <Star className="w-3 h-3" fill="currentColor" /> {favoriteCount} Favorites
              </Badge>
              <Badge variant="secondary" className="bg-white/80 border-green-200 px-4 py-2">
                {wishes.length} Total Wishes
              </Badge>
              <div className="ml-auto">
                <FilterBar filters={filters} onFiltersChange={setFilters} maxPrice={maxPrice} />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => {
                const stats = getCategoryStats(cat.name);
                const Icon = cat.icon;
                const isSelected = selectedCategories.includes(cat.name);
                return (
                  <motion.div key={cat.name} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Card
                      className={`cursor-pointer transition-all duration-200 h-full ${
                        isSelected ? "ring-2 ring-green-500 shadow-lg" : "hover:shadow-md"
                      } ${stats.count === 0 ? "opacity-50" : ""}`}
                      onClick={() =>
                        setSelectedCategories(
                          isSelected
                            ? selectedCategories.filter((c) => c !== cat.name)
                            : [...selectedCategories, cat.name]
                        )
                      }
                    >
                      <CardContent className="p-4 h-full flex items-center justify-center flex-col">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${cat.color} shadow-md`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-gray-900 mt-2">{cat.name}</p>
                        {stats.count > 0 && (
                          <div className="text-xs text-gray-500">
                            {stats.count} wishes • {stats.highPriority} high • {stats.totalValue.toLocaleString()} kr
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Wish Grid */}
            <div className="mt-8">
              <AnimatePresence mode="wait">
                {filteredWishes.length > 0 ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "grid grid-cols-1 lg:grid-cols-2 gap-6"}
                  >
                    {filteredWishes.map((wish, i) => (
                      <motion.div key={wish.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <WishCard
                          wish={{ ...wish, stars: wish.stars ?? priorityToStars(wish.priority) }} // fallback ⭐
                          onToggleFavorite={() => handleToggleFavorite(wish.id)}
                          onDelete={() => handleDelete(wish.id)}
                          onToggleReserve={() => handleToggleReserve(wish.id)}
                          onUpdateComments={(comments) => handleUpdateComments(wish.id, comments)}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-20 text-gray-500">No wishes found</div>
                )}
              </AnimatePresence>
            </div>

            {/* Add Wish Button */}
            <div className="fixed bottom-8 right-8 z-50">
              {user ? (
                <AddWishDialog
                  userId={user.id}
                  onAddWish={handleAddWish as any}
                  categories={categories.map((c) => c.name)}
                  wishListId={wishlistId}
                />
              ) : (
                <Button
                  size="lg"
                  className="h-16 w-16 rounded-full shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-200 bg-gray-400 cursor-not-allowed"
                  disabled
                  title="Log in to add a wish"
                >
                  <Plus className="w-6 h-6" />
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
