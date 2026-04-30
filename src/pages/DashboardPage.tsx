import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, Project } from "@/store/useAppStore";
import { getUserProjects, deleteProject } from "@/lib/firestore";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import CreateProjectModal from "@/components/dashboard/CreateProjectModal";

function ProjectCard({ project, onOpen, onDelete }: { project: Project; onOpen: () => void; onDelete: () => void }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 flex flex-col gap-3 cursor-pointer group transition-colors"
      onClick={onOpen}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center shrink-0">
          <svg width="14" height="14" fill="none" stroke="#a78bfa" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirming) {
              onDelete();
            } else {
              setConfirming(true);
              setTimeout(() => setConfirming(false), 2500);
            }
          }}
          className={`text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${confirming ? "bg-red-500 text-white" : "bg-zinc-800 text-zinc-500 hover:text-red-400"}`}
        >
          {confirming ? "Confirm" : "Delete"}
        </button>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-white leading-snug">{project.title}</h3>
        {project.description && (
          <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{project.description}</p>
        )}
      </div>
      <div className="flex items-center gap-3 text-xs text-zinc-600 mt-auto">
        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
        {project.notes.length > 0 && <span>{project.notes.length} note{project.notes.length > 1 ? "s" : ""}</span>}
        {project.linkedVideoId && <span className="text-violet-400">Linked</span>}
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const user = useAppStore((s) => s.user);
  const projects = useAppStore((s) => s.projects);
  const setProjects = useAppStore((s) => s.setProjects);
  const setActiveProject = useAppStore((s) => s.setActiveProject);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) return;
    getUserProjects(user.uid).then((p) => {
      setProjects(p);
      setLoading(false);
    });
  }, [user]);

  async function handleDelete(project: Project) {
    if (!user) return;
    await deleteProject(user.uid, project.id);
    setProjects(projects.filter((p) => p.id !== project.id));
  }

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-bold text-white text-sm">CreatorFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img
                src={user?.photoURL ?? ""}
                alt={user?.displayName ?? ""}
                className="w-7 h-7 rounded-full"
              />
              <span className="text-xs text-zinc-400 hidden sm:block">{user?.displayName}</span>
            </div>
            <button
              onClick={() => signOut(auth)}
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors px-2 py-1"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto w-full px-6 py-8 flex-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Your Projects</h1>
            <p className="text-xs text-zinc-500 mt-0.5">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-medium transition-colors"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Project
          </button>
        </div>

        {projects.length > 3 && (
          <div className="mb-5">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full max-w-xs bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-violet-500 placeholder:text-zinc-600"
            />
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-zinc-900 border border-zinc-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
              <svg width="28" height="28" fill="none" stroke="#52525b" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <p className="text-zinc-300 font-medium text-sm">
              {search ? "No projects found" : "No projects yet"}
            </p>
            <p className="text-zinc-600 text-xs mt-1">
              {search ? "Try a different search" : "Create your first project to get started"}
            </p>
            {!search && (
              <button
                onClick={() => setShowCreate(true)}
                className="mt-5 px-5 py-2.5 text-sm bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-medium transition-colors"
              >
                Create Project
              </button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onOpen={() => setActiveProject(project)}
                  onDelete={() => handleDelete(project)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      <AnimatePresence>
        {showCreate && (
          <CreateProjectModal
            onClose={() => setShowCreate(false)}
            onCreated={(project) => {
              setProjects([project, ...projects]);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
