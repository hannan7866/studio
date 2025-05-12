
"use client";

import { ProfileDisplay } from "@/components/profile/profile-display";
import type { UserProfile, Skill } from "@/types/skillswap";
import { useState, useEffect } from "react";
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import type { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // Added Card and CardContent import
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";

// Mock user data serves as a fallback or initial structure.
// Use explicit nulls for potentially missing data to differentiate from loading state
const initialMockUser: UserProfile = {
  id: "loading...",
  name: "Loading...",
  email: "loading...",
  avatarUrl: "https://picsum.photos/seed/placeholder/200/200",
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
  // Initialize with null to clearly distinguish between loading and no user data
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      setLoading(true); // Start loading when auth state changes
      if (fbUser) {
        // Fetch actual user profile data from your backend/Firestore here
        // For now, we merge Firebase Auth info with mock data structure
        // Replace mock data with actual fetched data when available
        const profileData: UserProfile = {
          // Spread initial mock data as a fallback for fields not in Firebase Auth
           ...initialMockUser,
           id: fbUser.uid,
           name: fbUser.displayName || "SkillSwap User", // Use a more descriptive default
           email: fbUser.email || "No email provided",
           // Prefer photoURL, then generate one, fallback to initialMockUser's
           avatarUrl: fbUser.photoURL || `https://picsum.photos/seed/${fbUser.uid}/200/200` || initialMockUser.avatarUrl,
           // Keep other mock fields until real data is fetched
           // bio: fetchedBio || initialMockUser.bio,
           // skillsOffered: fetchedSkillsOffered || initialMockUser.skillsOffered,
           // skillsWanted: fetchedSkillsWanted || initialMockUser.skillsWanted,
           // timeAvailable: fetchedTimeAvailable || initialMockUser.timeAvailable,
           // timeBalance: fetchedTimeBalance ?? initialMockUser.timeBalance, // Use nullish coalescing
        };
        setCurrentUser(profileData);
      } else {
        // User is logged out
        setCurrentUser(null);
        // Optionally redirect to login page:
        // router.push('/login');
      }
      setLoading(false); // Finish loading
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array means this runs once on mount


  const handleEdit = () => {
    if (currentUser) { // Only allow editing if user data is loaded
        setIsEditing(true);
    }
  };

  const handleSaveProfile = async (updatedProfileData: Partial<UserProfile>) => {
    if (!currentUser) return; // Should not happen if edit button is disabled when no user

    setLoading(true);
    console.log("Saving profile:", updatedProfileData);

    try {
        // --- Backend Update Logic ---
        // 1. Update Firebase Auth profile (if name/avatar changed)
        const authUpdates: { displayName?: string | null; photoURL?: string | null } = {};
        if (updatedProfileData.name && auth.currentUser && auth.currentUser.displayName !== updatedProfileData.name) {
            authUpdates.displayName = updatedProfileData.name;
        }
        if (updatedProfileData.avatarUrl && auth.currentUser && auth.currentUser.photoURL !== updatedProfileData.avatarUrl) {
            authUpdates.photoURL = updatedProfileData.avatarUrl;
        }
        // if (Object.keys(authUpdates).length > 0 && auth.currentUser) {
        //     await updateProfile(auth.currentUser, authUpdates);
        // }

        // 2. Update user profile data in your database (e.g., Firestore)
        // Example: await updateUserProfileInFirestore(currentUser.id, updatedProfileData);


        // --- Frontend State Update ---
        // Update local state optimistically or after confirming save
        setCurrentUser(prevUser => {
            if (!prevUser) return null; // Should not happen
            return {
                ...prevUser,
                ...updatedProfileData,
            };
        });

        toast({
            title: "Profile Updated",
            description: "Your profile information has been successfully saved.",
        });
        setIsEditing(false); // Close dialog on successful save

    } catch (error) {
        console.error("Failed to save profile", error);
        toast({ title: "Error", description: "Failed to save profile.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
};


  const handleCloseDialog = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
        {/* Use Card component here */}
        <Card className="overflow-hidden shadow-xl">
          <Skeleton className="h-48 md:h-64 w-full" />
          {/* Use CardContent here */}
          <CardContent className="relative pt-16 md:pt-12 p-6">
             <Skeleton className="absolute -bottom-12 left-6 h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-background"/>
             <div className="ml-32 md:ml-40 space-y-2">
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
        {/* Pass currentUser and handleEdit, only show edit if it's the current user's profile */}
         <ProfileDisplay user={currentUser} onEdit={handleEdit} isCurrentUserProfile={true} />

      {isEditing && currentUser && ( // Ensure currentUser exists before rendering Dialog
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
