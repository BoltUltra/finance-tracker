"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import { updateUserProfile } from "@/services/userService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EditProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDrawer({
  open,
  onOpenChange,
}: EditProfileDrawerProps) {
  const { user } = useAuth();
  const { userData } = useUserData();

  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setDisplayName(userData?.displayName || user?.displayName || "");
    }
  }, [open, userData, user]);

  const handleSave = async () => {
    if (!user) return;
    if (!displayName.trim()) {
      toast.error("Display name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile(user.uid, {
        displayName,
        // photoURL is not editable here anymore
      });
      toast.success("Profile updated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Edit Profile</DrawerTitle>
          </DrawerHeader>

          <div className="p-4 space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src={userData?.photoURL || user?.photoURL || ""} />
                <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-600">
                  {getInitials(displayName || "User")}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm text-gray-500">
                Profile picture editing is disabled.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
            </div>
          </div>

          <DrawerFooter>
            <Button
              onClick={handleSave}
              disabled={loading || !displayName.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
