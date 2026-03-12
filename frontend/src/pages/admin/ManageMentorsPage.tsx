import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { getMentorsList, deleteMentor } from "@/lib/api";
import type { Mentor } from "@/types";
import { toast } from "@/components/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2, Trash2, Users, RefreshCw } from "lucide-react";

export default function ManageMentorsPage() {
    const { getToken } = useAuth();
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const fetchMentors = useCallback(async () => {
        setLoading(true);
        try {
            const token = await getToken({ template: "skill-mentor" });
            if (!token) return;
            const data = await getMentorsList(token);
            setMentors(data.content);
        } catch (err) {
            console.error("Failed to fetch mentors", err);
            toast({
                title: "Error",
                description: "Failed to load mentors.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [getToken]);

    useEffect(() => {
        fetchMentors();
    }, [fetchMentors]);

    async function handleDelete(id: number, name: string) {
        if (!confirm(`Are you sure you want to delete mentor "${name}" (ID: ${id})?`)) return;

        setDeletingId(id);
        try {
            const token = await getToken({ template: "skill-mentor" });
            if (!token) throw new Error("Not authenticated");
            await deleteMentor(token, id);
            toast({
                title: "Mentor Deleted ✅",
                description: `${name} has been removed.`,
            });
            fetchMentors();
        } catch (err) {
            console.error("Failed to delete mentor", err);
            toast({
                title: "Error",
                description: err instanceof Error ? err.message : "Failed to delete mentor.",
                variant: "destructive",
            });
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="space-y-4">
            <Card className="border shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-10 rounded-lg bg-orange-100 text-orange-700">
                                <Users className="size-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Manage Mentors</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {mentors.length} mentor{mentors.length !== 1 ? "s" : ""}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchMentors}
                            disabled={loading}
                            className="gap-1.5"
                        >
                            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="size-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : mentors.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">
                            <Users className="size-12 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">No mentors found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-y bg-muted/40">
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Company</th>
                                        <th className="px-4 py-3 text-center font-medium text-muted-foreground">Certified</th>
                                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {mentors.map((mentor) => (
                                        <tr key={mentor.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">#{mentor.id}</td>
                                            <td className="px-4 py-3 font-medium">
                                                <div className="flex items-center gap-2">
                                                    {mentor.profileImageUrl ? (
                                                        <img
                                                            src={mentor.profileImageUrl}
                                                            alt=""
                                                            className="size-7 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="size-7 rounded-full bg-violet-200 flex items-center justify-center text-violet-700 text-xs font-bold">
                                                            {mentor.firstName?.[0]}{mentor.lastName?.[0]}
                                                        </div>
                                                    )}
                                                    {mentor.firstName} {mentor.lastName}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">{mentor.email}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{mentor.title || "—"}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{mentor.company || "—"}</td>
                                            <td className="px-4 py-3 text-center">
                                                {mentor.isCertified ? (
                                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">Yes</span>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs">No</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="gap-1 text-xs h-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    disabled={deletingId === mentor.id}
                                                    onClick={() =>
                                                        handleDelete(mentor.id, `${mentor.firstName} ${mentor.lastName}`)
                                                    }
                                                >
                                                    {deletingId === mentor.id ? (
                                                        <Loader2 className="size-3 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="size-3" />
                                                    )}
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
