import { ComponentProps, FC, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MeetingCard, { MeetingSkeletonCard } from "./meeting-card";
import { HorizontalScroll } from "@/components/horizontal-scroll";
import { VerticalScroll } from "@/components/vertical-scroll";
import useDate from "@/hooks/use-date";
import { useCalender } from "@/api_hooks/use-calendar";

interface CalendarProps extends ComponentProps<"div"> {}

const Calendar: FC<CalendarProps> = ({ className, ...props }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { getCalendarsQuery } = useCalender();
  const { formatDescribableDate, getDaysInMonth, formatStandardizedDate } =
    useDate();
  const { setStartDateTime, setEndDateTime } = useCalender();

  useEffect(() => {
    setStartDateTime(`${formatStandardizedDate(selectedDate)}T00:00:00Z`);
    setEndDateTime(`${formatStandardizedDate(selectedDate)}T23:59:59Z`);
  }, [selectedDate]);

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const upcomingCalendars = getCalendarsQuery.data?.length
    ? getCalendarsQuery.data.filter(
        (e) => new Date(e.start.dateTime) > new Date()
      )
    : [];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 flex-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Calendar</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg font-medium">
            {currentMonth.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {getDaysInMonth(currentMonth).map((day, index) => (
          <button
            key={index}
            onClick={() => day && setSelectedDate(day)}
            className={`cursor-pointer aspect-square p-2 rounded-lg text-sm relative ${
              !day ? "invisible" : "hover:bg-gray-100"
            }
      ${
        selectedDate && day && selectedDate.getDate() === day.getDate()
          ? "bg-blue-100"
          : ""
      } ${
              day?.toDateString() == new Date().toDateString()
                ? "border border-blue-200 "
                : "no"
            }`}
          >
            {day?.getDate()}
          </button>
        ))}
      </div>

      {/* Upcoming Meetings */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold mb-4">
          Upcoming Meetings for {formatDescribableDate(selectedDate)}
        </h3>
        <HorizontalScroll className="w-full">
          {upcomingCalendars.length
            ? upcomingCalendars.map((calendar, index) => (
                <MeetingCard calendar={calendar} key={index} />
              ))
            : getCalendarsQuery.isFetched && (
                <div className="h-28 ">
                  {" "}
                  <p className="text-gray-500 text-sm">
                    No upcoming meetings are there 😃
                  </p>
                </div>
              )}

          {getCalendarsQuery.isLoading &&
            new Array(2)
              .fill(null)
              .map((_, index) => <MeetingSkeletonCard key={index} />)}
        </HorizontalScroll>
      </div>

      {/* Meeting List */}
      {selectedDate && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            Meetings for {formatDescribableDate(selectedDate)}
          </h3>
          <VerticalScroll className="space-y-4" height="45vh">
            {getCalendarsQuery.data?.length
              ? getCalendarsQuery.data.map((calendar, index) => (
                  <MeetingCard calendar={calendar} key={index} />
                ))
              : getCalendarsQuery.isFetched && (
                  <div className="h-28 ">
                    {" "}
                    <p className="text-gray-500 text-sm">
                      No meetings scheduled for this day 😃
                    </p>
                  </div>
                )}
            {getCalendarsQuery.isLoading &&
              new Array(2)
                .fill(null)
                .map((_, index) => <MeetingSkeletonCard key={index} />)}
          </VerticalScroll>
        </div>
      )}
    </div>
  );
};

export default Calendar;
