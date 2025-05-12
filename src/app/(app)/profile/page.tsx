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
import type { Metadata } from 'next';

// This component is client-side, so metadata should be in layout or handled differently.
// For now, we'll remove the static export here as it's a client component.
// export const metadata: Metadata = {
//   title: 'My Profile - SkillSwap',
//   description: 'View and manage your SkillSwap profile.',
// };


// Mock user data serves as a fallback or initial structure.
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
  const [currentUser, setCurrentUser] = useState<UserProfile>(initialMockUser);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        setCurrentUser(prevUser => ({
          ...initialMockUser, // Start with the mock structure for bio, skills etc.
          ...prevUser,        // Overlay any existing state (e.g. from edits not yet saved to db)
          id: fbUser.uid,
          name: fbUser.displayName || "User", // Fallback if displayName is not set
          email: fbUser.email || "No email provided",
          avatarUrl: fbUser.photoURL || prevUser.avatarUrl || `https://picsum.photos/seed/${fbUser.uid}/200/200`,
        }));
      } else {
        // Handle user not logged in - redirect or show message
        // For now, we'll keep the initialMockUser or a 'logged out' state
        setCurrentUser(initialMockUser); // Or redirect to login
        // router.push('/login'); 
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async (updatedProfileData: Partial<UserProfile>) => {
    setLoading(true);
    // In a real app, this would involve an API call to save data to Firebase/backend
    // For example, updating Firestore and Firebase Auth profile
    console.log("Saving profile:", updatedProfileData);
    
    try {
      // Example: Update Firebase Auth display name if changed
      if (updatedProfileData.name && auth.currentUser && auth.currentUser.displayName !== updatedProfileData.name) {
        // await updateProfile(auth.currentUser, { displayName: updatedProfileData.name });
      }
      // Example: Update avatar URL if changed
      if (updatedProfileData.avatarUrl && auth.currentUser && auth.currentUser.photoURL !== updatedProfileData.avatarUrl) {
         // await updateProfile(auth.currentUser, { photoURL: updatedProfileData.avatarUrl });
      }

      // Simulate API call & update local state
      // In a real app: await saveUserProfileToAPI(currentUser.id, updatedProfileData);
      
      setCurrentUser(prevUser => ({
        ...prevUser,
        ...updatedProfileData,
      }));
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully saved.",
      });
    } catch (error) {
      console.error("Failed to save profile", error);
      toast({ title: "Error", description: "Failed to save profile.", variant: "destructive" });
    } finally {
      setIsEditing(false);
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
        <Card className="overflow-hidden shadow-xl">
          <Skeleton className="h-48 md:h-64 w-full" />
          <CardContent className="pt-20 md:pt-16 p-6 space-y-2">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-16 w-full mt-4" />
          </CardContent>
        </Card>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-24" /> <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-24" /> <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <ProfileDisplay user={currentUser} onEdit={handleEdit} />
      
      {isEditing && (
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
