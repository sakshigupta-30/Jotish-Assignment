import { useRef, useState, useEffect, useCallback } from 'react'

export default function SignaturePad({ photoSrc, onSign }) {
    const canvasRef = useRef(null)
    const [drawing, setDrawing] = useState(false)
    const [dimensions, setDimensions] = useState({ width: 640, height: 480 })

    useEffect(() => {
        const img = new Image()
        img.onload = () => {
            const maxW = 640
            const scale = img.width > maxW ? maxW / img.width : 1
            setDimensions({
                width: Math.round(img.width * scale),
                height: Math.round(img.height * scale),
            })
        }
        img.src = photoSrc
    }, [photoSrc])

    const getPos = useCallback((e) => {
        const canvas = canvasRef.current
        if (!canvas) return { x: 0, y: 0 }
        const rect = canvas.getBoundingClientRect()
        const clientX = e.touches ? e.touches[0].clientX : e.clientX
        const clientY = e.touches ? e.touches[0].clientY : e.clientY
        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        }
    }, [])

    const handleStart = useCallback((e) => {
        e.preventDefault()
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const pos = getPos(e)
        ctx.beginPath()
        ctx.moveTo(pos.x, pos.y)
        setDrawing(true)
    }, [getPos])

    const handleMove = useCallback((e) => {
        if (!drawing) return
        e.preventDefault()
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const pos = getPos(e)
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.strokeStyle = '#1a1a1a'
        ctx.lineTo(pos.x, pos.y)
        ctx.stroke()
    }, [drawing, getPos])

    const handleEnd = useCallback(() => {
        setDrawing(false)
    }, [])

    function clearSignature() {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    function submitSignature() {
        if (canvasRef.current) {
            onSign(canvasRef.current)
        }
    }

    return (
        <div>
            <div
                className="relative inline-block rounded border border-[#e5e7eb] overflow-hidden"
                style={{ width: dimensions.width, height: dimensions.height }}
            >
                <img
                    src={photoSrc}
                    alt="Captured"
                    className="block"
                    style={{ width: dimensions.width, height: dimensions.height }}
                />
                <canvas
                    ref={canvasRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    className="absolute top-0 left-0 cursor-crosshair"
                    style={{ touchAction: 'none' }}
                    onMouseDown={handleStart}
                    onMouseMove={handleMove}
                    onMouseUp={handleEnd}
                    onMouseLeave={handleEnd}
                    onTouchStart={handleStart}
                    onTouchMove={handleMove}
                    onTouchEnd={handleEnd}
                />
            </div>
            <div className="mt-3 flex gap-3">
                <button
                    onClick={clearSignature}
                    className="px-4 py-2 text-sm font-medium text-[#1a1a1a] border border-[#d1d5db] rounded-md hover:bg-[#f3f4f6] transition-colors cursor-pointer"
                >
                    Clear
                </button>
                <button
                    onClick={submitSignature}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] rounded-md hover:bg-[#333] transition-colors cursor-pointer"
                >
                    Done
                </button>
            </div>
        </div>
    )
}
