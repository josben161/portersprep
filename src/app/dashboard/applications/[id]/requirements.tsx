import { getSchoolData } from "@/lib/schools";
import { getApplication } from "@/lib/apps";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import RequirementsPanel from "@/components/RequirementsPanel";

export default async function Requirements({ appId }: { appId: string }) {
  // Get application and school data
  const app = await getApplication(appId);
  const sb = getAdminSupabase();
  const { data: sch } = await sb.from("schools").select("slug,name").eq("id", app.school_id).single();
  
  // Load school JSON data using the slug
  const json = sch?.slug ? await getSchoolData(sch.slug) : null;

  if (!json) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        No local data for this school yet. Please check back later or contact support.
      </div>
    );
  }

  return <RequirementsPanel appId={appId} school={json} />;
} 