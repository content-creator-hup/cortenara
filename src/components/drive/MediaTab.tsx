import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import {
  listFolderFiles,
  uploadFileToDrive,
  deleteFileFromDrive,
  getDownloadUrl,
  DriveFile,
} from "@/lib/driveApi";
import { updateProject } from "@/lib/firestore";
import { createDriveFolder } from "@/lib/driveApi";

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
  const activeProject = useAppStore((s) => s.activeProject);
  const updateProjectField = useAppStore((s) => s.updateProjectField);

  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setError(e.message ?? "Failed to load Drive files.");
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
      <div className="flex items-center justify-center h-full text-zinc-500">
        <div className="text-center">
          <div className="text-4xl mb-3">🔒</div>
          <p className="text-sm">Google Drive access not granted.</p>
          <p className="text-xs text-zinc-600 mt-1">Please sign in again to grant Drive permissions.</p>
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
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-400">
          {error}
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
