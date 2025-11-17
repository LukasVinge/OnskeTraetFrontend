"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Star,
  TreePine,
  Share2,
  Grid3x3,
  LayoutList,
  Dumbbell,
  Palette,
  Shirt,
  Smartphone,
  BookOpen,
  Plane,
  Sparkles,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";
import { WishCard, Wish } from "@components/WishCard/WishCard";
import { AddWishDialog } from "@components/AddWishDialog";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { FilterBar, FilterOptions } from "@components/FilterBar";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@components/ui/card";
import { Navigation } from "@components/Navigation"; // import navbar

const categories = [
  { name: "Sport", icon: Dumbbell, color: "from-blue-500 to-cyan-500" },
  { name: "Hobby", icon: Palette, color: "from-purple-500 to-pink-500" },
  { name: "Clothes", icon: Shirt, color: "from-rose-500 to-orange-500" },
  { name: "Electronics", icon: Smartphone, color: "from-indigo-500 to-blue-500" },
  { name: "Books", icon: BookOpen, color: "from-amber-500 to-yellow-500" },
  { name: "Travel", icon: Plane, color: "from-green-500 to-emerald-500" },
  { name: "Other", icon: MoreHorizontal, color: "from-gray-500 to-slate-500" },
];

const API_BASE_URL = "https://onsketraetbackend.onrender.com/api/Wishes";

