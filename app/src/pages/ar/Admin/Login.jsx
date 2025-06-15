import { Mail, Lock, Sparkles, Moon, ArrowRight, Info, Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { verifyAuth } from '@/middlewares/Admin'

export default function Login({ session, setNotification }) {
    const [errors, setErrors] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    useEffect(() => {
        if (session) window.location.href = './'
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }))
        }
    }

    const validate = () => {
        const newErrors = {}

        if (!formData.email.trim()) {
            newErrors.email = "L'email est requis"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Format d'email invalide"
        }

        if (!formData.password.trim()) {
            newErrors.password = "Le mot de passe est requis"
        }

        return newErrors
    }

    ///////////////////////////////////////////////////////////////

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newErrors = validate()

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            const response = await fetch('/api/_auth/adminLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                setSubmitted(true)
                setNotification((notif) => ({
                    ...notif,
                    msg: `Connecté avec succès !`,
                    type: 'success',
                    shown: true
                }))
                localStorage.setItem('activeTabAdmin', 'budget')
                window.location.href = './'
            } else {
                setErrors({ general: data.message || 'Erreur lors de la connexion.' })
                setNotification((notif) => ({
                    ...notif,
                    msg: `Erreur # ${data.message}`,
                    type: response.status === 401 ? 'warning' : 'error',
                    shown: true
                }))
            }
        } catch (error) {
            setErrors({ general: 'Une erreur est survenue. Veuillez réessayer plus tard.' })
            setNotification((notif) => ({
                ...notif,
                msg: `Erreur # ${error}`,
                type: 'error',
                shown: true
            }))
        }
    }

    return (
        <>
            <Head>
                <title>Login Admin - Académie Nobough</title>
                <link rel="icon" href="/logo2-nobg.png" />
            </Head>

            <div className="max-w-full relative pb-12 bg-white/60 backdrop-blur-3xl">
                {/* Decore */}
                <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 opacity-20">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#B8860B" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                        </svg>
                    </div>
                    <div className="absolute top-1/2 -left-24 w-64 h-64 opacity-20">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#B8860B" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                        </svg>
                    </div>
                    <div className="absolute -bottom-24 right-1/4 w-72 h-72 opacity-20">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#B8860B" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                        </svg>
                    </div>
                </div>

                {/* Titre */}
                <div className="text-center pt-12 relative">
                    <div className="inline-block">
                        <div className="flex items-center justify-center mb-2">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-700"></div>
                            <Sparkles className="text-amber-800 mx-4 w-6 h-6" />
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-700"></div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">Se connecter</h1>
                        <div className="flex items-center justify-center mt-2">
                            <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                            <Moon className="text-amber-800 mx-4 w-4 h-4" />
                            <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                        </div>
                    </div>
                    <p className="text-gray-600 mt-4 max-w-xl mx-auto">Connectez-vous pour accéder à votre compte et continuer votre parcours spirituel</p>
                </div>

                {/* Form */}
                <div className="max-w-full mx-auto p-4 md:p-16">
                    {submitted ? (
                        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl mb-10 border border-amber-100">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                    <Check className="w-8 h-8 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Connexion réussie !</h2>
                                <p className="text-gray-600 mb-8">Bienvenue {formData.email}. Vous êtes maintenant connecté.</p>
                                <button
                                    className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center font-medium"
                                >
                                    <span>Explorer nos formations</span>
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl mb-10 border border-amber-100">
                            <div className="grid grid-cols-1 gap-6">
                                {/* Email */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2 text-gray-700">Email <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-amber-700" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            className={`block w-full pl-12 pr-4 py-4 border ${errors.email ? 'border-red-300 bg-red-50' : 'border-amber-200'} rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700`}
                                            placeholder="votre.email@exemple.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                {/* Password */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2 text-gray-700">Mot de passe <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-amber-700" />
                                        </div>
                                        <input
                                            type="password"
                                            name="password"
                                            className={`block w-full pl-12 pr-4 py-4 border ${errors.password ? 'border-red-300 bg-red-50' : 'border-amber-200'} rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700`}
                                            placeholder="Votre mot de passe"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                                </div>
                            </div>

                            {/* Note d'information */}
                            <div className="bg-amber-50 p-4 rounded-lg mb-8 flex">
                                <Info className="h-5 w-5 text-amber-700 mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-700">
                                        En vous connectant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                                    </p>
                                </div>
                            </div>

                            {/* Bouton de soumission */}
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className="px-12 py-4 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center font-medium text-lg"
                                >
                                    <span>Se connecter</span>
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </button>
                            </div>

                            {/* Lien pour s'inscrire */}
                            <div className="text-center mt-4">
                                <p className="text-gray-600">
                                    Mot de passe oublié ?
                                    <Link
                                        href="Recover" target='_blank'
                                        className="ml-2 text-amber-700 font-medium hover:text-amber-800 transition-colors cursor-pointer hover:underline"
                                    >
                                        Récupérer votre compte
                                    </Link>
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps({ req, res }) {
    const admin = verifyAuth(req, res)

    if (admin) {
        return {
            props: {
                session: {
                    id: 1,
                }
            },
        }
    }

    return { props: { session: null } }
}