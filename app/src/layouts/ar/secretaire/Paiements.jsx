import {
    Search, Filter, Users, Clock, Navigation, Flag, TrendingUp,
    Tag, DollarSign, BookOpen, User, Bookmark, Check, FileText, X,
    ArrowRight, Heart, Star, ChevronDown, Grid, List, Mail, Phone, Calendar, Info,
    CreditCard, AlertCircle, CheckCircle, ChevronRight, FileCheck, UserCheck, UserX,
    Book, GraduationCap, School, Award, Layers, Moon, Sparkles
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Loading from '@/utils/Loading'

const Paiements = ({ setSelectedImage, setNotification }) => {
    const [paiements, setPaiements] = useState([])
    const [showRefuseReasonPaiement, setShowRefuseReasonPaiement] = useState({})
    const [refuseReasonPaiement, setRefuseReasonPaiement] = useState({})
    const [formationID, setFormationID] = useState(null)
    const [formations, setFormations] = useState([])
    const [x, y] = useState(true)

    const toggleRefuseReasonPaiement = (id) => {
        setShowRefuseReasonPaiement(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl)
    }

    useEffect(() => {
        fetchFormations()
    }, [])

    const fetchFormations = async () => {
        try {
            const response = await fetch('/api/formations/getAll')
            const data = await response.json()
            setFormations(data)
        } catch (error) {
            console.error('خطأ أثناء استرجاع التكوينات:', error)
        } finally {
            y(false)
        }
    }

    useEffect(() => {
        const fetchPaiements = async () => {
            try {
                const response = await fetch(`/api/paiements/getAll?formationID=${formationID}`)
                const data = await response.json()
                let formattedPaiements = []

                if (data.length > 0) {
                    formattedPaiements = data.map(paiement => ({
                        id: paiement.id,
                        prenom: paiement.prenom,
                        nom: paiement.nom,
                        email: paiement.email,
                        tel: paiement.tel,
                        cin: paiement.cin,
                        birth: new Date(paiement.birth).toLocaleDateString('ar-SA'),
                        total: paiement.total,
                        formationTitre: paiement.formationTitre,
                        formationID: paiement.formationID,
                        datePaiement: new Date(paiement.datePaiement).toLocaleDateString('ar-SA'),
                        preuve: paiement.preuve ? `data:image/jpeg;base64,${Buffer.from(paiement.preuve).toString('base64')}` : null,
                        img: paiement.img ? `data:image/jpeg;base64,${Buffer.from(paiement.img).toString('base64')}` : "/user.jpg"
                    }))
                }

                setPaiements(formattedPaiements)
                console.log(formattedPaiements)
            } catch (error) {
                console.error('خطأ أثناء استرجاع المدفوعات:', error)
            }
        }
        fetchPaiements()
    }, [formationID])

    const handleValiderPaiement = async (id, email, total) => {
        try {
            const response = await fetch('/api/paiements/validerPaiement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            })

            if (response.ok) {
                setNotification((notif) => ({
                    ...notif,
                    msg: `تم التحقق من الدفع #${id} بنجاح!`,
                    type: 'success',
                    shown: true
                }))
                envoyerEmail('valider', email, total)
            } else {
                const data = await response.json()
                setNotification((notif) => ({
                    ...notif,
                    msg: data.message || 'خطأ أثناء التحقق من الدفع.',
                    type: 'error',
                    shown: true
                }))
            }
        } catch (error) {
            setNotification((notif) => ({
                ...notif,
                msg: 'حدث خطأ. يرجى المحاولة مرة أخرى لاحقًا.',
                type: 'error',
                shown: true
            }))
        }
    }

    const handleRefuserPaiement = async (id, email, raison) => {
        try {
            const response = await fetch('/api/paiements/refuserPaiement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            })

            if (response.ok) {
                setNotification((notif) => ({
                    ...notif,
                    msg: `تم رفض الدفع #${id}: ${raison}`,
                    type: 'info',
                    shown: true
                }))
                setShowRefuseReasonPaiement(prev => ({ ...prev, [id]: false }))
                envoyerEmail('refuser', email, raison)
            } else {
                const data = await response.json()
                setNotification((notif) => ({
                    ...notif,
                    msg: data.message || 'خطأ أثناء رفض الدفع.',
                    type: 'error',
                    shown: true
                }))
                setNotification((notif) => ({ ...notif, shown: true }))
            }
        } catch (error) {
            setNotification((notif) => ({
                ...notif,
                msg: 'حدث خطأ. يرجى المحاولة مرة أخرى لاحقًا.',
                type: 'error',
                shown: true
            }))
        }
    }

    const envoyerEmail = async (type, email, param2) => {
        try {
            const res = await fetch(`/api/_mail/${type}PaiementMensuel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: type === 'valider' ? JSON.stringify({ email, total: param2 }) : JSON.stringify({ email, raison: param2 }),
            })

            const data = await res.json()

            if (res.ok) {
                console.log('تم إرسال البريد الإلكتروني بنجاح!')
            } else {
                console.error('خطأ:', data)
            }
        } catch (error) {
            console.error('خطأ في الشبكة:', error)
        }
    }

    if (x) {
        return (
            <div className='w-screen flex justify-center items-center maxtop'>
                <Loading />
            </div>
        )
    }

    return (
        <div dir="rtl">
            <div className="max-w-full md:px-22 relative">
                <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 opacity-20">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#B8860B" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                        </svg>
                    </div>
                    <div className="absolute top-1/2 -right-24 w-64 h-64 opacity-20">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#B8860B" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                        </svg>
                    </div>
                    <div className="absolute -bottom-24 left-1/4 w-72 h-72 opacity-20">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#B8860B" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                        </svg>
                    </div>
                </div>

                <div className="mb-12 text-center pt-8 relative">
                    <div className="inline-block">
                        <div className="flex items-center justify-center mb-2">
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-700"></div>
                            <Sparkles className="text-amber-800 mx-4 w-6 h-6" />
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-700"></div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">إدارة المدفوعات</h1>
                        <div className="flex items-center justify-center mt-2">
                            <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                            <Moon className="text-amber-800 mx-4 w-4 h-4" />
                            <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                        </div>
                    </div>
                    <p className="text-gray-600 mt-4 max-w-xl mx-auto">إدارة طلبات التسجيل والتحقق من معاملات التكوينات</p>
                </div>

                <div className="relative flex items-center justify-center mb-6">
                    <div className="absolute right-0 w-1/4 h-px bg-gradient-to-l from-transparent to-amber-700/30"></div>
                    <div className="flex items-center">
                        <h2 className="text-2xl font-bold text-amber-900">مدفوعات الطلاب ({paiements.length})</h2>
                        <CreditCard className="w-6 h-6 text-amber-700 ml-3" />
                    </div>
                    <div className="absolute left-0 w-1/4 h-px bg-gradient-to-r from-transparent to-amber-700/30"></div>
                </div>

                <div className="mb-4">
                    <select
                        id="formation"
                        name="formation"
                        value={formationID || ''}
                        onChange={(e) => setFormationID(e.target.value)}
                        className="mt-1 block w-fit bg-white pr-3 pl-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
                    >
                        <option value="">اختر تكوين</option>
                        {formations.map((formation) => (
                            <option key={formation.id} value={formation.id}>{formation.titre}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-6">
                    {paiements.filter(p => p.formationID == formationID || !formationID).map((paiement) => (
                        <div key={paiement.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-amber-100 hover:shadow-lg group relative">
                            <div className="flex flex-col sm:flex-row justify-between p-6">
                                <div className="flex mb-4 sm:mb-0">
                                    <div className="relative">
                                        <img
                                            src={paiement.img ? atob(paiement.img.split(',')[1]) : '/user.jpg'}
                                            alt={`${paiement.prenom} ${paiement.nom}`}
                                            className="w-16 h-16 rounded-full object-cover ml-4 border-2 border-amber-200 shadow-md"
                                        />
                                        <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center shadow-sm">
                                            <User className="w-3 h-3 text-amber-700" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg text-amber-800 font-semibold">
                                            {paiement.prenom} {paiement.nom}
                                        </h3>
                                        <p className="text-gray-600 text-sm">دفع بتاريخ {paiement.datePaiement}</p>
                                        <div className="flex items-center mt-2 bg-amber-50 px-3 py-1 rounded-full inline-block">
                                            <span className="mx-2 text-amber-300">•</span>
                                            <span className="font-medium text-amber-700">{paiement.total} درهم</span>
                                        </div>
                                        <span> → {paiement.formationTitre}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 sm:mt-0 mt-4">
                                    <button
                                        className="py-2 px-4 bg-gradient-to-l from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center cursor-pointer"
                                        onClick={() => handleValiderPaiement(paiement.id, paiement.email, paiement.total)}
                                    >
                                        <span className="font-medium">التحقق</span>
                                        <Check className="w-4 h-4 ml-2" />
                                    </button>
                                    {showRefuseReasonPaiement[paiement.id] ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                className="py-2 px-4 border border-amber-200 rounded-lg bg-white/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700"
                                                placeholder="أدخل السبب"
                                                onChange={(e) => setRefuseReasonPaiement({ ...refuseReasonPaiement, [paiement.id]: e.target.value })}
                                                value={refuseReasonPaiement[paiement.id] || ""}
                                            />
                                            <button
                                                className="py-2 px-4 bg-gradient-to-l from-red-500 to-red-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
                                                onClick={() => handleRefuserPaiement(paiement.id, paiement.email, refuseReasonPaiement[paiement.id])}
                                                disabled={!refuseReasonPaiement[paiement.id]}
                                            >
                                                <span className="font-medium">تأكيد</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="py-2 px-4 bg-gradient-to-l from-gray-200 to-gray-400 text-black rounded-lg transition-all flex items-center shadow-sm"
                                            onClick={() => toggleRefuseReasonPaiement(paiement.id)}
                                        >
                                            <span className="font-medium">رفض</span>
                                            <X className="w-4 h-4 ml-2" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <details className="px-6 pb-6 border-t border-amber-100">
                                <summary className="py-3 cursor-pointer focus:outline-none text-amber-700 font-medium">
                                    <div className="flex items-center">
                                        <ChevronRight className="w-4 h-4 mr-1" />
                                        عرض تفاصيل الدفع
                                        <Info className="w-4 h-4 ml-2" />
                                    </div>
                                </summary>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
                                        <h4 className="font-medium text-amber-800 mb-3 flex items-center">
                                            <User className="w-4 h-4 text-amber-700 ml-2" />
                                            معلومات شخصية
                                        </h4>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-center bg-amber-50/50 p-2 rounded-lg">
                                                <User className="w-4 h-4 text-amber-600 ml-2" />
                                                <span className="font-medium">الاسم الكامل:</span>
                                                <span className="mr-2 text-gray-700">{paiement.prenom} {paiement.nom}</span>
                                            </div>
                                            <div className="flex items-center bg-amber-50/50 p-2 rounded-lg">
                                                <Calendar className="w-4 h-4 text-amber-600 ml-2" />
                                                <span className="font-medium">تاريخ الميلاد:</span>
                                                <span className="mr-2 text-gray-700">{paiement.birth}</span>
                                            </div>
                                            <div className="flex items-center bg-amber-50/50 p-2 rounded-lg">
                                                <FileCheck className="w-4 h-4 text-amber-600 ml-2" />
                                                <span className="font-medium">رقم الهوية:</span>
                                                <span className="mr-2 text-gray-700">{paiement.cin}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
                                        <h4 className="font-medium text-amber-800 mb-3 flex items-center">
                                            <Phone className="w-4 h-4 text-amber-700 ml-2" />
                                            معلومات الاتصال
                                        </h4>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-center bg-amber-50/50 p-2 rounded-lg">
                                                <Mail className="w-4 h-4 text-amber-600 ml-2" />
                                                <span className="font-medium">البريد الإلكتروني:</span>
                                                <span className="mr-2 text-gray-700">{paiement.email}</span>
                                            </div>
                                            <div className="flex items-center bg-amber-50/50 p-2 rounded-lg">
                                                <Phone className="w-4 h-4 text-amber-600 ml-2" />
                                                <span className="font-medium">الهاتف:</span>
                                                <span className="mr-2 text-gray-700">{paiement.tel}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
                                        <h4 className="font-medium text-amber-800 mb-3 flex items-center">
                                            <CreditCard className="w-4 h-4 text-amber-700 ml-2" />
                                            تفاصيل الدفع
                                        </h4>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-center bg-amber-50/50 p-2 rounded-lg">
                                                <DollarSign className="w-4 h-4 text-amber-600 ml-2" />
                                                <span className="font-medium">المبلغ:</span>
                                                <span className="mr-2 text-gray-700">{paiement.total} درهم</span>
                                            </div>
                                            <div className="flex items-center bg-amber-50/50 p-2 rounded-lg">
                                                <Calendar className="w-4 h-4 text-amber-600 ml-2" />
                                                <span className="font-medium">التاريخ:</span>
                                                <span className="mr-2 text-gray-700">{paiement.datePaiement}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
                                        <h4 className="font-medium text-amber-800 mb-3 flex items-center">
                                            <FileCheck className="w-4 h-4 text-amber-700 ml-2" />
                                            إثبات المعاملة
                                        </h4>
                                        <div className="flex justify-center">
                                            <img
                                                src={paiement.preuve}
                                                alt="إثبات المعاملة"
                                                className="border border-amber-200 rounded-lg shadow-md max-w-xs cursor-pointer hover:opacity-90 transition-opacity"
                                                onClick={() => handleImageClick(paiement.preuve)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </details>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Paiements