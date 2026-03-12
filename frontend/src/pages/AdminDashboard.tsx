import { useNavigate } from "react-router";
import { useEffect } from "react";
import { CreateClassForm } from "@/components/admin/CreateClassForm";
import { CreateMentorForm } from "@/components/admin/CreateMentorForm";
import { ManageBookingsTable } from "@/components/admin/ManageBookingsTable";
import { useUser } from "@clerk/clerk-react";

export default function AdminDashboard() {
    const { user, isLoaded } = useUser();
    const navigate = useNavigate();

    // Check for "ADMIN" role in Clerk public metadata
    const isAdmin = user?.publicMetadata?.roles &&
        Array.isArray(user.publicMetadata.roles) &&
        user.publicMetadata.roles.includes("ADMIN");

    useEffect(() => {
        if (isLoaded && !isAdmin) {
            navigate("/dashboard");
        }
    }, [isLoaded, isAdmin, navigate]);

    // Show nothing while checking/redirecting
    if (!isLoaded || !isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-[1600px] mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

                <div className="flex flex-col gap-8 items-stretch">
                    {/* Create Class Section */}
                    <div className="w-full">
                        <CreateClassForm />
                    </div>

                    {/* Create Mentor Section */}
                    <div className="w-full">
                        <CreateMentorForm />
                    </div>

                    {/* Manage Bookings Section */}
                    <div className="w-full">
                        <ManageBookingsTable />
                    </div>
                </div>
            </div>
        </div>
    );
}
