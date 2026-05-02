import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import ScriptEditor from "@/components/editor/ScriptEditor";
import MediaTab from "@/components/drive/MediaTab";
import AnalyticsTab from "@/components/analytics/AnalyticsTab";

const TABS = [
  { key: "script" as const, label: "Script Editor" },
  { key: "media" as const, label: "Media" },
  { key: "analytics" as const, label: "Analytics" },
];

export default function ProjectPage() {
  const activeProject = useAppStore((s) => s.activeProject);
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const setActiveProject = useAppStore((s) => s.setActiveProject);

  if (!activeProject) return null;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <header className="border-b border-zinc-900 bg-zinc-950 sticky top-0 z-20">
        <div className="px-5 py-3 flex items-center gap-4">
          <button
            onClick={() => setActiveProject(null)}
            className="text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1.5 text-xs"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Projects
          </button>
          <div className="w-px h-4 bg-zinc-800" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-violet-600/20 flex items-center justify-center">
              <svg width="12" height="12" fill="none" stroke="#a78bfa" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h1 className="text-sm font-semibold text-white truncate max-w-[200px]">{activeProject.title}</h1>
          </div>

          <nav className="flex items-center gap-1 ml-4">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === tab.key
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-zinc-800 rounded-lg"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="h-[calc(100vh-56px)] overflow-hidden"
          >
            {activeTab === "script" && <ScriptEditor />}
            {activeTab === "media" && <MediaTab />}
            {activeTab === "analytics" && <AnalyticsTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
