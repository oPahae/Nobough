import {
  User, Mail, Phone, MessageSquare, Send, Home, ChevronLeft, Search, Filter, Sparkles, Moon
} from 'lucide-react'
import { useState } from 'react'
import Head from 'next/head'
import { predefinedProtestationsAr } from '@/utils/Constants'

export default function Protestation({ session, setNotification }) {
  const [formData, setFormData] = useState({
    nom: session ? session.nom : '',
    prenom: session ? session.prenom : '',
    email: session ? session.email : '',
    tel: session ? session.tel : '',
    message: ''
  })

  const [selectedProtestation, setSelectedProtestation] = useState('')
  const [automaticResponse, setAutomaticResponse] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleProtestationChange = (e) => {
    const selectedId = e.target.value
    setSelectedProtestation(selectedId)

    if (selectedId) {
      const selected = predefinedProtestationsAr.find(item => item.id === parseInt(selectedId))
      setAutomaticResponse(selected.response)
    } else {
      setAutomaticResponse('')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const PatternDecoration = () => (
    <div className="absolute left-0 top-0 w-24 h-24 opacity-10 -rotate-45">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 0L60 40H100L70 65L80 100L50 80L20 100L30 65L0 40L40 0Z" fill="currentColor" />
      </svg>
    </div>
  )

  const handleSend = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/protestations/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          tel: formData.tel,
          message: formData.message,
          sujet: selectedProtestation ? predefinedProtestationsAr.find(p => p.id === parseInt(selectedProtestation)).question : "آخر"
        }),
      })

      if (response.ok) {
        setFormData({
          nom: session ? session.nom : '',
          prenom: session ? session.prenom : '',
          email: session ? session.email : '',
          tel: session ? session.tel : '',
          message: ''
        })
        setSelectedProtestation('')
        setAutomaticResponse('')
        setNotification((notif) => ({
          ...notif,
          msg: 'تم إرسال الرسالة بنجاح!',
          type: 'success',
          shown: true
        }))
      } else {
        const data = await response.json()
        setNotification((notif) => ({
          ...notif,
          msg: `خطأ: ${data.message}`,
          type: 'error',
          shown: true
        }))
      }
    } catch (error) {
      setNotification((notif) => ({
        ...notif,
        msg: 'خطأ # ' + error,
        type: 'error',
        shown: true
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>إرسال رسائل - أكاديمية نبوغ</title>
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

        <div className="mb-12 text-center pt-8 relative">
          <div className="inline-block">
            <div className="flex items-center justify-center mb-2">
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-700"></div>
              <Sparkles className="text-amber-800 mx-4 w-6 h-6" />
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-700"></div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">إرسال رسائل</h1>
            <div className="flex items-center justify-center mt-2">
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
              <Moon className="text-amber-800 mx-4 w-4 h-4" />
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
            </div>
          </div>
          <p className="text-gray-600 mt-4 max-w-xl mx-auto">استخدم هذا النموذج لتقديم رسائل. سنقوم بمراجعة طلبك والاتصال بك في أقرب وقت ممكن.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl mb-10 border border-amber-100 relative">
            <PatternDecoration />

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-bl from-amber-400 to-amber-700 flex items-center justify-center shadow-md">
                  <Filter className="w-4 h-4 text-white" />
                </div>
                <label htmlFor="predefinedProtestation" className="block text-lg font-semibold mr-3 text-gray-800">
                  اختر نوع الرسالة
                </label>
              </div>
              <div className="relative">
                <select
                  id="predefinedProtestation"
                  name="predefinedProtestation"
                  value={selectedProtestation}
                  onChange={handleProtestationChange}
                  className="block w-full p-3 pl-10 border border-amber-200 rounded-lg bg-white/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700 appearance-none"
                >
                  <option value="">-- اختر رسالة --</option>
                  {predefinedProtestationsAr.map(protestation => (
                    <option key={protestation.id} value={protestation.id}>
                      {protestation.question}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center px-2 pointer-events-none">
                  <ChevronLeft className="h-5 w-5 text-amber-700" />
                </div>
              </div>
            </div>

            {automaticResponse && (
              <div className="mb-8 p-6 bg-amber-50/80 border border-amber-200 rounded-xl shadow-sm">
                <h3 className="text-lg font-medium text-amber-900 mb-3 flex items-center">
                  <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center ml-2">
                    <MessageSquare className="w-3 h-3 text-amber-700" />
                  </div>
                  رد تلقائي :
                </h3>
                <p className="text-gray-700 mr-8">{automaticResponse}</p>
              </div>
            )}

            {(!selectedProtestation || selectedProtestation === '5') && (
              <form onSubmit={handleSend} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700">الاسم</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-amber-600" />
                      </div>
                      <input
                        type="text"
                        id="nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                        className="pr-10 py-3 block w-full rounded-lg border border-amber-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/80 text-gray-700"
                        placeholder="اسمك"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">اللقب</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-amber-600" />
                      </div>
                      <input
                        type="text"
                        id="prenom"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        required
                        className="pr-10 py-3 block w-full rounded-lg border border-amber-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/80 text-gray-700"
                        placeholder="لقبك"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-amber-600" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="pr-10 py-3 block w-full rounded-lg border border-amber-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/80 text-gray-700"
                        placeholder="بريدك@الإلكتروني.كوم"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="tel" className="block text-sm font-medium text-gray-700">الهاتف</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-amber-600" />
                      </div>
                      <input
                        type="tel"
                        id="tel"
                        name="tel"
                        value={formData.tel}
                        onChange={handleChange}
                        required
                        className="pr-10 py-3 block w-full rounded-lg border border-amber-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/80 text-gray-700"
                        placeholder="+212 6XX XX XX XX"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">الرسالة</label>
                  <div className="relative">
                    <div className="absolute top-3 right-3 flex items-start pointer-events-none">
                      <MessageSquare className="h-5 w-5 text-amber-600" />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="pr-10 py-3 block w-full rounded-lg border border-amber-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/80 text-gray-700"
                      placeholder="صف الرسالة هنا..."
                    />
                  </div>
                </div>

                <div className="flex justify-start">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-l from-amber-600 to-amber-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center cursor-pointer disabled:opacity-50"
                  >
                    <span className="font-medium">إرسال</span>
                    {isSubmitting ?
                      <div className="h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div> :
                      <Send className="mr-2 h-5 w-5" />
                    }
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}