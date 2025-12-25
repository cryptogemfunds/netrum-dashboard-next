const BASE = "https://node.netrumlabs.dev";

const cache = {};
const inFlight = {};
const CACHE_TTL = 120_000; // 2 phút

/* ======================
   SAFE FETCH (STABLE)
====================== */
export async function fetchSafe(path) {
  const now = Date.now();

  // ✅ cache
  if (cache[path] && now - cache[path].time < CACHE_TTL) {
    return { ...cache[path].data, cached: true };
  }

  // 🔒 single-flight
  if (inFlight[path]) {
    return inFlight[path];
  }

  inFlight[path] = (async () => {
    try {
      const res = await fetch(BASE + path, {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      cache[path] = { data, time: Date.now() };
      return data;
    } catch (e) {
      console.warn(`[fetchSafe] failed: ${path}`, e.message);
      return { slow: true, error: "API slow / unreachable" };
    } finally {
      delete inFlight[path];
    }
  })();

  return inFlight[path];
}

/* ======================
   API WRAPPER (FULL)
====================== */
export const api = {
  /* ---------- OVERVIEW ---------- */
  async liteStats() {
    const r = await fetchSafe("/lite/nodes/stats");
    if (r?.error || r?.slow) return r;

    return {
      total: r.stats.totalNodes,
      active: r.stats.activeNodes,
      inactive: r.stats.inactiveNodes,
      totalTasks: r.stats.totalTasks,
      time: r.timestamp,
    };
  },

  /* ---------- NODES ---------- */
  activeNodes: () =>
    fetchSafe("/lite/nodes/active"),

  checkCooldown: (nodeId) =>
    fetchSafe(`/metrics/check-cooldown/${nodeId}`),

  /* ---------- MINING ---------- */
  miningCooldown: (nodeId) =>
    fetchSafe(`/mining/cooldown/${nodeId}`),

  claim: (wallet) =>
    fetchSafe(`/claim/status/${wallet}`),

  miningDebugContract: (wallet) =>
    fetchSafe(`/mining/debug/contract/${wallet}`),

  /* ---------- CLAIM HISTORY ---------- */
  claimHistoryNodeId: async (wallet) => {
    const r = await fetchSafe(`/claim/history/${wallet}`);
    return r?.lastClaim?.nodeId || null;
  },

  /* ---------- SYSTEM ---------- */
  requirements: () =>
    fetchSafe("/metrics/requirements"),
};
