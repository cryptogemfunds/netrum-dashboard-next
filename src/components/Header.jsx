'use client'
import Image from 'next/image'
import { useState } from 'react'

export default function Header({
  countdown,
  autoRefresh,
  setAutoRefresh,
}) {
  const [showMiningDebug, setShowMiningDebug] = useState(false)

  return (
    <>
      <header className="bg-black border-b border-neutral-800 relative z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Netrum"
              width={140}
              height={84}
              priority
            />
            <div>
              <div className="text-white font-semibold leading-tight">
                Netrum
              </div>
              <div className="text-xs text-neutral-400">
                Node Dashboard
              </div>
            </div>

            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/30">
              Online
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4 text-sm text-neutral-400">
            {/* 🔹 Mining Debug button (THÊM MỚI) */}
            <button
              onClick={() => setShowMiningDebug(v => !v)}
              className="px-3 py-1.5 rounded-lg
                         bg-white/10 hover:bg-white/20
                         border border-white/10
                         text-xs font-medium transition"
              title="Toggle Mining Debug"
            >
              ⛏ Mining Debug
            </button>

            {/* Existing auto refresh */}
            <span>
              Auto Refresh ({countdown}s)
            </span>

            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition
                ${autoRefresh
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300'}
              `}
              title="Toggle auto refresh"
            >
              ⟳
            </button>
          </div>
        </div>
      </header>

      {/* 🔹 Mining Debug panel (optional – bạn có thể đặt ở Page.jsx thay vì đây) */}
      {showMiningDebug && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* đặt component MiningDebug ở đây */}
          {/* <MiningDebug wallet={walletAddress} /> */}
          <div className="p-4 rounded-lg bg-black/60 border border-white/10 text-sm text-white/80">
            Mining Debug is ON
          </div>
        </div>
      )}
    </>
  )
}
