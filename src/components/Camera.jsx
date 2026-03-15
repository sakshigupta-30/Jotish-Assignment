import { useRef, useState, useEffect, useCallback } from 'react'

export default function Camera({ onCapture }) {
    const videoRef = useRef(null)
    const streamRef = useRef(null)
    const [active, setActive] = useState(false)
    const [error, setError] = useState('')

    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
            })
            streamRef.current = stream
            if (videoRef.current) {
                videoRef.current.srcObject = stream
            }
            setActive(true)
        } catch {
            setError('Camera access denied. Please allow camera permissions.')
        }
    }, [])

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop())
            }
        }
    }, [])

    function capture() {
        if (!videoRef.current) return
        const video = videoRef.current
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0)
        const dataUrl = canvas.toDataURL('image/png')

        streamRef.current?.getTracks().forEach(t => t.stop())
        streamRef.current = null
        setActive(false)

        onCapture(dataUrl)
    }

    if (error) {
        return <p className="text-sm text-[#dc2626]">{error}</p>
    }

    if (!active) {
        return (
            <button
                onClick={startCamera}
                className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] rounded-md hover:bg-[#333] transition-colors cursor-pointer"
            >
                Open Camera
            </button>
        )
    }

    return (
        <div>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-w-[640px] rounded border border-[#e5e7eb] bg-black"
            />
            <button
                onClick={capture}
                className="mt-3 px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] rounded-md hover:bg-[#333] transition-colors cursor-pointer"
            >
                Capture
            </button>
        </div>
    )
}
