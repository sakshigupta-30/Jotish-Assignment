import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import Camera from '../components/Camera'
import SignaturePad from '../components/SignaturePad'
import { mergeImage } from '../utils/mergeImage'

const FIELD_LABELS = ['Name', 'Position', 'Office', 'Extension', 'Start Date', 'Salary']

export default function Details() {
    const { id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const employee = location.state?.employee
    const allData = location.state?.allData

    const [photo, setPhoto] = useState(null)
    const [signatureCanvas, setSignatureCanvas] = useState(null)
    const [mergedImage, setMergedImage] = useState(null)
    const [step, setStep] = useState('capture')

    const handleCapture = useCallback((dataUrl) => {
        setPhoto(dataUrl)
        setStep('sign')
    }, [])

    const handleSign = useCallback((canvas) => {
        setSignatureCanvas(canvas)
    }, [])

    useEffect(() => {
        if (photo && signatureCanvas) {
            mergeImage(photo, signatureCanvas).then(merged => {
                setMergedImage(merged)
                setStep('done')
            })
        }
    }, [photo, signatureCanvas])

    function handleProceed() {
        navigate('/analytics', { state: { mergedImage, allData, employee } })
    }

    if (!employee) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-sm text-[#6b7280]">No employee data found.</p>
                <Link to="/list" className="text-sm text-[#4a6cf7] hover:underline">Back to list</Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <header className="border-b border-[#e5e7eb] bg-white">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-[#1a1a1a]">Identity Verification</h1>
                    <Link to="/list" className="text-sm text-[#6b7280] hover:text-[#1a1a1a] transition-colors no-underline">
                        Back to list
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-6">
                <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 mb-6">
                    <h2 className="text-sm font-medium text-[#6b7280] mb-3">Employee Details</h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        {employee.map((val, i) => (
                            <div key={i} className="flex items-baseline gap-2">
                                <span className="text-xs text-[#9ca3af] uppercase tracking-wide min-w-[80px]">
                                    {FIELD_LABELS[i] || `Field ${i + 1}`}
                                </span>
                                <span className="text-sm text-[#1a1a1a]">{val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {step === 'capture' && (
                    <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
                        <h2 className="text-sm font-medium text-[#6b7280] mb-4">Capture Photo</h2>
                        <Camera onCapture={handleCapture} />
                    </div>
                )}

                {step === 'sign' && photo && (
                    <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
                        <h2 className="text-sm font-medium text-[#6b7280] mb-4">Sign Over Photo</h2>
                        <SignaturePad photoSrc={photo} onSign={handleSign} />
                    </div>
                )}

                {step === 'done' && mergedImage && (
                    <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
                        <h2 className="text-sm font-medium text-[#6b7280] mb-4">Verification Complete</h2>
                        <img src={mergedImage} alt="Signed verification" className="max-w-full rounded border border-[#e5e7eb]" />
                        <button
                            onClick={handleProceed}
                            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] rounded-md hover:bg-[#333] transition-colors cursor-pointer"
                        >
                            View Analytics
                        </button>
                    </div>
                )}
            </main>
        </div>
    )
}
