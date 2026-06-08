import { AdminShell } from "@/components/admin/AdminShell";
import { getClinicSettings } from "@/lib/clinic-settings";
import { requireAuth } from "@/lib/session";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireAuth();
  const settings = await getClinicSettings();

  return (
    <AdminShell adminName={session.adminName} clinicName={settings.clinicName}>
      {children}
    </AdminShell>
  );
}
