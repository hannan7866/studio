import type { Listing } from "@/types/skillswap";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, User, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant={listing.type === "offer" ? "default" : "accent"} className="mb-2 capitalize">
              {listing.type === "offer" ? "Offering" : "Requesting"}
            </Badge>
            <CardTitle className="text-xl font-semibold leading-tight hover:text-primary transition-colors">
              <Link href={`/listings/${listing.id}`}>{listing.skill.name}</Link>
            </CardTitle>
          </div>
          {listing.skill.category && (
            <Badge variant="outline" className="ml-2 shrink-0">{listing.skill.category}</Badge>
          )}
        </div>
         <CardDescription className="mt-1 text-sm line-clamp-3 h-[3.75rem]"> {/*Approx 3 lines */}
            {listing.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 pt-0">
        {listing.tags && listing.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {listing.tags.slice(0, 3).map((tag) => ( // Show up to 3 tags
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 flex flex-col items-start space-y-3">
        <div className="flex items-center space-x-3 w-full">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={listing.userAvatarUrl || `https://picsum.photos/seed/${listing.userId}/50/50`} alt={listing.userName} data-ai-hint="user avatar" />
            <AvatarFallback>{listing.userName.substring(0,1)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground">{listing.userName}</p>
            <p className="text-xs text-muted-foreground">
              Posted {formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <Button variant="outline" asChild className="w-full mt-2">
          <Link href={`/listings/${listing.id}`} className="flex items-center justify-center">
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
