import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { type InputHTMLAttributes, useState } from "react";

type CustomInputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

const CustomInput = ({
  className,
  hasError = false,
  type = "text",
  disabled,
  ...props
}: CustomInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";
  const inputType = isPasswordType && showPassword ? "text" : type;

  return (
    <div className="relative">
      <input
        type={inputType}
        disabled={disabled}
        className={cn(
          "w-full rounded-lg border px-[18px] py-3 text-sm bg-transparent focus:outline-none focus:ring disabled:cursor-not-allowed disabled:opacity-50",
          isPasswordType && "pr-12",
          hasError
            ? "border-red-500 focus:ring-red-700/30"
            : "border-black/20 focus:ring-red-700/30",
          className,
        )}
        {...props}
      />

      {isPasswordType ? (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      ) : null}
    </div>
  );
};

export default CustomInput;
