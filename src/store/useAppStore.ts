import { create } from "zustand";
import { User } from "firebase/auth";

export interface Note {
  id: string;
  text: string;
  range: { from: number; to: number };
  timestamp: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  googleDriveFolderId: string;
  scriptContent: string;
  notes: Note[];
  linkedVideoId: string;
}

interface AppState {
  user: User | null;
  accessToken: string | null;
  activeProject: Project | null;
  projects: Project[];
  activeTab: "script" | "media" | "analytics";
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setActiveProject: (project: Project | null) => void;
  setProjects: (projects: Project[]) => void;
  setActiveTab: (tab: "script" | "media" | "analytics") => void;
  updateProjectField: <K extends keyof Project>(field: K, value: Project[K]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  accessToken: null,
  activeProject: null,
  projects: [],
  activeTab: "script",
  setUser: (user) => set({ user }),
  setAccessToken: (token) => set({ accessToken: token }),
  setActiveProject: (project) => set({ activeProject: project, activeTab: "script" }),
  setProjects: (projects) => set({ projects }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  updateProjectField: (field, value) =>
    set((state) => ({
      activeProject: state.activeProject
        ? { ...state.activeProject, [field]: value }
        : null,
    })),
}));
