import { cn } from "@/lib/utils";
import { CalendarIcon, Clock, Trash2, Users } from "lucide-react";
import { ComponentProps, FC, useEffect, useState } from "react";
import SubmitButton from "../../../components/submit-button";
import { TimezoneSelector } from "@/components/timezone-selector";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  createMeetingSchema,
  CreateMeetingType,
} from "@/schemas/create-meeting-schema";
import { FieldErrors, useForm } from "react-hook-form";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useCalender } from "@/api_hooks/use-calendar";

interface MeetingFormProps extends ComponentProps<"form"> {}

const MeetingForm: FC<MeetingFormProps> = ({ className, ...props }) => {
  const { createMeeting, getCalendarsQuery, startDateTime } = useCalender();

  const localDate = new Date(startDateTime).toISOString().split("T")[0];
  const localTime = new Date(startDateTime)
    .toTimeString()
    .split(" ")[0]
    .slice(0, 5);

  const [startDate, setStartDate] = useState<string>(localDate);
  const [startTime, setStartTime] = useState<string>(localTime);

  const [endDate, setEndDate] = useState<string>(localDate);
  const [endTime, setEndTime] = useState<string>(localTime);

  useEffect(() => {
    setStartDate(localDate);
    setStartTime(localTime);

    setEndDate(localDate);
    setEndTime(localTime);
  }, [startDateTime]);

  const [attendees, setAttendees] = useState<Array<string>>([""]);

  useEffect(() => {
    if (startDate && startTime) {
      setValue("start_time", `${startDate}T${startTime}:00`);
    }

    if (endDate && endTime) {
      setValue("end_time", `${endDate}T${endTime}:00`);
    }
  }, [startDate, startTime, endDate, endTime]);

  useEffect(() => {
    setValue(
      "attendees",
      attendees.filter((e) => e.length)
    );
  }, [attendees]);

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    setValue,
    reset,
  } = useForm<CreateMeetingType>({
    defaultValues: {
      summary: "",
      description: "",
      time_zone: "",
      start_time: "",
      end_time: "",
      attendees: [],
      video_conference: false,
    },
    resolver: yupResolver(createMeetingSchema),
  });

  const createMeetingMutation = useMutation({
    mutationFn: createMeeting,
    onSuccess: (data: { status: string; event_id: string }) => {
      getCalendarsQuery.refetch();
      toast.success(
        "Your meeting have schedule, all participants will be notified soon"
      );

      reset();
      setAttendees([""]);
    },
    onError: (error: any) => {
      const errorMessage = error.response.data.error;
      toast.error(errorMessage ?? "Something Went Wrong");
    },
  }) as UseMutationResult<
    { status: string; event_id: string },
    Error,
    CreateMeetingType,
    unknown
  >;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 flex-1">
      <h2 className="text-xl font-semibold text-gray-900"></h2>
      <form
        className={cn("space-y-4 mt-2", className)}
        {...props}
        onSubmit={handleSubmit((data) => createMeetingMutation.mutate(data))}
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Meeting Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            placeholder="Enter meeting title"
            {...register("summary")}
            required
          />
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Timezone
          </label>
          <TimezoneSelector
            onchange={(value) => setValue("time_zone", value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="start-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                Start Date
              </div>
            </label>
            <input
              type="date"
              id="start-date"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="start-time"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Start Time
              </div>
            </label>
            <input
              type="time"
              id="start-time"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="end-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                End Date
              </div>
            </label>
            <input
              type="date"
              id="end-date"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="end-time"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                End Time
              </div>
            </label>
            <input
              type="time"
              id="end-time"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Participants
            </div>
          </label>

          {attendees.map((email, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2"
            >
              <input
                type="email"
                id={`email-${index}`}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                placeholder="Enter the email Id (example: user@gmail.com)"
                value={email}
                onChange={(e) => {
                  let emails = structuredClone(attendees);
                  emails[index] = e.target.value;

                  if (!emails.filter((e) => e == "").length) {
                    setAttendees([...emails, ""]);
                  } else {
                    setAttendees([...emails]);
                  }
                }}
              />

              {index != attendees.length - 1 && (
                <button
                  className=" cursor-pointer "
                  onClick={() => {
                    let emails = structuredClone(attendees);
                    setAttendees(emails.filter((_, ind) => ind != index));
                  }}
                >
                  <Trash2 className=" text-red-400" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            <div className="flex items-center gap-2">Description</div>
          </label>
          <textarea
            id="description"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            placeholder="Write the description about the meeting"
            rows={3}
            {...register("description")}
          />
        </div>

        <div className="flex items-center">
          <input
            onChange={(e) => setValue("video_conference", e.target.checked)}
            id="video-conference"
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor="video-conference"
            className="ms-2 text-sm font-medium text-gray-900"
          >
            Video Conference
          </label>
        </div>

        <SubmitButton
          type="submit"
          disabled={isDirty}
          isLoading={createMeetingMutation.isPending}
        >
          Schedule Meeting
        </SubmitButton>

        <ErrorCard errors={errors} />
      </form>
    </div>
  );
};

export default MeetingForm;

interface ErrorCardProps extends ComponentProps<"div"> {
  errors: FieldErrors<{
    summary: string;
    attendees: (string | undefined)[];
    description: string;
    start_time: string;
    end_time: string;
    time_zone: string;
    video_conference: NonNullable<boolean | undefined>;
  }>;
}

const ErrorCard: FC<ErrorCardProps> = ({ errors, className }) => {
  const errorMessages = Object.values(errors)
    .flat()
    .map((error: any) => error["message"]);

  return errorMessages.length ? (
    <div className=" border border-red-500 rounded-md p-3 space-y-2">
      {errorMessages.map((error, index) => (
        <li key={index} className=" text-red-500">
          {error}
        </li>
      ))}
    </div>
  ) : (
    ""
  );
};
