import { SettingsForm } from "@/components/admin/SettingsForm";
import { getClinicSettings } from "@/lib/clinic-settings";
import { requireAuth } from "@/lib/session";

export default async function AdminSettingsPage() {
  await requireAuth();
  const settings = await getClinicSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-600">
          Update clinic contact details, hours, and lead notification email. Changes
          apply across the website immediately.
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
