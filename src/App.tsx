import AuthLayout from "@/components/layout/AuthLayout";
import { RouteConstant } from "@/constants/routes";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AuthPageGuard from "@/pages/auth/AuthPageGuard";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import Login from "@/pages/auth/Login";
import ResetPassword from "@/pages/auth/ResetPassword";
import Signup from "@/pages/auth/Signup";
import AboutPage from "@/pages/public/AboutPage";
import AlumniPage from "@/pages/public/AlumniPage";
import ContactPage from "@/pages/public/ContactPage";
import LandingPage from "@/pages/public/LandingPage";
import ProgramsPage from "@/pages/public/ProgramPage";
import Applications from "@/pages/student/Applications";
import Assignments from "@/pages/student/Assignments";
import Dashboard from "@/pages/student/Dashboard";
import Lesson from "@/pages/student/Lesson";
import MyCourses from "@/pages/student/MyCourses";
import NewApplication from "@/pages/student/NewApplication";
import NotificationCenter from "@/pages/student/NotificationCenter";
import Overview from "@/pages/student/Overview";
import Payments from "@/pages/student/Payments";
import PaymentSuccessful from "@/pages/student/PaymentSuccessful";
import Schedule from "@/pages/student/Schedule";
import StudentsForm from "@/pages/student/StudentsForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
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

        <Route path={RouteConstant.dashboard} element={<Dashboard />}>
          <Route index element={<Overview />} />
          <Route path="apply" element={<NewApplication />} />
          <Route path="applications" element={<Applications />} />
          <Route path="payments" element={<Payments />} />
          <Route path="notifications" element={<NotificationCenter />} />
          <Route path="courses" element={<MyCourses />} />
          <Route
            path="courses/:courseId/lessons/:lessonId"
            element={<Lesson />}
          />
          <Route path="schedule" element={<Schedule />} />
          <Route path="assignments" element={<Assignments />} />
        </Route>

        <Route
          path={RouteConstant.adminDashboard}
          element={<AdminDashboard />}
        />
        <Route
          path="/admin"
          element={<Navigate to={RouteConstant.adminDashboard} replace />}
        />

        <Route path="/" element={<LandingPage />} />
        <Route path="/payment-successful" element={<PaymentSuccessful />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
