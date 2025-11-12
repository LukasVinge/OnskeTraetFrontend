"use client";
import { useState, useMemo } from 'react';
import { Star, TreePine, Share2, Grid3x3, LayoutList, Dumbbell, Palette, Shirt, Smartphone, BookOpen, Plane, Sparkles, TrendingUp, MoreHorizontal } from 'lucide-react';
import { WishCard, Wish } from '@components/WishCard/WishCard';
import { AddWishDialog } from '@components/AddWishDialog';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import { FilterBar, FilterOptions } from '@components/FilterBar';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@components/ui/card';

const categories = [
  { name: 'Sport', icon: Dumbbell, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { name: 'Hobby', icon: Palette, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  { name: 'Clothes', icon: Shirt, color: 'from-rose-500 to-orange-500', bgColor: 'bg-rose-50', borderColor: 'border-rose-200' },
  { name: 'Electronics', icon: Smartphone, color: 'from-indigo-500 to-blue-500', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
  { name: 'Books', icon: BookOpen, color: 'from-amber-500 to-yellow-500', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  { name: 'Travel', icon: Plane, color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  { name: 'Other', icon: MoreHorizontal, color: 'from-gray-500 to-slate-500', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
];

const initialWishes: Wish[] = [
  {
    id: '1',
    title: 'Professional Running Shoes',
    description: 'High-performance running shoes for marathon training',
    category: 'Sport',
    imageUrl: 'https://images.unsplash.com/photo-1602211844066-d3bb556e983b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzU5OTM1NzU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    priority: 'high',
    isFavorite: true,
    price: 1200,
    link: 'https://example.com/shoes',
  },
  {
    id: '2',
    title: 'Watercolor Paint Set',
    description: 'Professional grade watercolor paints for creative projects',
    category: 'Hobby',
    imageUrl: 'https://images.unsplash.com/photo-1728393287642-13bee7126ae8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob2JieSUyMGNyYWZ0c3xlbnwxfHx8fDE3NjAwMTMzOTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    priority: 'medium',
    isFavorite: false,
    price: 450,
  },
  {
    id: '3',
    title: 'Winter Jacket',
    description: 'Stylish and warm winter jacket for cold weather',
    category: 'Clothes',
    imageUrl: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhlc3xlbnwxfHx8fDE3NjAwMTMzOTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    priority: 'high',
    isFavorite: true,
    price: 2500,
    comments: 'Size L, prefer dark colors',
  },
  {
    id: '4',
    title: 'Wireless Headphones',
    description: 'Noise-cancelling wireless headphones with premium sound',
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1645684084216-b52ba9e12aaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMGdhZGdldHN8ZW58MXx8fHwxNzU5OTQ4MzQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    priority: 'medium',
    isFavorite: false,
    price: 1800,
  },
  {
    id: '5',
    title: 'Classic Literature Collection',
    description: 'A collection of timeless classic novels',
    category: 'Books',
    imageUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMHJlYWRpbmd8ZW58MXx8fHwxNzU5OTM1OTIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    priority: 'low',
    isFavorite: false,
    price: 350,
  },
  {
    id: '6',
    title: 'Weekend Trip to Mountains',
    description: 'A relaxing weekend getaway to a mountain resort',
    category: 'Travel',
    imageUrl: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzU5OTI3OTI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    priority: 'high',
    isFavorite: true,
    price: 3500,
    isReserved: false,
  },
];

export default function WishlistPage() {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const maxPrice = useMemo(() => {
    const prices = wishes.map(w => w.price || 0);
    const highestPrice = Math.max(...prices, 0);
    // Round up to nearest 1000 or at least 5000
    return Math.max(Math.ceil(highestPrice / 1000) * 1000, 5000);
  }, [wishes]);

  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    priorities: [],
    priceRange: [0, maxPrice],
    favoritesOnly: false,
  });

useMemo(() => {
  setFilters((prev: FilterOptions) => ({
    ...prev,
    priceRange: [prev.priceRange[0], maxPrice],
  }));
}, [maxPrice]);


  const handleAddWish = (newWish: Omit<Wish, 'id' | 'isFavorite'>) => {
    const wish: Wish = {
      ...newWish,
      id: Date.now().toString(),
      isFavorite: false,
    };
    setWishes([wish, ...wishes]);
    toast.success('Wish added successfully!');
  };

  const handleToggleFavorite = (id: string) => {
    setWishes(
      wishes.map((wish) =>
        wish.id === id ? { ...wish, isFavorite: !wish.isFavorite } : wish
      )
    );
  };

  const handleDelete = (id: string) => {
    setWishes(wishes.filter((wish) => wish.id !== id));
    toast.success('Wish removed');
  };

  const handleToggleReserve = (id: string) => {
    setWishes(
      wishes.map((wish) =>
        wish.id === id ? { ...wish, isReserved: !wish.isReserved } : wish
      )
    );
    const wish = wishes.find(w => w.id === id);
    if (wish?.isReserved) {
      toast.success('Reservation removed');
    } else {
      toast.success('Wish marked as reserved!');
    }
  };

  const handleUpdateComments = (id: string, comments: string) => {
    setWishes(
      wishes.map((wish) =>
        wish.id === id ? { ...wish, comments } : wish
      )
    );
    toast.success('Notes saved');
  };

  const handleShareWishlist = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Wishlist link copied to clipboard!');
    });
  };

  // Apply filters
  const filteredWishes = useMemo(() => {
    return wishes.filter((wish) => {
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(wish.category)) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          wish.title.toLowerCase().includes(searchLower) ||
          wish.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Priority filter
      if (filters.priorities.length > 0) {
        if (!filters.priorities.includes(wish.priority)) return false;
      }

      // Price filter
      const wishPrice = wish.price || 0;
      if (wishPrice < filters.priceRange[0] || wishPrice > filters.priceRange[1]) {
        return false;
      }

      // Favorites filter
      if (filters.favoritesOnly && !wish.isFavorite) {
        return false;
      }

      return true;
    });
  }, [wishes, filters, selectedCategories]);

  const favoriteCount = wishes.filter((wish) => wish.isFavorite).length;
  const totalValue = wishes.reduce((sum, wish) => sum + (wish.price || 0), 0);

  const getCategoryStats = (categoryName: string) => {
    const categoryWishes = wishes.filter((wish) => wish.category === categoryName);
    const totalValue = categoryWishes.reduce((sum, wish) => sum + (wish.price || 0), 0);
    const highPriority = categoryWishes.filter(w => w.priority === 'high').length;
    return {
      count: categoryWishes.length,
      totalValue,
      highPriority,
    };
  };

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
              <h1 className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                My Wishlist
              </h1>
            </div>
            <p className="text-gray-600">
              Keep track of all the things you wish for and share with loved ones
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleShareWishlist}
              className="gap-2 border-green-200 hover:bg-green-50 hover:border-green-300"
            >
              <Share2 className="w-4 h-4" />
              Share Wishlist
            </Button>
          </div>
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
          <div className="flex-1" />
          <div className="flex gap-1 bg-white/80 rounded-lg p-1 border border-green-100">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-gradient-to-r from-green-600 to-green-700' : ''}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-gradient-to-r from-green-600 to-green-700' : ''}
            >
              <LayoutList className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Smart Category Navigation */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-green-600" />
          <h2 className="text-gray-900">Browse by Category</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const stats = getCategoryStats(category.name);
            const Icon = category.icon;
            const isSelected = selectedCategories.includes(category.name);
            
            const handleCategoryClick = () => {
              if (isSelected) {
                setSelectedCategories(selectedCategories.filter(c => c !== category.name));
              } else {
                setSelectedCategories([...selectedCategories, category.name]);
              }
            };
            
            return (
              <motion.div
                key={category.name}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="h-full"
              >
                <Card
                  className={`cursor-pointer transition-all duration-200 overflow-hidden h-full ${
                    isSelected 
                      ? 'ring-2 ring-green-500 shadow-lg' 
                      : 'hover:shadow-md'
                  } ${stats.count === 0 ? 'opacity-50' : ''}`}
                  onClick={handleCategoryClick}
                >
                  <CardContent className="p-4 h-full flex items-center">
                    <div className="flex flex-col items-center gap-3 text-center w-full">
                      {/* Icon */}
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} shadow-md`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Category Name */}
                      <div className="space-y-1 w-full min-h-[80px] flex flex-col justify-start">
                        <p className="text-gray-900">{category.name}</p>
                        
                        {/* Stats */}
                        {stats.count > 0 ? (
                          <div className="space-y-1">
                            <Badge variant="secondary" className="text-xs">
                              {stats.count} {stats.count === 1 ? 'wish' : 'wishes'}
                            </Badge>
                            
                            {stats.highPriority > 0 && (
                              <div className="flex items-center justify-center gap-1 text-xs text-amber-600">
                                <TrendingUp className="w-3 h-3" />
                                <span>{stats.highPriority} high</span>
                              </div>
                            )}
                            
                            <p className="text-xs text-gray-500">
                              {stats.totalValue.toLocaleString()} kr
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400">No wishes</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Active Category Filters */}
        {selectedCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2 flex-wrap"
          >
            <span className="text-sm text-gray-600">Showing:</span>
            {selectedCategories.map((cat) => (
              <Badge 
                key={cat}
                className="bg-green-100 text-green-700 border-green-200 px-3 py-1 gap-2 cursor-pointer hover:bg-green-200"
                onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== cat))}
              >
                {cat}
                <button className="hover:text-green-900">×</button>
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategories([])}
              className="h-6 px-2 text-xs hover:bg-green-50"
            >
              Clear all
            </Button>
          </motion.div>
        )}
      </div>

      {/* Filter Bar */}
      <FilterBar 
        filters={filters} 
        onFiltersChange={setFilters}
        maxPrice={maxPrice}
      />

      {/* Wishes Grid */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          {filteredWishes.length > 0 ? (
            <motion.div
              key="wishes-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                viewMode === 'grid'
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "grid grid-cols-1 lg:grid-cols-2 gap-6"
              }
            >
              {filteredWishes.map((wish, index) => (
                <motion.div
                  key={wish.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
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
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-20 bg-white/50 rounded-2xl border-2 border-dashed border-green-200"
            >
              <TreePine className="w-16 h-16 mx-auto text-green-300 mb-4" />
              <h3 className="text-gray-900 mb-2">No wishes found</h3>
              <p className="text-gray-500 mb-6">
                {filters.search || filters.priorities.length > 0 || filters.favoritesOnly || selectedCategories.length > 0
                  ? 'Try adjusting your filters'
                  : 'Start by adding your first wish!'}
              </p>
              {(selectedCategories.length > 0 || filters.search || filters.priorities.length > 0 || filters.favoritesOnly) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategories([]);
                    setFilters({
                      search: '',
                      priorities: [],
                      priceRange: [0, maxPrice],
                      favoritesOnly: false,
                    });
                  }}
                  className="border-green-200 hover:bg-green-50"
                >
                  Clear all filters
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <AddWishDialog
          onAddWish={handleAddWish}
          categories={categories.map(c => c.name)}
          defaultCategory="Sport"
        />
      </div>
    </div>
  );
}
