import { ComponentProps, CSSProperties, MouseEventHandler } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import React from "react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps extends Omit<ComponentProps<"button">, "onClick"> {
  isLoading: boolean;
  loaderColor?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  position: "absolute",
};

const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ loaderColor = "black", isLoading, onClick, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick} // ✅ Fixed lowercase issue
        type="submit"
        className={cn(
          `cursor-pointer w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all transform hover:scale-[1.02]
         ${
           isLoading
             ? ""
             : "bg-blue-600 shadow shadow-blue-200 hover:bg-blue-700"
         }`,
          className
        )}
        // {...props}
      >
        {isLoading ? (
          <div className="flex items-center text-gray-700 gap-3">
            <ClipLoader
              color={loaderColor}
              loading={isLoading}
              cssOverride={override} // ✅ Correctly applied
              size={18}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            <p className="ml-10">loading ...</p>
          </div>
        ) : (
          children // ✅ Used children correctly
        )}
      </button>
    );
  }
);

SubmitButton.displayName = "SubmitButton";

export default SubmitButton;
