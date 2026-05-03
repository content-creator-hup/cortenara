const DRIVE_BASE = "https://www.googleapis.com/drive/v3";
const DRIVE_UPLOAD = "https://www.googleapis.com/upload/drive/v3";

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  thumbnailLink?: string;
  webViewLink?: string;
  modifiedTime?: string;
}

export async function createDriveFolder(
  accessToken: string,
  folderName: string
): Promise<string> {
  const res = await fetch(`${DRIVE_BASE}/files`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    }),
  });
  if (!res.ok) throw new Error(`Failed to create folder: ${res.statusText}`);
  const data = await res.json();
  return data.id as string;
}

export async function listFolderFiles(
  accessToken: string,
  folderId: string
): Promise<DriveFile[]> {
  const params = new URLSearchParams({
    q: `'${folderId}' in parents and trashed = false`,
    fields: "files(id,name,mimeType,size,thumbnailLink,webViewLink,modifiedTime)",
    pageSize: "50",
  });
  const res = await fetch(`${DRIVE_BASE}/files?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`Failed to list files: ${res.statusText}`);
  const data = await res.json();
  return data.files as DriveFile[];
}

export async function uploadFileToDrive(
  accessToken: string,
  folderId: string,
  file: File
): Promise<DriveFile> {
  const metadata = {
    name: file.name,
    parents: [folderId],
  };
  const form = new FormData();
  form.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );
  form.append("file", file);

  const res = await fetch(`${DRIVE_UPLOAD}/files?uploadType=multipart&fields=id,name,mimeType,size,thumbnailLink,webViewLink,modifiedTime`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: form,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
  return (await res.json()) as DriveFile;
}

export async function deleteFileFromDrive(
  accessToken: string,
  fileId: string
): Promise<void> {
  const res = await fetch(`${DRIVE_BASE}/files/${fileId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
}

export function getDownloadUrl(fileId: string, accessToken: string): string {
  return `${DRIVE_BASE}/files/${fileId}?alt=media&access_token=${accessToken}`;
}
