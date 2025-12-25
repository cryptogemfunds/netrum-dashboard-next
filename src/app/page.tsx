'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Card from '@/components/Card'

import LiteStats from '@/features/LiteStats'
import NodeStats from '@/features/NodeStats'
import TaskStats from '@/features/TaskStats'
import ActiveNodes from '@/features/ActiveNodes'
import Balance from '@/features/Balance'
import Mining from '@/features/Mining'
import MiningDebug from '@/features/MiningDebug'
import SystemRequirements from '@/features/SystemRequirements'

import { api, fetchSafe } from '@/api/netrumApi'

import {
  loadSearchHistory,
  saveSearchHistory,
} from '@/utils/searchHistory'

export default function Page() {
  /* =====================
     WALLET STATE
  ===================== */
  const [rawAddress, setRawAddress] = useState('')
  const [address, setAddress] = useState('')
  const [nodeId, setNodeId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [cooldownActive, setCooldownActive] = useState(false)

  /* =====================
     AUTO REFRESH (LiteStats ONLY)
  ===================== */
  const REFRESH_INTERVAL = 240 // 4 phút
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL)

  // dùng ref để tránh re-render không cần thiết
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null)

  /* =====================
     MINING DEBUG
  ===================== */
  const [showMiningDebug, setShowMiningDebug] = useState(false)

  const handleNodeClick = (addr: string) => {
    setRawAddress(addr)
  }
  
  const [history, setHistory] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)

  /* =====================
     WALLET VALIDATION
  ===================== */
  useEffect(() => {
    if (!rawAddress) {
      setAddress('')
      setError('')
      setNodeId(null)
      return
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(rawAddress)) {
      setAddress('')
      setError('Invalid wallet address. Must start with 0x and be 42 chars long.')
      setNodeId(null)
      return
    }

    const timer = setTimeout(async () => {
      setCooldownActive(true)
      setAddress(rawAddress)
      setError('')
      // 🔹 LƯU LỊCH SỬ TÌM KIẾM
      saveSearchHistory(rawAddress)
      setHistory(loadSearchHistory())

      try {
        const nodeIdFromHistory = await api.claimHistoryNodeId(rawAddress)
        setNodeId(nodeIdFromHistory)
      } catch {
        setNodeId(null)
      } finally {
        setCooldownActive(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [rawAddress])

  useEffect(() => {
  setHistory(loadSearchHistory())
  }, [])


  /* =====================
     COUNTDOWN TIMER
     ⚠️ KHÔNG trigger ActiveNodes
     ⚠️ CHỈ reset countdown cho LiteStats
  ===================== */
  useEffect(() => {
    if (!autoRefresh) return

    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current)
    }

    refreshTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          console.log('🔄 Auto refresh LiteStats only')
          return REFRESH_INTERVAL
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current)
      }
    }
  }, [autoRefresh])

  /* =====================
     API TIMEOUT TEST (MANUAL)
  ===================== */
  const testTimeout = async () => {
    console.log('▶ API timeout test started')
    const start = Date.now()
    const res = await fetchSafe('/this-endpoint-does-not-exist')
    console.log('Result:', res)
    console.log('Elapsed (ms):', Date.now() - start)
  }

  const showCards = address && !error

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="relative z-10 min-h-screen bg-black/30">
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">

          {/* HEADER */}
          <Header
            countdown={countdown}
            autoRefresh={autoRefresh}
            setAutoRefresh={setAutoRefresh}
          />

          {/* OVERVIEW */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-transparent border-none md:col-span-2">
              {/* LiteStats tự refresh nội bộ (4 phút) */}
              <LiteStats />
            </Card>

            <Card className="bg-transparent border-none md:col-span-2">
              <SystemRequirements />
            </Card>
          </div>

          {/* SEARCH */}
          <Card
            title={
              <span className="text-lg md:text-lg font-bold flex items-center gap-2">
                🔍 Search Node Address
              </span>
            }
            className="bg-transparent border-none mt-6"
          >                                     
	    <div className="relative">
	      <input
	        className="w-full bg-transparent border border-white/20 rounded-xl
                           p-3 text-base text-white placeholder-gray-400"
                placeholder="0x..."
	        value={rawAddress}
	        onChange={(e) => setRawAddress(e.target.value.trim())}
	        onFocus={() => setShowHistory(true)}
	        onBlur={() => setTimeout(() => setShowHistory(false), 150)}
	      />

              {/* 🔽 SEARCH HISTORY */}
              {showHistory && history.length > 0 && (
                <div
                  className="absolute z-20 mt-1 w-full rounded-xl
                             bg-black/90 border border-white/10
                             backdrop-blur-md overflow-hidden"
                >
                  {history.map((addr) => (
                    <button
                      key={addr}
                      onClick={() => {
                        setRawAddress(addr)
                        setShowHistory(false)
                      }}
                      className="w-full text-left px-3 py-2
                                 text-lg font-mono text-white/80
                                 hover:bg-white/10 transition"
                    >
                      {addr}
                    </button>
                  ))}
                </div>
              )}
            </div>
  
            {error && (
              <div className="text-red-600 font-semibold opacity-70 text-lg mt-1">
                {error}
              </div>
            )}
          </Card>

          {/* NODE DATA */}
          {showCards && (
            <div className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-transparent border-none">
                  <NodeStats nodeId={nodeId} />
                </Card>

                <Card className="bg-transparent border-none">
                  <Mining nodeId={nodeId} walletAddress={address} />
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-transparent border-none">
                  <Balance wallet={address} />
                </Card>

                <Card className="bg-transparent border-none">
                  <TaskStats nodeId={nodeId} />
                </Card>
              </div>

              {/* MINING DEBUG */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowMiningDebug((v) => !v)}
                  className="px-4 py-2 text-lg rounded-lg
                             bg-orange-500/20 text-orange-300
                             hover:bg-orange-500/30 transition"
                >
                  ⛏ Mining Debug
                </button>
              </div>

              {showMiningDebug && (
                <Card className="bg-transparent border-none">
                  <MiningDebug wallet={address} />
                </Card>
              )}
            </div>
          )}

          {/* ACTIVE NODES (LOAD 1 LẦN, KHÔNG REFRESH) */}
          <Card className="bg-transparent border-none p-0">
            <ActiveNodes onNodeClick={handleNodeClick} />
          </Card>

          {/* TIMEOUT TEST */}
          <Card className="bg-transparent border border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-base opacity-70">
                API Request Timeout Test (30s)
              </span>
              <button
                onClick={testTimeout}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-base"
              >
                Run Test
              </button>
            </div>
          </Card>

          <Footer />
        </div>
      </div>
    </div>
  )
}
