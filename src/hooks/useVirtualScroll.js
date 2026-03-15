import { useState, useRef, useCallback } from 'react'

export default function useVirtualScroll({ totalItems, rowHeight, containerHeight, bufferSize = 5 }) {
    const [scrollTop, setScrollTop] = useState(0)
    const initialRowHeight = useRef(rowHeight)

    const onScroll = useCallback((e) => {
        setScrollTop(e.currentTarget.scrollTop)
    }, [])

    const rh = initialRowHeight.current
    const totalHeight = totalItems * rh
    const startIndex = Math.max(0, Math.floor(scrollTop / rh) - bufferSize)
    const visibleCount = Math.ceil(containerHeight / rh) + 2 * bufferSize
    const endIndex = Math.min(totalItems - 1, startIndex + visibleCount)
    const offsetY = startIndex * rh

    return { startIndex, endIndex, totalHeight, offsetY, onScroll }
}
