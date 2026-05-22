import AuthLayout from "@/components/layout/AuthLayout";
import { RouteConstant } from "@/constants/routes";
import AdminApplications from "@/pages/admin/AdminApplications";
import AdminAssignments from "@/pages/admin/AdminAssignments";
import AdminCertificates from "@/pages/admin/AdminCertificates";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminNotifications from "@/pages/admin/AdminNotifications";
import AdminPayments from "@/pages/admin/AdminPayments";
import AdminPrograms from "@/pages/admin/AdminPrograms";
import AdminSchedules from "@/pages/admin/AdminSchedules";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminUsers from "@/pages/admin/AdminUsers";
import AuthPageGuard from "@/pages/auth/AuthPageGuard";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import Login from "@/pages/auth/Login";
import ResetPassword from "@/pages/auth/ResetPassword";
import Signup from "@/pages/auth/Signup";
import GlobalErrorBoundary from "@/pages/GlobalErrorBoundary";
import NotFound from "@/pages/NotFound";
import AboutPage from "@/pages/public/AboutPage";
import AlumniPage from "@/pages/public/AlumniPage";
import ContactPage from "@/pages/public/ContactPage";
import LandingPage from "@/pages/public/LandingPage";
import ProgramsPage from "@/pages/public/ProgramPage";
import Applications from "@/pages/student/Applications";
import Assignments from "@/pages/student/Assignments";
import CourseDetails from "@/pages/student/CourseDetails";
import Dashboard from "@/pages/student/Dashboard";
import Lesson from "@/pages/student/Lesson";
import MyCourses from "@/pages/student/MyCourses";
import NewApplication from "@/pages/student/NewApplication";
import NotificationCenter from "@/pages/student/NotificationCenter";
import Overview from "@/pages/student/Overview";
import Payments from "@/pages/student/Payments";
import PaymentSuccessful from "@/pages/student/PaymentSuccessful";
import Schedule from "@/pages/student/Schedule";
import StudentCertificate from "@/pages/student/StudentCertificate";
import StudentSettings from "@/pages/student/StudentSettings";
import StudentsForm from "@/pages/student/StudentsForm";
//import "react-day-picker/style.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />} errorElement={<GlobalErrorBoundary />}>
          <Route
            path={RouteConstant.login}
            element={
              <AuthPageGuard>
                <Login />
              </AuthPageGuard>
            }
          />
          <Route
            path={RouteConstant.signup}
            element={
              <AuthPageGuard>
                <Signup />
              </AuthPageGuard>
            }
          />
          <Route path={RouteConstant.forgetPwd} element={<ForgotPassword />} />
          <Route path={RouteConstant.resetPwd} element={<ResetPassword />} />
        </Route>
        <Route path={RouteConstant.about} element={<AboutPage />} />
        <Route path={RouteConstant.programs} element={<ProgramsPage />} />
        <Route path={RouteConstant.contact} element={<ContactPage />} />
        <Route path={RouteConstant.alumni} element={<AlumniPage />} />
        <Route path={RouteConstant.studentsform} element={<StudentsForm />} />

        <Route
          path="/apply"
          element={<Navigate to={RouteConstant.apply} replace />}
        />

        <Route
          path={RouteConstant.dashboard}
          element={<Dashboard />}
          errorElement={<GlobalErrorBoundary />}
        >
          <Route index element={<Overview />} />
          <Route path="apply" element={<NewApplication />} />
          <Route path="applications" element={<Applications />} />
          <Route path="payments" element={<Payments />} />
          <Route path="notifications" element={<NotificationCenter />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="courses/:courseId" element={<CourseDetails />} />
          <Route
            path="courses/:courseId/lessons/:lessonId"
            element={<Lesson />}
          />
          <Route path="schedule" element={<Schedule />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="certificates" element={<StudentCertificate />} />
          <Route path="settings" element={<StudentSettings />} />
        </Route>

        <Route path={RouteConstant.adminRoot} element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="programs" element={<AdminPrograms />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="schedules" element={<AdminSchedules />} />
          <Route path="assignments" element={<AdminAssignments />} />
          <Route path="certificates" element={<AdminCertificates />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route
          path="/admin"
          element={<Navigate to={RouteConstant.adminDashboard} replace />}
        />

        <Route path="/" element={<LandingPage />} />
        <Route path="/payment-successful" element={<PaymentSuccessful />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
