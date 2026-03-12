import { Button } from "@/components/ui/button";

const bookings = [
    { id: 1, class: "Docker Essentials", student: "Nidula Ekanayake", mentor: "Michelle Burns", date: "19/02/2026 15:00", duration: "1h", status: "APPROVED" },
    { id: 2, class: "Golang Basics", student: "Nidula Ekanayake", mentor: "Scarlet Nexus", date: "21/02/2026 15:00", duration: "1h", status: "PENDING" },
    { id: 3, class: "Advanced Java", student: "Nidula Ekanayake", mentor: "Alex Thompson", date: "22/02/2026 15:00", duration: "1h", status: "PENDING" },
    { id: 4, class: "Advanced Java", student: "Nidula Ekanayake", mentor: "Michelle Burns", date: "23/02/2026 15:00", duration: "1h", status: "PENDING" },
    { id: 5, class: "JavaScript Basics", student: "Nidula Ekanayake", mentor: "Sarah Zhang", date: "04/02/2026 11:00", duration: "1h", status: "APPROVED" },
];

export function ManageBookingsTable() {
    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Manage Bookings</h2>
                <Button variant="outline" size="sm">Refresh</Button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-gray-500 border-b">
                        <tr>
                            <th className="px-4 py-3 font-medium">Class</th>
                            <th className="px-4 py-3 font-medium">Student</th>
                            <th className="px-4 py-3 font-medium">Mentor</th>
                            <th className="px-4 py-3 font-medium">Date</th>
                            <th className="px-4 py-3 font-medium">Duration</th>
                            <th className="px-4 py-3 font-medium text-center">Status</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-slate-900 font-medium">
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-4">{booking.class}</td>
                                <td className="px-4 py-4 text-gray-600">{booking.student}</td>
                                <td className="px-4 py-4 text-gray-600">{booking.mentor}</td>
                                <td className="px-4 py-4 text-gray-600">{booking.date}</td>
                                <td className="px-4 py-4 text-gray-600">{booking.duration}</td>
                                <td className="px-4 py-4 text-center">
                                    <span className={`px-4 py-2 rounded-full text-xs font-bold tracking-tight ${booking.status === "APPROVED"
                                        ? "bg-emerald-50 text-emerald-900"
                                        : "bg-slate-100 text-slate-700"
                                        }`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-right">
                                    {booking.status === "PENDING" ? (
                                        <Button
                                            className="bg-[#ebf0f5] hover:bg-[#dfe5eb] text-[#1e293b] font-bold border-none shadow-none text-md px-6 rounded-lg"
                                        >
                                            Approve
                                        </Button>
                                    ) : (
                                        <span className="text-[#10b981] font-bold px-6">
                                            Approved
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
