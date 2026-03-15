import { useLocation, Link } from 'react-router-dom'
import SvgChart from '../components/SvgChart'
import CityMap from '../components/CityMap'

export default function Analytics() {
    const location = useLocation()
    const mergedImage = location.state?.mergedImage
    const allData = location.state?.allData || []
    const employee = location.state?.employee

    if (!allData.length) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-sm text-[#6b7280]">No data available.</p>
                <Link to="/list" className="text-sm text-[#4a6cf7] hover:underline">Back to list</Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <header className="border-b border-[#e5e7eb] bg-white">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-[#1a1a1a]">Analytics</h1>
                    <Link to="/list" className="text-sm text-[#6b7280] hover:text-[#1a1a1a] transition-colors no-underline">
                        Back to list
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-6 space-y-6">
                {mergedImage && (
                    <section className="bg-white border border-[#e5e7eb] rounded-lg p-6">
                        <h2 className="text-sm font-medium text-[#6b7280] mb-4">
                            Audit Image {employee ? `- ${employee[0]}` : ''}
                        </h2>
                        <img
                            src={mergedImage}
                            alt="Verified identity"
                            className="max-w-md rounded border border-[#e5e7eb]"
                        />
                    </section>
                )}

                <section className="bg-white border border-[#e5e7eb] rounded-lg p-6">
                    <h2 className="text-sm font-medium text-[#6b7280] mb-4">Average Salary by City</h2>
                    <SvgChart data={allData} />
                </section>

                <section className="bg-white border border-[#e5e7eb] rounded-lg p-6">
                    <h2 className="text-sm font-medium text-[#6b7280] mb-4">Office Locations</h2>
                    <CityMap data={allData} />
                </section>
            </main>
        </div>
    )
}
