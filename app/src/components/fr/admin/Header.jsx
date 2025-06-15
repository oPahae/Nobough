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
            label: 'Comptes',
            icon: Users,
        },
        {
            id: 'budget',
            label: 'Budget',
            icon: PieChart,
        },
        {
            id: 'revenus',
            label: 'Revenus',
            icon: ArrowUp,
        },
        {
            id: 'depenses',
            label: 'Dépenses',
            icon: ArrowDown,
        },
        {
            id: 'dettes',
            label: 'Dettes',
            icon: DollarSign,
        },
        {
            id: 'evenements',
            label: 'Événements',
            icon: Calendar,
        },
        {
            id: 'salaires',
            label: 'Salaires',
            icon: Users,
        },
        {
            id: 'adhesions',
            label: 'Adhésions',
            icon: UserPlus,
        },
        {
            id: 'inscriptions',
            label: 'Inscriptions',
            icon: ClipboardList,
        },
        {
            id: 'paiements',
            label: 'Paiements',
            icon: CreditCard,
        },
        {
            id: 'etudiants',
            label: 'Etudiants',
            icon: Users,
        },
        {
            id: 'annonces',
            label: 'Annonces',
            icon: Megaphone,
        },
        {
            id: 'formations',
            label: 'Formations',
            icon: BookOpen,
        },
        {
            id: 'professeurs',
            label: 'Professeurs',
            icon: Users,
        },
        {
            id: 'protestations',
            label: 'Protestations',
            icon: Info,
        }
    ])

    const additionalLinks = [
        {
            id: 'faq',
            label: 'FAQs',
            icon: HelpCircle,
            href: '/fr/FAQs'
        },
        {
            id: 'about',
            label: 'À propos de nous',
            icon: Info,
            href: '/about'
        },
        {
            id: 'privacy',
            label: 'Politique de confidentialité',
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
        <div className={`h-screen overflow-y-scroll fixed top-0 left-0 z-40 bg-white shadow-md transition-all duration-300 ${sidebarOpened ? 'w-full md:w-64' : 'w-16'}`}>
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-amber-100">
                    {sidebarOpened ? (
                        <>
                            <div className="flex items-center gap-1">
                                <div className="rounded-full bg-gradient-to-br from-amber-200 to-amber-600 p-2 flex overflow-hidden cursor-pointer shadow-md shrink-0">
                                    <img
                                        src="/logo2.png"
                                        alt="Académie Nobough Logo"
                                        className="h-10 w-auto shrink-0"
                                    />
                                </div>
                                <div className="relative pl-4">
                                    <h1 className="text-xl font-bold" style={{ fontFamily: "'Noto Sans Arabic', 'Noto Sans', sans-serif" }}>
                                        Académie Nobough
                                    </h1>
                                    <p className="text-xs text-amber-700">Espace Comptable</p>
                                </div>
                            </div>
                            <button
                                className="p-2 rounded-full bg-amber-100 hover:bg-amber-200 transition-colors"
                                onClick={() => setSidebarOpened(!sidebarOpened)}
                            >
                                <X className="w-5 h-5 text-amber-700" />
                            </button>
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
                                        {sidebarOpened && <span className="ml-3">{item.label}</span>}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {sidebarOpened && (
                        <div className="p-4 border-t border-amber-100">
                            <p className="text-sm text-gray-500 font-medium mb-2">Liens rapides</p>
                            <ul className="space-y-2">
                                <Link href="/ar/Admin">
                                    <button className="px-4 py-3 font-medium transition-all w-full text-left flex items-center hover:bg-amber-50">
                                        <img src="/ar.png" className="w-5 h-5 mr-3 text-amber-600" />
                                        <span>Changer la langue</span>
                                    </button>
                                </Link>
                                {additionalLinks.map((link) => (
                                    <li key={link.id}>
                                        <Link href={link.href}>
                                            <button className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-amber-50 transition-all duration-300">
                                                <link.icon className="w-5 h-5 mr-3 text-amber-600" />
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
                                <User className="w-5 h-5 mr-3 text-white" />
                                <span className='text-white'>Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Sidebar
