// Modified to match with backend SubjectResponseDTO
export interface Subject {
  id: number;
  subjectName: string;
  description: string;
  courseImageUrl: string;
}

// Modified to match with backend MentorResponseDTO (from GET /api/v1/mentors)
export interface Mentor {
  id: number;
  mentorId: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  profession: string;
  company: string;
  experienceYears: number;
  bio: string;
  profileImageUrl: string;
  positiveReviews: number;
  totalEnrollments: number;
  isCertified: boolean;
  startYear: string;
  subjects: Subject[];
}

// Modified to match with SessionResponseDTO (from GET /api/v1/sessions/my-sessions)
export interface Enrollment {
  id: number;
  mentorName: string;
  mentorProfileImageUrl: string;
  subjectName: string;
  sessionAt: string;
  durationMinutes: number;
  sessionStatus: string;
  paymentStatus: "pending" | "accepted" | "completed" | "cancelled";
  meetingLink: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

// Admin DTOs matching backend

export interface SubjectCreateDTO {
  subjectName: string;
  description: string;
  courseImageUrl: string;
  mentorId: number;
}

export interface MentorCreateDTO {
  mentorId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  title?: string;
  profession?: string;
  company?: string;
  experienceYears: number;
  bio?: string;
  profileImageUrl?: string;
  isCertified?: boolean;
  startYear?: string;
}

// Matches backend SessionResponseDTO (from GET /api/v1/sessions)
export interface AdminSession {
  id: number;
  studentName: string;
  mentorName: string;
  mentorProfileImageUrl: string | null;
  subjectName: string;
  sessionAt: string;
  durationMinutes: number;
  sessionStatus: string;
  paymentStatus: string;
  meetingLink: string | null;
}
