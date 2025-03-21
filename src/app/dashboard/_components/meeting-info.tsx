"use client";

import { ComponentProps, Dispatch, FC, SetStateAction, useState } from "react";
import {
  Trash2,
  Copy,
  Video,
  Phone,
  ChevronDown,
  MessageSquare,
  Mail,
  ChevronUp,
} from "lucide-react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import SubmitButton from "@/components/submit-button";
import { toast } from "react-toastify";
import { CalendarResponseType, useCalender } from "@/api_hooks/use-calendar";

interface MeetingInfoProps extends ComponentProps<"div"> {
  calendar: CalendarResponseType;
  setIsInfoOpen: Dispatch<SetStateAction<boolean>>;
}

const MeetingInfo: FC<MeetingInfoProps> = ({
  calendar,
  setIsInfoOpen,
  className,
  ...props
}) => {
  console.log(calendar)
  const [isGuestListExpanded, setIsGuestListExpanded] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const colors = [
    "bg-purple-500",
    "bg-pink-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-orange-500",
  ];

  const entryPoint = (calendar?.conferenceData?.entryPoints ?? []).find(
    (e) => e.entryPointType == "phone"
  );

  const { deleteMeeting, getCalendarsQuery } = useCalender();

  const deleteMeetingMutation = useMutation({
    mutationFn: deleteMeeting,
    onSuccess: () => {
      getCalendarsQuery.refetch();
      toast.success("Meeting has been delete successfully");
      setIsInfoOpen(false);
    },
    onError: () => {
      // toast.error("something we wrong");
    },
  }) as UseMutationResult<{ status: string; event_id: string }, Error, string>;

  return (
    <div className={cn(" text-gray-900 rounded-lg w-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#4285f4] rounded-sm"></div>
            <h1 className="text-xl font-medium">{calendar.summary}</h1>
          </div>
          <p className=" truncate">organizer : {calendar.organizer.email}</p>
        </div>
        <div className="flex items-center gap-2">
          {!showDelete ? (
            <button
              className="p-2 hover:bg-gray-100 rounded-full text-gray-600 cursor-pointer"
              onClick={() => setShowDelete(true)}
            >
              <Trash2 size={20} />
            </button>
          ) : (
            <SubmitButton
              type="button"
              isLoading={deleteMeetingMutation.isPending}
              className="p-2 rounded-full whitespace-nowrap
          bg-red-400 text-white text-xs cursor-pointer hover:bg-red-400"
              onClick={() => deleteMeetingMutation.mutate(calendar.id)}
            >
              Confirm Delete
            </SubmitButton>
          )}
        </div>
      </div>

      {/* Date and Time */}
      <div className="px-6 py-2">
        <p className="text-gray-700">
          {new Date(calendar.start.dateTime).toDateString()} •{" "}
          {new Date(calendar.start.dateTime).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          –{" "}
          {new Date(calendar.end.dateTime).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        {calendar.description && (
          <div
            className={`text-gray-500 text-sm mt-1  ${
              calendar.description.length > 50
                ? "overflow-y-scroll h-[10vh]"
                : ""
            }`}
          >
            <p dangerouslySetInnerHTML={{ __html: calendar.description }} />
          </div>
        )}
      </div>

      {/* Google Meet Button */}
      {calendar.hangoutLink && (
        <div className="px-6 py-3">
          <a
            target="_blank"
            href={calendar.hangoutLink}
            className="flex w-[16rem] cursor-pointer items-center gap-2 bg-[#1a73e8] text-white px-6 py-2 rounded-full font-medium hover:bg-[#1557b0] transition-colors"
          >
            <Video size={20} />
            Join with Google Meet
          </a>
          <div className="mt-2 text-sm text-[#1a73e8]">
            {calendar.hangoutLink}
          </div>
        </div>
      )}

      {/* Phone Details */}
      {entryPoint && (
        <div className="px-6 py-2">
          <div className="flex items-center gap-2 text-[#1a73e8] mb-1">
            <Phone size={16} />
            <span>Join by phone</span>
          </div>
          <p className="text-gray-700 text-sm">
            ({entryPoint?.regionCode}) {entryPoint?.label} PIN:{" "}
            {entryPoint?.pin}#
          </p>
          <button className="text-[#1a73e8] text-sm mt-1 hover:text-[#1557b0]">
            More phone numbers
          </button>
        </div>
      )}

      {/* Location */}
      <div className="px-6 py-2">
        <p className="text-gray-700">
          location: {calendar.location ?? "unknown"}
        </p>
      </div>

      {/* Guests */}
      <div className="px-6 py-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-gray-700">{calendar.attendees.length} guests</h2>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
              <Copy size={18} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
              <MessageSquare size={18} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
              <Mail size={18} />
            </button>
            <button
              className="cursor-pointer p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-transform"
              onClick={() => setIsGuestListExpanded(!isGuestListExpanded)}
            >
              {isGuestListExpanded ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          {
            calendar.attendees.filter((e) => e.responseStatus == "accepted")
              .length
          }{" "}
          Yes,{" "}
          {
            calendar.attendees.filter((e) => e.responseStatus == "needsAction")
              .length
          }{" "}
          awaiting
        </p>

        {/* Guest List */}
        <div
          className={`mt-3 space-y-2 overflow-y-auto transition-all duration-300 ease-in-out ${
            isGuestListExpanded ? "max-h-44" : "max-h-0"
          }`}
        >
          {calendar.attendees.map((guest, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full ${
                  colors[Math.floor(Math.random() * 7)]
                }  flex items-center justify-center text-white`}
              >
                <span className="text-sm">{guest.email.split("")?.[0]}</span>
              </div>
              <div>
                <p className="text-gray-700 truncate w-72">{guest.email}</p>
                <p className="text-gray-500 text-sm">{guest.responseStatus}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      {/* <div className="p-4 border-t border-gray-200 mt-4">
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Going?</span>
          <button className="bg-gray-100 text-gray-700 px-4 py-1 rounded-full flex items-center gap-1 hover:bg-gray-200">
            Yes
            <ChevronDown size={16} />
          </button>
          <button className="text-[#1a73e8] px-4 py-1 rounded-full hover:bg-gray-100">
            No
          </button>
          <button className="text-[#1a73e8] px-4 py-1 rounded-full hover:bg-gray-100">
            Maybe
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default MeetingInfo;
