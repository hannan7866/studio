import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, List, Clock, PlusCircle, Activity } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - SkillSwap',
  description: 'Your SkillSwap dashboard.',
};

// Mock data - replace with actual data fetching
const currentUser = {
  name: 'Alex Doe',
  timeBalance: 12.5, // hours
  recentActivity: [
    { id: '1', text: 'Logged 2 hours for "Web Design Consultation"', date: '2 days ago' },
    { id: '2', text: 'Received 1 hour for "Spanish Tutoring"', date: '3 days ago' },
  ],
  pendingTasks: 0, // Example: number of open exchanges
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {currentUser.name}!
        </h1>
        <Button asChild>
          <Link href="/listings/create">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Listing
          </Link>
        </Button>
      </div>

      {/* Quick Stats Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Time Balance</CardTitle>
            <Clock className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{currentUser.timeBalance.toFixed(1)} hours</div>
            <p className="text-xs text-muted-foreground mt-1">
              Your available time credits.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <List className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div> {/* Replace with dynamic data */}
            <p className="text-xs text-muted-foreground mt-1">
              Skills you are offering or requesting.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Exchanges</CardTitle>
            <Activity className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currentUser.pendingTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Open skill exchanges requiring action.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Navigate to key areas of SkillSwap.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline" asChild className="h-auto py-4 flex flex-col items-center gap-2">
            <Link href="/profile" className="flex flex-col items-center text-center">
              <User className="h-8 w-8 mb-2 text-primary" />
              <span className="font-semibold">View Profile</span>
              <span className="text-xs text-muted-foreground">Update your skills & info</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-auto py-4 flex flex-col items-center gap-2">
            <Link href="/listings" className="flex flex-col items-center text-center">
              <List className="h-8 w-8 mb-2 text-primary" />
              <span className="font-semibold">Browse Listings</span>
              <span className="text-xs text-muted-foreground">Find skills or offer yours</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-auto py-4 flex flex-col items-center gap-2">
            <Link href="/timebank" className="flex flex-col items-center text-center">
              <Clock className="h-8 w-8 mb-2 text-primary" />
              <span className="font-semibold">Manage Time Bank</span>
              <span className="text-xs text-muted-foreground">Log hours & view balance</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-auto py-4 flex flex-col items-center gap-2">
            <Link href="/listings/create" className="flex flex-col items-center text-center">
              <PlusCircle className="h-8 w-8 mb-2 text-accent" />
              <span className="font-semibold text-accent">Post a New Skill</span>
              <span className="text-xs text-muted-foreground">Offer or request a skill</span>
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest time transactions and listing updates.</CardDescription>
        </CardHeader>
        <CardContent>
          {currentUser.recentActivity.length > 0 ? (
            <ul className="space-y-3">
              {currentUser.recentActivity.map((activity) => (
                <li key={activity.id} className="flex items-start space-x-3 p-3 rounded-md border hover:bg-secondary/50 transition-colors">
                  <Activity className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No recent activity to display.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
