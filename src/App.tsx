import { RouteConstant } from "@/constants/routes";
import { BrowserRouter, Route, Routes } from "react-router";
import ForgotPassword from "./pages/ForgotPassword";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path={RouteConstant.login} element={<Login />} />
        <Route path={RouteConstant.signup} element={<Signup />} />
        <Route path={RouteConstant.forgetPwd} element={<ForgotPassword />} />
        <Route path={RouteConstant.resetPwd} element={<ResetPassword />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
