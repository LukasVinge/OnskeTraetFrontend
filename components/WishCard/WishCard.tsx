"use client";
import { Heart, Trash2, Edit2, Star, ExternalLink, CheckCircle2, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Textarea } from '../ui/textarea';

export interface Wish {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  priority: "low" | "medium" | "high";
  stars: number;      // <--- required
  isFavorite: boolean;
  isReserved: boolean;
  price: number;
  link: string;
  comments: string;
}

interface WishCardProps {
  wish: Wish;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
  onToggleReserve?: (id: string) => void;
  onUpdateComments?: (id: string, comments: string) => void;
  isGuestView?: boolean;
}

export function WishCard({ 
  wish, 
  onToggleFavorite, 
  onDelete,
  onEdit,
  onToggleReserve,
  onUpdateComments,
  isGuestView = false
}: WishCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(wish.comments || '');

  const handleSaveComments = () => {
    if (onUpdateComments) onUpdateComments(wish.id, comments);
    setShowComments(false);
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group bg-white/80 backdrop-blur-sm border-green-100">
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-green-50 to-amber-50">
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={() => onToggleFavorite(wish.id)}
                className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
                  wish.isFavorite
                    ? 'bg-rose-500 text-white shadow-lg scale-110'
                    : 'bg-white/90 text-gray-700 hover:bg-rose-50 hover:text-rose-500'
                }`}
              >
                <Heart
                  className="w-5 h-5"
                  fill={wish.isFavorite ? 'currentColor' : 'none'}
                />
              </button>
            </div>
            
            <div className="absolute bottom-3 left-3 right-3 flex gap-2">
              {!isGuestView && onEdit && (
                <Button
                  size="sm"
                  onClick={() => onEdit(wish.id)}
                  className="flex-1 bg-white/90 hover:bg-white text-gray-900 backdrop-blur-md"
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  Edit
                </Button>
              )}
              {wish.link && (
                <Button
                  size="sm"
                  onClick={() => window.open(wish.link, '_blank')}
                  className="flex-1 bg-white/90 hover:bg-white text-gray-900 backdrop-blur-md"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View
                </Button>
              )}
            </div>
          </div>

          {/* Stars */}
          <div className="absolute top-3 left-3 flex gap-0.5 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full">
            {Array.from({ length: 3 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < wish.stars ? 'text-amber-500' : 'text-gray-300'
                }`}
                fill={i < wish.stars ? 'currentColor' : 'none'}
              />
            ))}
          </div>

          {wish.isReserved && (
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-green-600 text-white border-none">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Reserved
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-5 space-y-3">
          <div className="space-y-2">
            <h3 className="text-gray-900 line-clamp-1">{wish.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">{wish.description}</p>
          </div>

          {wish.price && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-green-700 font-semibold">{wish.price} kr</span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {isGuestView && onToggleReserve ? (
              <Button
                variant={wish.isReserved ? 'outline' : 'default'}
                size="sm"
                onClick={() => onToggleReserve(wish.id)}
                className={wish.isReserved ? 'flex-1 border-green-600 text-green-700 hover:bg-green-50' : 'flex-1 bg-gradient-to-r from-green-600 to-green-700'}
              >
                {wish.isReserved ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Reserved
                  </>
                ) : (
                  'Mark as Reserved'
                )}
              </Button>
            ) : (
              <>
                {onUpdateComments && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowComments(true)}
                    className="flex-1 border-green-200 hover:border-green-300 hover:bg-green-50"
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    {wish.comments ? 'View Notes' : 'Add Notes'}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(wish.id)}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notes for {wish.title}</DialogTitle>
            <DialogDescription>
              Add personal notes or details about this wish
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add any notes, preferences, sizes, colors, etc..."
              rows={5}
              className="resize-none"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowComments(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveComments} className="bg-gradient-to-r from-green-600 to-green-700">
              Save Notes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
