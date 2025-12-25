'use client'
import { useState } from 'react'
import { api } from '@/api/netrumApi'

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-white/20 rounded ${className}`} />
}

export default function MiningDebug({ wallet }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const runDebug = async () => {
    if (!wallet) return
    setLoading(true)
    setError('')
    setData(null)

    try {
      const res = await api.miningDebug(wallet)
      if (!res?.success) {
        setError('Debug API failed')
      } else {
        setData(res)
      }
    } catch (e) {
      setError(e.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-black/50 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">⛏ Mining Debug</h3>

        <button
          onClick={runDebug}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-orange-500/80 hover:bg-orange-500
                     text-black text-sm font-semibold disabled:opacity-50"
        >
          {loading ? 'Running…' : 'Run Debug'}
        </button>
      </div>

      {!wallet && (
        <p className="text-xs text-red-400">
          Wallet address is required
        </p>
      )}

      {loading && <Skeleton className="h-24" />}

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {data && (
        <pre className="text-xs text-white/80 bg-black/60 p-4 rounded-lg overflow-auto max-h-[300px]">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  )
}

