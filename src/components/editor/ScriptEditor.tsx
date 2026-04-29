import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Highlight } from "@tiptap/extension-highlight";
import { useEffect, useRef, useState } from "react";
import { useAppStore, Note } from "@/store/useAppStore";
import { updateProject, addNoteToProject } from "@/lib/firestore";

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const AI_MODELS = ["Gemini Pro", "GPT-4", "Claude 3"];

export default function ScriptEditor() {
  const user = useAppStore((s) => s.user);
  const activeProject = useAppStore((s) => s.activeProject);
  const updateProjectField = useAppStore((s) => s.updateProjectField);

  const [notes, setNotes] = useState<Note[]>(() => activeProject?.notes ?? []);
  const [chatMessages] = useState<ChatMessage[]>([]);
  const [selectedModel, setSelectedModel] = useState("Gemini Pro");
  const [showAddNote, setShowAddNote] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{ from: number; to: number } | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const projectId = activeProject?.id;

  const editor = useEditor({
    extensions: [StarterKit, Highlight],
    content: activeProject?.scriptContent ?? "<p>Start writing your script here...</p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[400px] text-zinc-100 leading-relaxed",
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      updateProjectField("scriptContent", html);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        const currentUser = useAppStore.getState().user;
        const currentProject = useAppStore.getState().activeProject;
        if (currentUser && currentProject) {
          await updateProject(currentUser.uid, currentProject.id, { scriptContent: html });
        }
      }, 1500);
    },
    onSelectionUpdate({ editor }) {
      const { from, to } = editor.state.selection;
      if (from !== to) {
        setSelectedRange({ from, to });
        setShowAddNote(true);
      } else {
        setShowAddNote(false);
      }
    },
  });

  useEffect(() => {
    setNotes(activeProject?.notes ?? []);
  }, [projectId]);

  async function handleAddNote() {
    if (!selectedRange || !user || !activeProject) return;
    const text = editor?.state.doc.textBetween(selectedRange.from, selectedRange.to, " ") ?? "";
    const note: Note = {
      id: generateId(),
      text,
      range: selectedRange,
      timestamp: Date.now(),
    };
    const updated = [...notes, note];
    setNotes(updated);
    updateProjectField("notes", updated);
    await addNoteToProject(user.uid, activeProject.id, updated);
    setShowAddNote(false);
  }

  async function removeNote(id: string) {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    updateProjectField("notes", updated);
    if (user && activeProject) {
      await addNoteToProject(user.uid, activeProject.id, updated);
    }
  }

  return (
    <div className="flex h-full gap-0">
      <div className="w-80 shrink-0 border-r border-zinc-800 flex flex-col bg-zinc-900/50">
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-zinc-300">AI Assistant</h3>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg px-2 py-1 focus:outline-none"
            >
              {AI_MODELS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {chatMessages.length === 0 && (
            <div className="text-center text-zinc-600 text-xs mt-8">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-3">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-zinc-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              Ask AI to help improve your script
            </div>
          )}
          {chatMessages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-800 text-zinc-300"
              }`}>
                {m.content}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-zinc-800 relative">
          <div className="absolute inset-0 bg-zinc-900/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-b">
            <div className="text-xs text-amber-400 font-medium flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
              AI Models under maintenance
            </div>
            <p className="text-zinc-600 text-xs mt-1">Coming soon</p>
          </div>
          <div className="flex gap-2 opacity-20 pointer-events-none">
            <input
              disabled
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none"
              placeholder="Ask AI..."
            />
            <button disabled className="bg-violet-600 text-white rounded-xl px-3 py-2 text-xs">
              Send
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-zinc-800 px-4 py-2 flex items-center gap-2 bg-zinc-900/30">
          {editor && (
            <>
              <button onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2 py-1 text-xs rounded font-bold ${editor.isActive("bold") ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800"}`}>B</button>
              <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2 py-1 text-xs rounded italic ${editor.isActive("italic") ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800"}`}>I</button>
              <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-2 py-1 text-xs rounded ${editor.isActive("heading", { level: 2 }) ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800"}`}>H2</button>
              <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`px-2 py-1 text-xs rounded ${editor.isActive("bulletList") ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800"}`}>• List</button>
              <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={`px-2 py-1 text-xs rounded ${editor.isActive("highlight") ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800"}`}>Highlight</button>
              <div className="flex-1" />
              {showAddNote && (
                <button
                  onClick={handleAddNote}
                  className="px-3 py-1 text-xs bg-amber-500 hover:bg-amber-400 text-white rounded-lg font-medium transition-colors"
                >
                  + Add Note
                </button>
              )}
            </>
          )}
        </div>

        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 overflow-y-auto p-6">
            <EditorContent editor={editor} />
          </div>

          {notes.length > 0 && (
            <div className="w-64 shrink-0 border-l border-zinc-800 bg-zinc-900/30 overflow-y-auto p-4 flex flex-col gap-3">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Notes</h4>
              {notes.map((note) => (
                <div key={note.id} className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                  <p className="text-xs text-amber-300 leading-relaxed mb-2 line-clamp-3">"{note.text}"</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-600">{new Date(note.timestamp).toLocaleDateString()}</span>
                    <button onClick={() => removeNote(note.id)} className="text-zinc-600 hover:text-red-400 text-xs transition-colors">×</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
