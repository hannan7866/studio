"use client";

import type { UserProfile } from "@/types/skillswap";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  // DialogFooter is not used as the form handles buttons
} from "@/components/ui/dialog";
import { EditProfileForm, type ProfileUpdateData } from "./edit-profile-form"; // Import ProfileUpdateData
import { useState } from "react";

interface EditProfileDialogProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProfileUpdateData) => Promise<void>; // Updated type to ProfileUpdateData
}

export function EditProfileDialog({ user, isOpen, onClose, onSave }: EditProfileDialogProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleFormSave = async (data: ProfileUpdateData) => { // Use ProfileUpdateData
    setIsSaving(true);
    try {
      await onSave(data);
      // Parent component (ProfilePage) is responsible for closing the dialog on successful save
    } catch (error) {
      console.error("Error saving profile:", error);
      // Consider adding a toast message here for save errors
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Your Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile information, including photos. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 max-h-[70vh] overflow-y-auto pr-2"> {/* Added scroll for long forms */}
          <EditProfileForm
            user={user}
            onSave={handleFormSave}
            onCancel={onClose}
            isSaving={isSaving}
          />
        </div>
        {/* Footer is now part of the EditProfileForm */}
      </DialogContent>
    </Dialog>
  );
}
