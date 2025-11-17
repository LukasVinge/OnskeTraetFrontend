"use client";
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Wish } from '@components/WishCard/WishCard'

interface AddWishDialogProps {
  onAddWish: (wish: Omit<Wish, 'id' | 'isFavorite'>) => void;
  categories: string[];
  defaultCategory?: string;
}

export function AddWishDialog({
  onAddWish,
  categories,
  defaultCategory,
}: AddWishDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(defaultCategory || categories[0]);
  const [imageUrl, setImageUrl] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [price, setPrice] = useState('');
  const [link, setLink] = useState('');
  const [comments, setComments] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddWish({
      title,
      description,
      category,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400',
      priority,
      price: price ? parseFloat(price) : undefined,
      link: link || undefined,
      comments: comments || undefined,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setImageUrl('');
    setPriority('medium');
    setPrice('');
    setLink('');
    setComments('');
    setCategory(defaultCategory || categories[0]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          className="h-16 w-16 rounded-full shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-200 bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
        >
          <Plus className="w-6 h-6" />
          <span className="sr-only">Add Wish</span>
        </Button>
      </DialogTrigger>

      {/* Responsive Dialog Content */}
      <DialogContent className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Wish</DialogTitle>
            <DialogDescription>
              Add a new item to your wishlist. Fill in the details below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Running Shoes"
                required
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your wish..."
                rows={3}
              />
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) =>
                  setPriority(value as 'low' | 'medium' | 'high')
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div className="grid gap-2">
              <Label htmlFor="price">Price (kr) (optional)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., 500"
              />
            </div>

            {/* Image URL */}
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Product Link */}
            <div className="grid gap-2">
              <Label htmlFor="link">Product Link (optional)</Label>
              <Input
                id="link"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://store.com/product"
              />
            </div>

            {/* Comments / Notes */}
            <div className="grid gap-2">
              <Label htmlFor="comments">Notes (optional)</Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add size, color preferences, or other details..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-gradient-to-r from-green-600 to-green-700">
              Add Wish
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
