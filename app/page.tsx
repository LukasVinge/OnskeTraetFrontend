"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Heart, Users, Gift, ArrowRight, TreePine } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const LandingPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-rose-50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-rose-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-amber-200/30 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-16 relative">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg">
                <TreePine className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="text-2xl font-semibold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  ØnskeTræet
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/wishlist")}
                className="hidden sm:inline-flex bg-transparent border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all"
              >
                Log in
              </Button>
              <Button
                onClick={() => router.push("/wishlist")}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
              >
                Sign up
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-green-200/50 shadow-sm">
                <Sparkles className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">Share wishes. Spread joy.</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Your wishes,{" "}
                  <span className="bg-gradient-to-r from-green-600 via-amber-600 to-rose-600 bg-clip-text text-transparent">
                    beautifully shared
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Create meaningful wishlists, share them with loved ones, and make every
                  celebration more special. ØnskeTræet brings families and friends together
                  through the joy of giving.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => router.push("/wishlist")}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Get started free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push("/sample")}
                  className="text-lg px-8 py-6 rounded-xl text-green-600 border-2 bg-transparent border-green-200 hover:border-green-300 hover:bg-green-50/50"
                >
                  View sample wishlist
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 max-w-xs hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">1,247 wishes</p>
                    <p className="text-sm text-gray-500">shared this week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl w-fit mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-3 text-gray-900">Share with loved ones</h3>
                <p className="text-gray-600">
                  Create beautiful wishlists and share them with family and friends. Let them know
                  exactly what would make you happy.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl w-fit mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-3 text-gray-900">Connect families</h3>
                <p className="text-gray-600">
                  See what your loved ones wish for. No more guessing games for birthdays,
                  holidays, or special occasions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl w-fit mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-3 text-gray-900">Make moments special</h3>
                <p className="text-gray-600">
                  Turn wishes into reality. Track priorities, set budgets, and create memorable
                  moments for those you care about.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mb-12">
            <h2 className="mb-4 text-gray-900">Celebrate every moment</h2>
            <p className="text-gray-600 text-lg mb-12">
              From birthdays to holidays, make every wish count
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent flex items-end p-6">
                  <p className="text-white font-medium text-lg">Perfect gifts, every time</p>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent flex items-end p-6">
                  <p className="text-white font-medium text-lg">Share the joy of giving</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-white mb-4">Ready to start sharing?</h2>
            <p className="text-green-50 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of families making gift-giving meaningful and stress-free
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => router.push("/login")}
                className="bg-white text-green-700 hover:bg-green-50 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Create your wishlist
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/sample")}
                className="border-2 border-white bg-white text-green-600 hover:text-white hover:bg-white/10 text-lg px-8 py-6 rounded-xl"
              >
                See how it works
              </Button>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-green-200/50 bg-white/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <TreePine className="w-5 h-5 text-green-600" />
              <span className="text-gray-600">© 2024 ØnskeTræet. Made with love.</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <button className="hover:text-green-600 transition-colors">About</button>
              <button className="hover:text-green-600 transition-colors">Privacy</button>
              <button className="hover:text-green-600 transition-colors">Terms</button>
              <button className="hover:text-green-600 transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;