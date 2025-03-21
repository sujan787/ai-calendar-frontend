import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  FC,
  ComponentProps,
  useCallback,
} from "react";
import { Clock, Search, ChevronDown, ChevronUp } from "lucide-react";

interface TimezoneSelectorProps extends ComponentProps<"div"> {
  onchange: (selectedTimezone: string) => void;
}

export const TimezoneSelector: FC<TimezoneSelectorProps> = ({
  onchange,
  className,
  ...props
}) => {
  const [selectedTimezone, setSelectedTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onchange(selectedTimezone);
  }, [selectedTimezone, onchange]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const timezones = useMemo(() => {
    const COMMON_TIMEZONES = new Set([
      "Europe/London",
      "Asia/Kolkata",
      "America/New_York",
      "Asia/Dubai",
      "Asia/Singapore",
      "Europe/Paris",
      "Asia/Tokyo",
      "Australia/Sydney",
      "Pacific/Auckland",
    ]);

    return Intl.supportedValuesOf("timeZone")
      .map((zone) => ({
        name: zone,
        displayName: zone.replace("_", " ").replace("/", " - "),
        currentTime: new Intl.DateTimeFormat("en-US", {
          timeZone: zone,
          timeStyle: "short",
        }).format(),
        isCommon: COMMON_TIMEZONES.has(zone),
      }))
      .sort((a, b) =>
        a.isCommon !== b.isCommon
          ? a.isCommon
            ? -1
            : 1
          : a.displayName.localeCompare(b.displayName)
      );
  }, []);

  const filteredTimezones = useMemo(
    () =>
      timezones.filter(
        (tz) =>
          tz.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tz.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [timezones, searchQuery]
  );

  const handleSelectTimezone = useCallback((tz: string) => {
    setSelectedTimezone(tz);
    setIsOpen(false);
    setSearchQuery("");
  }, []);

  const selectedItem = timezones.find((tz) => tz.name === selectedTimezone);

  return (
    <div className={`w-full max-w-md mx-auto ${className || ""}`} {...props}>
      <div className="relative" ref={dropdownRef}>
        <button
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg  flex items-center justify-between"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
          <span className="truncate">
            {selectedItem?.displayName} ({selectedItem?.currentTime})
          </span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  id="timezone-input"
                  ref={searchInputRef}
                  type="text"
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search timezone..."
                  value={searchQuery || ""}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-72">
              {filteredTimezones.map((tz) => (
                <div
                  key={tz.name}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${
                    tz.isCommon ? "bg-blue-50" : ""
                  } ${selectedTimezone === tz.name ? "bg-blue-100" : ""}`}
                  onClick={() => handleSelectTimezone(tz.name)}
                >
                  <div className="flex justify-between items-center">
                    <span className={tz.isCommon ? "font-medium" : ""}>
                      {tz.displayName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {tz.currentTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimezoneSelector;
