import React from 'react';
import { ArrowRight, Sparkles, BookOpen, Users, Award } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';
import Islam from '@/utils/Islam'
import FAQs from './FAQs'

export default function HomePage() {
    return (
        <>
            <Head>
                <title>Acceuil - Académie Nobough</title>
                <link rel="icon" href="/logo2-nobg.png" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/30 to-orange-300/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/2 -left-32 w-96 h-96 bg-gradient-to-br from-yellow-200/20 to-amber-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-to-br from-green-200/20 to-emerald-300/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
                </div>

                {/* Floating geometric shapes */}
                <div className="absolute top-20 left-1/4 w-4 h-4 bg-amber-400 rounded-full animate-bounce delay-300"></div>
                <div className="absolute top-40 right-1/3 w-6 h-6 bg-orange-400 rotate-45 animate-pulse delay-700"></div>
                <div className="absolute bottom-1/3 left-1/6 w-3 h-3 bg-yellow-500 rounded-full animate-bounce delay-1000"></div>
                <div className="absolute top-2/3 right-1/5 w-5 h-5 bg-emerald-400 rotate-12 animate-pulse delay-1500"></div>

                {/* Header with logo */}
                <header className="w-full p-4 flex items-center gap-2">
                    <div className="max-w-7xl mx-auto rounded-xl overflow-hidden shadow-xl">
                        <img
                            src="/logo2.png"
                            alt="Académie Nobough Logo"
                            className="h-16 md:h-20 drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <Link href="/ar" className='cursor-pointer maxtop'>
                        <div className="w-8 h-8 flex items-center justify-center bg-amber-100 rounded-full shadow-md hover:shadow-lg cursor-pointer overflow-hidden">
                            <img src="/ar.png" className='w-full h-full' />
                        </div>
                    </Link>
                </header>

                {/* Main content */}
                <main className="relative z-10 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-8 py-12 lg:py-20 min-h-[calc(100vh-120px)]">

                    {/* Left side - Content */}
                    <div className="flex-1 lg:pr-12 text-center lg:text-left">

                        {/* Decorative elements above title */}
                        <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-150"></div>
                                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-300"></div>
                            </div>
                            <Sparkles className="w-5 h-5 text-amber-600 animate-pulse" />
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-450"></div>
                                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-600"></div>
                                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-750"></div>
                            </div>
                        </div>

                        {/* Main title */}
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 relative">
                            <span className="bg-gradient-to-r from-amber-800 via-orange-700 to-yellow-800 bg-clip-text text-transparent drop-shadow-sm">
                                Académie
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-orange-800 via-amber-700 to-yellow-700 bg-clip-text text-transparent relative">
                                Nobough
                                <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-400 rounded-full animate-ping"></div>
                            </span>

                            {/* Decorative line under title */}
                            <div className="absolute -bottom-4 left-0 lg:left-auto lg:right-0 w-32 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                        </h1>

                        {/* Subtitle with icons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 mb-12">
                            <div className="flex items-center gap-2 text-amber-700">
                                <BookOpen className="w-5 h-5" />
                                <span className="font-medium">Excellence</span>
                            </div>
                            <div className="flex items-center gap-2 text-orange-700">
                                <Users className="w-5 h-5" />
                                <span className="font-medium">Innovation</span>
                            </div>
                            <div className="flex items-center gap-2 text-yellow-700">
                                <Award className="w-5 h-5" />
                                <span className="font-medium">Réussite</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="relative inline-block group">
                            <button onClick={() => window.location.href = "/fr/Etudiant"} className="relative bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 shadow-2xl transform hover:scale-105 transition-all duration-300 group">
                                <span>Explorer</span>
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                                <div className="absolute top-0 left-0 w-full h-full bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </div>

                        {/* Statistics or features */}
                        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
                            <div className="text-center p-4 rounded-xl bg-white/30 backdrop-blur-sm border border-amber-200/50 hover:bg-white/40 transition-all duration-300">
                                <div className="text-2xl md:text-3xl font-bold text-amber-800 mb-1">1000+</div>
                                <div className="text-sm text-amber-700">Étudiants</div>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-white/30 backdrop-blur-sm border border-orange-200/50 hover:bg-white/40 transition-all duration-300">
                                <div className="text-2xl md:text-3xl font-bold text-orange-800 mb-1">30+</div>
                                <div className="text-sm text-orange-700">Formations</div>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-white/30 backdrop-blur-sm border border-yellow-200/50 hover:bg-white/40 transition-all duration-300">
                                <div className="text-2xl md:text-3xl font-bold text-yellow-800 mb-1">20+</div>
                                <div className="text-sm text-yellow-700">Professeurs</div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Image */}
                    <div className="flex-1 mt-12 lg:mt-0 relative">
                        <div className="relative group">
                            {/* Decorative background for image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-300/30 to-orange-400/20 rounded-3xl rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
                            <div className="absolute inset-0 bg-gradient-to-tl from-yellow-300/20 to-orange-300/30 rounded-3xl -rotate-2 group-hover:-rotate-4 transition-transform duration-500 delay-100"></div>

                            {/* Main image container */}
                            <div className="relative bg-white/40 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50 group-hover:scale-105 transition-all duration-500">
                                <img
                                    src="/pc.png"
                                    alt="Ordinateur - Académie Nobough"
                                    className="w-full h-auto max-w-lg mx-auto drop-shadow-2xl"
                                />

                                {/* Floating elements around image */}
                                <div className="absolute -top-4 -left-4 w-8 h-8 bg-emerald-400 rounded-full animate-bounce delay-500"></div>
                                <div className="absolute -bottom-6 -right-6 w-6 h-6 bg-amber-400 rounded-full animate-pulse delay-700"></div>
                                <div className="absolute top-1/4 -right-8 w-4 h-4 bg-orange-400 rotate-45 animate-spin delay-1000" style={{ animationDuration: '4s' }}></div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Bottom decorative wave */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-100/50 to-transparent"></div>
            </div>
            <div className='w-full h-fit'>
                <Islam />
            </div>
            <div className='w-full h-fit'>
                <FAQs />
            </div>
        </>
    );
}