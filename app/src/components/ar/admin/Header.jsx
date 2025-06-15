import React, { useState, useEffect } from 'react'
import {
    ArrowDown, ArrowUp, AlertCircle, DollarSign,
    Calendar, FileText, Users, PieChart, ClipboardList,
    CreditCard, Megaphone, Bell, LogOut, User, X, Menu, ChevronDown,
    Info, Mail, Shield, HelpCircle, UserPlus, BookOpen, ChevronRight
} from 'lucide-react'
import Link from 'next/link'

const Sidebar = ({ activeTab, setActiveTab, sidebarOpened, setSidebarOpened }) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)

    const [navItems, setNavItems] = useState([
        {
            id: 'comptes',
            label: 'الحسابات',
            icon: Users,
        },
        {
            id: 'budget',
            label: 'الميزانية',
            icon: PieChart,
        },
        {
            id: 'revenus',
            label: 'الإيرادات',
            icon: ArrowUp,
        },
        {
            id: 'depenses',
            label: 'المصروفات',
            icon: ArrowDown,
        },
        {
            id: 'dettes',
            label: 'الديون',
            icon: DollarSign,
        },
        {
            id: 'evenements',
            label: 'الأحداث',
            icon: Calendar,
        },
        {
            id: 'salaires',
            label: 'الرواتب',
            icon: Users,
        },
        {
            id: 'adhesions',
            label: 'العضويات',
            icon: UserPlus,
        },
        {
            id: 'inscriptions',
            label: 'التسجيلات',
            icon: ClipboardList,
        },
        {
            id: 'paiements',
            label: 'المدفوعات',
            icon: CreditCard,
        },
        {
            id: 'etudiants',
            label: 'الطلاب',
            icon: Users,
        },
        {
            id: 'annonces',
            label: 'الإعلانات',
            icon: Megaphone,
        },
        {
            id: 'formations',
            label: 'التدريبات',
            icon: BookOpen,
        },
        {
            id: 'professeurs',
            label: 'الأساتذة',
            icon: Users,
        },
        {
            id: 'protestations',
            label: 'التواصلات',
            icon: Info,
        }
    ])

    const additionalLinks = [
        {
            id: 'faq',
            label: 'الأسئلة الشائعة',
            icon: HelpCircle,
            href: '/ar/FAQs'
        },
        {
            id: 'about',
            label: 'من نحن',
            icon: Info,
            href: '/about'
        },
        {
            id: 'privacy',
            label: 'سياسة الخصوصية',
            icon: Shield,
            href: '/privacy'
        }
    ]

    const handleTabChange = (tab) => {
        setActiveTab(tab)
    }

    useEffect(() => {
        const active = localStorage.getItem('activeTabAdmin')
        setActiveTab(active)
    }, [])

    const handleLogout = async () => {
        const res = await fetch('/api/_auth/adminLogout', { method: 'POST' });
        if (res.ok) {
            localStorage.setItem('activeTabAdmin', 'budget')
            window.location.reload()
        }
    }

    return (
        <div className={`h-screen overflow-y-scroll fixed top-0 right-0 z-40 bg-white shadow-md transition-all duration-300 ${sidebarOpened ? 'w-full md:w-64' : 'w-16'}`} dir="rtl">
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-amber-100">
                    {sidebarOpened ? (
                        <>
                            <button
                                className="p-2 rounded-full bg-amber-100 hover:bg-amber-200 transition-colors"
                                onClick={() => setSidebarOpened(!sidebarOpened)}
                            >
                                <X className="w-5 h-5 text-amber-700" />
                            </button>
                            <div className="flex items-center gap-1">
                                <div className="rounded-full bg-gradient-to-br from-amber-200 to-amber-600 p-2 flex overflow-hidden cursor-pointer shadow-md shrink-0">
                                    <img
                                        src="/logo2.png"
                                        alt="شعار أكاديمية نبوغ"
                                        className="h-10 w-auto shrink-0"
                                    />
                                </div>
                                <div className="relative pr-4">
                                    <h1 className="text-xl font-bold" style={{ fontFamily: "'Noto Sans Arabic', 'Noto Sans', sans-serif" }}>
                                        أكاديمية نبوغ
                                    </h1>
                                    <p className="text-xs text-amber-700">الفضاء المحاسبي</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <button
                            className="p-2 rounded-full bg-amber-100 hover:bg-amber-200 transition-colors"
                            onClick={() => setSidebarOpened(!sidebarOpened)}
                        >
                            <ChevronRight className="w-5 h-5 text-amber-700" />
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto">
                    <nav className="p-2">
                        <ul className="space-y-2">
                            {navItems.map((item) => (
                                <li key={item.id}>
                                    <button
                                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${activeTab === item.id ? 'bg-amber-50 text-amber-800' : 'hover:bg-amber-50'}`}
                                        onClick={() => handleTabChange(item.id)}
                                    >
                                        <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-amber-600' : 'text-gray-500'}`} />
                                        {sidebarOpened && <span className="mr-3">{item.label}</span>}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {sidebarOpened && (
                        <div className="p-4 border-t border-amber-100">
                            <p className="text-sm text-gray-500 font-medium mb-2">روابط سريعة</p>
                            <ul className="space-y-2">
                                <Link href="/fr/Admin">
                                    <button className="px-4 py-3 font-medium transition-all w-full text-right flex items-center hover:bg-amber-50">
                                        <img src="/ar.png" className="w-5 h-5 ml-3 text-amber-600" />
                                        <span>تغيير اللغة</span>
                                    </button>
                                </Link>
                                {additionalLinks.map((link) => (
                                    <li key={link.id}>
                                        <Link href={link.href}>
                                            <button className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-amber-50 transition-all duration-300">
                                                <link.icon className="w-5 h-5 ml-3 text-amber-600" />
                                                <span>{link.label}</span>
                                            </button>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {sidebarOpened && (
                    <div className="p-4 border-t border-amber-100">
                        <div className="relative">
                            <button
                                className="flex items-center justify-center w-full px-4 py-3 rounded-lg bg-amber-700 hover:bg-amber-800 transition-all duration-300"
                                onClick={handleLogout}
                            >
                                <User className="w-5 h-5 ml-3 text-white" />
                                <span className='text-white'>تسجيل الخروج</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Sidebar