import { useRef, useState, useEffect, useCallback } from 'react'

const CONSTRAINTS_CHAIN = [
    { video: { facingMode: 'user', width: { ideal: 320 }, height: { ideal: 240 }, frameRate: { ideal: 15 } } },
    { video: { facingMode: 'user', width: { ideal: 240 }, height: { ideal: 180 }, frameRate: { ideal: 10 } } },
    { video: true },
]

export default function Camera({ onCapture }) {
    const videoRef = useRef(null)
    const streamRef = useRef(null)
    const [active, setActive] = useState(false)
    const [ready, setReady] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const stopStream = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop())
            streamRef.current = null
        }
    }, [])

    const startCamera = useCallback(async () => {
        setError('')
        setLoading(true)
        setReady(false)
        stopStream()

        for (const constraints of CONSTRAINTS_CHAIN) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraints)
                streamRef.current = stream

                const video = videoRef.current
                if (video) {
                    video.srcObject = stream
                    video.onplaying = () => setReady(true)
                    try { await video.play() } catch {}
                }

                setActive(true)
                setLoading(false)
                return
            } catch {
                // try next, lower constraint set
            }
        }

        setLoading(false)
        setError('Could not open camera. Check permissions or close other apps using the camera.')
    }, [stopStream])

    useEffect(() => {
        return stopStream
    }, [stopStream])

    function capture() {
        const video = videoRef.current
        if (!video || video.videoWidth === 0) return

        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85)

        stopStream()
        setActive(false)
        setReady(false)
        onCapture(dataUrl)
    }

    if (error) {
        return (
            <div className="flex items-center gap-3">
                <p className="text-sm text-[#dc2626]">{error}</p>
                <button
                    onClick={startCamera}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-[#1a1a1a] rounded-md hover:bg-[#333] transition-colors cursor-pointer"
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <div>
            {/* video is always in the DOM so the ref is never null */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ display: active ? 'block' : 'none' }}
                className="w-full max-w-[640px] rounded border border-[#e5e7eb] bg-black"
            />

            {!active && (
                <button
                    onClick={startCamera}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] rounded-md hover:bg-[#333] transition-colors cursor-pointer disabled:opacity-50"
                >
                    {loading ? 'Starting camera...' : 'Open Camera'}
                </button>
            )}

            {active && (
                <button
                    onClick={capture}
                    disabled={!ready}
                    className="mt-3 px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] rounded-md hover:bg-[#333] transition-colors cursor-pointer disabled:opacity-50"
                >
                    {ready ? 'Capture' : 'Waiting for camera...'}
                </button>
            )}
        </div>
    )
}

