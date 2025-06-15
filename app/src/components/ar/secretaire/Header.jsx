import React, { useEffect, useRef, useState } from 'react'
import {
    AlertCircle, Calendar, PieChart, Briefcase, LogOut,
    Users, Video, CreditCard, X, UserPlus, ClipboardList,
    GraduationCap, Megaphone, BookOpen, User, Clock, Info,
    Bell, Menu, ChevronDown, Shield, HelpCircle, Mail
} from 'lucide-react'
import Link from 'next/link'
import gsap from 'gsap'
import { useRouter } from 'next/router'

const Header = ({ activeTab, setActiveTab, headerOpened, setHeaderOpened, etudiantID, setEtudiantID, protestations }) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const [currentEtudiantID, setCurrentEtudiantID] = useState(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const [navItems, setNavItems] = useState([
        {
            id: 'adhesions',
            label: 'الانضمام',
            icon: UserPlus,
        },
        {
            id: 'inscriptions',
            label: 'التسجيل',
            icon: ClipboardList,
        },
        {
            id: 'paiements',
            label: 'الدفع',
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
            label: 'التكوينات',
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

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen)
        if (showProfileMenu) setShowProfileMenu(false)
        if (showNotifications) setShowNotifications(false)
    }

    const handleTabChange = (tab) => {
        setActiveTab(tab)
        if (window.innerWidth < 768) {
            setMobileMenuOpen(false)
        }
    }

    const recent = useRef(null)

    useEffect(() => {
        if (activeTab === "etudiant" && !currentEtudiantID) {
            setCurrentEtudiantID(etudiantID)
            localStorage.setItem('etudiantID', etudiantID)
            setTimeout(() => {
                gsap.fromTo(recent.current, {
                    y: '100%',
                    opacity: 0,
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "elastic.out"
                })
            }, 100);
        }
    }, [activeTab])

    const closeFormation = (e) => {
        e.stopPropagation()
        gsap.to(recent.current, {
            y: '100%',
            opacity: 0,
            duration: 0.5,
            ease: "power3.in",
            onComplete: () => {
                localStorage.removeItem('etudiantID')
                setCurrentEtudiantID(null)
            }
        })
    }

    useEffect(() => {
        const recentetudiantID = localStorage.getItem('etudiantID')
        if (recentetudiantID !== 'null') {
            setCurrentEtudiantID(recentetudiantID)
            setTimeout(() => {
                gsap.fromTo(recent.current, { y: 0 }, { y: 0 })
            }, 100);
        }

        const handleResize = () => {
            if (window.innerWidth >= 768 && mobileMenuOpen) {
                setMobileMenuOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [mobileMenuOpen])

    useEffect(() => {
        const active = localStorage.getItem('activeTabSecretaire')
        setActiveTab(active)
    }, [])

    const handleLogout = async () => {
        const res = await fetch('/api/_auth/secretaireLogout', { method: 'POST' });
        if (res.ok) {
            window.location.reload()
        }
    }

    return (
        <div className={`fixed top-0 left-0 w-full z-40 ${!headerOpened && 'hidden'}`} dir="rtl">
            <header className="relative text-gray-800 p-4 shadow-md" style={{
                background: 'linear-gradient(160deg, #f5f0e5 0%, #f8f4eb 100%)',
                backgroundSize: 'cover'
            }}>
                {/* Arabesque pattern overlay - top */}
                <div className="absolute top-0 left-0 right-0 h-6 overflow-hidden opacity-20">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 24" className="w-full h-full">
                        <path d="M0,24 C50,0 100,24 150,24 C200,0 250,24 300,24 C350,0 400,24 450,24 C500,0 550,24 600,24 C650,0 700,24 750,24 C800,0 850,24 900,24 C950,0 1000,24 1000,24 Z" fill="#8A6E3D" />
                    </svg>
                </div>

                <div className="container mx-auto flex justify-between items-center py-2 flex-col sm:flex-row" onClick={() => { setShowNotifications(false); setShowProfileMenu(false); setMobileMenuOpen(false) }}>
                    <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-gradient-to-br from-amber-200 to-amber-600 p-2 flex overflow-hidden cursor-pointer shadow-md" onClick={() => setHeaderOpened(e => !e)}>
                            <img
                                src="/logo2.png"
                                alt="شعار أكاديمية نبوغ"
                                className="h-10 sm:h-14 w-auto shrink-0"
                            />
                        </div>
                        <div className="relative pr-4">
                            {/* Decorative vertical line with islamic pattern */}
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full overflow-hidden">
                                <div className="w-full h-full opacity-30">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 100" className="w-full h-full">
                                        <path d="M5,0 L5,100 M2,10 L8,10 M2,30 L8,30 M2,50 L8,50 M2,70 L8,70 M2,90 L8,90" stroke="#000" strokeWidth="1" />
                                    </svg>
                                </div>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "'Noto Sans Arabic', 'Noto Sans', sans-serif" }}>
                                أكاديمية نبوغ
                            </h1>
                            <p className="text-xs sm:text-sm text-amber-700">مساحة الكاتب</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 sm:mt-0">
                        {/* Liens supplémentaires - Desktop */}
                        <div className="hidden md:flex gap-3">
                            <Link href="/fr/Secretaire">
                                <div className="w-8 h-8 mt-1 flex items-center justify-center bg-amber-100 rounded-full shadow-md hover:shadow-lg cursor-pointer overflow-hidden">
                                    <img src="/fr.png" className='w-full h-full' />
                                </div>
                            </Link>
                            {additionalLinks.map((link) => (
                                <Link key={link.id} href={link.href}>
                                    <div className="flex items-center justify-center bg-amber-100 p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group">
                                        <link.icon className="w-5 h-5 text-amber-700 group-hover:text-amber-900" />
                                        <span className="absolute top-20 z-50 bg-white text-amber-700 rounded-md p-1 text-xs shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                            {link.label}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                            onClick={(e) => { e.stopPropagation(); toggleMobileMenu() }}
                        >
                            <Menu className="w-5 h-5 text-white" />
                        </button>

                        {/* Profile Button */}
                        <div className="relative">
                            <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-gray-700 hover:bg-amber-500 hover:text-white rounded-xl flex items-center cursor-pointer transition-colors duration-200">
                                <LogOut className="w-4 h-4 ml-3 text-amber-600" />
                                <span>تسجيل الخروج</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Arabesque pattern overlay - bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-6 overflow-hidden opacity-20">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 24" preserveAspectRatio="none" className="w-full h-full">
                        <path d="M0,0 C50,24 100,0 150,0 C200,24 250,0 300,0 C350,24 400,0 450,0 C500,24 550,0 600,0 C650,24 700,0 750,0 C800,24 850,0 900,0 C950,24 1000,0 1050,0 C1100,24 1150,0 1200,0 L1200,24 L0,24 Z" fill="#8A6E3D" />
                    </svg>
                </div>

                {/* Islamic decorative side elements - Hidden on mobile */}
                <div className="absolute top-1/2 left-2 transform -translate-y-1/2 w-8 h-16 sm:w-12 sm:h-24 hidden sm:block opacity-15">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" className="w-full h-full">
                        <path d="M50,0 L0,50 L50,100 L100,50 Z" fill="#8A6E3D" />
                        <path d="M50,10 L10,50 L50,90 L90,50 Z" fill="#8A6E3D" />
                        <path d="M50,20 L20,50 L50,80 L80,50 Z" fill="#8A6E3D" />
                        <path d="M50,30 L30,50 L50,70 L70,50 Z" fill="#8A6E3D" />
                        <path d="M50,40 L40,50 L50,60 L60,50 Z" fill="#8A6E3D" />
                    </svg>
                </div>

                <div className="absolute top-1/2 right-2 transform -translate-y-1/2 w-8 h-16 sm:w-12 sm:h-24 hidden sm:block opacity-15">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" className="w-full h-full">
                        <path d="M50,0 L0,50 L50,100 L100,50 Z" fill="#8A6E3D" />
                        <path d="M50,10 L10,50 L50,90 L90,50 Z" fill="#8A6E3D" />
                        <path d="M50,20 L20,50 L50,80 L80,50 Z" fill="#8A6E3D" />
                        <path d="M50,30 L30,50 L50,70 L70,50 Z" fill="#8A6E3D" />
                        <path d="M50,40 L40,50 L50,60 L60,50 Z" fill="#8A6E3D" />
                    </svg>
                </div>
            </header>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="bg-white shadow-xl md:hidden z-50 rounded-b-lg overflow-hidden border-t border-amber-100">
                    <ul className="flex flex-col">
                        {currentEtudiantID && (
                            <li>
                                <button
                                    className={`px-4 py-3 font-medium transition-all w-full text-left flex items-center justify-between ${activeTab === 'etudiant' ? 'bg-amber-50 text-amber-800' : 'hover:bg-amber-50'}`}
                                    onClick={() => handleTabChange('etudiant')}
                                >
                                    <div className="flex items-center">
                                        <Clock className={`w-5 h-5 ml-3 ${activeTab === 'etudiant' ? 'text-amber-600' : 'text-gray-500'}`} />
                                        <span>الأخيرة</span>
                                    </div>
                                    <X className="w-5 h-5 text-red-600" onClick={closeFormation} />
                                </button>
                            </li>
                        )}

                        {/* Affichage dynamique des éléments de navigation */}
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    className={`px-4 py-3 font-medium transition-all w-full text-left flex items-center ${activeTab === item.id ? 'bg-amber-50 text-amber-800' : 'hover:bg-amber-50'}`}
                                    onClick={() => handleTabChange(item.id)}
                                >
                                    <item.icon className={`w-5 h-5 ml-3 ${activeTab === item.id ? 'text-amber-600' : 'text-gray-500'}`} />
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        ))}

                        {/* Liens supplémentaires dans le menu mobile */}
                        <li className="mt-2 border-t border-amber-100 pt-2">
                            <div className="px-4 py-2">
                                <p className="text-sm text-gray-500 font-medium">روابط سريعة</p>
                            </div>
                            <Link href="/fr/Secretaire">
                                <button className="px-4 py-3 font-medium transition-all w-full text-left flex items-center hover:bg-amber-50">
                                    <img src="/fr.png" className="w-5 h-5 ml-3 text-amber-600" />
                                    <span>تغيير اللغة</span>
                                </button>
                            </Link>
                            {additionalLinks.map((link) => (
                                <Link key={link.id} href={link.href}>
                                    <button className="px-4 py-3 font-medium transition-all w-full text-left flex items-center hover:bg-amber-50">
                                        <link.icon className="w-5 h-5 ml-3 text-amber-600" />
                                        <span>{link.label}</span>
                                    </button>
                                </Link>
                            ))}
                        </li>
                    </ul>
                </div>
            )}

            {/* Desktop Navigation */}
            <nav className="bg-white shadow-md hidden md:block">
                <div className="container mx-auto">
                    <ul className="flex overflow-x-auto">
                        {currentEtudiantID &&
                            <li ref={recent} className="translate-y-20">
                                <button
                                    className={`px-5 py-4 font-medium border-b-2 transition-all duration-300 flex items-center ${activeTab === 'etudiant' ? 'border-amber-600 text-amber-800 bg-amber-50' : 'border-transparent hover:bg-amber-50'} cursor-pointer`}
                                    onClick={() => setActiveTab('etudiant')}
                                >
                                    <div className="bg-amber-100 rounded-full p-2 ml-2">
                                        <Clock className={`w-4 h-4 ${activeTab === 'etudiant' ? 'text-amber-600' : 'text-gray-500'}`} />
                                    </div>
                                    <span className="hidden mr-1 lg:block">الأخيرة</span>
                                    <div className="mr-2 rounded-full hover:bg-red-100 p-1 transition-colors duration-200">
                                        <X className="w-4 h-4 text-red-600" onClick={closeFormation} />
                                    </div>
                                </button>
                            </li>
                        }

                        {/* Affichage dynamique des éléments de navigation */}
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    className={`px-5 py-4 font-medium border-b-2 transition-all duration-300 flex items-center ${activeTab === item.id ? 'border-amber-600 text-amber-800 bg-amber-50' : 'border-transparent hover:bg-amber-50'} cursor-pointer`}
                                    onClick={() => setActiveTab(item.id)}
                                >
                                    <div className="bg-amber-100 rounded-full p-2 ml-2">
                                        <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-amber-600' : 'text-gray-500'}`} />
                                    </div>
                                    <span className="hidden mr-1 lg:block">{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Header