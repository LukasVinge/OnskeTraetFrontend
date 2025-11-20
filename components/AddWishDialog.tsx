"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Wish {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  priority: "low" | "medium" | "high";
  isFavorite: boolean;
  isReserved: boolean;
  price: number;
  link?: string;
  comments?: string;
}

interface AddWishDialogProps {
  onAddWish: (wish: Omit<Wish, "id" | "isFavorite" | "isReserved">) => void;
  categories: string[];
  defaultCategory?: string;
  wishListId: string;
}

export function AddWishDialog({
  onAddWish,
  categories,
  defaultCategory,
  wishListId,
}: AddWishDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(defaultCategory || categories[0]);
  const [imageUrl, setImageUrl] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [price, setPrice] = useState("");
  const [link, setLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    const apiPriority = priority.charAt(0).toUpperCase() + priority.slice(1);

    const apiPayload = {
      wishId: crypto.randomUUID(),
      wishListId: wishListId,
      wishName: title,
      description,
      link: link || "string",
      reserved: false,
      priority: apiPriority,
      type: category,
      price: price ? parseFloat(price) : 0,
      currency: "DKK",
      image: imageUrl || "string",
    };

    try {
      const response = await fetch(
        "https://onsketraetbackend.onrender.com/api/Wishes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiPayload),
        }
      );

      if (!response.ok) throw new Error(await response.text());

      onAddWish({
        title,
        description,
        category,
        imageUrl: imageUrl || undefined,
        priority,
        price: price ? parseFloat(price) : 0,
        link: link || undefined,
        comments: undefined,
      });

      resetForm();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Der skete en fejl. Tjek konsollen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageUrl("");
    setPriority("medium");
    setPrice("");
    setLink("");
    setCategory(defaultCategory || categories[0]);
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

      <DialogContent className="max-h-[90vh] overflow-hidden">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col max-h-[80vh] overflow-hidden"
        >
          <DialogHeader>
            <DialogTitle>Add New Wish</DialogTitle>
            <DialogDescription>
              Add a new item to your wishlist. Fill in the details below.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Running Shoes"
                required
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your wish..."
                rows={3}
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger
                    id="category"
                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-neutral-900 border shadow-lg">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={priority}
                  onValueChange={(value) =>
                    setPriority(value as "low" | "medium" | "high")
                  }
                >
                  <SelectTrigger
                    id="priority"
                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-neutral-900 border shadow-lg">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (kr) (optional)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g., 500"
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Product Link (optional)</Label>
                <Input
                  id="link"
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://store.com/product"
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-600 to-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Add Wish"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
