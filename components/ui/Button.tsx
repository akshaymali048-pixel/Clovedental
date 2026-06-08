import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
  fullWidth?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#e07a4f] text-white hover:bg-[#cf6a42] focus:ring-[#e07a4f]/30",
  secondary:
    "bg-[#0d6e6e] text-white hover:bg-[#0a5a5a] focus:ring-[#0d6e6e]/30",
  outline:
    "border border-[#0d6e6e] bg-transparent text-[#0d6e6e] hover:bg-[#0d6e6e]/5 focus:ring-[#0d6e6e]/20",
};

export function Button({
  variant = "primary",
  children,
  fullWidth = false,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-2.5 text-base font-semibold transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
