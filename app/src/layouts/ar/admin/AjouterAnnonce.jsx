import {
    Calendar, Search, Users, Clock, Navigation, Flag, TrendingUp,
    Tag, User, Bookmark, Check, FileText, Moon, Sparkles,
    ArrowRight, Info, Star, ChevronDown, Grid, List,
    Trash2, Edit, Plus, X, Upload
} from 'lucide-react'
import { useState, useRef } from 'react'

export default function AjouterAnnonce({ setActiveTab, setNotification }) {
    const fileInputRef = useRef(null)

    const [formData, setFormData] = useState({
        titre: '',
        description: '',
        img: '/formation.jpg',
        date: new Date().toISOString().split('T')[0]
    })

    const [errors, setErrors] = useState({})
    const [submitted, setSubmitted] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }))
        }
    }

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader()
            reader.onload = (loadEvent) => {
                setFormData(prev => ({
                    ...prev,
                    img: loadEvent.target.result
                }))
            }
            reader.readAsDataURL(e.target.files[0])
        }
    }

    const validate = () => {
        const newErrors = {}

        if (!formData.titre.trim()) {
            newErrors.titre = "العنوان مطلوب"
        }

        if (!formData.description.trim()) {
            newErrors.description = "الوصف مطلوب"
        }

        if (!formData.img || formData.img === '/formation.jpg') {
            newErrors.img = "الصورة مطلوبة"
        }

        return newErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newErrors = validate()

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            const imageBase64 = formData.img.split(',')[1]

            const submissionData = {
                titre: formData.titre,
                description: formData.description,
                img: imageBase64,
                date: formData.date,
                auteur: "إدارة نبوغ"
            }

            const response = await fetch('/api/annonces/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            })

            if (response.ok) {
                setSubmitted(true)
            } else {
                const data = await response.json()
                setErrors({ general: data.message || 'حدث خطأ أثناء إضافة الإعلان' })
            }
        } catch (error) {
            setErrors({ general: 'حدث خطأ. يرجى المحاولة مرة أخرى لاحقًا.' })
        }
    }

    return (
        <div className="max-w-full relative" dir="rtl">
            {/* Motif décoratif */}
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

            {/* Titre avec ornement */}
            <div className="mb-12 text-center pt-8 relative">
                <div className="inline-block">
                    <div className="flex items-center justify-center mb-2">
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-700"></div>
                        <Sparkles className="text-amber-800 mx-4 w-6 h-6" />
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-700"></div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">إضافة إعلان</h1>
                    <div className="flex items-center justify-center mt-2">
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                        <Moon className="text-amber-800 mx-4 w-4 h-4" />
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                    </div>
                </div>
                <p className="text-gray-600 mt-4 max-w-xl mx-auto">أنشئ إعلانًا جديدًا لإعلام أعضاء الأكاديمية</p>
            </div>

            {/* Formulaire d'ajout d'annonce */}
            <div className="max-w-4xl mx-auto">
                {submitted ? (
                    <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl mb-10 border border-amber-100">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">تمت إضافة الإعلان بنجاح!</h2>
                            <p className="text-gray-600 mb-8">تم نشر إعلانك وهو الآن مرئي لجميع الأعضاء.</p>
                            <button
                                onClick={() => setActiveTab('annonces')}
                                className="px-6 py-3 bg-gradient-to-l from-amber-600 to-amber-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center font-medium"
                            >
                                <span>العودة إلى الإعلانات</span>
                                <ArrowRight className="w-4 h-4 mr-2" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl mb-10 border border-amber-100">
                        <div className="grid grid-cols-1 gap-6">
                            {/* Titre */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2 text-gray-700">العنوان <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <FileText className="h-5 w-5 text-amber-700" />
                                    </div>
                                    <input
                                        type="text"
                                        name="titre"
                                        className={`block w-full pr-12 pl-4 py-4 border ${errors.titre ? 'border-red-300 bg-red-50' : 'border-amber-200'} rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700`}
                                        placeholder="عنوان الإعلان"
                                        value={formData.titre}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {errors.titre && <p className="mt-2 text-sm text-red-600">{errors.titre}</p>}
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2 text-gray-700">الوصف <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <div className="absolute top-4 right-4 pointer-events-none">
                                        <FileText className="h-5 w-5 text-amber-700" />
                                    </div>
                                    <textarea
                                        name="description"
                                        rows="4"
                                        className={`block w-full pr-12 pl-4 py-4 border ${errors.description ? 'border-red-300 bg-red-50' : 'border-amber-200'} rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700`}
                                        placeholder="وصف مفصل للإعلان"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>
                                {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
                            </div>

                            {/* Image */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2 text-gray-700">الصورة</label>
                                <div className="relative">
                                    <div className="absolute top-4 right-4 pointer-events-none">
                                        <Upload className="h-5 w-5 text-amber-700" />
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        className={`block w-full pr-12 pl-4 py-4 border ${errors.img ? 'border-red-300 bg-red-50' : 'border-amber-200'} rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700`}
                                        accept="image/*"
                                    />
                                </div>
                                {errors.img && <p className="mt-2 text-sm text-red-600">{errors.img}</p>}

                                {formData.img && formData.img !== '/formation.jpg' && (
                                    <div className="mt-4">
                                        <img
                                            src={formData.img}
                                            alt="معاينة"
                                            className="w-32 h-32 object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Date */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2 text-gray-700">التاريخ</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 pl-4 flex items-center pointer-events-none">
                                        <Calendar className="h-5 w-5 text-amber-700" />
                                    </div>
                                    <input
                                        type="date"
                                        name="date"
                                        className="block w-full pr-12 pl-4 py-4 border border-amber-200 rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700"
                                        value={formData.date}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Note d'information */}
                        <div className="bg-amber-50 p-4 rounded-lg mb-8 flex">
                            <Info className="h-5 w-5 text-amber-700 ml-3 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-700">
                                    بنشر هذا الإعلان، أنت ملتزم باحترام قواعد التواصل في الأكاديمية.
                                </p>
                            </div>
                        </div>

                        {/* Boutons de soumission */}
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={() => setActiveTab('annonces')}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
                            >
                                إلغاء
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-3 bg-gradient-to-l from-amber-600 to-amber-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center font-medium text-lg"
                            >
                                <span>نشر الإعلان</span>
                                <ArrowRight className="w-5 h-5 mr-2" />
                            </button>
                        </div>

                        {errors.general && <p className="mt-4 text-sm text-red-600 text-center">{errors.general}</p>}
                    </form>
                )}
            </div>
        </div>
    )
}