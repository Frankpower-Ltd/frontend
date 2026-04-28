import { RouteConstant } from "@/constants/routes";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import AboutPage from "./pages/AboutPage";
import AdminDashboard from "./pages/AdminDashboard";
import AlumniPage from "./pages/AlumniPage";
import Applications from "./pages/Applications";
import Assignments from "./pages/Assignments";
import ContactPage from "./pages/ContactPage";
import Dashboard from "./pages/Dashboard";
import DashboardPrograms from "./pages/DashboardPrograms";
import ForgotPassword from "./pages/ForgotPassword";
import LandingPage from "./pages/LandingPage";
import Lesson from "./pages/Lesson";
import Login from "./pages/Login";
import MyCourses from "./pages/MyCourses";
import NewApplication from "./pages/NewApplication";
import NotificationCenter from "./pages/NotificationCenter";
import Overview from "./pages/Overview";
import Payments from "./pages/Payments";
import PaymentSuccessful from "./pages/PaymentSuccessful";
import ProgramOutline from "./pages/ProgramOutline";
import ProgramsPage from "./pages/ProgramPage";
import ResetPassword from "./pages/ResetPassword";
import Schedule from "./pages/Schedule";
import Signup from "./pages/Signup";
import StudentsForm from "./pages/StudentsForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={RouteConstant.login} element={<Login />} />
        <Route path={RouteConstant.signup} element={<Signup />} />
        <Route path={RouteConstant.forgetPwd} element={<ForgotPassword />} />
        <Route path={RouteConstant.resetPwd} element={<ResetPassword />} />
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
          <Route path="programs" element={<DashboardPrograms />} />
          <Route path="programs/:programId" element={<ProgramOutline />} />
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
