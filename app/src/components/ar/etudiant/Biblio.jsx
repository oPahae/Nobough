import {
    Search, Filter, Users, Clock, Navigation, Flag, TrendingUp,
    Tag, DollarSign, BookOpen, User, Bookmark, Check, FileText,
    ArrowRight, Heart, Star, ChevronDown, Grid, List, Mail, Phone,
    Calendar, Info, MessageCircle, Library, Book, Video, File, Download,
    MapPin, Sparkles, Moon, Image
} from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'

const Biblio = ({ formationID }) => {
    const [docs, setDocs] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filterOpen, setFilterOpen] = useState(false)
    const [filters, setFilters] = useState({
        type: 'tous',
    })
    const [filteredDocuments, setFilteredDocuments] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const getFileIcon = (type) => {
        switch ( type ) {
            case 'pdf':
                return <FileText className="w-8 h-8 text-amber-700" />
            case 'image':
                return <Image className="w-8 h-8 text-amber-700" />
            case 'video':
                return <Video className="w-8 h-8 text-amber-700" />
            case 'archive':
                return <File className="w-8 h-8 text-amber-700" />
            default:
                return <FileText className="w-8 h-8 text-amber-700" />
        }
    }

    const handleDownload = (documentContenu, documentTitle) => {
        const link = document.createElement('a')
        link.href = documentContenu
        link.download = documentTitle
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase()
        setSearchQuery(query)

        const filtered = docs.filter(document => {
            const matchQuery = document.titre.toLowerCase().includes(query) || document.descr.toLowerCase().includes(query)
            const matchType = filters.type === 'tous' || document.type === filters.type
            return matchQuery && matchType
        })
        setFilteredDocuments(filtered)
    }

    const handleFilterChange = (filterType, value) => {
        setFilters({
            ...filters,
            [filterType]: value
        })
    }

    useEffect(() => {
        if (docs && docs.length > 0) {
            const filtered = docs.filter(document => {
                const matchQuery = searchQuery === '' ||
                    document.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    document.descr.toLowerCase().includes(searchQuery.toLowerCase())
                const matchType = filters.type === 'tous' || document.type === filters.type
                return matchQuery && matchType
            })
            setFilteredDocuments(filtered)
        }
    }, [filters, searchQuery, docs])

    const cancelFilters = () => {
        setFilters({
            type: 'tous',
        })
        setFilterOpen(false)
    }

    const fileTypes = [...new Set(docs.map(document => document.type))]

    const PatternDecoration = () => (
        <div className="absolute left-0 top-0 w-24 h-24 opacity-10 -rotate-45">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0L60 40H100L70 65L80 100L50 80L20 100L30 65L0 40H40L50 0Z" fill="currentColor" />
            </svg>
        </div>
    )

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                setIsLoading(true)
                const response = await fetch(`/api/formation/getDocs?formationID=${formationID}`)

                if (!response.ok) {
                    throw new Error('خطأ أثناء استرجاع الوثائق')
                }

                const data = await response.json()
                const formattedDocs = data.map(doc => ({
                    ...doc,
                    created_At: new Date(doc.created_At).toISOString(),
                    contenu: doc.contenu ? `data:${doc.type};base64,${Buffer.from(doc.contenu).toString('base64')}` : null
                }))

                setDocs(formattedDocs)
                setFilteredDocuments(formattedDocs)
            } catch (error) {
                console.error('خطأ أثناء استرجاع الوثائق:', error)
                setError(error.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchDocs()
    }, [formationID])

    return (
        <div className="max-w-full relative" dir="rtl">
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
                    <h1 className="text-3xl font-bold text-gray-800">مكتبة الموارد</h1>
                    <div className="flex items-center justify-center mt-2">
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                        <Moon className="text-amber-800 mx-4 w-4 h-4" />
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                    </div>
                </div>
                <p className="text-gray-600 mt-4 max-w-xl mx-auto">الوصول إلى مجموعة من الموارد التعليمية عالية الجودة لإثراء مسار التعلم الخاص بك</p>
            </div>

            <div className="mb-8 relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-amber-700" />
                </div>
                <input
                    type="text"
                    className="block w-full pr-12 pl-4 py-4 border-0 rounded-xl bg-white/80 shadow-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700"
                    placeholder="البحث عن مستند حسب العنوان، الوصف..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <div className="absolute left-3 top-3">
                    <button
                        className="p-2 bg-amber-100 text-amber-800 rounded-lg flex items-center shadow-sm hover:bg-amber-200 transition-all"
                        onClick={() => setFilterOpen(!filterOpen)}
                    >
                        <span className="text-sm font-medium">المرشحات</span>
                        <Filter className="w-4 h-4 ml-1" />
                    </button>
                </div>
            </div>

            {filterOpen && (
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl mb-10 max-w-5xl mx-auto border border-amber-100">
                    <div className="flex items-center mb-6">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-bl from-amber-400 to-amber-700 flex items-center justify-center shadow-md">
                            <Filter className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold mr-3 text-gray-800">المرشحات المتقدمة</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">نوع المستند</label>
                            <div className="relative">
                                <select
                                    className="w-full p-3 pl-10 border border-amber-200 rounded-lg bg-white/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700 appearance-none"
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                >
                                    <option value="tous">كل الأنواع</option>
                                    {fileTypes.map((type, index) => (
                                        <option key={index} value={type}>{type}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 left-0 flex items-center px-2 pointer-events-none">
                                    <ChevronDown className="h-5 w-5 text-amber-700" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-start">
                        <button
                            className="px-6 py-3 bg-gradient-to-l from-amber-600 to-amber-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center"
                            onClick={cancelFilters}
                        >
                            <span className="font-medium">إعادة تعيين المرشحات</span>
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-6 max-w-5xl mx-auto">
                {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((document) => (
                        <div key={document.id} className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-2xl group relative border border-amber-100">
                            <div className="p-6 relative">
                                <PatternDecoration />
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex items-center justify-center bg-amber-50 p-4 rounded-xl">
                                        {getFileIcon(document.type)}
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{document.titre}</h3>
                                        <p className="text-sm text-gray-600 mb-4">{document.descr}</p>
                                        <div className="flex flex-wrap gap-4 mb-4">
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-700 ml-2">{new Date(document.created_At).toLocaleDateString('FR-fr')}</span>
                                                <Calendar className="w-4 h-4 text-amber-600" />
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-700 ml-2">{document.taille} م.ب</span>
                                                <FileText className="w-4 h-4 text-amber-600" />
                                            </div>
                                            <div className="flex items-center bg-amber-50 px-2 py-1 rounded-md">
                                                <span className="text-sm ml-1">{document.type}</span>
                                                <Tag className="w-4 h-4 text-amber-700" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-start">
                                        <button
                                            className="py-3 px-5 bg-gradient-to-l from-amber-600 to-amber-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center"
                                            onClick={() => handleDownload(document.contenu, document.titre)}
                                        >
                                            <span className="font-medium">تحميل</span>
                                            <Download className="w-4 h-4 ml-2" />
                                        </button>
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
                        <h3 className="text-xl font-bold mb-3 text-amber-900">لم يتم العثور على مستندات</h3>
                        <p className="text-gray-600 mb-6">لا يوجد مستندات تتوافق مع معايير البحث الخاصة بك.</p>
                        <button
                            className="px-6 py-3 bg-gradient-to-l from-amber-600 to-amber-800 text-white rounded-xl hover:from-amber-700 hover:to-amber-900 transition-all cursor-pointer font-medium"
                            onClick={() => {
                                setSearchQuery('')
                                setFilters({
                                    type: 'tous',
                                })
                                setFilteredDocuments(docs)
                            }}
                        >
                            إعادة تعيين المرشحات
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Biblio