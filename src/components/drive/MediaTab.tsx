import { useEffect, useRef, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useAppStore } from "@/store/useAppStore";
import {
  listFolderFiles,
  uploadFileToDrive,
  deleteFileFromDrive,
  getDownloadUrl,
  DriveFile,
  createDriveFolder,
} from "@/lib/driveApi";
import { updateProject } from "@/lib/firestore";

function FileIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith("image/"))
    return <div className="text-2xl">🖼️</div>;
  if (mimeType.startsWith("video/"))
    return <div className="text-2xl">🎬</div>;
  if (mimeType.includes("pdf"))
    return <div className="text-2xl">📄</div>;
  return <div className="text-2xl">📁</div>;
}

export default function MediaTab() {
  const user = useAppStore((s) => s.user);
  const accessToken = useAppStore((s) => s.accessToken);
  const setAccessToken = useAppStore((s) => s.setAccessToken);
  const activeProject = useAppStore((s) => s.activeProject);
  const updateProjectField = useAppStore((s) => s.updateProjectField);

  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsReconnect, setNeedsReconnect] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleReconnectDrive() {
    setReconnecting(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { GoogleAuthProvider } = await import("firebase/auth");
      const credential = GoogleAuthProvider.credentialFromResult(result);
      setAccessToken(credential?.accessToken ?? null);
      setNeedsReconnect(false);
    } catch (e: any) {
      setError("Failed to reconnect: " + (e.message ?? "Unknown error"));
    } finally {
      setReconnecting(false);
    }
  }

  async function ensureFolderAndLoad() {
    if (!user || !accessToken || !activeProject) return;
    setLoading(true);
    setError(null);
    try {
      let folderId = activeProject.googleDriveFolderId;
      if (!folderId) {
        folderId = await createDriveFolder(
          accessToken,
          `[CreatorFlow] - ${activeProject.title}`
        );
        await updateProject(user.uid, activeProject.id, { googleDriveFolderId: folderId });
        updateProjectField("googleDriveFolderId", folderId);
      }
      const driveFiles = await listFolderFiles(accessToken, folderId);
      setFiles(driveFiles);
    } catch (e: any) {
      const msg: string = e.message ?? "";
      if (msg.includes("403") || msg.toLowerCase().includes("forbidden") || msg.toLowerCase().includes("insufficient")) {
        setNeedsReconnect(true);
        setError("Drive access was denied (403). Please reconnect your Google account to grant Drive permissions.");
      } else {
        setError(msg || "Failed to load Drive files.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    ensureFolderAndLoad();
  }, [activeProject?.id, accessToken]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !accessToken || !activeProject?.googleDriveFolderId) return;
    setUploading(true);
    try {
      const uploaded = await uploadFileToDrive(accessToken, activeProject.googleDriveFolderId, file);
      setFiles((prev) => [uploaded, ...prev]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(fileId: string) {
    if (!accessToken) return;
    try {
      await deleteFileFromDrive(accessToken, fileId);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (!accessToken) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-sm px-6">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <p className="text-white font-medium mb-1">Google Drive not connected</p>
          <p className="text-zinc-500 text-sm mb-5">
            Your session expired or Drive access was not granted. Reconnect to manage your media files.
          </p>
          {error && (
            <p className="text-red-400 text-xs mb-3">{error}</p>
          )}
          <button
            onClick={handleReconnectDrive}
            disabled={reconnecting}
            className="flex items-center justify-center gap-2 mx-auto px-5 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
          >
            {reconnecting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Reconnect Google Drive
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-5 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Media Files</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {activeProject?.googleDriveFolderId
              ? `Synced to Google Drive folder`
              : "Drive folder will be created on first upload"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={ensureFolderAndLoad}
            className="px-3 py-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 text-xs bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload File"}
          </button>
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-xs text-red-400 flex items-start justify-between gap-3">
          <span>{error}</span>
          {needsReconnect && (
            <button
              onClick={handleReconnectDrive}
              disabled={reconnecting}
              className="shrink-0 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
            >
              {reconnecting ? "Connecting..." : "Reconnect Drive"}
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-zinc-500 text-sm">
          <div className="animate-spin w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full mr-3" />
          Loading files from Drive...
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">📂</div>
          <p className="text-zinc-400 text-sm font-medium">No files yet</p>
          <p className="text-zinc-600 text-xs mt-1">Upload files to sync them to your Google Drive folder.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {files.map((file) => (
            <div key={file.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group hover:border-zinc-700 transition-colors">
              <div className="relative aspect-video bg-zinc-800 flex items-center justify-center overflow-hidden">
                {file.thumbnailLink ? (
                  <img
                    src={file.thumbnailLink}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FileIcon mimeType={file.mimeType} />
                )}
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-zinc-300 truncate mb-1">{file.name}</p>
                {file.size && (
                  <p className="text-xs text-zinc-600">
                    {(parseInt(file.size) / 1024).toFixed(1)} KB
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {accessToken && (
                    <a
                      href={getDownloadUrl(file.id, accessToken)}
                      download={file.name}
                      className="flex-1 text-center text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-300 py-1 rounded-lg transition-colors"
                    >
                      Download
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="flex-1 text-center text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 py-1 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
