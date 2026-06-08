export type EventType = "CALL_CLICK" | "WHATSAPP_CLICK" | "FORM_SUBMIT";

const SESSION_KEY = "dental_session_id";

export function getSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function trackEvent(type: EventType, page?: string): void {
  const pathname =
    page ?? (typeof window !== "undefined" ? window.location.pathname : "/");

  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type,
      page: pathname,
      sessionId: getSessionId(),
    }),
  }).catch(() => {});
}

export function formatWhatsAppUrl(whatsapp: string): string {
  const digits = whatsapp.replace(/\D/g, "");
  const normalized = digits.startsWith("91") ? digits.slice(2) : digits;
  return `https://wa.me/91${normalized}?text=Hi%2C%20I%20would%20like%20to%20book%20an%20appointment`;
}

export function openWhatsApp(whatsapp: string): void {
  window.open(formatWhatsAppUrl(whatsapp), "_blank", "noopener,noreferrer");
}
