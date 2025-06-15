import { useState, useEffect } from 'react'
import {
    Calendar, DollarSign, CheckCircle, XCircle,
    Filter, ChevronDown, Search, User, BookOpen,
    TrendingUp, CreditCard, Clock, Award
} from 'lucide-react'

export default function Salaires({ setActiveTab }) {
    const [professeurs, setProfesseurs] = useState([])
    const [salaires, setSalaires] = useState([])
    const [selectedProf, setSelectedProf] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const generateSalaryDates = (created_At) => {
        const dates = []
        const startDate = new Date(created_At)
        startDate.setMonth(startDate.getMonth() + 1)
        const endDate = new Date()

        for (let date = new Date(startDate); date <= endDate; date.setMonth(date.getMonth() + 1)) {
            dates.push(new Date(date))
        }

        return dates
    }

    const isPaid = (profID, date) => {
        const dateStr = date.toISOString().slice(0, 7)
        return salaires.some(s => s.profID === profID && new Date(s.datePaiement).toISOString().slice(0, 7) === dateStr)
    }

    const getPaymentStats = (profId) => {
        if (!selectedProf) return { paid: 0, unpaid: 0, total: 0 }

        const dates = generateSalaryDates(selectedProf.created_At)
        const paid = dates.filter(date => isPaid(profId, date)).length
        const unpaid = dates.length - paid

        return { paid, unpaid, total: dates.length }
    }

    useEffect(() => {
        fetchProfesseurs()
        fetchSalaires()
    }, [])

    const fetchProfesseurs = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/profs/getAll')
            const data = await response.json()
            setProfesseurs(data || [])
        } catch (error) {
            console.error('خطأ أثناء استرجاع الأساتذة:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchSalaires = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/finance/getSalaires')
            const data = await response.json()
            setSalaires(data || [])
        } catch (error) {
            console.error('خطأ أثناء استرجاع الرواتب:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const togglePaiementMois = async (profID, date) => {
        try {
            const response = await fetch('/api/finance/updateProf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ profID, date, isPaid: isPaid(selectedProf.id, date) })
            })

            if (response.ok) {
                fetchSalaires()
            }
        } catch (error) {
            console.error('خطأ أثناء تحديث الدفع:', error)
        }
    }

    const stats = selectedProf ? getPaymentStats(selectedProf.id) : null

    return (
        <div className="min-h-screen bg-gradient-to-br pt-4 pb-16" dir="rtl">
            {/* رأس الصفحة مع تأثير الزجاج */}
            <div className="max-w-7xl mx-auto px-4 mb-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg">
                                <DollarSign className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                    إدارة الرواتب
                                </h1>
                                <p className="text-amber-700/70 mt-1">متابعة المدفوعات الشهرية</p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center space-x-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-amber-600">{professeurs.length}</div>
                                <div className="text-sm text-amber-700/70">أساتذة</div>
                            </div>
                            <div className="w-px h-12 bg-amber-200"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{salaires.length}</div>
                                <div className="text-sm text-amber-700/70">مدفوعات</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-8">
                {/* قائمة الأساتذة مع تصميم محسن */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200/50 overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6">
                            <h2 className="text-xl font-bold text-white flex items-center">
                                <User className="w-6 h-6 ml-3" />
                                قائمة الأساتذة
                            </h2>
                        </div>

                        {isLoading ? (
                            <div className="p-12 text-center">
                                <div className="relative">
                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-500 mx-auto"></div>
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 opacity-20 animate-pulse"></div>
                                </div>
                                <p className="text-amber-700 mt-4 font-medium">جاري التحميل...</p>
                            </div>
                        ) : (
                            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                                {professeurs.map((prof, index) => (
                                    <div
                                        key={prof.id}
                                        className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                                            selectedProf?.id === prof.id
                                                ? 'bg-gradient-to-r from-amber-100 to-orange-100 ring-2 ring-amber-400 shadow-lg'
                                                : 'bg-white hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:shadow-md'
                                        }`}
                                        onClick={() => setSelectedProf(prof)}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <div className="flex items-center">
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={prof.img ? atob(Buffer.from(prof.img).toString('base64')) : "/user.jpg"}
                                                    className="h-12 w-12 rounded-full object-cover ring-2 ring-amber-200 shadow-sm"
                                                    alt={`${prof.prenom} ${prof.nom}`}
                                                />
                                                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white"></div>
                                            </div>
                                            <div className="mr-4 flex-grow">
                                                <div className="text-base font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">
                                                    {`${prof.prenom} ${prof.nom}`}
                                                </div>
                                                <div className="text-sm text-gray-500 truncate">{prof.email}</div>
                                                <div className="text-sm text-gray-400">{prof.tel}</div>
                                            </div>
                                            <div className="text-left">
                                                <div className="flex items-center text-lg font-bold text-amber-600">
                                                    <DollarSign className="w-4 h-4 ml-1" />
                                                    {prof.salaire}
                                                </div>
                                                <div className="text-xs text-gray-500">درهم/شهر</div>
                                            </div>
                                        </div>
                                        {selectedProf?.id === prof.id && (
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400/10 to-orange-400/10 pointer-events-none"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* تفاصيل الرواتب مع تصميم متميز */}
                <div className="w-full lg:w-2/3">
                    {selectedProf ? (
                        <div className="space-y-6">
                            {/* إحصائيات مع بطاقات */}
                            {stats && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-green-100">المدفوعات المنجزة</p>
                                                <p className="text-3xl font-bold">{stats.paid}</p>
                                            </div>
                                            <CheckCircle className="w-12 h-12 text-green-200" />
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-6 text-white shadow-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-red-100">في الانتظار</p>
                                                <p className="text-3xl font-bold">{stats.unpaid}</p>
                                            </div>
                                            <Clock className="w-12 h-12 text-red-200" />
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-amber-100">إجمالي الأشهر</p>
                                                <p className="text-3xl font-bold">{stats.total}</p>
                                            </div>
                                            <Calendar className="w-12 h-12 text-amber-200" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* جدول الرواتب */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200/50 overflow-hidden">
                                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-white flex items-center">
                                            <CreditCard className="w-6 h-6 ml-3" />
                                            سجل الرواتب - {`${selectedProf.prenom} ${selectedProf.nom}`}
                                        </h2>
                                        <div className="flex items-center text-amber-100">
                                            <Award className="w-5 h-5 ml-2" />
                                            <span className="font-semibold">{selectedProf.salaire} درهم/شهر</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead className="bg-gradient-to-r from-amber-100 to-orange-100">
                                            <tr>
                                                <th className="px-6 py-4 text-right text-sm font-bold text-amber-800 uppercase tracking-wider">
                                                    <div className="flex items-center">
                                                        <Calendar className="w-4 h-4 ml-2" />
                                                        الفترة
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-right text-sm font-bold text-amber-800 uppercase tracking-wider">
                                                    <div className="flex items-center">
                                                        <TrendingUp className="w-4 h-4 ml-2" />
                                                        الحالة
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-right text-sm font-bold text-amber-800 uppercase tracking-wider">
                                                    الإجراءات
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-amber-100">
                                            {generateSalaryDates(selectedProf.created_At).map((date, index) => {
                                                const paid = isPaid(selectedProf.id, date)
                                                return (
                                                    <tr
                                                        key={index}
                                                        className="hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50 transition-all duration-200"
                                                        style={{ animationDelay: `${index * 30}ms` }}
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="p-2 bg-amber-100 rounded-lg ml-3">
                                                                    <Calendar className="w-4 h-4 text-amber-600" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {date.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {paid ? (
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 ring-1 ring-green-200">
                                                                    <CheckCircle className="w-4 h-4 ml-2" />
                                                                    مدفوع
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-red-100 to-rose-100 text-red-800 ring-1 ring-red-200">
                                                                    <XCircle className="w-4 h-4 ml-2" />
                                                                    غير مدفوع
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <button
                                                                onClick={() => togglePaiementMois(selectedProf.id, date)}
                                                                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
                                                                    paid
                                                                        ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700'
                                                                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                                                                }`}
                                                            >
                                                                {paid ? (
                                                                    <>
                                                                        <XCircle className="w-4 h-4 ml-2" />
                                                                        إلغاء الدفع
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <CheckCircle className="w-4 h-4 ml-2" />
                                                                        وضع علامة مدفوع
                                                                    </>
                                                                )}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200/50 p-12 text-center">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="p-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full">
                                    <User className="w-16 h-16 text-amber-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">اختر أستاذًا</h3>
                                <p className="text-gray-600 max-w-md">
                                    اختر أستاذًا من القائمة على اليسار لعرض سجل مدفوعاته وإدارة راتبه.
                                </p>
                                <div className="flex items-center space-x-2 text-amber-600">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}