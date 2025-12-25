// src/utils/searchHistory.ts

const HISTORY_KEY = 'netrum_search_history'
const MAX_HISTORY = 5

export function loadSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveSearchHistory(address: string) {
  if (typeof window === 'undefined') return

  const list = loadSearchHistory()

  // đưa address mới lên đầu, bỏ trùng
  const next = [
    address,
    ...list.filter((a) => a !== address),
  ].slice(0, MAX_HISTORY)

  localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
}

export function clearSearchHistory() {
  localStorage.removeItem(HISTORY_KEY)
}

