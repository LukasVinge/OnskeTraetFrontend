"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Star,
  TreePine,
  Share2,
  Grid3x3,
  LayoutList,
} from "lucide-react";
import { toast } from "sonner";

import { WishCard, Wish } from "@/components/WishCard";
import { AddWishDialog } from "@/components/AddWishDialog";
import { FilterBar, FilterOptions } from "@/components/FilterBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const categories = ["Sport", "Hobby", "Clothes", "Electronics", "Books", "Travel"];

const initialWishes: Wish[] = [
  {
    id: "1",
    title: "Professional Running Shoes",
    description: "High-performance running shoes for marathon training",
    category: "Sport",
    imageUrl:
      "https://images.unsplash.com/photo-1602211844066-d3bb556e983b?auto=format&w=1080&q=80",
    priority: "high",
    isFavorite: true,
    price: 1200,
    link: "https://example.com/shoes",
  },
  {
    id: "2",
    title: "Watercolor Paint Set",
    description: "Professional grade watercolor paints for creative projects",
    category: "Hobby",
    imageUrl:
      "https://images.unsplash.com/photo-1728393287642-13bee7126ae8?auto=format&w=1080&q=80",
    priority: "medium",
    isFavorite: false,
    price: 450,
  },
  {
    id: "3",
    title: "Winter Jacket",
    description: "Stylish and warm winter jacket for cold weather",
    category: "Clothes",
    imageUrl:
      "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&w=1080&q=80",
    priority: "high",
    isFavorite: true,
    price: 2500,
    comments: "Size L, prefer dark colors",
  },
  {
    id: "4",
    title: "Wireless Headphones",
    description: "Noise-cancelling wireless headphones with premium sound",
    category: "Electronics",
    imageUrl:
      "https://images.unsplash.com/photo-1645684084216-b52ba9e12aaf?auto=format&w=1080&q=80",
    priority: "medium",
    isFavorite: false,
    price: 1800,
  },
  {
    id: "5",
    title: "Classic Literature Collection",
    description: "A collection of timeless classic novels",
    category: "Books",
    imageUrl:
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&w=1080&q=80",
    priority: "low",
    isFavorite: false,
    price: 350,
  },
  {
    id: "6",
    title: "Weekend Trip to Mountains",
    description: "A relaxing weekend getaway to a mountain resort",
    category: "Travel",
    imageUrl:
      "https://images.unsplash.com/photo-1528543606781-2f6e6857f318?auto=format&w=1080&q=80",
    priority: "high",
    isFavorite: true,
    price: 3500,
    isReserved: false,
  },
];

export default function WishlistPage() {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const maxPrice = useMemo(
    () => Math.max(...wishes.map((w) => w.price || 0), 5000),
    [wishes]
  );

  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    priorities: [],
    priceRange: [0, maxPrice],
    favoritesOnly: false,
  });

  // Keep filter max price in sync
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [prev.priceRange[0], maxPrice],
    }));
  }, [maxPrice]);

  const handleAddWish = (newWish: Omit<Wish, "id" | "isFavorite">) => {
    const wish: Wish = {
      ...newWish,
      id: Date.now().toString(),
      isFavorite: false,
    };
    setWishes((prev) => [wish, ...prev]);
    toast.success("Wish added successfully!");
  };

  const handleToggleFavorite = (id: string) => {
    setWishes((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isFavorite: !w.isFavorite } : w
      )
    );
  };

  const handleDelete = (id: string) => {
    setWishes((prev) => prev.filter((w) => w.id !== id));
    toast.success("Wish removed");
  };

  const handleToggleReserve = (id: string) => {
    setWishes((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isReserved: !w.isReserved } : w
      )
    );
    const target = wishes.find((w) => w.id === id);
    toast.success(target?.isReserved ? "Reservation removed" : "Wish marked as reserved!");
  };

  const handleUpdateComments = (id: string, comments: string) => {
    setWishes((prev) =>
      prev.map((w) => (w.id === id ? { ...w, comments } : w))
    );
    toast.success("Notes saved");
  };

  const handleShareWishlist = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Wishlist link copied to clipboard!");
  };

  const filteredWishes = useMemo(() => {
    return wishes.filter((w) => {
      const inSearch =
        !filters.search ||
        w.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        w.description.toLowerCase().includes(filters.search.toLowerCase());
      const inPriority =
        filters.priorities.length === 0 ||
        filters.priorities.includes(w.priority);
      const inPrice =
        (w.price || 0) >= filters.priceRange[0] &&
        (w.price || 0) <= filters.priceRange[1];
      const inFavorites = !filters.favoritesOnly || w.isFavorite;
      return inSearch && inPriority && inPrice && inFavorites;
    });
  }, [wishes, filters]);

  const favoriteCount = wishes.filter((w) => w.isFavorite).length;
  const totalValue = wishes.reduce((sum, w) => sum + (w.price || 0), 0);

  const getWishesByCategory = (category: string) =>
    filteredWishes.filter((w) => w.category === category);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <TreePine className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                My Wishlist
              </h1>
            </div>
            <p className="text-gray-600">
              Keep track of all the things you wish for and share them with loved ones
            </p>
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
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="gap-1 bg-gradient-to-r from-green-600 to-green-700 text-white border-none px-4 py-2">
            <Star className="w-3 h-3" fill="currentColor" />
            {favoriteCount} Favorites
          </Badge>
          <Badge variant="secondary" className="bg-white/80 border-green-200 px-4 py-2">
            {wishes.length} Total Wishes
          </Badge>
          <Badge variant="secondary" className="bg-white/80 border-amber-200 px-4 py-2">
            {totalValue.toLocaleString()} kr Total Value
          </Badge>

          <div className="flex-1" />
          <div className="flex gap-1 bg-white/80 rounded-lg p-1 border border-green-100">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={
                viewMode === "grid"
                  ? "bg-gradient-to-r from-green-600 to-green-700"
                  : ""
              }
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={
                viewMode === "list"
                  ? "bg-gradient-to-r from-green-600 to-green-700"
                  : ""
              }
            >
              <LayoutList className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterBar filters={filters} onFiltersChange={setFilters} maxPrice={maxPrice} />

      {/* Category sections */}
      <div className="space-y-12">
        {categories.map((category) => {
          const categoryWishes = getWishesByCategory(category);
          if (categoryWishes.length === 0) return null;

          return (
            <section key={category} className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {category}
                  </h2>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    {categoryWishes.length}{" "}
                    {categoryWishes.length === 1 ? "wish" : "wishes"}
                  </Badge>
                </div>
                <Separator className="bg-green-100" />
              </div>

              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "grid grid-cols-1 lg:grid-cols-2 gap-6"
                }
              >
                {categoryWishes.map((wish) => (
                  <WishCard
                    key={wish.id}
                    wish={wish}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDelete}
                    onToggleReserve={handleToggleReserve}
                    onUpdateComments={handleUpdateComments}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* Empty state */}
        {filteredWishes.length === 0 && (
          <div className="text-center py-20 bg-white/50 rounded-2xl border-2 border-dashed border-green-200">
            <TreePine className="w-16 h-16 mx-auto text-green-300 mb-4" />
            <h3 className="text-gray-900 mb-2">No wishes found</h3>
            <p className="text-gray-500 mb-6">
              {filters.search || filters.priorities.length > 0 || filters.favoritesOnly
                ? "Try adjusting your filters"
                : "Start by adding your first wish!"}
            </p>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <AddWishDialog
          onAddWish={handleAddWish}
          categories={categories}
          defaultCategory="Sport"
        />
      </div>
    </div>
  );
}
