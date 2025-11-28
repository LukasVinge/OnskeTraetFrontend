import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Badge } from './ui/badge';

export interface FilterOptions {
  search: string;
  priorities: ('low' | 'medium' | 'high')[];
  priceRange: [number, number];
  favoritesOnly: boolean;
}

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  maxPrice: number;
}

export function FilterBar({ filters, onFiltersChange, maxPrice }: FilterBarProps) {
  const activeFiltersCount =
    filters.priorities.length +
    (filters.favoritesOnly ? 1 : 0) +
    (filters.priceRange[1] < maxPrice ? 1 : 0);

  const handlePriorityToggle = (priority: 'low' | 'medium' | 'high') => {
    const newPriorities = filters.priorities.includes(priority)
      ? filters.priorities.filter((p) => p !== priority)
      : [...filters.priorities, priority];
    onFiltersChange({ ...filters, priorities: newPriorities });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      priorities: [],
      priceRange: [0, maxPrice],
      favoritesOnly: false,
    });
  };

  const handlePriceChange = (value: [number, number]) => {
    onFiltersChange({ ...filters, priceRange: value });
  };

  const handleFavoritesChange = (checked: boolean | 'indeterminate') => {
    onFiltersChange({ ...filters, favoritesOnly: Boolean(checked) });
  };

  const hasActiveFilters = filters.search || activeFiltersCount > 0;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100 p-4 mb-8">
      <div className="flex flex-col sm:flex-row gap-4">

        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
          <Input
            placeholder="Search wishes..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pl-9 border-green-200 focus:border-green-300"
          />
        </div>

        {/* Filter Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 border-green-200 hover:bg-green-50 hover:border-green-300 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-1 bg-green-600">{activeFiltersCount}</Badge>
              )}
            </Button>
          </PopoverTrigger>

          {/* 🔥 FIXED: NOT SEE-THROUGH ANYMORE */}
          <PopoverContent
            className="w-80 bg-white border border-green-200 shadow-xl rounded-xl"
            align="end"
          >
            <div className="space-y-4">

              {/* Priority */}
              <div>
                <h4 className="mb-3 font-medium">Priority</h4>
                <div className="space-y-2">
                  {(['high', 'medium', 'low'] as const).map((priority) => (
                    <div key={priority} className="flex items-center space-x-2">
                      <Checkbox
                        id={`priority-${priority}`}
                        checked={filters.priorities.includes(priority)}
                        onCheckedChange={() => handlePriorityToggle(priority)}
                        className="cursor-pointer data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                      <Label htmlFor={`priority-${priority}`} className="cursor-pointer capitalize">
                        {priority}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="mb-3 font-medium">
                  Price Range: {filters.priceRange[0]} - {filters.priceRange[1]} kr
                </h4>
                <Slider
                  min={0}
                  max={maxPrice}
                  step={50}
                  value={filters.priceRange}
                  onValueChange={handlePriceChange}
                  className="cursor-pointer [&_.bg-primary]:bg-green-600 [&_[role=slider]]:border-green-600 [&_[role=slider]]:focus:ring-green-300"
                />
              </div>

              {/* Favorites only */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="favorites-only"
                  checked={filters.favoritesOnly}
                  onCheckedChange={handleFavoritesChange}
                  className="cursor-pointer data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <Label htmlFor="favorites-only" className="cursor-pointer">
                  Favorites only
                </Label>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearFilters}
            className="shrink-0 cursor-pointer hover:bg-green-50 hover:text-green-700"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
