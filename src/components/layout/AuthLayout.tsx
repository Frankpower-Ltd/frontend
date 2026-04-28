import companyLogo from "@/assets/images/company-logo.png";
import { RouteConstant } from "@/constants/routes";
import { Outlet, useLocation } from "react-router";

type AuthLayoutContent = {
  sideTitle: string;
  sideSubtitle: string;
  sideDescription: string;
};

const AUTH_LAYOUT_CONTENT: Record<string, AuthLayoutContent> = {
  [RouteConstant.login]: {
    sideTitle: "REVOLUTIONIZING",
    sideSubtitle: "THE EDUCATION SYSTEM",
    sideDescription:
      "Empowering students and educators with tools that make knowledge accessible, engaging, and limitless.",
  },
  [RouteConstant.signup]: {
    sideTitle: "JOIN THE REVOLUTION",
    sideSubtitle: "IN EDUCATION",
    sideDescription:
      "Be part of a community that's transforming the way we learn.",
  },
  [RouteConstant.forgetPwd]: {
    sideTitle: "PASSWORD RECOVERY",
    sideSubtitle: "SECURE & SIMPLE",
    sideDescription:
      "Check your email for a reset token, then complete your password reset.",
  },
  [RouteConstant.resetPwd]: {
    sideTitle: "SECURE ACCESS",
    sideSubtitle: "RENEWED & PROTECTED",
    sideDescription:
      "Use the reset token sent to your email to set a new password.",
  },
};

const AuthLayout = () => {
  const { pathname } = useLocation();
  const content =
    AUTH_LAYOUT_CONTENT[pathname] ?? AUTH_LAYOUT_CONTENT[RouteConstant.login];

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      <aside className="hidden md:flex md:flex-1 md:flex-col items-center justify-center px-12 py-12 bg-gradient-to-b from-[#8b0000] to-[#3b0000] text-white">
        <div className="max-w-[480px]">
          <h2 className="text-[34px] m-0 tracking-wide font-extrabold">
            {content.sideTitle}
          </h2>
          <h3 className="text-sm font-bold my-2 mb-3">
            {content.sideSubtitle}
          </h3>
          <p className="opacity-95 leading-relaxed">
            {content.sideDescription}
          </p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col bg-white px-6 md:px-14 py-12 justify-center items-center md:items-start">
        <header className="mb-2">
          <img
            className="w-28 h-auto object-contain"
            src={companyLogo}
            alt="Company logo"
          />
        </header>

        <main className="w-full max-w-[460px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
