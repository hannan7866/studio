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
  onEdit: () => void; // Callback to handle edit action
}

// Mock data for skills as it's not part of UserProfileType directly but often shown
const mockUser: UserProfileType = {
  id: "1",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  avatarUrl: "https://picsum.photos/seed/alex/200/200",
  bio: "Passionate lifelong learner and full-stack developer. Eager to share knowledge in web technologies and learn creative arts like pottery and music production.",
  skillsOffered: [
    { id: "s1", name: "React Development", category: "Tech" },
    { id: "s2", name: "Node.js Backend", category: "Tech" },
    { id: "s3", name: "Guitar Lessons (Beginner)", category: "Music" },
  ],
  skillsWanted: [
    { id: "s4", name: "Pottery", category: "Arts" },
    { id: "s5", name: "Digital Marketing", category: "Business" },
  ],
  timeAvailable: "10 hours/week",
  timeBalance: 25.5,
};


function SkillPill({ skill }: { skill: Skill }) {
  return (
    <Badge variant="secondary" className="text-sm py-1 px-3 shadow-sm">
      {skill.name}
      {skill.category && <span className="ml-1.5 text-xs opacity-70">({skill.category})</span>}
    </Badge>
  );
}

export function ProfileDisplay({ user = mockUser, onEdit }: ProfileDisplayProps) {
  return (
    <div className="space-y-8">
      <Card className="overflow-hidden shadow-xl">
        <div className="relative h-48 md:h-64 w-full">
          <Image 
            src="https://picsum.photos/seed/profilebg/1200/400" 
            alt="Profile background" 
            layout="fill" 
            objectFit="cover"
            data-ai-hint="abstract background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg">
              <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile picture" />
              <AvatarFallback className="text-4xl">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
           <Button 
            variant="outline" 
            size="sm" 
            onClick={onEdit} 
            className="absolute top-4 right-4 bg-background/80 hover:bg-background"
          >
            <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </div>
        
        <CardContent className="pt-20 md:pt-16 p-6">
          <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
          <p className="text-primary flex items-center gap-2 mt-1">
            <Mail className="h-4 w-4" /> {user.email}
          </p>
          {user.bio && (
            <p className="mt-4 text-muted-foreground leading-relaxed">{user.bio}</p>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><Star className="text-accent h-6 w-6" /> Skills Offered</CardTitle>
            <CardDescription>Expertise Alex is willing to share with the community.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {user.skillsOffered.length > 0 ? (
              user.skillsOffered.map(skill => <SkillPill key={skill.id} skill={skill} />)
            ) : (
              <p className="text-muted-foreground">No skills offered yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><Search className="text-primary h-6 w-6" /> Skills Wanted</CardTitle>
            <CardDescription>Areas where Alex is looking to learn and grow.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {user.skillsWanted.length > 0 ? (
              user.skillsWanted.map(skill => <SkillPill key={skill.id} skill={skill} />)
            ) : (
              <p className="text-muted-foreground">No skills wanted at the moment.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl"><Clock className="text-primary h-6 w-6" /> Time Bank & Availability</CardTitle>
          <CardDescription>Alex&apos;s current time balance and weekly availability.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Time Balance</p>
                    <p className="text-2xl font-bold text-primary">{user.timeBalance.toFixed(1)} hours</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
            </div>
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Weekly Availability</p>
                    <p className="text-2xl font-bold">{user.timeAvailable || "Not specified"}</p>
                </div>
                <CalendarDays className="h-8 w-8 text-muted-foreground" />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
