import { useState } from "react";
import { useAppStore, Project } from "@/store/useAppStore";
import { createProject } from "@/lib/firestore";

interface Props {
  onClose: () => void;
  onCreated: (project: Project) => void;
}

export default function CreateProjectModal({ onClose, onCreated }: Props) {
  const user = useAppStore((s) => s.user);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !title.trim()) return;
    setLoading(true);
    setError("");
    try {
      const data: Omit<Project, "id" | "createdAt"> = {
        title: title.trim(),
        description: description.trim(),
        googleDriveFolderId: "",
        scriptContent: "",
        notes: [],
        linkedVideoId: "",
      };
      const id = await createProject(user.uid, data);
      onCreated({ ...data, id, createdAt: Date.now() });
      onClose();
    } catch (e: any) {
      setError(e.message ?? "Failed to create project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-base font-semibold text-white mb-4">New Project</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Project Title *</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How I Built a $1M Business"
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-violet-500 placeholder:text-zinc-600"
              required
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this video about?"
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-violet-500 placeholder:text-zinc-600 resize-none"
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <div className="flex items-center gap-2 justify-end mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="px-5 py-2 text-sm bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
