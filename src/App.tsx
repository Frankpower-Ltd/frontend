import { RouteConstant } from "@/constants/routes";
import { BrowserRouter, Route, Routes } from "react-router";
import ForgotPassword from "./pages/ForgotPassword";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";
import AboutPage from "./pages/AboutPage";
import ProgramsPage from "./pages/ProgramPage";
import ContactPage from "./pages/ContactPage";
import AlumniPage from "./pages/AlumniPage";

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

        {/* Landing Page route */}
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
