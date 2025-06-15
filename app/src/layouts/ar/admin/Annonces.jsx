import Loading from '@/utils/Loading'
import {
    Calendar, Search, Users, Clock, Navigation, Flag, TrendingUp,
    Tag, User, Bookmark, Check, FileText, Moon, Sparkles,
    ArrowRight, Heart, Star, ChevronDown, Grid, List,
    Trash2, Edit, Plus, X
} from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Annonces({ setActiveTab }) {
    const [annonces, setAnnonces] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredAnnonces, setFilteredAnnonces] = useState([])
    const [loading, setLoading] = useState(true)

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase()
        setSearchQuery(query)

        const filtered = annonces.filter(annonce => {
            return annonce.titre.toLowerCase().includes(query) ||
                annonce.descr.toLowerCase().includes(query)
        })
        setFilteredAnnonces(filtered)
    }

    useEffect(() => {
        fetchAnnonces()
    }, [])

    const fetchAnnonces = async () => {
        try {
            setLoading(true)
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
            setFilteredAnnonces(annoncesWithImages || [])
            console.log(annoncesWithImages)
            setLoading(false)
        } catch (error) {
            console.error('خطأ أثناء استرجاع الإعلانات:', error)
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if(!confirm("هل أنت متأكد"))   return
        try {
            const response = await fetch('/api/annonces/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                fetchAnnonces()
            } else {
                const data = await response.json();
                console.error('خطأ أثناء الحذف:', data.message)
            }
        } catch (error) {
            console.error('خطأ أثناء الحذف:', error)
        }
    };

    if (loading) {
        return (
            <div className='w-screen flex justify-center items-center maxtop'>
                <Loading />
            </div>
        )
    }

    return (
        <div className="max-w-full relative" dir="rtl">
            {/* نمط زخرفي */}
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

            {/* عنوان مع زخرفة */}
            <div className="mb-12 text-center pt-8 relative">
                <div className="inline-block">
                    <div className="flex items-center justify-center mb-2">
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-700"></div>
                        <Sparkles className="text-amber-800 mx-4 w-6 h-6" />
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-700"></div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">إعلانات</h1>
                    <div className="flex items-center justify-center mt-2">
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                        <span className="text-amber-800 mx-4 w-4 h-4">نبوغ</span>
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                    </div>
                </div>
                <p className="text-gray-600 mt-4 max-w-xl mx-auto">ابقوا على اطلاع بأحدث الأخبار والأحداث القادمة للأكاديمية</p>
            </div>

            {/* شريط البحث وزر الإضافة */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 max-w-5xl mx-auto px-4">
                <div className="relative w-full md:w-2/3">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-amber-700" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pr-12 pl-4 py-4 border-0 rounded-xl bg-white/80 shadow-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700"
                        placeholder="بحث عن إعلان..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
                <button
                    onClick={() => setActiveTab('ajouterAnnonce')}
                    className="w-full md:w-auto py-4 px-6 bg-gradient-to-l from-amber-600 to-amber-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center cursor-pointer"
                >
                    <Plus className="w-5 h-5 ml-2" />
                    <span className="font-medium">إضافة إعلان</span>
                </button>
            </div>

            {/* قائمة الإعلانات */}
            <div className="space-y-8 max-w-5xl mx-auto px-4 pb-16">
                {filteredAnnonces.length > 0 ? (
                    filteredAnnonces.map((annonce) => (
                        <div key={annonce.id} className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl relative border border-amber-100">
                            <div className="flex flex-col md:flex-row">
                                <div className="relative md:w-1/3 h-56 md:h-auto overflow-hidden">
                                    <img
                                        src={annonce.img || "/formation.jpg"}
                                        alt={annonce.titre}
                                        className="w-full h-full object-cover transform transition-transform hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-0 right-0 p-4 w-full">
                                        <div className="flex items-center text-white">
                                            <Calendar className="w-4 h-4 ml-2" />
                                            <span className="text-sm font-medium">{annonce.date}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 md:w-2/3 flex flex-col relative">
                                    <div className="flex justify-between mb-3">
                                        <h3 className="text-xl font-bold text-gray-800 leading-tight">{annonce.titre}</h3>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => { setActiveTab('modifierAnnonce'); sessionStorage.setItem('annonce', annonce.id) }}
                                                className="p-2 bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(annonce.id)}
                                                className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 mb-6 line-clamp-3">{annonce.descr}</p>

                                    <div className="flex flex-wrap md:items-center gap-4 mb-6">
                                        <div className="flex items-center bg-amber-50 px-3 py-1.5 rounded-full">
                                            <Calendar className="w-4 h-4 text-amber-700 ml-2" />
                                            <span className="text-sm">نشر في {annonce.date}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-10 rounded-2xl shadow-md border border-amber-100 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-amber-600/30 to-transparent"></div>
                        <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-amber-600/30 to-transparent"></div>

                        <Search className="w-16 h-16 text-amber-300 mx-auto mb-5" />
                        <h3 className="text-xl font-bold mb-3 text-amber-900">لم يتم العثور على إعلانات</h3>
                        <p className="text-gray-600 mb-6">لا يوجد إعلانات تطابق بحثك.</p>
                        <button
                            className="px-6 py-3 bg-gradient-to-l from-amber-600 to-amber-800 text-white rounded-xl hover:from-amber-700 hover:to-amber-900 transition-all cursor-pointer font-medium"
                            onClick={() => { setSearchQuery(''); setFilteredAnnonces(annonces) }}
                        >
                            إعادة تعيين البحث
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}