export default function WishlistPage() {
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

  // Navbar state
  const [currentPage, setCurrentPage] = useState("wishlist");

  // Fetch wishes from Swagger API
  useEffect(() => {
    async function fetchWishes() {
      try {
        const res = await fetch(API_BASE_URL);
        if (!res.ok) throw new Error("Failed to fetch wishes");
        const data = await res.json();

        const mapped = data.map((w: any) => ({
          id: w.wishId,
          title: w.wishName,
          description: w.description,
          category: w.type || "Other",
          imageUrl: w.image || "/placeholder.png",
          priority: w.priority?.toLowerCase() || "medium",
          isFavorite: false,
          isReserved: w.reserved || false,
          price: w.price || 0,
          link: w.link,
          comments: "",
        }));

        setWishes(mapped);
      } catch (error) {
        console.error(error);
        toast.error("Could not load wishes from API");
      } finally {
        setLoading(false);
      }
    }
    fetchWishes();
  }, []);

  const maxPrice = useMemo(() => {
    const prices = wishes.map((w) => w.price || 0);
    const highest = Math.max(...prices, 0);
    return Math.max(Math.ceil(highest / 1000) * 1000, 5000);
  }, [wishes]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [prev.priceRange[0], maxPrice],
    }));
  }, [maxPrice]);

  // ----- Handlers -----
  const handleAddWish = async (newWish: Omit<Wish, "id" | "isFavorite">) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wishName: newWish.title,
          description: newWish.description,
          price: newWish.price,
          type: newWish.category,
          priority: newWish.priority,
          link: newWish.link,
          image: newWish.imageUrl,
        }),
      });
      if (!response.ok) throw new Error("Failed to create wish");
      toast.success("Wish added successfully!");
      const created = await response.json();
      setWishes((prev) => [
        { ...newWish, id: created.wishId, isFavorite: false, isReserved: false },
        ...prev,
      ]);
    } catch {
      toast.error("Failed to add wish to API");
    }
  };

  const handleToggleFavorite = (id: string) => {
    setWishes((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isFavorite: !w.isFavorite } : w))
    );
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete wish");
      setWishes((prev) => prev.filter((w) => w.id !== id));
      toast.success("Wish deleted");
    } catch {
      toast.error("Failed to delete wish from API");
    }
  };

  const handleToggleReserve = async (id: string) => {
    const wish = wishes.find((w) => w.id === id);
    if (!wish) return;
    const updated = { ...wish, isReserved: !wish.isReserved };
    setWishes((prev) => prev.map((w) => (w.id === id ? updated : w)));
    toast.success(updated.isReserved ? "Wish reserved" : "Reservation removed");
    try {
      await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...wish, reserved: updated.isReserved }),
      });
    } catch {
      toast.error("Failed to update reservation status");
    }
  };

  const handleUpdateComments = (id: string, comments: string) => {
    setWishes(
      wishes.map((wish) => (wish.id === id ? { ...wish, comments } : wish))
    );
    toast.success("Notes saved");
  };

  const handleShareWishlist = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Wishlist link copied to clipboard!");
  };

  // ----- Filtered Wishes -----
  const filteredWishes = useMemo(() => {
    return wishes.filter((w) => {
      if (selectedCategories.length && !selectedCategories.includes(w.category))
        return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (!w.title.toLowerCase().includes(search) && !w.description.toLowerCase().includes(search))
          return false;
      }
      if (filters.priorities.length > 0 && !filters.priorities.includes(w.priority))
        return false;
      const price = w.price || 0;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
      if (filters.favoritesOnly && !w.isFavorite) return false;
      return true;
    });
  }, [wishes, filters, selectedCategories]);

  // ----- Stats -----
  const favoriteCount = wishes.filter((w) => w.isFavorite).length;

  const getCategoryStats = (categoryName: string) => {
    const categoryWishes = wishes.filter((w) => w.category === categoryName);
    const totalValue = categoryWishes.reduce((sum, w) => sum + (w.price || 0), 0);
    const highPriority = categoryWishes.filter((w) => w.priority === "high").length;
    return { count: categoryWishes.length, totalValue, highPriority };
  };

  // ----- Render -----
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-rose-50">
      {/* Navbar */}
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

      <div className="container mx-auto px-4 py-8">
        {currentPage === "wishlist" ? (
          loading ? (
            <div className="text-center py-20 text-gray-500">Loading wishes...</div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                      <TreePine className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                      My Wishlist
                    </h1>
                  </div>
                  <p className="text-gray-600">Keep track of all the things you wish for and share with loved ones</p>
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

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <Badge className="gap-1 bg-gradient-to-r from-green-600 to-green-700 text-white border-none px-4 py-2">
                  <Star className="w-3 h-3" fill="currentColor" />
                  {favoriteCount} Favorites
                </Badge>
                <Badge variant="secondary" className="bg-white/80 border-green-200 px-4 py-2">
                  {wishes.length} Total Wishes
                </Badge>
              </div>

              {/* Category Navigation */}
              <div className="mb-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {categories.map((category) => {
                    const stats = getCategoryStats(category.name);
                    const Icon = category.icon;
                    const isSelected = selectedCategories.includes(category.name);
                    return (
                      <motion.div
                        key={category.name}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-200 overflow-hidden h-full ${
                            isSelected ? "ring-2 ring-green-500 shadow-lg" : "hover:shadow-md"
                          } ${stats.count === 0 ? "opacity-50" : ""}`}
                          onClick={() =>
                            setSelectedCategories(
                              isSelected
                                ? selectedCategories.filter((c) => c !== category.name)
                                : [...selectedCategories, category.name]
                            )
                          }
                        >
                          <CardContent className="p-4 h-full flex items-center justify-center flex-col">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} shadow-md`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-gray-900 mt-2">{category.name}</p>
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
              </div>

              {/* Filter Bar */}
              <FilterBar filters={filters} onFiltersChange={setFilters} maxPrice={maxPrice} />

              {/* Wishes Grid */}
              <div className="mt-8">
                <AnimatePresence mode="wait">
                  {filteredWishes.length > 0 ? (
                    <motion.div
                      key="grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={
                        viewMode === "grid"
                          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                          : "grid grid-cols-1 lg:grid-cols-2 gap-6"
                      }
                    >
                      {filteredWishes.map((wish, i) => (
                        <motion.div key={wish.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                          <WishCard
                            wish={wish}
                            onToggleFavorite={handleToggleFavorite}
                            onDelete={handleDelete}
                            onToggleReserve={handleToggleReserve}
                            onUpdateComments={handleUpdateComments}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-20 text-gray-500">No wishes found</div>
                  )}
                </AnimatePresence>
              </div>

              {/* Floating Add Button */}
              <div className="fixed bottom-8 right-8 z-50">
                <AddWishDialog onAddWish={handleAddWish} categories={categories.map((c) => c.name)} />
              </div>
            </>
          )
        ) : currentPage === "settings" ? (
          <div className="text-center py-20 text-gray-500">Settings page coming soon...</div>
        ) : null}
      </div>
    </div>
  );
}
