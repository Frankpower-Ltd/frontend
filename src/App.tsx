import { RouteConstant } from "@/constants/routes";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route
          path="/"
          element={<Navigate to={RouteConstant.login} replace />}
        />

        {/* Auth routes */}
        <Route path={RouteConstant.login} element={<Login />} />
        <Route path={RouteConstant.signup} element={<Signup />} />
        <Route path={RouteConstant.forgetPwd} element={<ForgotPassword />} />
        <Route path={RouteConstant.resetPwd} element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
