"use client";

import type { MouseEvent, ReactNode } from "react";

import { openWhatsApp, trackEvent } from "@/lib/track-event";

type TrackedWhatsAppLinkProps = {
  whatsapp: string;
  children: ReactNode;
  className?: string;
};

export function TrackedWhatsAppLink({
  whatsapp,
  children,
  className,
}: TrackedWhatsAppLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    trackEvent("WHATSAPP_CLICK");
    openWhatsApp(whatsapp);
  }

  return (
    <a
      href="#"
      onClick={handleClick}
      className={className}
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
