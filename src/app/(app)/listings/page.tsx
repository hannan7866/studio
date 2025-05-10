import type { Metadata } from 'next';
import { ListingCard } from "@/components/listings/listing-card";
import type { Listing } from "@/types/skillswap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { PlusCircle, Search, Filter } from "lucide-react";

export const metadata: Metadata = {
  title: 'Skill Listings - SkillSwap',
  description: 'Browse and find skill offers and requests.',
};

// Mock data - replace with actual data fetching
const mockListings: Listing[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Alice Wonderland",
    userAvatarUrl: "https://picsum.photos/seed/alice/50/50",
    type: "offer",
    skill: { id: "s1", name: "Advanced JavaScript Tutoring", category: "Tech" },
    description: "Offering in-depth JavaScript tutoring, covering ES6+, async/await, and functional programming concepts. Suitable for intermediate to advanced learners.",
    tags: ["JavaScript", "Tutoring", "Web Development", "ES6"],
    createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    status: "open",
  },
  {
    id: "2",
    userId: "user2",
    userName: "Bob The Builder",
    userAvatarUrl: "https://picsum.photos/seed/bob/50/50",
    type: "request",
    skill: { id: "s2", name: "Graphic Design for Logo", category: "Design" },
    description: "Looking for a skilled graphic designer to create a modern logo for my new startup. Need someone proficient in Adobe Illustrator or Figma.",
    tags: ["Graphic Design", "Logo", "Branding"],
    createdAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
    status: "open",
  },
  {
    id: "3",
    userId: "user3",
    userName: "Charlie Brown",
    userAvatarUrl: "https://picsum.photos/seed/charlie/50/50",
    type: "offer",
    skill: { id: "s3", name: "Spanish Conversation Practice", category: "Language" },
    description: "Native Spanish speaker offering conversation practice. Let's chat about various topics to improve your fluency and confidence!",
    tags: ["Spanish", "Language Exchange", "Conversation"],
    createdAt: new Date(Date.now() - 86400000 * 1), // 1 day ago
    status: "open",
  },
    {
    id: "4",
    userId: "user4",
    userName: "Diana Prince",
    userAvatarUrl: "https://picsum.photos/seed/diana/50/50",
    type: "request",
    skill: { id: "s4", name: "Yoga Instructor for Beginners", category: "Wellness" },
    description: "Seeking a patient yoga instructor for weekly beginner sessions. Focus on basic poses, breathing techniques, and mindfulness.",
    tags: ["Yoga", "Wellness", "Fitness", "Beginner"],
    createdAt: new Date(Date.now() - 86400000 * 10), // 10 days ago
    status: "open",
  },
];

export default function ListingsPage() {
  // TODO: Implement filtering and sorting logic
  const listings = mockListings;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Skill Listings</h1>
            <p className="text-muted-foreground">Discover skills offered and requested by the community.</p>
        </div>
        <Button asChild>
          <Link href="/listings/create">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Listing
          </Link>
        </Button>
      </div>

      {/* Filters and Search Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end p-4 bg-secondary/30 rounded-lg shadow">
        <div className="md:col-span-2 lg:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-muted-foreground mb-1">Search by keyword</label>
          <div className="relative">
            <Input id="search" placeholder="e.g., 'Python', 'Graphic Design'" className="pr-10" />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-muted-foreground mb-1">Type</label>
          <Select defaultValue="all">
            <SelectTrigger id="type">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="offer">Offers</SelectItem>
              <SelectItem value="request">Requests</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-muted-foreground mb-1">Sort by</label>
          <Select defaultValue="recent">
            <SelectTrigger id="sort">
              <SelectValue placeholder="Most Recent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              {/* Add more sort options if needed */}
            </SelectContent>
          </Select>
        </div>
         {/* <Button variant="outline" className="md:col-start-3 lg:col-start-auto">
            <Filter className="mr-2 h-4 w-4" /> Advanced Filters
        </Button> */}
      </div>

      {/* Listings Grid */}
      {listings.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <List className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-xl font-semibold">No listings found</h3>
          <p className="mt-1 text-muted-foreground">
            Try adjusting your filters or check back later.
          </p>
          <Button asChild className="mt-6">
            <Link href="/listings/create">Create a Listing</Link>
          </Button>
        </div>
      )}
      
      {/* TODO: Add pagination if many listings */}
    </div>
  );
}
