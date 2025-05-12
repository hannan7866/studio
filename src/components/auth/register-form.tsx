"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { UserPlus, Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile, FirebaseError } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

const registerFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      // Set the user's display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: values.name,
        });
      }
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created.",
      });
      router.push('/dashboard'); // Redirect after successful registration
    } catch (error) {
      const firebaseError = error as FirebaseError;
      console.error("Registration error:", firebaseError);
      let errorMessage = "An unexpected error occurred during registration.";
      if (firebaseError.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered. Please login or use a different email.";
      } else if (firebaseError.code === "auth/invalid-email") {
        errorMessage = "The email address is not valid.";
      } else if (firebaseError.code === "auth/weak-password") {
        errorMessage = "The password is too weak. Please choose a stronger password.";
      } else if (firebaseError.code === "auth/configuration-not-found") {
        errorMessage = "Firebase authentication configuration not found. Please check your Firebase project setup.";
      }
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
        <CardDescription>Join SkillSwap to start exchanging skills and banking time.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} disabled={isLoading} suppressHydrationWarning />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} disabled={isLoading} suppressHydrationWarning />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} suppressHydrationWarning />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} suppressHydrationWarning />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading} suppressHydrationWarning>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              Register
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button variant="link" asChild className="p-0 h-auto text-primary">
            <Link href="/login">Login here</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
