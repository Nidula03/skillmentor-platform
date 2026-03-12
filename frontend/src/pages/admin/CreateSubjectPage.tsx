import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSubject, getMentorsList } from "@/lib/api";
import type { Mentor } from "@/types";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2, BookPlus } from "lucide-react";

const subjectSchema = z.object({
    subjectName: z
        .string()
        .min(5, "Subject name must be at least 5 characters"),
    description: z
        .string()
        .max(500, "Description must not exceed 500 characters"),
    courseImageUrl: z.string(),
    mentorId: z.string().min(1, "Please select a mentor"),
});

type SubjectFormValues = z.infer<typeof subjectSchema>;

export default function CreateSubjectPage() {
    const { getToken } = useAuth();
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [loadingMentors, setLoadingMentors] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const form = useForm<SubjectFormValues>({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            subjectName: "",
            description: "",
            courseImageUrl: "",
            mentorId: "",
        },
    });

    useEffect(() => {
        async function fetchMentors() {
            try {
                const token = await getToken({ template: "skill-mentor" });
                if (!token) return;
                const data = await getMentorsList(token);
                setMentors(data.content);
            } catch (err) {
                console.error("Failed to fetch mentors", err);
                toast({
                    title: "Error",
                    description: "Failed to load mentors list.",
                    variant: "destructive",
                });
            } finally {
                setLoadingMentors(false);
            }
        }
        fetchMentors();
    }, [getToken]);

    async function onSubmit(values: SubjectFormValues) {
        setSubmitting(true);
        try {
            const token = await getToken({ template: "skill-mentor" });
            if (!token) throw new Error("Not authenticated");

            await createSubject(token, {
                subjectName: values.subjectName,
                description: values.description || "",
                courseImageUrl: values.courseImageUrl || "",
                mentorId: Number(values.mentorId),
            });

            toast({
                title: "Subject Created! ✅",
                description: `"${values.subjectName}" has been created successfully.`,
            });

            form.reset();
        } catch (err) {
            console.error("Failed to create subject", err);
            toast({
                title: "Error",
                description:
                    err instanceof Error ? err.message : "Failed to create subject.",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    }


    return (
        <div className="max-w-2xl mx-auto">
            <Card className="border shadow-sm">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-blue-100 text-blue-700">
                            <BookPlus className="size-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Create New Subject</CardTitle>
                            <CardDescription>
                                Add a new subject and assign it to a mentor.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="subjectName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subject Name *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. Advanced JavaScript"
                                                {...field}
                                            />
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
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe the subject content and learning outcomes..."
                                                className="min-h-[100px] resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="courseImageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Course Image URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://example.com/image.webp"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="mentorId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Assign Mentor *</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue
                                                        placeholder={
                                                            loadingMentors
                                                                ? "Loading mentors..."
                                                                : "Select a mentor"
                                                        }
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {mentors.map((mentor) => (
                                                    <SelectItem
                                                        key={mentor.id}
                                                        value={String(mentor.id)}
                                                    >
                                                        {mentor.firstName} {mentor.lastName} —{" "}
                                                        {mentor.title || mentor.profession || "Mentor"}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Subject"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
