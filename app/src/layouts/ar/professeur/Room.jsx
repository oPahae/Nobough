import {
    Video, KeyRound, LogIn, CheckCircle, AlertCircle, Check
} from 'lucide-react'
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Room({ session }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [validation, setValidation] = useState({
        status: null,
        message: ''
    })
    const router = useRouter()

    const generateRandomCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let code = ''
        for (let i = 0; i < 14; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return code
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setValidation({ status: null, message: '' })

        try {
            const roomCode = generateRandomCode()

            const response = await fetch('/api/room/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: roomCode,
                    profID: session.id
                }),
            })

            if (response.ok) {
                window.open(`/ar/Room?code=${roomCode}`, '_blank')
            } else {
                const errorData = await response.json()
                setValidation({
                    status: 'error',
                    message: errorData.message || 'خطأ أثناء إنشاء الغرفة'
                })
            }
        } catch (error) {
            console.error('خطأ أثناء إنشاء الغرفة:', error)
            setValidation({
                status: 'error',
                message: 'حدث خطأ أثناء إنشاء الغرفة'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div dir="rtl">
            <Head>
                <title>بدء جلسة - أكاديمية نبوغ</title>
                <link rel="icon" href="/logo2-nobg.png" />
            </Head>

            <div className="max-w-full">
                <div className="md:px-4 lg:px-4">
                    <div className="w-full bg-white/60 backdrop-blur-xs rounded-xl shadow-xl overflow-hidden p-6">
                        <div className="max-w-md mx-auto">
                            <div className="text-center mb-8">
                                <Video className="h-16 w-16 text-amber-600 mx-auto mb-4" />
                                <h1 className="text-3xl font-bold mb-3 text-gray-800">بدء جلسة</h1>
                                <p className="text-gray-600">
                                    إنشاء جلسة عبر الإنترنت وادعُ طلابك عبر رابط.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <>
                                    {validation.status === 'error' && (
                                        <p className="text-red-500 text-sm flex items-center justify-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {validation.message}
                                        </p>
                                    )}
                                    {validation.status === 'success' && (
                                        <p className="text-green-500 text-sm flex items-center justify-center gap-1">
                                            <CheckCircle className="h-4 w-4" />
                                            {validation.message}
                                        </p>
                                    )}
                                </>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || validation.status === 'success'}
                                        className="w-full inline-flex justify-center gap-3 items-center px-6 py-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors disabled:opacity-50 cursor-pointer"
                                    >
                                        {validation.status === 'success' ? (
                                            <>
                                                <CheckCircle className="h-5 w-5" />
                                                جاري التحقق...
                                            </>
                                        ) : isSubmitting ? (
                                            <>
                                                <div className="h-5 w-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                                جاري التحقق...
                                            </>
                                        ) : (
                                            <>
                                                إنشاء جلسة
                                                <LogIn className="h-5 w-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="my-8 p-6 w-full bg-gray-50 rounded-lg border border-gray-200">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
                                <Video className="h-6 w-6 text-amber-600" />
                                كيفية إنشاء جلسة
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <KeyRound className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">إنشاء رمز</p>
                                        <p className="text-gray-600">انقر على الزر لإنشاء رمز جلسة فريد.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <Check className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">مشاركة الرمز</p>
                                        <p className="text-gray-600">أرسل رمز الجلسة إلى طلابك عبر البريد الإلكتروني أو أي وسيلة أخرى.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <LogIn className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">بدء الجلسة</p>
                                        <p className="text-gray-600">انقر على الزر لبدء الجلسة والوصول إلى الفصل الافتراضي.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}