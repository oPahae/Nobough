import {
    FileText, Download, BookOpen, User, Clock, Users, Tag,
    ArrowRight, Sparkles, Moon, Award, Receipt, Calendar,
    Filter, ChevronDown, GraduationCap, FileCheck
} from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Documents({ session }) {
    const [certificats, setCertificats] = useState([])
    const [recus, setRecus] = useState([])
    const [formations, setFormations] = useState([])
    const [loadingCertificats, setLoadingCertificats] = useState(true)
    const [loadingRecus, setLoadingRecus] = useState(true)
    const [selectedYear, setSelectedYear] = useState('2025')
    const [selectedMonth, setSelectedMonth] = useState('all')
    const [selectedFormation, setSelectedFormation] = useState('all')

    useEffect(() => {
        fetchFormations()
        fetchCertificats()
        fetchRecus()
    }, [])

    const fetchFormations = async () => {
        try {
            const response = await fetch(`/api/_documents/getFormations?etudiantID=${session.id}`)
            const data = await response.json()
            setFormations(data || [])
        } catch (error) {
            console.error('خطأ أثناء تحميل التكوينات:', error)
        } finally {
            setLoadingCertificats(false)
        }
    }

    const fetchCertificats = async () => {
        try {
            const response = await fetch(`/api/_documents/getCertificats?etudiantID=${session.id}`)
            const data = await response.json()
            setCertificats(data || [])
        } catch (error) {
            console.error('خطأ أثناء تحميل الشهادات:', error)
        } finally {
            setLoadingCertificats(false)
        }
    }

    const fetchRecus = async () => {
        try {
            const response = await fetch(`/api/_documents/getRecus?etudiantID=${session.id}`)
            const data = await response.json()
            setRecus(data || [])
        } catch (error) {
            console.error('خطأ أثناء تحميل الإيصالات:', error)
        } finally {
            setLoadingRecus(false)
        }
    }

    const generateAttestation = async () => {
        try {
            const response = await fetch(`/api/_documents/attestation?etudiantID=${session.id}`)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'شهادة-التسجيل.pdf'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('خطأ أثناء إنشاء الشهادة:', error)
        }
    }

    const generateEmploi = async () => {
        try {
            const response = await fetch(`/api/_documents/emploi?etudiantID=${session.id}`)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'جدول-المحاضرات.pdf'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('خطأ أثناء إنشاء جدول المحاضرات:', error)
        }
    }

    const generateRecu = async (year, month) => {
        try {
            const response = await fetch(`/api/_documents/recu?etudiantID=${session.id}&year=${year}&month=${month}`)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `إيصال-الدفع-${year}-${month}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('خطأ أثناء إنشاء الإيصال:', error)
        }
    }

    const generateCertificat = async (certificatID) => {
        try {
            const response = await fetch(`/api/_documents/certificat?certificatID=${certificatID}`)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `شهادة-${certificatID}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('خطأ أثناء إنشاء الشهادة:', error)
        }
    }

    const getAvailableMonths = (year) => {
        const months = [...new Set(
            recus
                .filter(recu => new Date(recu.created_At).getFullYear().toString() === year)
                .map(recu => (new Date(recu.created_At).getMonth() + 1))
        )]

        return months.map(month => {
            const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
                               "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
            return {
                value: month.toString(),
                label: monthNames[month - 1]
            }
        })
    }

    const filteredRecus = recus.filter(recu => {
        const year = new Date(recu.created_At).getFullYear().toString()
        const month = (new Date(recu.created_At).getMonth() + 1).toString()
        return (selectedYear === 'all' || year === selectedYear) &&
               (selectedMonth === 'all' || month === selectedMonth)
    })

    const filteredCertificats = certificats.filter(certificat => {
        return selectedFormation === 'all' || certificat.formationID.toString() === selectedFormation
    })

    const availableYears = [...new Set(recus.map(recu => new Date(recu.created_At).getFullYear().toString()))]
    const availableMonths = getAvailableMonths(selectedYear)

    return (
        <div className="w-full mx-auto md:p-6" dir="rtl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-center mb-4">
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-600"></div>
                    <FileText className="text-amber-700 mx-4 w-8 h-8" />
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-600"></div>
                </div>
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">مستنداتي</h1>
                <p className="text-center text-gray-600">الوصول إلى جميع مستنداتك الأكاديمية</p>
            </div>

            {/* Block 1: Main Documents */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FileCheck className="w-5 h-5 ml-2 text-amber-600" />
                    المستندات الرئيسية
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={generateAttestation}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-all group"
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center ml-4">
                                <Award className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="text-right">
                                <h3 className="font-semibold text-gray-800">شهادة التسجيل</h3>
                                <p className="text-sm text-gray-600">مستند رسمي للتسجيل</p>
                            </div>
                        </div>
                        <Download className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
                    </button>

                    <button
                        onClick={generateEmploi}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-all group"
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center ml-4">
                                <Calendar className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="text-right">
                                <h3 className="font-semibold text-gray-800">جدول المحاضرات</h3>
                                <p className="text-sm text-gray-600">جدول المحاضرات الحالية</p>
                            </div>
                        </div>
                        <Download className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
                    </button>
                </div>
            </div>

            {/* Block 2: Payment Receipts */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <Receipt className="w-5 h-5 ml-2 text-amber-600" />
                        إيصالات الدفع
                    </h2>
                    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
                        <div className="flex items-center">
                            <Filter className="w-4 h-4 text-gray-500 ml-2" />
                            <select
                                value={selectedYear}
                                onChange={(e) => {
                                    setSelectedYear(e.target.value)
                                    setSelectedMonth('all')
                                }}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            >
                                <option value="all">جميع السنوات</option>
                                {availableYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        {selectedYear !== 'all' && (
                            <div className="flex items-center">
                                <Filter className="w-4 h-4 text-gray-500 ml-2" />
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    <option value="all">جميع الأشهر</option>
                                    {availableMonths.map(month => (
                                        <option key={month.value} value={month.value}>{month.label}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {loadingRecus ? (
                    <div className="text-center py-8 text-gray-500">جاري تحميل الإيصالات...</div>
                ) : filteredRecus.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">لم يتم العثور على إيصالات</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredRecus.map((recu) => (
                            <button
                                key={recu.id}
                                onClick={() => generateRecu(
                                    new Date(recu.created_At).getFullYear(),
                                    (new Date(recu.created_At).getMonth() + 1)
                                )}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-all group"
                            >
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center ml-3">
                                        <Receipt className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="text-right">
                                        <h3 className="font-medium text-gray-800">{recu.total} درهم</h3>
                                        <p className="text-xs text-gray-600">
                                            {new Date(recu.created_At).toLocaleDateString('FR-fr')}
                                        </p>
                                    </div>
                                </div>
                                <Download className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Block 3: Certificates */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center md:justify-between mb-4 flex-wrap gap-3">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <GraduationCap className="w-5 h-5 ml-2 text-amber-600" />
                        الشهادات
                    </h2>
                    <div className="flex items-center">
                        <Filter className="w-4 h-4 text-gray-500 ml-2" />
                        <select
                            value={selectedFormation}
                            onChange={(e) => setSelectedFormation(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                            <option value="all">جميع التكوينات</option>
                            {formations.map(formation => (
                                <option key={formation.id} value={formation.id}>تكوين {formation.titre}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {loadingCertificats ? (
                    <div className="text-center py-8 text-gray-500">جاري تحميل الشهادات...</div>
                ) : filteredCertificats.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">لم يتم العثور على شهادات</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCertificats.map((certificat) => (
                            <button
                                key={certificat.id}
                                onClick={() => generateCertificat(certificat.id)}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-all group"
                            >
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center ml-3">
                                        <Award className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="text-right">
                                        <h3 className="font-medium text-gray-800">{certificat.formationTitre}</h3>
                                        <p className="text-xs text-gray-600 mb-1">{certificat.mention}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(certificat.created_At).toLocaleDateString('FR-fr')}
                                        </p>
                                    </div>
                                </div>
                                <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}