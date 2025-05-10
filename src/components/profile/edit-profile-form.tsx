
"use client";

import type { UserProfile, Skill } from "@/types/skillswap";
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
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

// Helper to generate simple unique IDs for new skills
const generateSkillId = () => `skill_${Math.random().toString(36).substr(2, 9)}`;

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  bio: z.string().max(500, { message: "Bio must not exceed 500 characters." }).optional().default(""),
  // Store skills as comma-separated strings in the form for simplicity
  skillsOfferedStr: z.string().optional().default(""),
  skillsWantedStr: z.string().optional().default(""),
  timeAvailable: z.string().optional().default(""),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface EditProfileFormProps {
  user: UserProfile;
  onSave: (data: Partial<UserProfile>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export function EditProfileForm({ user, onSave, onCancel, isSaving }: EditProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || "",
      bio: user.bio || "",
      skillsOfferedStr: user.skillsOffered?.map(skill => skill.name).join(", ") || "",
      skillsWantedStr: user.skillsWanted?.map(skill => skill.name).join(", ") || "",
      timeAvailable: user.timeAvailable || "",
    },
  });

  useEffect(() => {
    form.reset({
      name: user.name || "",
      bio: user.bio || "",
      skillsOfferedStr: user.skillsOffered?.map(skill => skill.name).join(", ") || "",
      skillsWantedStr: user.skillsWanted?.map(skill => skill.name).join(", ") || "",
      timeAvailable: user.timeAvailable || "",
    });
  }, [user, form]);

  function onSubmit(values: ProfileFormValues) {
    const skillsOfferedArray: Skill[] = values.skillsOfferedStr
      ? values.skillsOfferedStr.split(",").map(name => name.trim()).filter(Boolean).map(name => ({ id: generateSkillId(), name }))
      : [];
    const skillsWantedArray: Skill[] = values.skillsWantedStr
      ? values.skillsWantedStr.split(",").map(name => name.trim()).filter(Boolean).map(name => ({ id: generateSkillId(), name }))
      : [];

    const updatedProfileData: Partial<UserProfile> = {
      name: values.name,
      bio: values.bio,
      skillsOffered: skillsOfferedArray,
      skillsWanted: skillsWantedArray,
      timeAvailable: values.timeAvailable,
    };
    onSave(updatedProfileData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} disabled={isSaving} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little about yourself..."
                  className="resize-y min-h-[100px]"
                  {...field}
                  disabled={isSaving}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="skillsOfferedStr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills Offered</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., JavaScript, Graphic Design, Spanish Tutoring (comma-separated)"
                  {...field}
                  disabled={isSaving}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="skillsWantedStr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills Wanted</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Python, Public Speaking, Yoga (comma-separated)"
                  {...field}
                  disabled={isSaving}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeAvailable"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Available</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 5-10 hours/week, Evenings" {...field} disabled={isSaving} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
