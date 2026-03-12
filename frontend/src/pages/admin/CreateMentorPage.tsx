import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMentor } from "@/lib/api";
import { toast } from "@/components/hooks/use-toast";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2, UserPlus, Eye, EyeOff } from "lucide-react";

const mentorSchema = z.object({
    mentorId: z.string(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Must be a valid email address"),
    phoneNumber: z.string(),
    title: z.string(),
    profession: z.string(),
    company: z.string(),
    experienceYears: z.coerce
        .number()
        .min(0, "Must be 0 or more")
        .max(50, "Must be 50 or less"),
    bio: z
        .string()
        .max(500, "Bio must not exceed 500 characters"),
    profileImageUrl: z.string(),
    isCertified: z.boolean(),
    startYear: z.string(),
});

type MentorFormValues = z.infer<typeof mentorSchema>;

export default function CreateMentorPage() {
    const { getToken } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const form = useForm<MentorFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(mentorSchema) as any,

        defaultValues: {
            mentorId: "",
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            title: "",
            profession: "",
            company: "",
            experienceYears: 0,
            bio: "",
            profileImageUrl: "",
            isCertified: false,
            startYear: "",
        },
    });

    const watchedValues = form.watch();

    async function onSubmit(values: MentorFormValues) {
        setSubmitting(true);
        try {
            const token = await getToken({ template: "skill-mentor" });
            if (!token) throw new Error("Not authenticated");

            await createMentor(token, {
                mentorId: values.mentorId || undefined,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phoneNumber: values.phoneNumber || undefined,
                title: values.title || undefined,
                profession: values.profession || undefined,
                company: values.company || undefined,
                experienceYears: values.experienceYears,
                bio: values.bio || undefined,
                profileImageUrl: values.profileImageUrl || undefined,
                isCertified: values.isCertified || false,
                startYear: values.startYear || undefined,
            });

            toast({
                title: "Mentor Created! ✅",
                description: `${values.firstName} ${values.lastName} has been added as a mentor.`,
            });

            form.reset();
            setShowPreview(false);
        } catch (err) {
            console.error("Failed to create mentor", err);
            toast({
                title: "Error",
                description:
                    err instanceof Error ? err.message : "Failed to create mentor.",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Form Card */}
            <Card className="border shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-10 rounded-lg bg-violet-100 text-violet-700">
                                <UserPlus className="size-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Create New Mentor</CardTitle>
                                <CardDescription>
                                    Add a mentor with their complete profile details.
                                </CardDescription>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowPreview(!showPreview)}
                            className="gap-1.5"
                        >
                            {showPreview ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                            {showPreview ? "Hide" : "Show"} Preview
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Identity Section */}
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                                    Identity
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="mentorId"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel>Mentor ID</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder=" "
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First Name *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Name *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Doe" {...field} />
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
                                                <FormLabel>Email *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="john@example.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+1 234 567 8900" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Professional Section */}
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                                    Professional Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Senior Software Engineer"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="profession"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Profession</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Software Engineering"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="company"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Company</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Google" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="experienceYears"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Experience (Years)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        max={50}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="startYear"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Start Year</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="2020"
                                                        maxLength={4}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="isCertified"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center gap-3 rounded-md border p-3 mt-auto">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel className="!mt-0 cursor-pointer">
                                                    Certified Mentor
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Bio & Image Section */}
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                                    Profile
                                </h3>
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="bio"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Bio{" "}
                                                    <span className="text-muted-foreground font-normal">
                                                        ({(field.value || "").length}/500)
                                                    </span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Tell students about this mentor's expertise and teaching style..."
                                                        className="min-h-[120px] resize-none"
                                                        maxLength={500}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="profileImageUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Profile Image URL</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="https://example.com/photo.jpg"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Mentor...
                                    </>
                                ) : (
                                    "Create Mentor"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Preview Card */}
            {showPreview && (
                <Card className="border shadow-sm overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">
                            Mentor Card Preview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-violet-50 to-blue-50 border">
                            <div className="shrink-0">
                                {watchedValues.profileImageUrl ? (
                                    <img
                                        src={watchedValues.profileImageUrl}
                                        alt="Profile"
                                        className="size-20 rounded-full object-cover object-top border-2 border-white shadow-sm"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <div className="size-20 rounded-full bg-violet-200 flex items-center justify-center text-violet-700 text-2xl font-bold border-2 border-white shadow-sm">
                                        {(watchedValues.firstName?.[0] || "?").toUpperCase()}
                                        {(watchedValues.lastName?.[0] || "").toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {watchedValues.firstName || "First"}{" "}
                                        {watchedValues.lastName || "Last"}
                                    </h3>
                                    {watchedValues.isCertified && (
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                                            Certified
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600">
                                    {watchedValues.title || "Title"}{" "}
                                    {watchedValues.company ? `at ${watchedValues.company}` : ""}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {watchedValues.profession || "Profession"} •{" "}
                                    {watchedValues.experienceYears || 0} yrs experience
                                </p>
                                {watchedValues.bio && (
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                        {watchedValues.bio}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
