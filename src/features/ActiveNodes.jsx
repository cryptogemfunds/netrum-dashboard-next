'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SignalHigh, Search } from 'lucide-react'
import { api } from '@/api/netrumApi'

/* =====================
   CONFIG
===================== */
const PAGE_SIZES = [10, 20, 40, 100]
const DEFAULT_PAGE_SIZE = 40

export default function ActiveNodes({ onNodeClick }) {
  const [nodes, setNodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  /* pagination */
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  /* search */
  const [search, setSearch] = useState('')

  /* cache */
  const cacheRef = useRef([])

  /* =====================
     FETCH (1 lần)
  ===================== */
  useEffect(() => {
    let alive = true

    const load = async () => {
      setLoading(true)
      setError('')

      try {
        const res = await api.activeNodes()
        console.log('[ActiveNodes] API raw:', res)

        if (!alive) return

        if (res?.slow && cacheRef.current.length) {
          setNodes(cacheRef.current)
          return
        }

        if (res?.error) {
          setError(res.error)
          return
        }

        const list =
          res?.nodes ||
          res?.data ||
          (Array.isArray(res) ? res : [])

        cacheRef.current = list
        setNodes(list)
      } catch (e) {
        console.error(e)
        setError('Failed to load active nodes')
      } finally {
        alive && setLoading(false)
      }
    }

    load()
    return () => (alive = false)
  }, [])

  /* =====================
     FILTER (SEARCH)
  ===================== */
  const filteredNodes = useMemo(() => {
    if (!search) return nodes

    const q = search.toLowerCase()
    return nodes.filter((n) =>
      (n.address || n.wallet || '').toLowerCase().includes(q) ||
      (n.nodeId || n.id || '').toLowerCase().includes(q)
    )
  }, [nodes, search])

  /* reset page when filter/pageSize changes */
  useEffect(() => {
    setPage(1)
  }, [search, pageSize])

  /* =====================
     PAGINATION
  ===================== */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredNodes.length / pageSize)
  )

  const visibleNodes = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredNodes.slice(start, start + pageSize)
  }, [filteredNodes, page, pageSize])

  /* =====================
     UI
  ===================== */
  return (
    <div className="rounded-xl border border-white/20 bg-black/40 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 flex flex-col gap-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg border border-white">
            <SignalHigh className="h-5 w-5 text-white" />
          </div>

          <div>
            <div className="text-sm font-bold uppercase tracking-wide">
              Active Nodes
            </div>
            <div className="text-xs opacity-60">
              Live node activity
            </div>
          </div>

          <span className="ml-auto px-3 py-1 text-xs rounded-full bg-orange-500/20 text-orange-300">
            {filteredNodes.length} nodes
          </span>
        </div>

        {/* 🔍 SEARCH + PAGE SIZE */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search wallet or node id…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-black/50 border border-white/20 text-sm outline-none"
            />
          </div>

          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-3 py-2 rounded-lg bg-black/50 border border-white/20 text-sm"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px] text-xs">#</TableHead>
            <TableHead className="text-sm">Wallet</TableHead>
            <TableHead className="text-sm">Node ID</TableHead>
            <TableHead className="w-[80px] text-xs">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={4} className="py-10 text-center opacity-60">
                Loading active nodes…
              </TableCell>
            </TableRow>
          )}

          {!loading && error && (
            <TableRow>
              <TableCell colSpan={4} className="py-10 text-center text-red-400">
                {error}
              </TableCell>
            </TableRow>
          )}

          {!loading && !visibleNodes.length && (
            <TableRow>
              <TableCell colSpan={4} className="py-10 text-center opacity-60">
                No matching nodes
              </TableCell>
            </TableRow>
          )}

          {visibleNodes.map((node, idx) => (
            <TableRow
              key={`${node.address || node.wallet}-${idx}`}
              className="hover:bg-white/5"
            >
              <TableCell className="text-xs opacity-60">
                {(page - 1) * pageSize + idx + 1}
              </TableCell>

              <TableCell
                className="text-orange-400 cursor-pointer text-sm font-mono"
                onClick={() =>
                  onNodeClick?.(node.address || node.wallet)
                }
              >
                {node.address || node.wallet}
              </TableCell>

              <TableCell className="text-sm font-mono">
                {node.nodeId || node.id}
              </TableCell>

              <TableCell className="text-xs text-green-400 font-semibold">
                Active
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 text-sm">
          <span className="opacity-60">
            Page {page} / {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 rounded bg-white/10 disabled:opacity-30"
            >
              Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded bg-white/10 disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
