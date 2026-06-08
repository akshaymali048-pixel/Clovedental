import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const hasUpstash =
  Boolean(process.env.UPSTASH_REDIS_REST_URL) &&
  Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

export const appointmentRatelimit = hasUpstash
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      analytics: false,
      prefix: "dental:appointment",
    })
  : null;

export async function checkAppointmentRateLimit(ip: string): Promise<boolean> {
  if (!appointmentRatelimit) {
    return true;
  }

  const { success } = await appointmentRatelimit.limit(ip);
  return success;
}
