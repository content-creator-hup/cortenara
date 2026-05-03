import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useAppStore } from "@/store/useAppStore";
import { updateProject } from "@/lib/firestore";

const retentionData = [
  { time: "0s", retention: 100 },
  { time: "15s", retention: 85 },
  { time: "30s", retention: 72 },
  { time: "1m", retention: 61 },
  { time: "2m", retention: 54 },
  { time: "3m", retention: 48 },
  { time: "5m", retention: 40 },
  { time: "8m", retention: 34 },
  { time: "10m", retention: 30 },
];

const engagementData = [
  { name: "Likes", value: 4821, fill: "#7c3aed" },
  { name: "Shares", value: 1243, fill: "#6d28d9" },
  { name: "Comments", value: 892, fill: "#5b21b6" },
];

const demographicsAge = [
  { name: "13-17", value: 8 },
  { name: "18-24", value: 32 },
  { name: "25-34", value: 28 },
  { name: "35-44", value: 18 },
  { name: "45-54", value: 9 },
  { name: "55+", value: 5 },
];

const demographicsGender = [
  { name: "Male", value: 58 },
  { name: "Female", value: 39 },
  { name: "Other", value: 3 },
];

const COLORS = ["#7c3aed", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe", "#f5f3ff"];
const GENDER_COLORS = ["#7c3aed", "#a78bfa", "#c4b5fd"];

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-zinc-600 mt-1">{sub}</p>}
    </div>
  );
}

export default function AnalyticsTab() {
  const user = useAppStore((s) => s.user);
  const activeProject = useAppStore((s) => s.activeProject);
  const updateProjectField = useAppStore((s) => s.updateProjectField);

  const [videoUrl, setVideoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [hasData] = useState(true);

  function extractVideoId(url: string): string | null {
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (ytMatch) return ytMatch[1];
    const ttMatch = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
    if (ttMatch) return ttMatch[1];
    return null;
  }

  async function handleLinkVideo() {
    if (!user || !activeProject) return;
    const id = extractVideoId(videoUrl);
    if (!id) return;
    setSaving(true);
    try {
      await updateProject(user.uid, activeProject.id, { linkedVideoId: id });
      updateProjectField("linkedVideoId", id);
      setVideoUrl("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 flex flex-col gap-6 overflow-y-auto h-full">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-base font-semibold text-white">Analytics</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {activeProject?.linkedVideoId
              ? `Linked video: ${activeProject.linkedVideoId}`
              : "Link a YouTube or TikTok video to view real stats"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Paste YouTube or TikTok URL..."
            className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs rounded-xl px-3 py-2 w-72 focus:outline-none focus:border-violet-500 placeholder:text-zinc-600"
          />
          <button
            onClick={handleLinkVideo}
            disabled={saving || !videoUrl}
            className="px-4 py-2 text-xs bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Linking..." : "Link Video"}
          </button>
        </div>
      </div>

      {!activeProject?.linkedVideoId && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-400 flex items-center gap-2">
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
          Demo data shown below. Link a real video URL above to see live analytics.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Views" value="48.2K" sub="+12% this week" />
        <StatCard label="Avg. View Duration" value="3m 42s" sub="of 10m 15s total" />
        <StatCard label="Watch Time" value="2,987 hrs" />
        <StatCard label="Subscriber Gain" value="+643" sub="from this video" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Audience Retention</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="time" tick={{ fill: "#71717a", fontSize: 10 }} />
              <YAxis tick={{ fill: "#71717a", fontSize: 10 }} unit="%" />
              <Tooltip
                contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#a1a1aa" }}
              />
              <Line type="monotone" dataKey="retention" stroke="#7c3aed" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Engagement</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 10 }} />
              <YAxis tick={{ fill: "#71717a", fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#a1a1aa" }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {engagementData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Age Demographics</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={demographicsAge} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}%`} labelLine={false}>
                {demographicsAge.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Gender Demographics</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={demographicsGender} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                {demographicsGender.map((_, i) => (
                  <Cell key={i} fill={GENDER_COLORS[i]} />
                ))}
              </Pie>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#71717a" }} />
              <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
