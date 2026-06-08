import type { LeadActivity } from "@prisma/client";

import { formatAbsoluteTime, formatRelativeTime } from "@/lib/format-date";

type LeadActivityFeedProps = {
  activities: LeadActivity[];
};

// createdBy convention:
// - "system" = auto-generated server entries (reserved string)
// - adminName = human actions from the admin panel

export function LeadActivityFeed({ activities }: LeadActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-800">Activity</h3>
        <p className="mt-3 text-sm text-slate-500">No activity recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-slate-800">Activity</h3>

      <ul className="mt-4 space-y-4">
        {activities.map((activity) => {
          const isSystem = activity.createdBy === "system";

          return (
            <li
              key={activity.id}
              className="border-l-2 border-slate-200 pl-4"
            >
              <p
                className={
                  isSystem
                    ? "text-sm italic text-slate-400"
                    : "text-sm text-slate-800"
                }
              >
                {activity.action}
              </p>
              <p
                className={`mt-1 text-xs ${isSystem ? "text-slate-400" : "text-slate-500"}`}
              >
                {isSystem ? "System" : activity.createdBy}
                {" · "}
                <time
                  dateTime={activity.createdAt.toISOString()}
                  title={formatAbsoluteTime(activity.createdAt)}
                >
                  {formatRelativeTime(activity.createdAt)}
                </time>
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
