import type { ClinicTimings } from "@/lib/clinic-settings";

export type DayHoursRow = {
  day: string;
  dayIndex: number;
  hours: string;
  closed: boolean;
};

const WEEK_DAYS: { name: string; dayIndex: number }[] = [
  { name: "Sunday", dayIndex: 0 },
  { name: "Monday", dayIndex: 1 },
  { name: "Tuesday", dayIndex: 2 },
  { name: "Wednesday", dayIndex: 3 },
  { name: "Thursday", dayIndex: 4 },
  { name: "Friday", dayIndex: 5 },
  { name: "Saturday", dayIndex: 6 },
];

function hoursForDay(dayName: string, timings: ClinicTimings): string {
  const closedDays = timings.closed ?? [];

  if (closedDays.includes(dayName)) {
    return "Closed";
  }

  if (dayName === "Saturday" && timings.saturday) {
    return timings.saturday;
  }

  if (dayName === "Sunday" && timings.sunday) {
    return timings.sunday;
  }

  if (
    ["Tuesday", "Wednesday", "Thursday", "Friday"].includes(dayName) &&
    timings.weekdays
  ) {
    return timings.weekdays;
  }

  if (dayName === "Monday") {
    return "Closed";
  }

  return timings.weekdays ?? "Contact us";
}

export function buildWeeklySchedule(timings: ClinicTimings): DayHoursRow[] {
  return WEEK_DAYS.map(({ name, dayIndex }) => {
    const hours = hoursForDay(name, timings);
    return {
      day: name,
      dayIndex,
      hours,
      closed: hours === "Closed",
    };
  });
}

export function getMapsEmbedUrl(
  address: string,
  googleMapsUrl: string | null,
): string {
  if (googleMapsUrl) {
    if (googleMapsUrl.includes("output=embed")) {
      return googleMapsUrl;
    }
    if (googleMapsUrl.includes("/maps/embed")) {
      return googleMapsUrl;
    }
  }

  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}

export { siteUrl } from "@/lib/seo";
