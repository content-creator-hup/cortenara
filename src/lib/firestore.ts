import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import { Project, Note } from "../store/useAppStore";

export async function getUserProjects(userId: string): Promise<Project[]> {
  const q = query(
    collection(db, "users", userId, "projects"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Project, "id">),
    createdAt:
      d.data().createdAt?.toMillis
        ? d.data().createdAt.toMillis()
        : d.data().createdAt ?? Date.now(),
  }));
}

export async function createProject(
  userId: string,
  data: Omit<Project, "id" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "users", userId, "projects"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProject(
  userId: string,
  projectId: string,
  data: Partial<Omit<Project, "id" | "createdAt">>
): Promise<void> {
  await updateDoc(doc(db, "users", userId, "projects", projectId), data);
}

export async function deleteProject(userId: string, projectId: string): Promise<void> {
  await deleteDoc(doc(db, "users", userId, "projects", projectId));
}

export async function addNoteToProject(
  userId: string,
  projectId: string,
  notes: Note[]
): Promise<void> {
  await updateDoc(doc(db, "users", userId, "projects", projectId), { notes });
}
