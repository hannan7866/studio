"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
// import { useRouter } from "next/navigation"; // For redirecting after submission

const listingFormSchema = z.object({
  type: z.enum(["offer", "request"], {
    required_error: "You need to select a listing type.",
  }),
  skillName: z.string().min(3, { message: "Skill name must be at least 3 characters." }),
  category: z.string().optional(),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(500, { message: "Description must not exceed 500 characters." }),
  tags: z.string().optional(), // Could be processed into an array
});

type ListingFormValues = z.infer<typeof listingFormSchema>;

export function CreateListingForm() {
  // const router = useRouter();
  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      type: "offer",
      skillName: "",
      category: "",
      description: "",
      tags: "",
    },
  });

  // TODO: Implement actual listing creation logic
  function onSubmit(values: ListingFormValues) {
    console.log("Listing submitted", values);
    // Example: const tagsArray = values.tags?.split(',').map(tag => tag.trim()).filter(tag => tag);
    // API call to create listing
    // router.push('/listings'); // Redirect to listings page
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <PlusCircle className="h-6 w-6 text-primary" /> Create New Skill Listing
        </CardTitle>
        <CardDescription>Share your skills or let the community know what you&apos;re looking for.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Listing Type*</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="offer" />
                        </FormControl>
                        <FormLabel className="font-normal">I&apos;m offering a skill</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="request" />
                        </FormControl>
                        <FormLabel className="font-normal">I&apos;m requesting a skill</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skillName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Web Design, Guitar Lessons, Spanish Tutoring" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Technology, Music, Language" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide details about the skill, your experience, or what you're looking for."
                      className="resize-y min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                   <p className="text-xs text-muted-foreground text-right">{field.value.length} / 500</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (Optional, comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., beginner, remote, project-based" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Listing
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
