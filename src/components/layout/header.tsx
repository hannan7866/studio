"use client";

import Link from "next/link";
import { Zap, LayoutDashboard, User, List, Clock, LogOut, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import React, { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, type User as FirebaseUser } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/listings", label: "Listings", icon: List },
  { href: "/timebank", label: "Time Bank", icon: Clock },
];

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push("/"); // Redirect to landing page after logout
    } catch (error) {
      console.error("Logout error:", error);
      toast({ title: "Logout Failed", description: "Could not log you out. Please try again.", variant: "destructive" });
    }
  };

  const NavLink = ({ href, label, icon: Icon }: typeof navItems[0]) => (
    <Button
      variant="ghost"
      asChild
      className={cn(
        "justify-start text-base font-medium",
        pathname === href ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
      )}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <Link href={href} className="flex items-center gap-2">
        <Icon className="h-5 w-5" />
        {label}
      </Link>
    </Button>
  );

  const userInitial = authUser?.displayName ? authUser.displayName.substring(0, 1).toUpperCase() : (authUser?.email ? authUser.email.substring(0,1).toUpperCase() : "U");

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
           <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">SkillSwap</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className={cn(
                  pathname === item.href
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-primary",
                  "px-3 py-2"
                )}
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          {loadingAuth ? (
             <Avatar className="h-9 w-9">
                <AvatarFallback>...</AvatarFallback>
             </Avatar>
          ) : authUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={authUser.photoURL || `https://picsum.photos/seed/${authUser.uid}/50/50`} alt={authUser.displayName || "User Avatar"} data-ai-hint="user avatar"/>
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{authUser.displayName || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {authUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                     <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Button asChild size="sm">
                <Link href="/login">Login</Link>
            </Button>
          )}
          
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-0">
                <div className="p-4">
                  <Link href="/dashboard" className="flex items-center space-x-2 mb-6" onClick={() => setIsMobileMenuOpen(false)}>
                    <Zap className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg">SkillSwap</span>
                  </Link>
                </div>
                <nav className="flex flex-col space-y-2 px-4">
                  {navItems.map((item) => (
                    <NavLink key={item.href} {...item} />
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
