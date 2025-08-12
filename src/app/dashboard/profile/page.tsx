"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { User, Mail, Calendar, CreditCard, Settings, Save } from "lucide-react";

interface Profile {
  id: string;
  clerk_user_id: string;
  email: string;
  name: string | null;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export default function ProfilePage() {
  const { user } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingBilling, setIsLoadingBilling] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData({
          name: data.name || "",
          email: data.email || ""
        });
      } else {
        toast.error("Failed to load profile");
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setEditMode(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleManageBilling = async () => {
    setIsLoadingBilling(true);
    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        toast.error('Failed to access billing portal');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoadingBilling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground">Unable to load your profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
          >
            <Settings className="h-4 w-4" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Your account details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {editMode ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-95 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setFormData({
                        name: profile.name || "",
                        email: profile.email || ""
                      });
                    }}
                    className="px-4 py-2 border rounded-md hover:bg-muted"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{profile.name || "Not set"}</div>
                    <div className="text-sm text-muted-foreground">Full name</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{profile.email}</div>
                    <div className="text-sm text-muted-foreground">Email address</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Member since</div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Billing Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Billing & Subscription
            </CardTitle>
            <CardDescription>
              Manage your subscription and billing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <div className="font-medium">Active Account</div>
                <div className="text-sm text-muted-foreground">
                  {profile.stripe_customer_id ? "Connected to Stripe" : "No billing account"}
                </div>
              </div>
            </div>
            
            {profile.stripe_customer_id ? (
              <button
                onClick={handleManageBilling}
                disabled={isLoadingBilling}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-95 disabled:opacity-50"
              >
                <CreditCard className="h-4 w-4" />
                {isLoadingBilling ? "Loading..." : "Manage Billing"}
              </button>
            ) : (
              <div className="text-center p-4 border rounded-md">
                <p className="text-sm text-muted-foreground mb-2">
                  No billing account found
                </p>
                <a
                  href="/pricing"
                  className="text-sm text-primary hover:underline"
                >
                  View pricing plans →
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Account Statistics */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
          <CardDescription>
            Your usage and activity summary
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground">Assessments</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground">Essays</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground">Coach Messages</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 