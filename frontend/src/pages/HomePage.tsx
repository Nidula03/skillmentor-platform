import { useEffect, useState } from "react";
import { MentorCard } from "@/components/MentorCard";
import { getPublicMentors } from "@/lib/api";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import type { Mentor } from "@/types";

export default function HomePage() {
  const { isSignedIn } = useAuth();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicMentors()
      .then((data) => setMentors(data.content))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-10">
      <div className="flex flex-col items-center justify-center space-y-8 text-center py-8">
        <div className="space-y-2">
          <h1 className="text-5xl tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-bold">
            Find your{" "}
            <span className="bg-gradient-to-r from-[#6366f6] via-[#3b82f6] to-[#6366f1] bg-clip-text text-transparent font-black animate-gradient-text">
              SkillMentor
            </span>
          </h1>
          <p className="mx-auto text-gray-500 md:text-xl dark:text-gray-400 max-w-xs sm:max-w-full">
            Empower your career with personalized mentorship for AWS Developer{" "}
            <br className="hidden sm:block" />
            Associate, Interview Prep, and more.
          </p>
        </div>

        {isSignedIn ? (
          <Link to="/dashboard">
            <Button size="lg" className="text-xl bg-[#4F6DF5] hover:bg-[#3730a3] text-white border-none shadow-lg px-8">
              Go to Dashboard
            </Button>
          </Link>
        ) : (
          <Link to="/login">
            <Button size="lg" className="text-xl bg-[#4F6DF5] hover:bg-[#3730a3] text-white border-none shadow-lg px-8">
              Sign up to see all tutors
            </Button>
          </Link>
        )}
      </div>

      <div className="space-y-8 mt-8 container bg-background">
        <h1 className="lg:text-5xl md:text-4xl sm:text-2xl text-2xl font-bold">
          Schedule a Call
        </h1>

        {loading ? (
          <div className="text-center py-10 text-muted-foreground">
            Loading mentors...
          </div>
        ) : mentors.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No mentors available yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
