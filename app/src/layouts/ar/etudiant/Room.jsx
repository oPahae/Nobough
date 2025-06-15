import {
    Video, KeyRound, LogIn, CheckCircle, AlertCircle, Check,
    Sparkles, Moon
} from 'lucide-react'
import { useState } from 'react'
import Head from 'next/head'

export default function Room() {
    const [code, setCode] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [validation, setValidation] = useState({
        status: null,
        message: ''
    })

    const handleCodeChange = (e) => {
        let value = e.target.value

        if (value.length <= 16) {
            setCode(value)
            setValidation({ status: null, message: '' })
        }
    }

    const PatternDecoration = () => (
        <div className="absolute left-0 top-0 w-24 h-24 opacity-10 -rotate-45">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0L60 40H100L70 65L80 100L50 80L20 100L30 65L0 40L40 0Z" fill="currentColor" />
            </svg>
        </div>
    )

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setValidation({ status: null, message: '' })

        try {
            const response = await fetch('/api/room/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code
                }),
            })

            if (response.ok) {
                window.open(`/ar/Room?code=${code}`, '_blank')
            } else {
                const errorData = await response.json()
                setValidation({
                    status: 'error',
                    message: errorData.message || 'رمز الجلسة غير صالح'
                })
            }
        } catch (error) {
            console.error('خطأ أثناء التحقق من الرمز:', error)
            setValidation({
                status: 'error',
                message: 'حدث خطأ أثناء التحقق من الرمز'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Head>
                <title>الانضمام إلى جلسة - أكاديمية نبوغ</title>
                <link rel="icon" href="/logo2-nobg.png" />
            </Head>

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

                <div className="md:px-4 lg:px-4">
                    <div className="mb-12 text-center pt-8 relative">
                        <div className="inline-block">
                            <div className="flex items-center justify-center mb-2">
                                <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-700"></div>
                                <Sparkles className="text-amber-800 mx-4 w-6 h-6" />
                                <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-700"></div>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800">الانضمام إلى جلسة</h1>
                            <div className="flex items-center justify-center mt-2">
                                <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                                <Moon className="text-amber-800 mx-4 w-4 h-4" />
                                <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                            </div>
                        </div>
                        <p className="text-gray-600 mt-4 max-w-xl mx-auto">أدخل الرمز المقدم من المدرس الخاص بك للوصول مباشرة إلى دروسك عبر الإنترنت.</p>
                    </div>

                    <div className="w-full bg-white rounded-xl shadow-xl overflow-hidden p-6 relative max-w-2xl mx-auto mb-10">
                        <PatternDecoration />
                        <div className="max-w-md mx-auto">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-md mx-auto mb-4">
                                    <Video className="h-8 w-8 text-white" />
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <label htmlFor="code" className="block text-base font-medium text-gray-700 text-center">رمز الجلسة</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <KeyRound className="h-6 w-6 text-amber-700" />
                                        </div>
                                        <input
                                            type="text"
                                            id="code"
                                            name="code"
                                            value={code}
                                            onChange={handleCodeChange}
                                            required
                                            className={`pr-12 py-4 block w-full rounded-lg shadow-sm focus:ring-amber-500 bg-white/90 text-2xl font-mono tracking-wider text-center border ${validation.status === 'error'
                                                ? 'border-red-500 focus:border-red-500'
                                                : validation.status === 'success'
                                                    ? 'border-green-500 focus:border-green-500'
                                                    : 'border-amber-200 focus:border-amber-500'
                                                }`}
                                            placeholder="eQu8x65qO7aLks"
                                            autoFocus
                                        />
                                    </div>
                                    {validation.status === 'error' && (
                                        <p className="text-red-500 text-sm flex items-center justify-center gap-1 mt-2">
                                            <AlertCircle className="h-4 w-4" />
                                            {validation.message}
                                        </p>
                                    )}
                                    {validation.status === 'success' && (
                                        <p className="text-green-500 text-sm flex items-center justify-center gap-1 mt-2">
                                            <CheckCircle className="h-4 w-4" />
                                            {validation.message}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1 text-center">
                                        يتكون الرمز من 10 إلى 16 حرفًا (أحرف وأرقام).
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || validation.status === 'success'}
                                        className="w-full inline-flex justify-center gap-3 items-center px-6 py-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-gradient-to-l from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all disabled:opacity-50 transform hover:-translate-y-0.5 cursor-pointer"
                                    >
                                        {validation.status === 'success' ? (
                                            <>
                                                <CheckCircle className="h-5 w-5" />
                                                جاري التحقق...
                                            </>
                                        ) : isSubmitting ? (
                                            <>
                                                <div className="h-5 w-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                                التحقق...
                                            </>
                                        ) : (
                                            <>
                                                الانضمام إلى الجلسة
                                                <LogIn className="h-5 w-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="my-8 p-6 w-full bg-amber-50/40 rounded-lg border border-amber-100">
                            <div className="relative flex items-center justify-center mb-4">
                                <div className="absolute right-0 w-1/4 h-px bg-gradient-to-l from-transparent to-amber-700/30"></div>
                                <h2 className="text-xl font-bold text-amber-900 px-6 flex items-center gap-2">
                                    <Video className="h-5 w-5 text-amber-700" />
                                    كيفية الانضمام إلى جلستك
                                </h2>
                                <div className="absolute left-0 w-1/4 h-px bg-gradient-to-r from-transparent to-amber-700/30"></div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-gradient-to-bl from-amber-400 to-amber-700 p-2 rounded-full shadow-sm">
                                        <KeyRound className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">احصل على رمزك</p>
                                        <p className="text-gray-600">تم إرسال رمز الجلسة إليك عبر البريد الإلكتروني أو تم التواصل به من قبل المدرس الخاص بك.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="bg-gradient-to-bl from-amber-400 to-amber-700 p-2 rounded-full shadow-sm">
                                        <Check className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">أدخل الرمز</p>
                                        <p className="text-gray-600">أدخل رمز جلستك في الحقل أعلاه.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="bg-gradient-to-bl from-amber-400 to-amber-700 p-2 rounded-full shadow-sm">
                                        <LogIn className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">الوصول إلى دروسك</p>
                                        <p className="text-gray-600">ستتم إعادة توجيهك تلقائيًا إلى الفصل الافتراضي.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}