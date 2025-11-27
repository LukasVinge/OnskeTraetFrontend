"use client";

import { useState, ReactNode } from "react"; 
import { Loader2 } from "lucide-react";
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

interface AddWishlistDialogProps {
  userId: string;
  onWishlistCreated: () => void;
  children: ReactNode; 
}

const COLOR_OPTIONS = [
  { name: "Emerald", gradient: "from-emerald-500 to-emerald-600" },
  { name: "Blue", gradient: "from-blue-500 to-blue-600" },
  { name: "Pink", gradient: "from-pink-500 to-pink-600" },
  { name: "Amber", gradient: "from-amber-500 to-amber-600" },
  { name: "Purple", gradient: "from-purple-500 to-purple-600" },
];

export function AddWishlistDialog({ userId, onWishlistCreated, children }: AddWishlistDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLOR_OPTIONS[0].gradient);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    const wishlistPayload = {
      wishListId: crypto.randomUUID(),
      wishId: crypto.randomUUID(),
      userId,
      wishListName: name,
      sharedLink: "",
      description: description || "string",
      color: color,
    };

    try {
      const response = await fetch(
        "https://onsketraetbackend.onrender.com/api/WishLists",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(wishlistPayload),
        }
      );

      if (!response.ok) throw new Error(await response.text());

      resetForm();
      setOpen(false);
      onWishlistCreated();
    } catch (error) {
      console.error(error);
      alert("Der skete en fejl. Kunne ikke oprette ønskeliste.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setColor(COLOR_OPTIONS[0].gradient);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children} 
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-hidden">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col max-h-[80vh] overflow-hidden"
        >
          <DialogHeader>
            <DialogTitle>Create New Wishlist</DialogTitle>
            <DialogDescription>
              Choose a title, description and a theme color for your wishlist.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Christmas 2025"
                required
                className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the wishlist..."
                rows={3}
                className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
              />
            </div>

            {/* COLOR SELECTOR */}
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="grid grid-cols-5 gap-1">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    type="button"
                    key={c.name}
                    onClick={() => setColor(c.gradient)}
                    className={`relative h-10 mx-2 rounded-xl transition-all border border-gray-200 bg-gradient-to-br ${c.gradient} ${color === c.gradient ? "scale-105" : "opacity-90 hover:scale-105"}`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Create Wishlist"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
