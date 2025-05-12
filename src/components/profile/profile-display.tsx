"use client";

import type { UserProfile as UserProfileType, Skill } from "@/types/skillswap";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit3, Clock, Star, Search, Mail, CalendarDays } from "lucide-react";
import Image from "next/image";

interface ProfileDisplayProps {
  user: UserProfileType;
  onEdit?: () => void; // Callback to handle edit action, make optional if used in public views
  isCurrentUserProfile?: boolean; // To conditionally show edit button
}

// Default user structure if none is provided (e.g., public profile view of a non-existent user)
const defaultUser: UserProfileType = {
  id: "unknown",
  name: "User Not Found",
  email: "N/A",
  avatarUrl: "https://picsum.photos/seed/default/200/200",
  bio: "This user profile could not be loaded.",
  skillsOffered: [],
  skillsWanted: [],
  timeAvailable: "N/A",
  timeBalance: 0,
};


function SkillPill({ skill }: { skill: Skill }) {
  return (
    <Badge variant="secondary" className="text-sm py-1 px-3 shadow-sm">
      {skill.name}
      {skill.category && <span className="ml-1.5 text-xs opacity-70">({skill.category})</span>}
    </Badge>
  );
}

export function ProfileDisplay({ user = defaultUser, onEdit, isCurrentUserProfile = true }: ProfileDisplayProps) {
  const profileUser = user || defaultUser; // Ensure user is never null/undefined
  const userInitials = profileUser.name && profileUser.name !== "Loading..." && profileUser.name !== "User Not Found" 
    ? profileUser.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() 
    : "??";

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden shadow-xl">
        <div className="relative h-48 md:h-64 w-full">
          <Image 
            src={profileUser.id === "loading..." ? "https://picsum.photos/1200/400?grayscale" : `https://picsum.photos/seed/${profileUser.id}-bg/1200/400`}
            alt="Profile background" 
            layout="fill" 
            objectFit="cover"
            data-ai-hint="abstract background"
            priority={true} // Prioritize banner image
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg">
              <AvatarImage src={profileUser.avatarUrl} alt={profileUser.name} data-ai-hint="profile picture" />
              <AvatarFallback className="text-4xl">{userInitials}</AvatarFallback>
            </Avatar>
          </div>
           {isCurrentUserProfile && onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onEdit} 
              className="absolute top-4 right-4 bg-background/80 hover:bg-background"
              disabled={profileUser.id === "loading..."}
            >
              <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
           )}
        </div>
        
        <CardContent className="pt-20 md:pt-16 p-6">
          <h1 className="text-3xl font-bold text-foreground">{profileUser.name}</h1>
          <p className="text-primary flex items-center gap-2 mt-1">
            <Mail className="h-4 w-4" /> {profileUser.email}
          </p>
          {profileUser.bio && (
            <p className="mt-4 text-muted-foreground leading-relaxed">{profileUser.bio}</p>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><Star className="text-accent h-6 w-6" /> Skills Offered</CardTitle>
            <CardDescription>Expertise {profileUser.name === "Loading..." ? "this user" : profileUser.name.split(' ')[0]} is willing to share.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {profileUser.skillsOffered && profileUser.skillsOffered.length > 0 ? (
              profileUser.skillsOffered.map(skill => <SkillPill key={skill.id} skill={skill} />)
            ) : (
              <p className="text-muted-foreground">No skills offered yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><Search className="text-primary h-6 w-6" /> Skills Wanted</CardTitle>
            <CardDescription>Areas where {profileUser.name === "Loading..." ? "this user" : profileUser.name.split(' ')[0]} is looking to learn.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {profileUser.skillsWanted && profileUser.skillsWanted.length > 0 ? (
              profileUser.skillsWanted.map(skill => <SkillPill key={skill.id} skill={skill} />)
            ) : (
              <p className="text-muted-foreground">No skills wanted at the moment.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl"><Clock className="text-primary h-6 w-6" /> Time Bank & Availability</CardTitle>
          <CardDescription>{profileUser.name === "Loading..." ? "This user's" : `${profileUser.name.split(' ')[0]}'s`} current time balance and weekly availability.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Time Balance</p>
                    <p className="text-2xl font-bold text-primary">{profileUser.timeBalance?.toFixed(1)} hours</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
            </div>
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Weekly Availability</p>
                    <p className="text-2xl font-bold">{profileUser.timeAvailable || "Not specified"}</p>
                </div>
                <CalendarDays className="h-8 w-8 text-muted-foreground" />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
