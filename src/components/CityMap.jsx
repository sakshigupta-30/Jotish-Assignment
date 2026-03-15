import { useEffect, useRef, useMemo } from 'react'
import L from 'leaflet'
import CITY_COORDS from '../utils/cityCoords'

export default function CityMap({ data }) {
    const mapRef = useRef(null)
    const instanceRef = useRef(null)

    const cityGroups = useMemo(() => {
        const map = {}
        data.forEach(row => {
            const city = row[2]
            if (!map[city]) map[city] = 0
            map[city] += 1
        })
        return map
    }, [data])

    useEffect(() => {
        if (!mapRef.current || instanceRef.current) return

        const map = L.map(mapRef.current).setView([30, 0], 2)
        instanceRef.current = map

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 18,
        }).addTo(map)

        Object.entries(cityGroups).forEach(([city, count]) => {
            const coords = CITY_COORDS[city]
            if (coords) {
                L.circleMarker(coords, {
                    radius: Math.min(6 + count * 2, 20),
                    fillColor: '#1a1a1a',
                    color: '#fff',
                    weight: 1,
                    fillOpacity: 0.8,
                })
                    .addTo(map)
                    .bindPopup(`${city}: ${count} employee${count > 1 ? 's' : ''}`)
            }
        })

        return () => {
            map.remove()
            instanceRef.current = null
        }
    }, [cityGroups])

    return (
        <div
            ref={mapRef}
            className="w-full rounded border border-[#e5e7eb]"
            style={{ height: 400 }}
        />
    )
}
