import companyLogo from "@/assets/images/company-logo.png";
import { RouteConstant } from "@/constants/routes";
import { Outlet, useLocation } from "react-router";

// Import your background image (adjust the path based on your assets)
import AuthBackgroundImg from "@/assets/images/girl-holding-computer.jpg"; // or any relevant image

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
      {/* Left Sidebar with Background Image and Blur Overlay */}
      <aside className="hidden md:flex md:flex-1 md:flex-col items-center justify-center px-12 py-12 text-white relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${AuthBackgroundImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Gradient Overlay with Blur Effect */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#8b0000]/95 via-[#6b0000]/90 to-[#3b0000]/95 backdrop-blur-[3px]" />

        {/* Optional: Add a subtle pattern overlay for texture */}
        <div
          className="absolute inset-0 z-10 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
                            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`,
          }}
        />

        {/* Content */}
        <div className="max-w-[480px] relative z-20">
          <h2 className="text-[34px] m-0 tracking-wide font-extrabold drop-shadow-lg">
            {content.sideTitle}
          </h2>
          <h3 className="text-sm font-bold my-2 mb-3 drop-shadow-md">
            {content.sideSubtitle}
          </h3>
          <p className="opacity-95 leading-relaxed drop-shadow-sm">
            {content.sideDescription}
          </p>
        </div>
      </aside>

      {/* Right Side - Form */}
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
