// src/api/fetchHeavy.js
const BASE = "https://node.netrumlabs.dev"

const cache = {}
const lock = {}

const CACHE_TTL = 30_000
const LOCK_TIME = 5_000

export async function fetchHeavy(path) {
  const now = Date.now()

  // 1️⃣ cache ưu tiên
  if (cache[path] && now - cache[path].time < CACHE_TTL) {
    return cache[path].data
  }

  // 2️⃣ lock
  if (lock[path] && now - lock[path] < LOCK_TIME) {
    return cache[path]?.data ?? { timeout: true }
  }

  lock[path] = now

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30_000)

  try {
    const res = await fetch(BASE + path, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      return cache[path]?.data ?? { error: `HTTP ${res.status}` }
    }

    const data = await res.json()
    cache[path] = { data, time: now }
    return data
  } catch (err) {
    clearTimeout(timeoutId)

    // ✅ QUAN TRỌNG: KHÔNG THROW
    if (err.name === "AbortError") {
      console.warn("[fetchHeavy] timeout:", path)
      return cache[path]?.data ?? { timeout: true }
    }

    return cache[path]?.data ?? { error: "Network error" }
  }
}
