"use client";

import { useState } from "react";
import { Settings as SettingsIcon, Palette, Bell, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Label } from '@components/ui/label';
import { Switch } from "@components/ui/switch";
import { Separator } from "@components/ui/separator";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Navigation } from "@components/Navigation";

export default function SettingsPageWrapper() {
  const [currentPage, setCurrentPage] = useState("settings");

  const handleNavigate = (page: string) => {
    // In Next.js 13+, use router.push for navigation
    setCurrentPage(page);
    window.location.href = page === "wishlist" ? "/wishlist" : "/settings";
  };

  return (
    <>
      {/* Navbar only on wishlist and settings */}
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="w-8 h-8 text-purple-600" />
            <h1 className="text-purple-600">Settings</h1>
          </div>
          <p className="text-gray-600">
            Manage your preferences and account settings
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                <CardTitle>Profile</CardTitle>
              </div>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" placeholder="Enter your name" defaultValue="Guest User" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your.email@example.com" />
              </div>
              <Button>Save Profile</Button>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-600" />
                <CardTitle>Appearance</CardTitle>
              </div>
              <CardDescription>
                Customize how ØnskeTræet looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable dark theme for the application
                  </p>
                </div>
                <Switch id="dark-mode" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="compact-view">Compact View</Label>
                  <p className="text-sm text-muted-foreground">
                    Show more wishes in less space
                  </p>
                </div>
                <Switch id="compact-view" />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-purple-600" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about your wishlist via email
                  </p>
                </div>
                <Switch id="email-notifications" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="price-alerts">Price Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when items go on sale
                  </p>
                </div>
                <Switch id="price-alerts" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reminders">Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders about your high-priority wishes
                  </p>
                </div>
                <Switch id="reminders" />
              </div>
            </CardContent>
          </Card>

          {/* Data & Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>
                Manage your data and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Export Wishlist Data
              </Button>
              <Button variant="outline" className="w-full">
                Import Wishlist Data
              </Button>
              <Separator />
              <Button variant="destructive" className="w-full">
                Clear All Wishes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
