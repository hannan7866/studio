
"use client";

import type { UserProfile } from "@/types/skillswap";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter, // Import if needed for custom footer buttons, but form has its own
} from "@/components/ui/dialog";
import { EditProfileForm } from "./edit-profile-form";
import { useState } from "react";

interface EditProfileDialogProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<UserProfile>) => Promise<void>;
}

export function EditProfileDialog({ user, isOpen, onClose, onSave }: EditProfileDialogProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleFormSave = async (data: Partial<UserProfile>) => {
    setIsSaving(true);
    try {
      await onSave(data);
      // onClose(); // Usually onSave in parent will handle closing
    } catch (error) {
      console.error("Error saving profile:", error);
      // Potentially show an error message within the dialog or via toast
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
            Make changes to your profile information. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <EditProfileForm 
            user={user} 
            onSave={handleFormSave} 
            onCancel={onClose}
            isSaving={isSaving}
          />
        </div>
        {/* Footer can be part of the form itself for better control over submit/cancel buttons */}
      </DialogContent>
    </Dialog>
  );
}
