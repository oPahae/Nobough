import {
    Calendar, Tag, User, MapPin, Info, ArrowRight, Home, ChevronRight,
    Search, Filter, Moon, Sparkles
} from 'lucide-react'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Loading from '@/utils/Loading'

export default function Annonces() {
    const [annonces, setAnnonces] = useState([])
    const [x, y] = useState(true)

    useEffect(() => {
        fetchAnnonces()
    }, [])

    const fetchAnnonces = async () => {
        try {
            const response = await fetch('/api/annonces/getAll')
            const data = await response.json()
            let annoncesWithImages = []

            if (data.length > 0) {
                annoncesWithImages = data.map(annonce => {
                    if (annonce.img) {
                        const buffer = annonce.img.data
                        const base64Image = Buffer.from(buffer).toString('base64')
                        const imageUrl = `data:image/jpeg;base64,${base64Image}`
                        return { ...annonce, img: imageUrl }
                    }
                    return annonce
                })
            }

            setAnnonces(annoncesWithImages || [])
            console.log(data)
        } catch (error) {
            console.error('خطأ أثناء استرجاع الإعلانات:', error)
        } finally {
            y(false)
        }
    }

    if (x) {
        return (
            <div className='w-screen flex justify-center items-center maxtop' dir="rtl">
                <Loading />
            </div>
        )
    }

    return (
        <div className="max-w-full relative" dir="rtl">
            <Head>
                <title>الإعلانات - أكاديمية نبوغ</title>
                <link rel="icon" href="/logo2-nobg.png" />
            </Head>

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
                    <h1 className="text-3xl font-bold text-gray-800">الإعلانات</h1>
                    <div className="flex items-center justify-center mt-2">
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                        <Moon className="text-amber-800 mx-4 w-4 h-4" />
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                    </div>
                </div>
                <p className="text-gray-600 mt-4 max-w-xl mx-auto">ابق على اطلاع بأحدث الأخبار والتحديثات في الأكاديمية</p>
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="space-y-8 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {annonces.map((annonce) => (
                        <div key={annonce.id} className="w-full h-fit bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 group relative">
                            <div className="flex flex-col">
                                <div className="p-6 relative">
                                    <div className="absolute left-0 top-0 w-24 h-24 opacity-10 -rotate-45">
                                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M50 0L60 40H100L70 65L80 100L50 80L20 100L30 65L0 40H40L50 0Z" fill="currentColor" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-gray-800">{annonce.titre}</h3>
                                    <p className="text-gray-600 mb-6">{annonce.descr}</p>

                                    <div className="flex flex-wrap md:items-center gap-4 mb-6">
                                        <div className="flex items-center bg-amber-50 px-3 py-1.5 rounded-full">
                                            <Calendar className="w-4 h-4 text-amber-700 ml-2" />
                                            <span className="text-sm">نشر في {annonce.date}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full h-fit relative overflow-hidden">
                                    <img
                                        src={annonce.img}
                                        alt={annonce.titre}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}