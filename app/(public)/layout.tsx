import { MobileCTABar } from "@/components/public/MobileCTABar";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteNav } from "@/components/public/SiteNav";
import { WhatsAppFAB } from "@/components/public/WhatsAppFAB";
import { getClinicSettings } from "@/lib/clinic-settings";
import { getAllServices } from "@/lib/services";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getClinicSettings();
  const services = getAllServices();

  return (
    <>
      <SiteNav
        clinicName={settings.clinicName}
        phone={settings.phone}
        services={services}
      />
      <main className="pb-[72px] md:pb-0">{children}</main>
      <SiteFooter
        clinicName={settings.clinicName}
        phone={settings.phone}
        address={settings.address}
        googleMapsUrl={settings.googleMapsUrl}
        timings={settings.timings}
      />
      <MobileCTABar phone={settings.phone} whatsapp={settings.whatsapp} />
      {settings.whatsapp ? <WhatsAppFAB whatsapp={settings.whatsapp} /> : null}
    </>
  );
}
