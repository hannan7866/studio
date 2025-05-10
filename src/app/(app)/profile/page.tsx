
"use client"; 

import { ProfileDisplay } from "@/components/profile/profile-display";
import type { UserProfile, Skill } from "@/types/skillswap";
import { useState, useEffect } from "react";
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";
import { useToast } from "@/hooks/use-toast";

// Mock user data for now. In a real app, this would be fetched.
const initialMockUser: UserProfile = {
  id: "123",
  name: "Alex Johnson",
  email: "alex.johnson@example.com", // Email is typically part of auth, not directly editable here
  avatarUrl: "https://picsum.photos/seed/user123/200/200",
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
  const { toast } = useToast();

  // In a real app, fetch user data here using useEffect
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     // Replace with your actual data fetching logic
  //     // const userData = await getUserProfileFromAPI(auth.currentUser.uid);
  //     // if (userData) setCurrentUser(userData);
  //   };
  //   fetchUserData();
  // }, []);


  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async (updatedProfileData: Partial<UserProfile>) => {
    // In a real app, this would involve an API call to save data to Firebase/backend
    console.log("Saving profile:", updatedProfileData);
    
    // Create a new user object with updated fields
    // This carefully merges, especially skills arrays
    const updatedUser = {
      ...currentUser,
      ...updatedProfileData,
      // Ensure skillsOffered and skillsWanted are properly updated if they exist in updatedProfileData
      skillsOffered: updatedProfileData.skillsOffered ? updatedProfileData.skillsOffered : currentUser.skillsOffered,
      skillsWanted: updatedProfileData.skillsWanted ? updatedProfileData.skillsWanted : currentUser.skillsWanted,
    };

    setCurrentUser(updatedUser);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully saved.",
    });
    // Example API call:
    // try {
    //   await saveUserProfileToAPI(currentUser.id, updatedUser);
    //   setCurrentUser(updatedUser);
    //   setIsEditing(false);
    //   toast({ title: "Profile Updated", description: "Your changes have been saved." });
    // } catch (error) {
    //   console.error("Failed to save profile", error);
    //   toast({ title: "Error", description: "Failed to save profile.", variant: "destructive" });
    // }
  };

  const handleCloseDialog = () => {
    setIsEditing(false);
  };

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
