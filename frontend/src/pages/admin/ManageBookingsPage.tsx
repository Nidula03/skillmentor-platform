import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { getAllSessions, updateSession } from "@/lib/api";
import type { AdminSession } from "@/types";
import { toast } from "@/components/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Loader2,
    Search,
    RefreshCw,
    Link as LinkIcon,
    CheckCircle2,
    CreditCard,
    CalendarCheck,
} from "lucide-react";

const ITEMS_PER_PAGE = 8;

function StatusBadge({
    status,
}: {
    status: string;
}) {
    const colors: Record<string, string> = {
        // Payment statuses
        pending: "bg-amber-100 text-amber-800",
        accepted: "bg-emerald-100 text-emerald-800",
        completed: "bg-blue-100 text-blue-800",
        cancelled: "bg-red-100 text-red-800",
        // Session statuses
        scheduled: "bg-sky-100 text-sky-800",
        in_progress: "bg-indigo-100 text-indigo-800",
        confirmed: "bg-emerald-100 text-emerald-800",
    };

    const key = status?.toLowerCase() || "unknown";
    const colorClass = colors[key] || "bg-gray-100 text-gray-700";

    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${colorClass}`}
        >
            {status || "N/A"}
        </span>
    );
}

export default function ManageBookingsPage() {
    const { getToken } = useAuth();
    const [sessions, setSessions] = useState<AdminSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    // Filters
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    // Meeting link dialog
    const [meetingDialog, setMeetingDialog] = useState<{
        open: boolean;
        sessionId: number | null;
    }>({ open: false, sessionId: null });
    const [meetingLink, setMeetingLink] = useState("");

    const fetchSessions = useCallback(async () => {
        setLoading(true);
        try {
            const token = await getToken({ template: "skill-mentor" });
            if (!token) return;
            const data = await getAllSessions(token);
            setSessions(data);
        } catch (err) {
            console.error("Failed to fetch sessions", err);
            toast({
                title: "Error",
                description: "Failed to load sessions.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [getToken]);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    // Filter and search
    const filteredSessions = sessions.filter((s) => {
        // Status filter
        if (statusFilter !== "all") {
            const matchPayment =
                s.paymentStatus?.toLowerCase() === statusFilter.toLowerCase();
            const matchSession =
                s.sessionStatus?.toLowerCase() === statusFilter.toLowerCase();
            if (!matchPayment && !matchSession) return false;
        }

        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            if (
                !(s.studentName?.toLowerCase() || "").includes(q) &&
                !(s.mentorName?.toLowerCase() || "").includes(q) &&
                !(s.subjectName?.toLowerCase() || "").includes(q)
            )
                return false;
        }

        return true;
    });

    // Pagination
    const totalPages = Math.ceil(filteredSessions.length / ITEMS_PER_PAGE);
    const paginatedSessions = filteredSessions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    async function handleAction(
        sessionId: number,
        update: Partial<AdminSession>,
        successMsg: string,
    ) {
        setActionLoading(sessionId);
        try {
            const token = await getToken({ template: "skill-mentor" });
            if (!token) throw new Error("Not authenticated");
            await updateSession(token, sessionId, update);
            toast({
                title: "Success ✅",
                description: successMsg,
            });
            fetchSessions();
        } catch (err) {
            console.error("Action failed", err);
            toast({
                title: "Error",
                description:
                    err instanceof Error ? err.message : "Action failed.",
                variant: "destructive",
            });
        } finally {
            setActionLoading(null);
        }
    }

    function handleConfirmPayment(sessionId: number) {
        handleAction(
            sessionId,
            { paymentStatus: "accepted" },
            "Payment confirmed successfully.",
        );
    }

    function handleMarkComplete(sessionId: number) {
        handleAction(
            sessionId,
            { sessionStatus: "completed" },
            "Session marked as completed.",
        );
    }

    function handleAddMeetingLink() {
        if (!meetingDialog.sessionId || !meetingLink.trim()) return;
        handleAction(
            meetingDialog.sessionId,
            { meetingLink: meetingLink.trim() },
            "Meeting link added successfully.",
        );
        setMeetingDialog({ open: false, sessionId: null });
        setMeetingLink("");
    }

    return (
        <div className="space-y-4">
            <Card className="border shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-10 rounded-lg bg-teal-100 text-teal-700">
                                <CalendarCheck className="size-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Manage Bookings</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {filteredSessions.length} session
                                    {filteredSessions.length !== 1 ? "s" : ""} found
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchSessions}
                            disabled={loading}
                            className="gap-1.5"
                        >
                            <RefreshCw
                                className={`size-4 ${loading ? "animate-spin" : ""}`}
                            />
                            Refresh
                        </Button>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by student, mentor, or subject..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-9"
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onValueChange={(val) => {
                                setStatusFilter(val);
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="accepted">Accepted</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="size-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : paginatedSessions.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">
                            <CalendarCheck className="size-12 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">No sessions found</p>
                            <p className="text-sm">Try adjusting your filters.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-y bg-muted/40">
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                            ID
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                            Student
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                            Mentor
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                            Subject
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                            Date / Time
                                        </th>
                                        <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                                            Duration
                                        </th>
                                        <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                                            Payment
                                        </th>
                                        <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {paginatedSessions.map((session) => (
                                        <tr
                                            key={session.id}
                                            className="hover:bg-muted/30 transition-colors"
                                        >
                                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                                #{session.id}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {session.studentName || "—"}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {session.mentorName || "—"}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {session.subjectName || "—"}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                                {session.sessionAt
                                                    ? new Date(session.sessionAt).toLocaleString()
                                                    : "—"}
                                            </td>
                                            <td className="px-4 py-3 text-center text-muted-foreground">
                                                {session.durationMinutes
                                                    ? `${session.durationMinutes}m`
                                                    : "—"}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <StatusBadge
                                                    status={session.paymentStatus}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <StatusBadge
                                                    status={session.sessionStatus}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {session.paymentStatus?.toLowerCase() ===
                                                        "pending" && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="gap-1 text-xs h-7"
                                                                disabled={actionLoading === session.id}
                                                                onClick={() => handleConfirmPayment(session.id)}
                                                            >
                                                                {actionLoading === session.id ? (
                                                                    <Loader2 className="size-3 animate-spin" />
                                                                ) : (
                                                                    <CreditCard className="size-3" />
                                                                )}
                                                                Confirm
                                                            </Button>
                                                        )}
                                                    {session.sessionStatus?.toLowerCase() !==
                                                        "completed" && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="gap-1 text-xs h-7"
                                                                disabled={actionLoading === session.id}
                                                                onClick={() => handleMarkComplete(session.id)}
                                                            >
                                                                {actionLoading === session.id ? (
                                                                    <Loader2 className="size-3 animate-spin" />
                                                                ) : (
                                                                    <CheckCircle2 className="size-3" />
                                                                )}
                                                                Complete
                                                            </Button>
                                                        )}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="gap-1 text-xs h-7"
                                                        onClick={() => {
                                                            setMeetingLink(session.meetingLink || "");
                                                            setMeetingDialog({
                                                                open: true,
                                                                sessionId: session.id,
                                                            });
                                                        }}
                                                    >
                                                        <LinkIcon className="size-3" />
                                                        Link
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t">
                            <p className="text-sm text-muted-foreground">
                                Page {currentPage} of {totalPages}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                >
                                    Previous
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Meeting Link Dialog */}
            <Dialog
                open={meetingDialog.open}
                onOpenChange={(open) => {
                    if (!open) {
                        setMeetingDialog({ open: false, sessionId: null });
                        setMeetingLink("");
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Meeting Link</DialogTitle>
                    </DialogHeader>
                    <Input
                        placeholder="https://meet.google.com/abc-defg-hij"
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                    />
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setMeetingDialog({ open: false, sessionId: null });
                                setMeetingLink("");
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddMeetingLink}
                            disabled={!meetingLink.trim()}
                            className="bg-teal-600 hover:bg-teal-700 text-white"
                        >
                            Save Link
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
