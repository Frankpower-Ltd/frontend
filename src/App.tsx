import { RouteConstant } from "@/constants/routes";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useParams,
} from "react-router";

const CourseRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/dashboard/courses/${id}/lessons/lesson-1`} replace />;
};
import ForgotPassword from "./pages/ForgotPassword";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";
import AboutPage from "./pages/AboutPage";
import ProgramsPage from "./pages/ProgramPage";
import ContactPage from "./pages/ContactPage";
import AlumniPage from "./pages/AlumniPage";
import StudentsForm from "./pages/StudentsForm";
import Dashboard from "./pages/Dashboard";
import Overview from "./pages/Overview";
import Schedule from "./pages/Schedule";
import MyCourses from "./pages/MyCourses";
import Assignments from "./pages/Assignments";
import Achievements from "./pages/Achievements";
import StudyGroups from "./pages/StudyGroups";
//import CourseLesson from "./pages/Lesson";
import Lesson from "./pages/Lesson";
import PhysicalClassHub from "./pages/PhysicalClassHub";
import ApplicationFlow from "./pages/ApplicationFlow";
import MyApplications from "./pages/MyApplications";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path={RouteConstant.login} element={<Login />} />
        <Route path={RouteConstant.signup} element={<Signup />} />
        <Route path={RouteConstant.forgetPwd} element={<ForgotPassword />} />
        <Route path={RouteConstant.resetPwd} element={<ResetPassword />} />
        <Route path={RouteConstant.about} element={<AboutPage />} />
        <Route path={RouteConstant.programs} element={<ProgramsPage />} />
        <Route path={RouteConstant.contact} element={<ContactPage />} />
        <Route path={RouteConstant.alumni} element={<AlumniPage />} />
        <Route path={RouteConstant.studentsform} element={<StudentsForm />} />
        // App.tsx - Update the dashboard routes
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Overview />} />
          <Route path="apply" element={<ApplicationFlow />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="courses" element={<MyCourses />} />
          <Route
            path="courses/:courseId/lessons/:lessonId"
            element={<Lesson />}
          />
          <Route
            path="physical-course/:courseId"
            element={<PhysicalClassHub />}
          />
          <Route path="schedule" element={<Schedule />} />
          <Route path="groups" element={<StudyGroups />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="assignments" element={<Assignments />} />
        </Route>
        {/*
        <Route path={RouteConstant.dashboard} element={<Dashboard/>} />
        <Route path={RouteConstant.overview} element={<Overview/>} />
        <Route path={RouteConstant.schedule} element={<Schedule/>} />
        <Route path={RouteConstant.myCourses} element={<MyCourses/>} />
        <Route path={RouteConstant.assignments} element={<Assignments/>} />
        <Route path={RouteConstant.achievements} element={<Achievements/>} />
        <Route path={RouteConstant.studyGroups} element={<StudyGroups/>} />
*/}
        <Route path="/course/:id" element={<CourseRedirect />} />
        {/* Landing Page route */}
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
