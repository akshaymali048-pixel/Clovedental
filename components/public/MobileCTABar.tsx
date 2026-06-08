"use client";

import Link from "next/link";

import { TrackedCallLink } from "@/components/public/TrackedCallLink";
import { openWhatsApp, trackEvent } from "@/lib/track-event";

type MobileCTABarProps = {
  phone: string;
  whatsapp: string | null;
};

export function MobileCTABar({ phone, whatsapp }: MobileCTABarProps) {
  function handleWhatsAppClick() {
    if (!whatsapp) return;
    trackEvent("WHATSAPP_CLICK");
    openWhatsApp(whatsapp);
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-lg items-stretch divide-x divide-slate-200">
        <TrackedCallLink
          phone={phone}
          className="flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold text-[#0d6e6e]"
        >
          <span aria-hidden>📞</span>
          Call
        </TrackedCallLink>

        {whatsapp ? (
          <button
            type="button"
            onClick={handleWhatsAppClick}
            className="flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold text-[#25D366]"
          >
            <span aria-hidden>💬</span>
            WhatsApp
          </button>
        ) : null}

        <Link
          href="/#book"
          className="flex flex-1 items-center justify-center gap-2 bg-[#e07a4f] py-3.5 text-sm font-semibold text-white"
        >
          Book
        </Link>
      </div>
    </div>
  );
}
