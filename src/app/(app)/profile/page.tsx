"use client";

import { ProfileDisplay } from "@/components/profile/profile-display";
import type { UserProfile, Skill } from "@/types/skillswap";
import { useState, useEffect } from "react";
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";
import { type ProfileUpdateData } from "@/components/profile/edit-profile-form"; // Import the updated type
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import type { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";

// Mock user data serves as a fallback or initial structure.
const initialMockUser: UserProfile = {
  id: "loading...",
  name: "Loading...",
  email: "loading...",
  avatarUrl: "https://picsum.photos/seed/placeholder/200/200",
  coverPhotoUrl: "https://picsum.photos/seed/placeholder-cover/1200/400", // Added placeholder
  bio: "A passionate developer and lifelong learner. Interested in exchanging coding skills for music lessons.",
  skillsOffered: [
    { id: "skill1", name: "Web Development (React, Node.js)", category: "Technology" },
    { id: "skill2", name: "Project Management", category: "Business" },
  ],
  skillsWanted: [
    { id: "skill3", name: "Guitar Playing", category: "Music" },
    { id: "skill4", name: "Spanish Conversation", category: "Language" },
  ],
  timeAvailable: "5-10 hours/week",
  timeBalance: 15.5, // in hours
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      setLoading(true);
      if (fbUser) {
        // Fetch actual user profile data from your backend/Firestore here
        // For now, we merge Firebase Auth info with mock data structure
        // Replace mock data with actual fetched data when available
        const profileData: UserProfile = {
           ...initialMockUser, // Use mock as base
           id: fbUser.uid,
           name: fbUser.displayName || "SkillSwap User",
           email: fbUser.email || "No email provided",
           avatarUrl: fbUser.photoURL || `https://picsum.photos/seed/${fbUser.uid}/200/200`,
           // Fetch coverPhotoUrl from your database if available, otherwise use placeholder
           // coverPhotoUrl: fetchedCoverUrl || initialMockUser.coverPhotoUrl,
           // Fetch other fields like bio, skills, time from your database
           // bio: fetchedBio || initialMockUser.bio,
           // skillsOffered: fetchedSkillsOffered || initialMockUser.skillsOffered,
           // ... etc
           // Ensure required fields from UserProfile are present
           skillsOffered: initialMockUser.skillsOffered, // Keep mock until fetched
           skillsWanted: initialMockUser.skillsWanted,  // Keep mock until fetched
           timeBalance: initialMockUser.timeBalance,    // Keep mock until fetched
        };
        setCurrentUser(profileData);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleEdit = () => {
    if (currentUser) {
        setIsEditing(true);
    }
  };

  // Updated to handle ProfileUpdateData which includes optional files
  const handleSaveProfile = async (updatedData: ProfileUpdateData) => {
    if (!currentUser || !auth.currentUser) return;

    setLoading(true);
    console.log("Saving profile with data:", updatedData);

    // Prepare updates, separating files from text data
    const { avatarFile, coverFile, ...textProfileData } = updatedData;
    let newAvatarUrl = currentUser.avatarUrl;
    let newCoverUrl = currentUser.coverPhotoUrl;

    try {
        // --- Handle File Updates (Local Preview/Future Upload) ---
        if (avatarFile) {
            // For now: Generate local preview URL. Replace with upload logic later.
            newAvatarUrl = await readFileAsDataURL(avatarFile);
            console.log("Generated new avatar preview URL");
            // TODO: Upload avatarFile to Firebase Storage and get the actual URL
            // Example: newAvatarUrl = await uploadFile(avatarFile, `avatars/${currentUser.id}`);
             // TODO: Update Firebase Auth profile photoURL *after* successful upload
            // await updateProfile(auth.currentUser, { photoURL: newAvatarUrl });
        }
        if (coverFile) {
            // For now: Generate local preview URL. Replace with upload logic later.
            newCoverUrl = await readFileAsDataURL(coverFile);
            console.log("Generated new cover preview URL");
            // TODO: Upload coverFile to Firebase Storage and get the actual URL
            // Example: newCoverUrl = await uploadFile(coverFile, `covers/${currentUser.id}`);
            // TODO: Save newCoverUrl to your Firestore user profile document
        }

         // --- Handle Text Data Updates ---
         const authUpdates: { displayName?: string | null } = {};
          if (textProfileData.name && auth.currentUser.displayName !== textProfileData.name) {
              authUpdates.displayName = textProfileData.name;
              await updateProfile(auth.currentUser, authUpdates); // Update Auth display name
              console.log("Updated Firebase Auth display name");
          }

        // TODO: Update user profile data in your database (e.g., Firestore)
        // Combine textProfileData and the *final* newAvatarUrl/newCoverUrl from storage
        // Example: await updateUserProfileInFirestore(currentUser.id, { ...textProfileData, avatarUrl: finalAvatarUrl, coverPhotoUrl: finalCoverUrl });


        // --- Frontend State Update (Optimistic/Using Previews) ---
        setCurrentUser(prevUser => {
            if (!prevUser) return null;
            return {
                ...prevUser,
                ...textProfileData, // Update with text data (name, bio, skills strings etc.)
                skillsOffered: updatedData.skillsOffered || prevUser.skillsOffered, // Use the processed skill arrays
                skillsWanted: updatedData.skillsWanted || prevUser.skillsWanted,
                avatarUrl: newAvatarUrl, // Use the new URL (preview or final)
                coverPhotoUrl: newCoverUrl, // Use the new URL (preview or final)
            };
        });

        toast({
            title: "Profile Updated",
            description: "Your profile information has been successfully saved.",
        });
        setIsEditing(false); // Close dialog on successful save

    } catch (error) {
        console.error("Failed to save profile", error);
        toast({ title: "Error", description: "Failed to save profile. Check console for details.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
};

// Helper function to read file as Data URL for local preview
const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};


  const handleCloseDialog = () => {
    setIsEditing(false);
  };

  if (loading && !currentUser) { // Show skeleton only on initial load
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
        <Card className="overflow-hidden shadow-xl">
          <Skeleton className="h-48 md:h-64 w-full" />
          <CardContent className="relative pt-16 md:pt-12 p-6">
             <Skeleton className="absolute left-6 -top-12 md:-top-16 h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-background"/>
             <div className="ml-0 mt-12 md:mt-0 md:ml-40 space-y-2">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-16 w-full mt-4" />
             </div>
          </CardContent>
        </Card>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentUser) {
     return (
       <div className="container mx-auto py-12 text-center">
         <h1 className="text-2xl font-semibold">Profile Not Available</h1>
         <p className="text-muted-foreground mt-2">Please log in to view your profile.</p>
         <Button asChild className="mt-6">
           <a href="/login">Go to Login</a>
         </Button>
       </div>
     );
  }


  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
         <ProfileDisplay user={currentUser} onEdit={handleEdit} isCurrentUserProfile={true} />

      {isEditing && currentUser && (
        <EditProfileDialog
          user={currentUser}
          isOpen={isEditing}
          onClose={handleCloseDialog}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}
