import { Modal, ModalContent, ModalTrigger } from "@/components/spring-modal";
import { cn } from "@/lib/utils";
import { CalendarResponseType } from "@/api_hooks/use-calendar";
import { Calendar, Clock, Users } from "lucide-react";
import { ComponentProps, FC, useState } from "react";
import MeetingInfo from "./meeting-info";
import useDate from "@/hooks/use-date";
import { useAuth } from "@/api_hooks/use-auth";

interface MeetingCardProps extends ComponentProps<"div"> {
  calendar: CalendarResponseType;
}

const MeetingCard: FC<MeetingCardProps> = ({
  calendar,
  className,
  ...props
}) => {
  const {user} = useAuth()
  const { getDuration } = useDate();
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);

  return (
    <Modal
      open={isInfoOpen}
      className={cn(
        "cursor-pointer bg-gray-100 border border-gray-200 p-4 rounded-xl hover:shadow-md transition-shadow",
        className
      )}
      {...props}
    >
      <ModalTrigger>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-medium  text-gray-900 truncate w-40 text-start">
              {calendar.summary}
            </h4>
            <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <p>
                {" "}
                {new Date(calendar.start.dateTime).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                at{" "}
                {new Date(calendar.start.dateTime).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              calendar.organizer.email == user?.email
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
           {calendar.organizer.email == user?.email ? 'Created' : "Invited"}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />{" "}
            {getDuration(calendar.start.dateTime, calendar.end.dateTime)}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {calendar.attendees.length} participants
          </div>
        </div>
      </ModalTrigger>

      <ModalContent>
        <MeetingInfo calendar={calendar} setIsInfoOpen={setIsInfoOpen}/>
      </ModalContent>
    </Modal>
  );
};

export default MeetingCard;

interface MeetingSkeletonCardProps extends ComponentProps<"div"> {}

export const MeetingSkeletonCard: FC<MeetingSkeletonCardProps> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "w-full cursor-pointer bg-gray-100 border border-gray-200 p-4 rounded-xl hover:shadow-md transition-shadow",
        className
      )}
      {...props}
    >
      <div className="flex animate-pulse space-x-4">
        <div className="size-10 rounded-full bg-gray-200"></div>
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 rounded bg-gray-200"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-2 rounded bg-gray-200"></div>
              <div className="col-span-1 h-2 rounded bg-gray-200"></div>
            </div>
            <div className="h-2 rounded bg-gray-200 pb-5"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
