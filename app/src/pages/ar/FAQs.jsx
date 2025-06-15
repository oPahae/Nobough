import {
    MessageSquare, ChevronDown, ChevronUp, Search, Sparkles, Moon
} from 'lucide-react'
import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function FAQ() {
    const [faqs, setFaqs] = useState([])
    const [expandedItems, setExpandedItems] = useState({})
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredFaqs, setFilteredFaqs] = useState([])

    useEffect(() => {
        fetchFaqs()
    }, [])

    useEffect(() => {
        if (searchQuery === '') {
            setFilteredFaqs(faqs)
        } else {
            const filtered = faqs.filter(faq =>
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.reponse.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredFaqs(filtered)
        }
    }, [searchQuery, faqs])

    const fetchFaqs = async () => {
        try {
            const response = await fetch('/api/protestations/getFaqs')
            const data = await response.json()
            let formattedFaqs = []

            if (data.length > 0) {
                formattedFaqs = data.map(faq => ({
                    id: faq.id,
                    question: faq.question,
                    reponse: faq.reponse,
                    created_at: new Date(faq.created_at).toLocaleDateString('ar-SA')
                }))
            }

            setFaqs(formattedFaqs)
            setFilteredFaqs(formattedFaqs)
        } catch (error) {
            console.error('خطأ أثناء استرجاع الأسئلة الشائعة:', error)
        }
    }

    const toggleExpand = (id) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const PatternDecoration = () => (
        <div className="absolute left-0 top-0 w-24 h-24 opacity-10 -rotate-45">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0L60 40H100L70 65L80 100L50 80L20 100L30 65L0 40L40 0Z" fill="currentColor" />
            </svg>
        </div>
    )

    return (
        <>
            <Head>
                <title>الأسئلة الشائعة - أكاديمية نبوغ</title>
                <link rel="icon" href="/logo2-nobg.png" />
            </Head>

            <div className="w-full h-screen overflow-y-scroll relative bg-white/60 backdrop-blur-3xl" dir="rtl">
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
                        <h1 className="text-3xl font-bold text-gray-800">الأسئلة الشائعة</h1>
                        <div className="flex items-center justify-center mt-2">
                            <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                            <Moon className="text-amber-800 mx-4 w-4 h-4" />
                            <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                        </div>
                    </div>
                    <p className="text-gray-600 mt-4 max-w-xl mx-auto">ابحث عن إجابات للأسئلة الأكثر تكرارًا</p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 relative">
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-amber-700" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pr-12 pl-4 py-4 border-0 rounded-xl bg-white/80 shadow-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700"
                            placeholder="بحث عن سؤال..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl mb-10 border border-amber-100 relative">
                        <PatternDecoration />

                        <div className="space-y-4">
                            {filteredFaqs.length > 0 ? (
                                filteredFaqs.map((faq) => (
                                    <div key={faq.id} className="border border-amber-100 rounded-xl overflow-hidden">
                                        <button
                                            className="w-full p-6 text-right bg-white hover:bg-amber-50 transition-colors flex justify-between items-center"
                                            onClick={() => toggleExpand(faq.id)}
                                        >
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-bl from-amber-400 to-amber-700 flex items-center justify-center shadow-md ml-4">
                                                    <MessageSquare className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-lg font-medium text-gray-800">{faq.question}</span>
                                            </div>
                                            {expandedItems[faq.id] ? (
                                                <ChevronUp className="w-5 h-5 text-amber-700" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-amber-700" />
                                            )}
                                        </button>
                                        {expandedItems[faq.id] && (
                                            <div className="p-6 bg-amber-50/50 border-t border-amber-100">
                                                <p className="text-gray-700">{faq.reponse}</p>
                                                <p className="text-xs text-gray-500 mt-4">تمت الإضافة في {faq.created_at}</p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <MessageSquare className="w-12 h-12 text-amber-200 mx-auto mb-4" />
                                    <p className="text-gray-600">لا يوجد أسئلة تطابق بحثك.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}