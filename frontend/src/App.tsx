import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import PaymentPage from "@/pages/PaymentPage";
import AdminLayout from "@/components/admin/AdminLayout";
import CreateSubjectPage from "@/pages/admin/CreateSubjectPage";
import CreateMentorPage from "@/pages/admin/CreateMentorPage";
import ManageBookingsPage from "@/pages/admin/ManageBookingsPage";
import ManageMentorsPage from "@/pages/admin/ManageMentorsPage";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          {/* Public & student routes — wrapped in Layout (nav + footer) */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <>
                  <SignedIn>
                    <DashboardPage />
                  </SignedIn>
                  <SignedOut>
                    <LoginPage />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/payment/:sessionId"
              element={
                <>
                  <SignedIn>
                    <PaymentPage />
                  </SignedIn>
                  <SignedOut>
                    <LoginPage />
                  </SignedOut>
                </>
              }
            />
            <Route path="*" element={<LoginPage />} />
          </Route>

          {/* Admin routes — NO nav/footer, uses AdminLayout sidebar instead */}
          <Route
            path="/admin"
            element={
              <>
                <SignedIn>
                  <AdminLayout />
                </SignedIn>
                <SignedOut>
                  <LoginPage />
                </SignedOut>
              </>
            }
          >
            <Route index element={<Navigate to="subjects/create" replace />} />
            <Route path="subjects/create" element={<CreateSubjectPage />} />
            <Route path="mentors/create" element={<CreateMentorPage />} />
            <Route path="mentors/manage" element={<ManageMentorsPage />} />
            <Route path="bookings" element={<ManageBookingsPage />} />
          </Route>
        </Routes>
        <ToastViewport />
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
