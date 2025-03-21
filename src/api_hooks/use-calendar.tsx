import { cn } from "@/lib/utils";
import { CreateMeetingType } from "@/schemas/create-meeting-schema";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import {
  ComponentProps,
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

axios.defaults.withCredentials = true;

export type CalendarResponseType = {
  kind: string;
  etag: string;
  location: string;
  description: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  creator: {
    email: string;
  };
  organizer: {
    email: string;
  };
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  recurringEventId: string;
  originalStartTime: {
    dateTime: string;
    timeZone: string;
  };
  iCalUID: string;
  sequence: number;
  attendees: Array<{
    email: string;
    responseStatus: string;
  }>;
  hangoutLink: string;
  conferenceData: {
    entryPoints: Array<{
      entryPointType: string;
      uri: string;
      pin: string;
      regionCode: string;
      label: string;
    }>;
    conferenceSolution: {
      key: {
        type: string;
      };
      name: string;
      iconUri: string;
    };
    conferenceId: string;
  };
  reminders: {
    useDefault: true;
  };
  eventType: string;
};

type CalendarContextProps = {
  getCalendarsQuery: UseQueryResult<CalendarResponseType[], Error>;
  createMeeting: (data: CreateMeetingType) => any;
  deleteMeeting: (eventId: string) => any;
  startDateTime: string;
  setStartDateTime: Dispatch<SetStateAction<string>>;
  endDateTime: string;
  setEndDateTime: Dispatch<SetStateAction<string>>;
};

const CalendarContext = createContext<CalendarContextProps | undefined>(
  undefined
);

interface CalendarProviderProps extends ComponentProps<"div"> {
  defaultStartDateTime: string;
  defaultEndDateTime: string;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({
  defaultStartDateTime,
  defaultEndDateTime,
  className,
  children,
  ...props
}) => {
  const [startDateTime, setStartDateTime] =
    useState<string>(defaultStartDateTime);
  const [endDateTime, setEndDateTime] = useState<string>(defaultEndDateTime);

  const getCalendarsQuery = useQuery({
    queryKey: ["google-calendar-meetings", startDateTime, endDateTime],
    queryFn: () => getMeetings(startDateTime, endDateTime),
  }) as UseQueryResult<Array<CalendarResponseType>, Error>;

  const apiEndPoint = process.env.NEXT_PUBLIC_BACKEND_API;

  const createMeeting = async (data: CreateMeetingType) => {
    try {
      const response = await axios.post(
        `${apiEndPoint}/api/google-calendar/create_meeting`,
        data
      );

      return response.data;
    } catch (error) {
      console.error("Error creating meeting:", error);
      throw error;
    }
  };

  const getMeetings = async (startDate: string, endDate: string) => {
    const response = await axios.get(
      `${apiEndPoint}/api/google-calendar/meetings`,
      {
        params: { start_date: startDate, end_date: endDate },
        withCredentials: true,
      }
    );

    if (response.data.error) throw new Error(response.data.error);

    return response.data;
  };

  const deleteMeeting = async (eventId: string) => {
    const response = await axios.post(
      `${apiEndPoint}/api/google-calendar/delete_meeting`,
      { event_id: eventId },
      { withCredentials: true }
    );

    if (response.data.error) throw new Error(response.data.error);

    return response.data;
  };

  return (
    <CalendarContext.Provider
      value={{
        getCalendarsQuery,
        createMeeting,
        deleteMeeting,
        startDateTime,
        setStartDateTime,
        endDateTime,
        setEndDateTime,
      }}
    >
      <div className={cn("", className)} {...props}>
        {children}
      </div>
    </CalendarContext.Provider>
  );
};

export const useCalender = (): CalendarContextProps => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
