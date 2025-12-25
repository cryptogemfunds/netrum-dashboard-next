'use client'
import { useEffect, useState, useRef } from "react";
import { api } from "../api/netrumApi";
import { Users, Wifi, PauseCircle, ListChecks, Network } from "lucide-react";

function formatTime(iso) {
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())} • ${p(d.getDate())}/${p(
    d.getMonth() + 1
  )}/${d.getFullYear()}`;
}

export default function LiteStats() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const hasDataRef = useRef(false);

  const fetchStats = async () => {
    try {
      const r = await api.liteStats();
      console.log("[LiteStats] API raw:", r);

      // 🔁 lỗi tạm → giữ data cũ
      if (r?.transient) return;

      if (r?.error && !hasDataRef.current) {
        setErr(r.error);
        return;
      }

      if (r && !r.error) {
        setData(r);
        setErr("");
        hasDataRef.current = true;
      }
    } catch (e) {
      if (!hasDataRef.current) setErr("Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const i = setInterval(fetchStats, 240_000);
    return () => clearInterval(i);
  }, []);

  if (err && !hasDataRef.current) {
    return <div className="text-red-400">{err}</div>;
  }

  const d = data || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-primary/10">
          <Network className="h-5 w-5" />
        </div>
        <div>
          <div className="text-lg font-bold">Network Overview</div>
          {d.time && <div className="text-xs opacity-60">Updated {formatTime(d.time)}</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat title="Network Nodes" value={d.total} icon={Users} />
        <Stat title="Active Nodes" value={d.active} icon={Wifi} />
        <Stat title="Inactive Nodes" value={d.inactive} icon={PauseCircle} />
        <Stat title="Total Tasks" value={d.totalTasks} icon={ListChecks} />
      </div>
    </div>
  );
}

function Stat({ title, value, icon: Icon }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="flex justify-between">
        <div>
          <div className="text-xs opacity-60">{title}</div>
          <div className="text-xl font-mono font-bold">
            {(value ?? 0).toLocaleString()}
          </div>
        </div>
        <Icon className="h-5 w-5 opacity-70" />
      </div>
    </div>
  );
}

