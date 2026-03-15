import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useVirtualScroll from '../hooks/useVirtualScroll'

const ROW_HEIGHT = 48
const CONTAINER_HEIGHT = 600
const HEADERS = ['Name', 'Position', 'Office', 'Ext', 'Start Date', 'Salary']

export default function List() {
    const { logout } = useAuth()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(import.meta.env.VITE_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: import.meta.env.VITE_API_USERNAME,
                        password: import.meta.env.VITE_API_PASSWORD,
                    }),
                })
                const json = await res.json()
                const rows = json?.TABLE_DATA?.data || []
                setData(rows)
            } catch {
                setError('Failed to load employee data.')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const { startIndex, endIndex, totalHeight, offsetY, onScroll } = useVirtualScroll({
        totalItems: data.length,
        rowHeight: ROW_HEIGHT,
        containerHeight: CONTAINER_HEIGHT,
    })

    const visibleRows = data.slice(startIndex, endIndex + 1)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-sm text-[#6b7280]">Loading employees...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-sm text-[#dc2626]">{error}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <header className="border-b border-[#e5e7eb] bg-white">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-[#1a1a1a]">Employees</h1>
                    <button
                        onClick={logout}
                        className="text-sm text-[#6b7280] hover:text-[#1a1a1a] transition-colors cursor-pointer"
                    >
                        Sign out
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-6">
                <p className="text-sm text-[#6b7280] mb-4">{data.length} records</p>

                <div className="bg-white border border-[#e5e7eb] rounded-lg overflow-hidden">
                    <div
                        className="grid border-b border-[#e5e7eb] bg-[#f9fafb]"
                        style={{ gridTemplateColumns: `56px repeat(${HEADERS.length}, 1fr)` }}
                    >
                        <div className="px-4 py-3 text-xs font-medium text-[#6b7280] uppercase tracking-wide">#</div>
                        {HEADERS.map(h => (
                            <div key={h} className="px-4 py-3 text-xs font-medium text-[#6b7280] uppercase tracking-wide">{h}</div>
                        ))}
                    </div>

                    <div
                        onScroll={onScroll}
                        style={{ height: CONTAINER_HEIGHT, overflowY: 'auto' }}
                    >
                        <div style={{ height: totalHeight, position: 'relative' }}>
                            <div style={{ transform: `translateY(${offsetY}px)` }}>
                                {visibleRows.map((row, i) => {
                                    const idx = startIndex + i
                                    return (
                                        <Link
                                            to={`/details/${idx}`}
                                            key={idx}
                                            state={{ employee: row, employeeIndex: idx, allData: data }}
                                            className="grid border-b border-[#f3f4f6] hover:bg-[#f9fafb] transition-colors no-underline text-inherit"
                                            style={{
                                                height: ROW_HEIGHT,
                                                gridTemplateColumns: `56px repeat(${HEADERS.length}, 1fr)`,
                                            }}
                                        >
                                            <div className="px-4 flex items-center text-xs text-[#9ca3af]">{idx + 1}</div>
                                            {row.map((cell, ci) => (
                                                <div key={ci} className="px-4 flex items-center text-sm text-[#1a1a1a] truncate">
                                                    {cell}
                                                </div>
                                            ))}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
