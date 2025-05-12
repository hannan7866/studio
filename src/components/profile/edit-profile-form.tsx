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
import { Loader2, Upload } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Helper to generate simple unique IDs for new skills
const generateSkillId = () => `skill_${Math.random().toString(36).substr(2, 9)}`;

// Zod schema only handles text fields; files are handled separately
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  bio: z.string().max(500, { message: "Bio must not exceed 500 characters." }).optional().default(""),
  skillsOfferedStr: z.string().optional().default(""),
  skillsWantedStr: z.string().optional().default(""),
  timeAvailable: z.string().optional().default(""),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

// New type for the data passed to onSave, including optional files
export interface ProfileUpdateData extends ProfileFormValues {
  avatarFile?: File | null;
  coverFile?: File | null;
  // Keep original data structure for compatibility where needed
  skillsOffered?: Skill[];
  skillsWanted?: Skill[];
}


interface EditProfileFormProps {
  user: UserProfile;
  onSave: (data: ProfileUpdateData) => void; // Updated type
  onCancel: () => void;
  isSaving?: boolean;
}

export function EditProfileForm({ user, onSave, onCancel, isSaving }: EditProfileFormProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

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

  // Reset form and previews if the user prop changes
  useEffect(() => {
    form.reset({
      name: user.name || "",
      bio: user.bio || "",
      skillsOfferedStr: user.skillsOffered?.map(skill => skill.name).join(", ") || "",
      skillsWantedStr: user.skillsWanted?.map(skill => skill.name).join(", ") || "",
      timeAvailable: user.timeAvailable || "",
    });
    setAvatarPreview(null);
    setCoverPreview(null);
    setAvatarFile(null);
    setCoverFile(null);
  }, [user, form]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(values: ProfileFormValues) {
    const skillsOfferedArray: Skill[] = values.skillsOfferedStr
      ? values.skillsOfferedStr.split(",").map(name => name.trim()).filter(Boolean).map(name => ({ id: generateSkillId(), name }))
      : [];
    const skillsWantedArray: Skill[] = values.skillsWantedStr
      ? values.skillsWantedStr.split(",").map(name => name.trim()).filter(Boolean).map(name => ({ id: generateSkillId(), name }))
      : [];

    // Construct the data object including files
    const updatedProfileData: ProfileUpdateData = {
      ...values, // Includes name, bio, timeAvailable, skills strings
      skillsOffered: skillsOfferedArray, // Pass structured skills too
      skillsWanted: skillsWantedArray,
      avatarFile: avatarFile,
      coverFile: coverFile,
    };
    onSave(updatedProfileData);
  }

   const userInitials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : "??";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Cover Photo Input */}
         <FormItem>
            <FormLabel>Cover Photo</FormLabel>
             <div className="relative aspect-[3/1] w-full rounded-md overflow-hidden bg-secondary border border-dashed border-muted-foreground/50 flex items-center justify-center">
                <Image
                    src={coverPreview || user.coverPhotoUrl || `https://picsum.photos/seed/${user.id}-cover/600/200`}
                    alt="Cover photo preview"
                    layout="fill"
                    objectFit="cover"
                    className={coverPreview || user.coverPhotoUrl ? "" : "opacity-50"} // Dim placeholder
                 />
                 <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => coverInputRef.current?.click()}
                    className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background"
                    disabled={isSaving}
                >
                    <Upload className="mr-2 h-4 w-4" /> Change Cover
                </Button>
                 <Input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, setCoverPreview, setCoverFile)}
                    disabled={isSaving}
                 />
             </div>
         </FormItem>

        {/* Avatar Input */}
        <FormItem>
           <FormLabel>Profile Picture</FormLabel>
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border">
                    <AvatarImage src={avatarPreview || user.avatarUrl || `https://picsum.photos/seed/${user.id}/200/200`} alt="Avatar preview" />
                    <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
                </Avatar>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isSaving}
                >
                    <Upload className="mr-2 h-4 w-4" /> Upload Picture
                </Button>
                <Input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, setAvatarPreview, setAvatarFile)}
                    disabled={isSaving}
                 />
            </div>
        </FormItem>


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
              <FormLabel>Skills Offered (comma-separated)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., JavaScript, Graphic Design, Spanish Tutoring"
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
              <FormLabel>Skills Wanted (comma-separated)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Python, Public Speaking, Yoga"
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
