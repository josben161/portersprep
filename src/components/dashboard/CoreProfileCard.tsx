"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";

// Document icon component
function DocumentIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

type Story = {
  id: string;
  title: string;
  summary?: string;
  tags?: string[];
};

export default function CoreProfileCard(){
  const [p, setP] = useState<any|null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [originalFileName, setOriginalFileName] = useState<string>("");

  useEffect(()=>{ (async()=>{
    try {
      const r = await fetch("/api/profile");
      if (r.ok) {
        const profileData = await r.json();
        console.log("Initial profile load:", profileData);
        setP(profileData);
      } else {
        // If profile doesn't exist or API fails, create a default one
        setP({
          name: "",
          email: "",
          subscription_tier: "free",
          resume_key: null,
          goals: "",
          industry: "",
          years_exp: null,
          gpa: null,
          gmat: null
        });
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      // Set default profile on error
      setP({
        name: "",
        email: "",
        subscription_tier: "free",
        resume_key: null,
        goals: "",
        industry: "",
        years_exp: null,
        gpa: null,
        gmat: null
      });
    } finally {
      setLoading(false);
    }
  })(); },[]);

  // Load stories
  useEffect(() => {
    async function loadStories() {
      try {
        const r = await fetch("/api/stories");
        if (r.ok) {
          const storiesData = await r.json();
          setStories(storiesData);
        }
      } catch (error) {
        console.error("Failed to load stories:", error);
      }
    }
    loadStories();
  }, []);

  async function uploadCV(file: File){
    setUploading(true);
    setMessage(null);
    setOriginalFileName(file.name); // Store original filename
    
    try {
      console.log("Starting CV upload for file:", file.name);
      
      // Use server-side upload to avoid CORS issues
      const formData = new FormData();
      formData.append('file', file);
      
      const r = await apiFetch("/api/upload-cv", {
        method: "POST",
        body: formData
      });
      
      if (!r.ok) {
        const errorText = await r.text();
        console.error("CV upload failed:", errorText);
        setMessage({ type: 'error', text: `Upload failed: ${errorText}` });
        return;
      }
      
      const result = await r.json();
      console.log("CV upload completed successfully:", result);
      
      // Update local state with new resume_key
      setP((prev: any) => ({ ...prev, resume_key: result.key }));
      
      setMessage({ type: 'success', text: `CV uploaded successfully!` });
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
      
    } catch (error) {
      console.error("CV upload error:", error);
      setMessage({ type: 'error', text: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setUploading(false);
    }
  }

  async function saveProfile(){
    setSaving(true);
    try {
      await apiFetch("/api/profile", { method:"PUT", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(p) });
      setMessage({ type: 'success', text: 'Profile saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) { 
      console.error("Profile save failed:", error);
      setMessage({ type: 'error', text: 'Failed to save profile' });
    } finally { setSaving(false); }
  }

  // Auto-save profile changes (debounced)
  useEffect(() => {
    if (p && !loading) {
      const timeoutId = setTimeout(() => {
        // Only auto-save if there are actual changes
        if (p.name || p.goals || p.industry || p.years_exp || p.gpa || p.gmat) {
          saveProfile();
        }
      }, 2000); // Debounce for 2 seconds
      
      return () => clearTimeout(timeoutId);
    }
  }, [p?.name, p?.goals, p?.industry, p?.years_exp, p?.gpa, p?.gmat]);

  async function removeCV(){
    if (!confirm("Remove CV from profile?")) return;
    
    setMessage(null);
    
    try {
      await apiFetch("/api/profile", { 
        method:"PUT", 
        headers:{ "Content-Type":"application/json" }, 
        body: JSON.stringify({ ...p, resume_key: null }) 
      });
      
      setP((prev: any) => ({ ...prev, resume_key: null }));
      setOriginalFileName(""); // Clear original filename
      setMessage({ type: 'success', text: 'CV removed successfully' });
      setTimeout(() => setMessage(null), 3000);
      
    } catch (error) {
      console.error("Failed to remove CV:", error);
      setMessage({ type: 'error', text: 'Failed to remove CV' });
    }
  }

  // Get filename - use original filename if available, otherwise extract from S3 key
  function getFileName(key: string) {
    if (originalFileName) return originalFileName;
    const parts = key.split('/');
    return parts[parts.length - 1] || 'CV';
  }

  // Get file extension for icon
  function getFileExtension(key: string) {
    const fileName = getFileName(key);
    return fileName.split('.').pop()?.toUpperCase() || 'PDF';
  }

  if (loading) return <section className="card p-4 text-sm text-muted-foreground">Loading profile…</section>;
  if (!p) return <section className="card p-4 text-sm text-muted-foreground">Failed to load profile</section>;

  return (
    <section className="card p-4">
      <div className="text-xs text-muted-foreground">Core Profile</div>
      <h3 className="text-base font-semibold">Resume & Story Bank</h3>
      
      {message && (
        <div className={`mt-3 rounded-md p-2 text-sm ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200' 
            : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <input className="rounded-md border px-3 py-2" placeholder="Name" value={p.name ?? ""} onChange={e=> setP((v:any)=>({...v, name: e.target.value}))} />
        <input className="rounded-md border px-3 py-2" placeholder="Industry" value={p.industry ?? ""} onChange={e=> setP((v:any)=>({...v, industry: e.target.value}))} />
        <input className="rounded-md border px-3 py-2" placeholder="Years experience" value={p.years_exp ?? ""} onChange={e=> setP((v:any)=>({...v, years_exp: e.target.value}))} />
        <input className="rounded-md border px-3 py-2" placeholder="GPA" value={p.gpa ?? ""} onChange={e=> setP((v:any)=>({...v, gpa: e.target.value}))} />
        <input className="rounded-md border px-3 py-2" placeholder="GMAT" value={p.gmat ?? ""} onChange={e=> setP((v:any)=>({...v, gmat: e.target.value}))} />
        <input className="sm:col-span-2 rounded-md border px-3 py-2" placeholder="Goals (1–2 lines)" value={p.goals ?? ""} onChange={e=> setP((v:any)=>({...v, goals: e.target.value}))} />
      </div>
      
      <div className="mt-3 flex gap-2">
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2 text-xs transition-colors" 
          onClick={saveProfile} 
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
        {saving && <span className="text-xs text-muted-foreground self-center">Auto-saving...</span>}
      </div>
      
      <div className="mt-4">
        {p.resume_key ? (
          <div className="rounded-md border p-3 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-12 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                  <DocumentIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {getFileName(p.resume_key)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {getFileExtension(p.resume_key)} • Available for applications
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="btn btn-outline text-xs" 
                  onClick={removeCV} 
                  disabled={uploading}
                  title="Remove CV"
                >
                  Remove
                </button>
                <label className={`btn btn-outline text-xs ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {uploading ? 'Uploading...' : 'Replace'}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx,.txt" 
                    disabled={uploading}
                    onChange={e=> { 
                      const f = e.target.files?.[0]; 
                      if (f) {
                        const ext = f.name.split('.').pop()?.toLowerCase();
                        const allowedExtensions = ['pdf', 'doc', 'docx', 'txt'];
                        if (!allowedExtensions.includes(ext || '')) {
                          setMessage({ type: 'error', text: `Please select a PDF, Word document, or text file. Got: .${ext}` });
                          return;
                        }
                        uploadCV(f); 
                      }
                    }} 
                  />
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 text-center">
            <DocumentIcon className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              No CV uploaded yet
            </div>
            <label className={`btn btn-outline text-xs ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {uploading ? 'Uploading...' : 'Upload CV'}
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.doc,.docx,.txt" 
                disabled={uploading}
                onChange={e=> { 
                  const f = e.target.files?.[0]; 
                  if (f) {
                    const ext = f.name.split('.').pop()?.toLowerCase();
                    const allowedExtensions = ['pdf', 'doc', 'docx', 'txt'];
                    if (!allowedExtensions.includes(ext || '')) {
                      setMessage({ type: 'error', text: `Please select a PDF, Word document, or text file. Got: .${ext}` });
                      return;
                    }
                    uploadCV(f); 
                  }
                }} 
              />
            </label>
          </div>
        )}
      </div>

      {/* Story Bank Section */}
      <div className="mt-6">
        <div className="text-xs text-muted-foreground mb-3">Story Bank</div>
        
        {/* Quick Add Story */}
        <div className="mb-3 rounded-md border p-3">
          <div className="text-xs text-muted-foreground mb-2">Quick Add Story</div>
          <input 
            className="w-full rounded-md border px-2 py-1 text-sm mb-2" 
            placeholder="Story title" 
            id="story-title"
            onKeyDown={async (e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const titleInput = document.getElementById('story-title') as HTMLInputElement;
                const descInput = document.getElementById('story-description') as HTMLTextAreaElement;
                const title = titleInput?.value?.trim();
                const description = descInput?.value?.trim();
                
                if (!title) {
                  setMessage({ type: 'error', text: 'Story title is required' });
                  return;
                }
                
                try {
                  const r = await apiFetch("/api/stories", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                      title, 
                      summary: description || "", 
                      tags: [] 
                    })
                  });
                  if (r.ok) {
                    const newStory = await r.json();
                    setStories(prev => [newStory, ...prev]);
                    titleInput.value = "";
                    descInput.value = "";
                    setMessage({ type: 'success', text: 'Story added successfully!' });
                    setTimeout(() => setMessage(null), 3000);
                  } else {
                    const errorText = await r.text();
                    setMessage({ type: 'error', text: `Failed to add story: ${errorText}` });
                  }
                } catch (error) {
                  console.error("Failed to add story:", error);
                  setMessage({ type: 'error', text: 'Failed to add story' });
                }
              }
            }}
          />
          <textarea 
            className="w-full rounded-md border px-2 py-1 text-sm mb-2 resize-none" 
            placeholder="Story description (optional)"
            rows={2}
            id="story-description"
          />
          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              Press Enter in title field to save
            </div>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-1 text-xs transition-colors"
              onClick={async () => {
                const titleInput = document.getElementById('story-title') as HTMLInputElement;
                const descInput = document.getElementById('story-description') as HTMLTextAreaElement;
                const title = titleInput?.value?.trim();
                const description = descInput?.value?.trim();
                
                if (!title) {
                  setMessage({ type: 'error', text: 'Story title is required' });
                  return;
                }
                
                try {
                  const r = await apiFetch("/api/stories", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                      title, 
                      summary: description || "", 
                      tags: [] 
                    })
                  });
                  if (r.ok) {
                    const newStory = await r.json();
                    setStories(prev => [newStory, ...prev]);
                    titleInput.value = "";
                    descInput.value = "";
                    setMessage({ type: 'success', text: 'Story added successfully!' });
                    setTimeout(() => setMessage(null), 3000);
                  } else {
                    const errorText = await r.text();
                    setMessage({ type: 'error', text: `Failed to add story: ${errorText}` });
                  }
                } catch (error) {
                  console.error("Failed to add story:", error);
                  setMessage({ type: 'error', text: 'Failed to add story' });
                }
              }}
            >
              Add Story
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          {stories.map((story) => (
            <div key={story.id} className="rounded-md border p-3">
              <div className="text-sm font-medium">{story.title}</div>
              {story.summary && (
                <div className="text-xs text-muted-foreground mt-1">{story.summary}</div>
              )}
              {story.tags && story.tags.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {story.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {stories.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-4">
              No stories yet. Add your first story above!
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 