"use client";

import { useAuth } from "@/api_hooks/use-auth";
import { Calendar } from "lucide-react";
import { ComponentProps, FC } from "react";

const Page = () => {
  const { loginGoogleCalendar } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-8">
          <Calendar className="w-12 h-12 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Calendar Integration
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Connect your Google Calendar to get started
        </p>
        <GoogleCalendarAuth onClick={() => loginGoogleCalendar()} />
      </div>
    </div>
  );
};

export default Page;

interface GoogleCalendarAuthProps extends ComponentProps<"button"> {}

const GoogleCalendarAuth: FC<GoogleCalendarAuthProps> = ({
  className,
  ...props
}) => {
  return (
    <button
      className="cursor-pointer w-full bg-indigo-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2"
      {...props}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z"
        />
        <path
          fill="#fff"
          d="M12 4.872c1.912 0 3.594.892 4.686 2.284l2.505-2.505C17.203 2.808 14.81 1.8 12 1.8c-3.97 0-7.402 2.283-9.064 5.607l2.94 2.284C6.833 6.98 9.213 4.872 12 4.872z"
        />
      </svg>
      Connect Google Calendar
    </button>
  );
};
