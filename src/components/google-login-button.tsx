"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ComponentProps, FC, MouseEventHandler } from "react";

interface GoogleLoginButtonProps extends ComponentProps<"button"> {
  onclick: MouseEventHandler<HTMLButtonElement> | undefined
}

const GoogleLoginButton: FC<GoogleLoginButtonProps> = ({
  onclick,
  className,
  children,
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        " cursor-pointer flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors",
        className
      )}

      onClick={onclick}
    >
      {children}
    </motion.button>
  );
};

export default GoogleLoginButton;

export const GoogleIcon = () => {
  return (
    <img
      src="https://www.google.com/favicon.ico"
      alt="Google"
      className="w-5 h-5"
    />
  );
};
