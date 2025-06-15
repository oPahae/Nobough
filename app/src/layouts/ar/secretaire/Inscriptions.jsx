import {
    Search, Filter, Users, Clock, Navigation, Flag, TrendingUp,
    Tag, DollarSign, BookOpen, User, Bookmark, Check, FileText, X,
    ArrowRight, Heart, Star, ChevronDown, Grid, List, Mail, Phone, Calendar, Info,
    CreditCard, AlertCircle, CheckCircle, ChevronRight, FileCheck, UserCheck, UserX,
    Book, GraduationCap, School, Award, Layers
} from 'lucide-react'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Inscriptions2 from '../../../components/ar/secretaire/Inscriptions2'
import Paiements2 from '../../../components/ar/secretaire/Paiements2'
import Loading from '@/utils/Loading'

export default function Inscriptions({ setSelectedImage, setNotification }) {
    const [activeTab, setActiveTab] = useState('inscriptions')
    const [inscriptions, setInscriptions] = useState([])
    const [paiements, setPaiements] = useState([])
    const [x, y] = useState(true)

    const fetchInscriptions = async () => {
        try {
            const response = await fetch('/api/inscriptions/getInscriptions')
            const data = await response.json()
            setInscriptions(data || [])
        } catch (error) {
            console.error('خطأ أثناء استرجاع التسجيلات:', error)
        }
    }

    const fetchPaiements = async () => {
        try {
            const response = await fetch('/api/inscriptions/getPaiements')
            const data = await response.json()
            console.log(data)
            setPaiements(data || [])
        } catch (error) {
            console.error('خطأ أثناء استرجاع المدفوعات:', error)
        } finally {
            y(false)
        }
    }

    useEffect(() => {
        fetchInscriptions()
        fetchPaiements()
    }, [])

    if (x) {
        return (
            <div className='w-screen flex justify-center items-center maxtop' dir="rtl">
                <Loading />
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>إدارة التكوينات - أكاديمية نبوغ</title>
                <link rel="icon" href="/logo2-nobg.png" />
            </Head>

            <div className="max-w-full" dir="rtl">
                {/* Nav */}
                <div className="max-w-5xl mx-auto mb-10">
                    <div className="flex justify-center border-b border-amber-200 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('inscriptions')}
                            className={`py-4 px-8 font-medium relative transition-all ${activeTab === 'inscriptions' ? 'text-amber-800' : 'text-gray-600 hover:text-amber-700'}`}
                        >
                            <div className="flex items-center whitespace-nowrap">
                                <GraduationCap className="w-5 h-5 ml-2" />
                                التسجيلات للتكوينات
                                <span className="mr-2 bg-gradient-to-l from-amber-600 to-amber-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm">
                                    {inscriptions.length}
                                </span>
                            </div>
                            {activeTab === 'inscriptions' && (
                                <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-amber-500 to-amber-700"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('paiements')}
                            className={`py-4 px-8 font-medium relative transition-all ${activeTab === 'paiements' ? 'text-amber-800' : 'text-gray-600 hover:text-amber-700'}`}
                        >
                            <div className="flex items-center whitespace-nowrap">
                                <CreditCard className="w-5 h-5 ml-2" />
                                مدفوعات الشهر الأول
                                <span className="mr-2 bg-gradient-to-l from-amber-600 to-amber-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm">
                                    {paiements.length}
                                </span>
                            </div>
                            {activeTab === 'paiements' && (
                                <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-amber-500 to-amber-700"></div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Inscriptions */}
                {activeTab === 'inscriptions' && (
                    <Inscriptions2 inscriptions={inscriptions} setNotification={setNotification} fetchInscriptions={fetchInscriptions} />
                )}

                {/* Paiements */}
                {activeTab === 'paiements' && (
                    <Paiements2 setSelectedImage={setSelectedImage} paiements={paiements} setNotification={setNotification} fetchPaiements={fetchPaiements} />
                )}
            </div>
        </>
    )
}