"use client";

import type { MouseEvent, ReactNode } from "react";

import { trackEvent } from "@/lib/track-event";

type TrackedCallLinkProps = {
  phone: string;
  children: ReactNode;
  className?: string;
  page?: string;
};

export function TrackedCallLink({
  phone,
  children,
  className,
  page,
}: TrackedCallLinkProps) {
  function handleClick() {
    trackEvent("CALL_CLICK", page);
  }

  function handleClickWithStop(event: MouseEvent<HTMLAnchorElement>) {
    handleClick();
    // Allow default tel: navigation
    event.stopPropagation();
  }

  return (
    <a href={`tel:${phone}`} className={className} onClick={handleClickWithStop}>
      {children}
    </a>
  );
}
