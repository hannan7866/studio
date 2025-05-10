"use client"; // Required if we have client-side interactions like onEdit

import { ProfileDisplay } from "@/components/profile/profile-display";
// import type { UserProfile } from "@/types/skillswap"; // If fetching data
import { useState } from "react";
// import { EditProfileDialog } from "@/components/profile/edit-profile-dialog"; // Assuming this component exists

// Mock user data for now. In a real app, this would be fetched.
const mockUser = {
  id: "123",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
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
  // const [currentUser, setCurrentUser] = useState<UserProfile>(mockUser);

  // TODO: Fetch user data here
  // For now, we use mockUser

  const handleEdit = () => {
    setIsEditing(true);
    console.log("Edit profile clicked");
    // In a real app, you might open a dialog:
    // showDialog(<EditProfileDialog user={currentUser} onSave={handleSaveProfile} />);
  };

  // const handleSaveProfile = (updatedUser: UserProfile) => {
  //   setCurrentUser(updatedUser);
  //   setIsEditing(false);
  //   // TODO: API call to save profile
  // };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {/*
      This would be Next.js metadata API for App router if this were a server component.
      <Head>
        <title>{mockUser.name}&apos;s Profile - SkillSwap</title>
        <meta name="description" content={`View the profile of ${mockUser.name} on SkillSwap.`} />
      </Head>
      */}
      <ProfileDisplay user={mockUser} onEdit={handleEdit} />
      {/* 
      {isEditing && (
        <EditProfileDialog 
          user={currentUser} 
          onSave={handleSaveProfile} 
          onClose={() => setIsEditing(false)} 
        />
      )}
      */}
    </div>
  );
}

// Metadata for App Router needs to be defined in a server component parent or layout.
// For example, in src/app/(app)/profile/layout.tsx or src/app/(app)/layout.tsx
// export const metadata = {
//   title: 'My Profile - SkillSwap',
//   description: 'View and manage your SkillSwap profile.',
// };
