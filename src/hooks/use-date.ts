const useDate = () => {
  const formatStandardizedDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const formatDescribableDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  function getDuration(startDateTime: string, endDateTime: string) {
    const start = new Date(startDateTime) as any;
    const end = new Date(endDateTime) as any;

    const durationMs = end - start; 
    const durationSec = durationMs / 1000;

    if (durationSec < 60) {
      return `${Math.round(durationSec)}s`; 
    }

    const durationMin = durationSec / 60;
    if (durationMin < 60) {
      return `${Math.round(durationMin)}m`; 
    }

    const durationHours = durationMin / 60; 
    return `${durationHours.toFixed(1)}h`; 
  }

  return {
    formatStandardizedDate,
    formatDescribableDate,
    getDaysInMonth,
    getDuration,
  };
};

export default useDate;
