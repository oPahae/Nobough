import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
    CreditCard, FileImage, Check, ArrowRight, Info
} from 'lucide-react'
import Link from 'next/link'
import Head from 'next/head'

export default function Paiement({ setNotification }) {
    const router = useRouter()
    const { id, prix } = router.query

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            montant: prix
        }))
    }, [prix])

    const [formData, setFormData] = useState({
        montant: prix,
        message: '',
        image: null,
        imagePreview: ''
    })

    const [errors, setErrors] = useState({})
    const [submitted, setSubmitted] = useState(false)

    const handleChange = (e) => {
        const { name, value, files } = e.target
        if (name === 'image') {
            const file = files[0]
            if (file) {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setFormData(prev => ({
                        ...prev,
                        image: file,
                        imagePreview: reader.result
                    }))
                }
                reader.readAsDataURL(file)
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }))
        }
    }

    const validate = () => {
        const newErrors = {}
        if (!formData.montant.trim()) newErrors.montant = "المبلغ مطلوب"
        if (!formData.message.trim()) newErrors.message = "الرسالة مطلوبة"
        if (!formData.image) newErrors.image = "إثبات المعاملة مطلوب"
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
            const reader = new FileReader()
            reader.onloadend = async () => {
                const base64Image = reader.result.split(',')[1]

                const response = await fetch('/api/inscriptions/payer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        preuve: base64Image,
                        msg: formData.message,
                        id,
                    }),
                })

                if (response.ok) {
                    setSubmitted(true)
                    setNotification((notif) => ({
                        ...notif,
                        msg: `تم إرسال الدفع بنجاح!`,
                        type: 'success',
                        shown: true
                    }))
                } else {
                    const data = await response.json()
                    setErrors({ general: data.message || 'حدث خطأ أثناء إرسال الدفع.' })
                    setNotification((notif) => ({
                        ...notif,
                        msg: `خطأ: ${data.message}`,
                        type: 'error',
                        shown: true
                    }))
                }
            }
            reader.readAsDataURL(formData.image)
        } catch (error) {
            setErrors({ general: 'حدث خطأ ما. يرجى المحاولة مرة أخرى لاحقًا.' })
        }
    }

    return (
        <>
            <Head>
                <title>مساحة الطالب - أكاديمية نبوغ</title>
                <link rel="icon" href="/logo2-nobg.png" />
            </Head>
            <div className="min-h-screen flex flex-col bg-white/60 backdrop-blur-3xl" dir="rtl">
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
                            <CreditCard className="text-amber-800 mx-4 w-6 h-6" />
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-700"></div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">إجراء دفع</h1>
                        <div className="flex items-center justify-center mt-2">
                            <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                            <Info className="text-amber-800 mx-4 w-4 h-4" />
                            <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                        </div>
                    </div>
                    <p className="text-gray-600 mt-4 max-w-xl mx-auto">أكمل المعلومات أدناه لإجراء الدفع</p>
                </div>

                <div className="flex-grow max-w-full mx-auto">
                    {submitted ? (
                        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl mb-10 border border-amber-100 flex items-center justify-center">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                    <Check className="w-8 h-8 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">تم الدفع بنجاح!</h2>
                                <p className="text-gray-600 mb-8">شكرًا لدفعك. تم تسجيل معاملتك.</p>
                                <Link href="Etudiant"
                                    className="px-6 py-3 bg-gradient-to-l from-amber-600 to-amber-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center font-medium"
                                >
                                    <ArrowRight className="w-4 h-4 mr-2" />
                                    <span>العودة إلى الصفحة الرئيسية</span>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl mb-10 border border-amber-100 flex-grow flex flex-col">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2 text-gray-700">المبلغ <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <CreditCard className="h-5 w-5 text-amber-700" />
                                        </div>
                                        <input
                                            type="number"
                                            name="montant"
                                            className={`block w-full pr-12 pl-4 py-4 border ${errors.montant ? 'border-red-300 bg-red-50' : 'border-amber-200'} rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700`}
                                            placeholder="المبلغ بالدرهم المغربي"
                                            value={formData.montant}
                                            onChange={handleChange}
                                            disabled
                                        />
                                    </div>
                                    {errors.montant && <p className="mt-2 text-sm text-red-600">{errors.montant}</p>}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2 text-gray-700">الرسالة <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute top-4 right-4 pointer-events-none">
                                            <FileImage className="h-5 w-5 text-amber-700" />
                                        </div>
                                        <textarea
                                            name="message"
                                            rows="1"
                                            className={`block w-full pr-12 pl-4 py-4 border ${errors.message ? 'border-red-300 bg-red-50' : 'border-amber-200'} rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700`}
                                            placeholder="رسالتك"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>
                                    {errors.message && <p className="mt-2 text-sm text-red-600">{errors.message}</p>}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2 text-gray-700">إثبات المعاملة <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute top-4 right-4 pointer-events-none">
                                            <FileImage className="h-5 w-5 text-amber-700" />
                                        </div>
                                        <input
                                            type="file"
                                            name="image"
                                            accept="image/*"
                                            className={`block w-full pr-12 pl-4 py-4 border ${errors.image ? 'border-red-300 bg-red-50' : 'border-amber-200'} rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700`}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image}</p>}
                                    {formData.imagePreview && (
                                        <div className="mt-4">
                                            <img src={formData.imagePreview} alt="إثبات المعاملة" className="w-20 h-auto rounded-xl" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-amber-50 p-4 rounded-lg mb-8 flex">
                                <Info className="h-5 w-5 text-amber-700 ml-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-700">
                                        من خلال تقديم هذا النموذج، فإنك توافق على شروط الاستخدام وسياسة الخصوصية الخاصة بنا.
                                        سيتم معالجة بياناتك الشخصية وفقًا للقانون المعمول به.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-center mt-auto">
                                <button
                                    type="submit"
                                    className="px-12 py-4 bg-gradient-to-l from-amber-600 to-amber-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center font-medium text-lg"
                                >
                                    <ArrowRight className="w-5 h-5 mr-2" />
                                    <span>إرسال الدفع</span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    )
}