"use client";

import { useState, useEffect } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Plus, Gift, Star, Heart, Sparkles, TreePine, Users, Lock, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { AddWishlistDialog } from "@components/AddWishlistDialog";
import { Navigation } from "@components/Navigation";

// ===== Types =====
type WishlistIcon = "gift" | "heart" | "sparkles" | "star";

interface Wishlist {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  categoryCount: number;
  totalValue: number;
  lastUpdated: Date;
  color: string;
  icon: WishlistIcon;
  isShared: boolean;
  sharedWith: number;
}

interface FullUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string | null;
  birthYear: string;
  gender: string;
  language: string;
  streetName: string;
  streetNumber: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}

// Map icons
const iconMap = {
  gift: Gift,
  heart: Heart,
  sparkles: Sparkles,
  star: Star,
};

const API_BASE_URL = "https://onsketraetbackend.onrender.com/api/WishLists";
const API_USER_URL = "https://onsketraetbackend.onrender.com/api/Users";
const API_HEALTH_URL = "https://onsketraetbackend.onrender.com/api/Health";

export default function WishlistPage() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [firstName, setFirstName] = useState<string>("");

  // Fetch API Health first
  useEffect(() => {
    async function checkHealth() {
      try {
        await fetch(API_HEALTH_URL);
        console.log("Health check passed");
      } catch (err) {
        console.error("API Health check failed", err);
      }
    }
    checkHealth();
  }, []);

  // Fetch wishlists and full user info
  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      setLoading(true);

      try {
        // Fetch full user info
        const userRes = await fetch(`${API_USER_URL}/${user?.id}`);
        if (!userRes.ok) throw new Error("Failed to fetch user info");
        const userData: FullUser = await userRes.json();
        setFirstName(userData.firstName);

        // Save to localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("localStorage:", localStorage);

        // Fetch wishlists
        const res = await fetch(`${API_BASE_URL}/user/${user?.id}`);
        if (!res.ok) throw new Error("Failed to fetch wishlists");
        const data = await res.json();

        const mapped: Wishlist[] = data.map((w: any) => ({
          id: w.wishListId,
          name: w.wishListName,
          description: w.description || "",
          itemCount: w.itemCount || 0,
          categoryCount: w.categoryCount || 0,
          totalValue: w.totalValue || 0,
          lastUpdated: w.lastUpdated ? new Date(w.lastUpdated) : new Date(),
          color: w.color || "from-indigo-500 to-purple-600",
          icon: (w.icon as WishlistIcon) || "star",
          isShared: w.isShared || false,
          sharedWith: w.sharedWith || 0,
        }));

        setWishlists(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if (user === null) router.push("/login");
  }, [user, router]);

  if (loading) return <p className="flex items-center justify-center h-screen">Loading…</p>;
  if (!user) return null;

  const totalWishes = wishlists.reduce((sum, w) => sum + w.itemCount, 0);

  const formatDate = (date: Date) => {
    const days = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  const handleSelectWishlist = (id: string) => router.push(`/main/wishlist/${id}`);

  const handleWishlistCreated = () => {
    setWishlists((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "New Wishlist",
        description: "Just created!",
        itemCount: 0,
        categoryCount: 0,
        totalValue: 0,
        lastUpdated: new Date(),
        color: "from-indigo-500 to-purple-600",
        icon: "star",
        isShared: false,
        sharedWith: 0,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-rose-50">
      {/* Navigation */}
      <Navigation currentPage="wishlists-overview" onNavigate={() => {}} />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl mb-3 text-gray-900">{firstName}'s Wishlist</h1>
              <p className="text-gray-600 text-lg">Welcome back, {firstName}</p>
            </div>

            <AddWishlistDialog userId={user.id} onWishlistCreated={handleWishlistCreated}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all rounded-xl gap-2"
              >
                <Plus className="w-5 h-5" />
                New Wishlist
              </Button>
            </AddWishlistDialog>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="border-none shadow-lg bg-gradient-to-br from-green-500 to-green-600 overflow-hidden text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm mb-1">Total Wishlists</p>
                  <p className="text-3xl">{wishlists.length}</p>
                </div>
                <TreePine className="w-8 h-8" />
              </div>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 overflow-hidden text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm mb-1">Total Wishes</p>
                  <p className="text-3xl">{totalWishes}</p>
                </div>
                <Gift className="w-8 h-8" />
              </div>
            </Card>
          </div>
        </div>

        {/* Wishlist cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {wishlists.map((wishlist, idx) => {
            const Icon = iconMap[wishlist.icon];
            return (
              <motion.div
                key={wishlist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card
                  className="border-none shadow-lg hover:shadow-2xl transition-all cursor-pointer group bg-white/80 backdrop-blur-sm"
                  onClick={() => handleSelectWishlist(wishlist.id)}
                >
                  <CardContent className="p-0">
                    <div className={`p-6 bg-gradient-to-r ${wishlist.color} text-white`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-2">
                          {wishlist.isShared ? (
                            <div className="flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                              <Users className="w-4 h-4" />
                              <span className="text-sm">{wishlist.sharedWith}</span>
                            </div>
                          ) : (
                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                              <Lock className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </div>

                      <h3 className="mb-2">{wishlist.name}</h3>
                      <p className="text-white/80 text-sm">{wishlist.description}</p>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-500 text-sm mb-1">Wishes</p>
                          <p className="text-xl text-gray-900">{wishlist.itemCount}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm mb-1">Categories</p>
                          <p className="text-xl text-gray-900">{wishlist.categoryCount}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>Updated {formatDate(wishlist.lastUpdated)}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          View →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {/* Add new wishlist card */}
          <AddWishlistDialog userId={user.id} onWishlistCreated={handleWishlistCreated}>
            <Card className="border-2 border-dashed border-gray-300 shadow-lg hover:border-green-400 transition-all cursor-pointer group bg-white/50 backdrop-blur-sm h-full min-h-[320px]">
              <CardContent className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-4 group-hover:from-green-200 group-hover:to-green-300 transition-all">
                  <Plus className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="mb-2 text-gray-900">Create New Wishlist</h3>
                <p className="text-gray-600 mb-6">
                  Start a new collection for birthdays, holidays, or any special occasion
                </p>
                <Button variant="outline" className="border-2 border-green-600 text-green-700 hover:bg-green-50">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </AddWishlistDialog>
        </div>
      </div>
    </div>
  );
}
