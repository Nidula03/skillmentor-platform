import { useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import {
    BookOpen,
    Users,
    UserCog,
    CalendarCheck,
    ShieldCheck,
    LogOut,
} from "lucide-react";
import {
    SidebarProvider,
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const navItems = [
    {
        title: "Create Subject",
        href: "/admin/subjects/create",
        icon: BookOpen,
    },
    {
        title: "Create Mentor",
        href: "/admin/mentors/create",
        icon: Users,
    },
    {
        title: "Manage Mentors",
        href: "/admin/mentors/manage",
        icon: UserCog,
    },
    {
        title: "Manage Bookings",
        href: "/admin/bookings",
        icon: CalendarCheck,
    },
];

export default function AdminLayout() {
    const { user, isLoaded } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    const isAdmin =
        user?.publicMetadata?.roles &&
        Array.isArray(user.publicMetadata.roles) &&
        user.publicMetadata.roles.includes("ADMIN");

    useEffect(() => {
        if (isLoaded && !isAdmin) {
            navigate("/dashboard");
        }
    }, [isLoaded, isAdmin, navigate]);

    if (!isLoaded || !isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-pulse text-muted-foreground text-lg">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <SidebarProvider className="min-h-screen">
            <Sidebar variant="inset">
                {/* Sidebar Header */}
                <SidebarHeader className="p-4">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center size-8 rounded-lg bg-primary text-primary-foreground">
                            <ShieldCheck className="size-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Admin Panel</p>
                            <p className="text-xs text-muted-foreground">SkillMentor</p>
                        </div>
                    </div>
                </SidebarHeader>

                <Separator />

                {/* Navigation */}
                <SidebarContent className="p-2">
                    <SidebarMenu>
                        {navItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={location.pathname === item.href}
                                    tooltip={item.title}
                                >
                                    <Link to={item.href}>
                                        <item.icon className="size-4" />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>

                {/* Footer */}
                <SidebarFooter className="p-2">
                    <Separator className="mb-2" />
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link to="/dashboard">
                                    <LogOut className="size-4" />
                                    <span>Back to Dashboard</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            {/* Main Content Area */}
            <SidebarInset>
                <header className="flex h-14 items-center gap-2 border-b px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 !h-4" />
                    <h1 className="text-sm font-semibold text-muted-foreground">
                        Admin Dashboard
                    </h1>
                </header>
                <div className="flex-1 p-6">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
