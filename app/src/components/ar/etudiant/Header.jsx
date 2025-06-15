import React, { useEffect, useRef, useState } from 'react'
import {
    ArrowDown, ArrowUp, AlertCircle, DollarSign,
    Calendar, FileText, Users, PieChart, Briefcase,
    Plus, Filter, Bell, LogOut, User, Video,
    CreditCard, FileQuestion, X, Menu, ChevronDown,
    Info, Mail, Shield, HelpCircle, LogIn, Lock, File,
    CheckCircle, XCircle
} from 'lucide-react'
import Link from 'next/link'
import gsap from 'gsap'

const Header = ({ session, activeTab, setActiveTab, headerOpened, setHeaderOpened, formationID, setFormationID, setNotification }) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const [currentFormationID, setCurrentFormationID] = useState(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [notifications, setNotifications] = useState([])

    const [navItems, setNavItems] = useState([
        {
            id: 'dashboard',
            label: 'الرئيسية',
            icon: PieChart,
        },
        {
            id: 'formations',
            label: 'التكوينات',
            icon: Briefcase,
        },
        {
            id: 'annonces',
            label: 'الإعلانات',
            icon: AlertCircle,
        },
        {
            id: 'evenements',
            label: 'الأحداث',
            icon: Calendar,
        },
        {
            id: 'room',
            label: 'غرفة',
            icon: Video,
        },
        {
            id: 'payer',
            label: 'الدفع',
            icon: CreditCard,
        },
        {
            id: 'protestation',
            label: 'التواصل',
            icon: FileQuestion,
        },
        {
            id: 'documents',
            label: 'المستندات',
            icon: File,
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

    const toggleProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu)
        if (showNotifications) setShowNotifications(false)
    }

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications)
        if (showProfileMenu) setShowProfileMenu(false)
    }

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
        if (activeTab === "etudier" && !currentFormationID) {
            setCurrentFormationID(formationID)
            localStorage.setItem('formationID', formationID)
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
                localStorage.removeItem('formationID')
                setCurrentFormationID(null)
            }
        })
    }

    useEffect(() => {
        const recentFormationID = localStorage.getItem('formationID')
        if (recentFormationID !== 'null') {
            setCurrentFormationID(recentFormationID)
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
        const active = localStorage.getItem('activeTabEtudiant')
        setActiveTab(active)
    }, [])

    useEffect(() => {
        fetchNotifs();
    }, [session]);

    const fetchNotifs = async () => {
        if (session)
            try {
                const res = await fetch(`/api/notifications/getEtud?etudiantID=${session.id}`);
                const data = await res.json();
                console.log(data);
                setNotifications(data || []);
            } catch (err) {
                console.error('خطأ أثناء استرجاع الإشعارات:', err);
                setNotifications([]);
            }
    };

    const setNotificationsRead = async () => {
        try {
            const res = await fetch(`/api/notifications/setReadEtud?etudiantID=${session.id}`);
            const data = await res.json();
            if (res.ok) fetchNotifs()
        } catch (err) {
            console.error('خطأ أثناء استرجاع الإشعارات:', err);
        }
    };

    const handleLogout = async () => {
        const res = await fetch('/api/_auth/userLogout', { method: 'POST' });
        if (res.ok) {
            localStorage.setItem('activeTabEtudiant', 'register')
            window.location.reload()
        }
    }

    return (
        <div dir="rtl" className={`fixed top-0 right-0 w-full z-40 ${!headerOpened && 'hidden'}`}>
            <header className="relative text-gray-800 p-4 shadow-md" style={{
                background: 'linear-gradient(160deg, #f5f0e5 0%, #f8f4eb 100%)',
                backgroundSize: 'cover'
            }}>
                {/* Arabesque pattern overlay - top */}
                <div className="absolute top-0 right-0 left-0 h-6 overflow-hidden opacity-20 z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 24" className="w-full h-full">
                        <path d="M0,24 C50,0 100,24 150,24 C200,0 250,24 300,24 C350,0 400,24 450,24 C500,0 550,24 600,24 C650,0 700,24 750,24 C800,0 850,24 900,24 C950,0 1000,24 1000,24 Z" fill="#8A6E3D" />
                    </svg>
                </div>

                <div className="container mx-auto flex justify-between items-center py-2 flex-col sm:flex-row z-20" onClick={() => { setShowNotifications(false); setShowProfileMenu(false); setMobileMenuOpen(false) }}>
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
                            <p className="text-xs sm:text-sm text-amber-700">مساحة الطالب</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 sm:mt-0 md:px-8">
                        {/* Liens supplémentaires - Desktop */}
                        <div className="hidden md:flex gap-3">
                            <Link href="/fr/Etudiant">
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

                        {session &&
                            <>
                                <div className="relative">
                                    <button
                                        className="flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                                        onClick={(e) => { e.stopPropagation(); toggleNotifications(); setNotificationsRead() }}
                                    >
                                        <Bell className="w-5 h-5 text-white" />
                                        {notifications.filter(notif => notif.vue == 0).length > 0 &&
                                            <span className="absolute -top-1 -left-1 bg-white text-amber-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md">
                                                {notifications.filter(notif => notif.vue == 0).length}
                                            </span>
                                        }
                                    </button>

                                    {showNotifications && (
                                        <div className="absolute -left-26 md:left-0 mt-3 w-72 bg-white rounded-lg shadow-xl py-2 z-50 border border-amber-100" onClick={e => e.stopPropagation()}>
                                            <div className="px-4 py-2 border-b border-amber-100 flex items-center">
                                                <h3 className="font-medium text-gray-800">الإشعارات</h3>
                                                <div className="mr-2 h-6 w-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">
                                                    {notifications.length}
                                                </div>
                                            </div>
                                            <div className="max-h-64 overflow-y-auto">
                                                {notifications.map((notification, index) => (
                                                    <div key={index} className="px-4 py-3 hover:bg-amber-50 border-b border-amber-50 last:border-b-0 transition-colors duration-200">
                                                        <div className="flex items-start">
                                                            <div className={`p-1 rounded-full ml-3 mt-1 shadow-sm ${notification.type === 'validation' ? 'bg-green-100' :
                                                                notification.type === 'refus' ? 'bg-red-100' :
                                                                    notification.type === 'paiement' ? 'bg-blue-100' :
                                                                        notification.type === 'certificat' ? 'bg-yellow-100' : 'bg-gray-100'
                                                                }`}>
                                                                {notification.type === 'validation' && <CheckCircle className="w-4 h-4 text-green-500" />}
                                                                {notification.type === 'refus' && <XCircle className="w-4 h-4 text-red-500" />}
                                                                {notification.type === 'paiement' && <CreditCard className="w-4 h-4 text-blue-500" />}
                                                                {notification.type === 'certificat' && <FileText className="w-4 h-4 text-yellow-500" />}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-700">{notification.msg}</p>
                                                                {notification.vue == 0 && <div className='w-2 h-2 rounded-full bg-green-400'></div>}
                                                                <p className="text-xs text-gray-500 mt-1">{new Date(notification.created_At).toLocaleDateString('FR-fr')}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="relative">
                                    <button
                                        className="flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                                        onClick={(e) => { e.stopPropagation(); toggleProfileMenu() }}
                                    >
                                        <User className="w-5 h-5 text-white" />
                                    </button>

                                    {showProfileMenu && (
                                        <div className="absolute left-0 mt-3 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-amber-100" onClick={e => e.stopPropagation()}>
                                            <button onClick={() => setActiveTab('profile')} className="w-full text-right px-4 py-3 text-gray-700 hover:bg-amber-50 flex items-center cursor-pointer transition-colors duration-200">
                                                <span>الملف الشخصي</span>
                                                <User className="w-4 h-4 ml-3 text-amber-600" />
                                            </button>
                                            <button onClick={handleLogout} className="w-full text-right px-4 py-3 text-gray-700 hover:bg-amber-50 flex items-center cursor-pointer transition-colors duration-200">
                                                <span>تسجيل الخروج</span>
                                                <LogOut className="w-4 h-4 ml-3 text-amber-600" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        }
                    </div>
                </div>

                {/* Arabesque pattern overlay - bottom */}
                <div className="absolute bottom-0 right-0 left-0 h-6 overflow-hidden opacity-20">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 24" preserveAspectRatio="none" className="w-full h-full">
                        <path d="M0,0 C50,24 100,0 150,0 C200,24 250,0 300,0 C350,24 400,0 450,0 C500,24 550,0 600,0 C650,24 700,0 750,0 C800,24 850,0 900,0 C950,24 1000,0 1050,0 C1100,24 1150,0 1200,0 L1200,24 L0,24 Z" fill="#8A6E3D" />
                    </svg>
                </div>

                {/* Islamic decorative side elements - Hidden on mobile */}
                <div className="absolute top-1/2 right-2 transform -translate-y-1/2 w-8 h-16 sm:w-12 sm:h-24 hidden sm:block opacity-15">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" className="w-full h-full">
                        <path d="M50,0 L0,50 L50,100 L100,50 Z" fill="#8A6E3D" />
                        <path d="M50,10 L10,50 L50,90 L90,50 Z" fill="#8A6E3D" />
                        <path d="M50,20 L20,50 L50,80 L80,50 Z" fill="#8A6E3D" />
                        <path d="M50,30 L30,50 L50,70 L70,50 Z" fill="#8A6E3D" />
                        <path d="M50,40 L40,50 L50,60 L60,50 Z" fill="#8A6E3D" />
                    </svg>
                </div>

                <div className="absolute top-1/2 left-2 transform -translate-y-1/2 w-8 h-16 sm:w-12 sm:h-24 hidden sm:block opacity-15">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" className="w-full h-full">
                        <path d="M50,0 L0,50 L50,100 L100,50 Z" fill="#8A6E3D" />
                        <path d="M50,10 L10,50 L50,90 L90,50 Z" fill="#8A6E3D" />
                        <path d="M50,20 L20,50 L50,80 L80,50 Z" fill="#8A6E3D" />
                        <path d="M50,30 L30,50 L50,70 L70,50 Z" fill="#8A6E3D" />
                        <path d="M50,40 L40,50 L50,60 L60,50 Z" fill="#8A6E3D" />
                    </svg>
                </div>
            </header>

            {/* Nav tel */}
            {mobileMenuOpen && (
                <div className="bg-white shadow-xl md:hidden z-50 rounded-b-lg overflow-hidden border-t border-amber-100">
                    <ul className="flex flex-col">
                        {!session && (
                            <li>
                                <button
                                    className={`px-4 py-3 font-medium transition-all w-full text-right flex items-center justify-between ${activeTab === 'register' ? 'bg-amber-50 text-amber-800' : 'hover:bg-amber-50'}`}
                                    onClick={() => handleTabChange('register')}
                                >
                                    <div className="flex items-center">
                                        <span>التسجيل</span>
                                        <LogIn className={`w-5 h-5 ml-3 ${activeTab === 'register' ? 'text-amber-600' : 'text-gray-500'}`} />
                                    </div>
                                </button>
                            </li>
                        )}

                        {currentFormationID && (
                            <li>
                                <button
                                    className={`px-4 py-3 font-medium transition-all w-full text-right flex items-center justify-between ${activeTab === 'etudier' ? 'bg-amber-50 text-amber-800' : 'hover:bg-amber-50'}`}
                                    onClick={() => handleTabChange('etudier')}
                                >
                                    <div className="flex items-center">
                                        <span>الأحدث</span>
                                        <PieChart className={`w-5 h-5 ml-3 ${activeTab === 'etudier' ? 'text-amber-600' : 'text-gray-500'}`} />
                                    </div>
                                    <X className="w-5 h-5 text-red-600" onClick={closeFormation} />
                                </button>
                            </li>
                        )}

                        {/* Nav tel */}
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    className={`px-4 py-3 font-medium transition-all w-full text-right flex items-center ${activeTab === item.id ? 'bg-amber-50 text-amber-800' : 'hover:bg-amber-50'}`}
                                    onClick={() => handleTabChange(item.id)}
                                >
                                    <item.icon className={`w-5 h-5 ml-3 ${activeTab === item.id ? 'text-amber-600' : 'text-gray-500'}`} />
                                    <span>{item.label}</span>
                                    {['غرفة', 'الدفع', 'المستندات'].includes(item.label) && !session && <Lock className='text-xs rounded-full font-bold text-white bg-gradient-to-br from-gray-400 to-gray-500 p-1 mr-2' />}
                                </button>
                            </li>
                        ))}

                        {/* Links tel */}
                        <li className="mt-2 border-t border-amber-100 pt-2">
                            <div className="px-4 py-2">
                                <p className="text-sm text-gray-500 font-medium">روابط سريعة</p>
                            </div>
                            <Link href="/fr/Etudiant">
                                <button className="px-4 py-3 font-medium transition-all w-full text-right flex items-center hover:bg-amber-50">
                                    <img src="/fr.png" className="w-5 h-5 ml-3 text-amber-600" />
                                    <span>تغيير اللغة</span>
                                </button>
                            </Link>
                            {additionalLinks.map((link) => (
                                <Link key={link.id} href={link.href}>
                                    <button className="px-4 py-3 font-medium transition-all w-full text-right flex items-center hover:bg-amber-50">
                                        <link.icon className="w-5 h-5 ml-3 text-amber-600" />
                                        <span>{link.label}</span>
                                    </button>
                                </Link>
                            ))}
                        </li>
                    </ul>
                </div>
            )}

            {/* Nav pc */}
            <nav className="bg-white shadow-md hidden md:block">
                <div className="container mx-auto">
                    <ul className="flex overflow-x-auto">
                        {!session &&
                            <li>
                                <button
                                    className={`px-5 py-4 font-medium border-b-2 transition-all duration-300 flex items-center ${activeTab === 'register' ? 'border-amber-600 text-amber-800 bg-amber-50' : 'border-transparent hover:bg-amber-50'} cursor-pointer`}
                                    onClick={() => setActiveTab('register')}
                                >
                                    <div className="bg-amber-100 rounded-full p-2 ml-2">
                                        <LogIn className={`w-4 h-4 ${activeTab === 'register' ? 'text-amber-600' : 'text-gray-500'}`} />
                                    </div>
                                    <span className="hidden mr-1 lg:block">التسجيل</span>
                                </button>
                            </li>
                        }

                        {currentFormationID &&
                            <li ref={recent} className="translate-y-20">
                                <button
                                    className={`px-5 py-4 font-medium border-b-2 transition-all duration-300 flex items-center ${activeTab === 'etudier' ? 'border-amber-600 text-amber-800 bg-amber-50' : 'border-transparent hover:bg-amber-50'} cursor-pointer`}
                                    onClick={() => setActiveTab('etudier')}
                                >
                                    <div className="bg-amber-100 rounded-full p-2 ml-2">
                                        <PieChart className={`w-4 h-4 ${activeTab === 'etudier' ? 'text-amber-600' : 'text-gray-500'}`} />
                                    </div>
                                    <span className="hidden mr-1 lg:block">الأحدث</span>
                                    <div className="mr-2 rounded-full hover:bg-red-100 p-1 transition-colors duration-200">
                                        <X className="w-4 h-4 text-red-600" onClick={closeFormation} />
                                    </div>
                                </button>
                            </li>
                        }

                        {/* Nav */}
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    className={`px-5 py-4 font-medium border-b-2 transition-all duration-300 flex items-center ${activeTab === item.id ? 'border-amber-600 text-amber-800 bg-amber-50' : 'border-transparent hover:bg-amber-50'} cursor-pointer ${['غرفة', 'الدفع', 'المستندات'].includes(item.label) && !session && 'bg-gray-200 line-through'}`}
                                    onClick={() => setActiveTab(item.id)}
                                    disabled={['غرفة', 'الدفع', 'المستندات'].includes(item.label) && !session}
                                >
                                    <div className="bg-amber-100 rounded-full p-2 ml-2">
                                        <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-amber-600' : 'text-gray-500'}`} />
                                    </div>
                                    <span className="hidden mr-1 lg:block">{item.label}</span>
                                    {['غرفة', 'الدفع', 'المستندات'].includes(item.label) && !session && <Lock className='text-sm rounded-full font-bold text-white bg-gradient-to-br from-gray-400 to-gray-500 p-1 -translate-y-4' />}
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