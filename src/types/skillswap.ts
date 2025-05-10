export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  timeAvailable?: string; // e.g., "5 hours/week"
  timeBalance: number; // in minutes or hours
}

export interface Skill {
  id: string;
  name: string;
  category?: string;
}

export interface Listing {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  type: "offer" | "request";
  skill: Skill;
  description: string;
  tags?: string[];
  createdAt: Date;
  status: "open" | "closed" | "in_progress";
}

export interface TimeLog {
  id: string;
  fromUserId: string;
  toUserId: string;
  skillId: string;
  skillName: string;
  hours: number;
  description?: string;
  date: Date;
  type: "credit" | "debit"; // From the perspective of the system or current user
}

export interface TimeTransaction {
  id: string;
  userName: string; // Person you exchanged with
  skillName: string;
  hours: number;
  date: string; // Formatted date string
  type: "credited" | "spent";
  description?: string;
}
