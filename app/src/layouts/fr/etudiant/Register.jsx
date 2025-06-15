import {
    User, Mail, Phone, Calendar, CreditCard, FileText, Check, Lock,
    Sparkles, Moon, ArrowRight, Info
} from 'lucide-react'
import { useState, useEffect } from 'react'
import ReCAPTCHA from "react-google-recaptcha";

export default function Register({ session, setNotification, setActiveTab }) {
    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        dateNaissance: '',
        cin: '',
        email: '',
        tel: '',
        bio: '',
        image: '',
        password: '',
        confirmPassword: ''
    })
    const [mineur, setMineur] = useState(false)
    const [captcha, setCaptcha] = useState(null);

    const handleCaptcha = (value) => {
        setCaptcha(value);
    };

    useEffect(() => {
        if (session) setActiveTab('dashboard')
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
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    image: reader.result
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    const validate = () => {
        const newErrors = {}

        if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis"
        if (!formData.nom.trim()) newErrors.nom = "Le nom est requis"
        if (!formData.dateNaissance) newErrors.dateNaissance = "La date de naissance est requise"

        if (!mineur) {
            if (!formData.cin.trim()) {
                newErrors.cin = "Le CIN est requis"
            } else if (!/^[A-Z]{1,2}\d{5,6}$/.test(formData.cin.trim())) {
                newErrors.cin = "Format CIN invalide"
            }
        }

        if (!formData.email.trim()) {
            newErrors.email = "L'email est requis"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Format d'email invalide"
        }

        if (!formData.tel.trim()) {
            newErrors.tel = "Le téléphone est requis"
        } else if (!/^0[5-7][0-9]{8}$/.test(formData.tel.trim())) {
            newErrors.tel = "Format de téléphone invalide"
        }

        if (!formData.password.trim()) {
            newErrors.password = "Le mot de passe est requis"
        } else if (formData.password.length < 6) {
            newErrors.password = "Le mot de passe doit contenir au moins 6 caractères"
        }

        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = "La confirmation du mot de passe est requise"
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
        }

        if (formData.bio.length > 500) {
            newErrors.bio = "La bio ne peut pas dépasser 500 caractères"
        }

        return newErrors
    }

    const calculateAge = (dateString) => {
        if (!dateString) return null
        const birthDate = new Date(dateString)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }

        return age
    }

    ////////////////////////////////////////////////////////////

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!captcha) {
            setNotification((notif) => ({
                ...notif,
                msg: "Veuillez valider le CAPTCHA.",
                type: 'info',
                shown: true
            }))
            return;
        }

        const newErrors = validate();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await fetch('/api/_auth/userRegister', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    cin: mineur ? 'Mineur' : formData.cin,
                    captcha: captcha
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitted(true);
                setNotification((notif) => ({
                    ...notif,
                    msg: `Inscription envoyée avec succès !`,
                    type: 'success',
                    shown: true
                }))
            } else {
                setErrors({ general: data.message.message });
                setNotification((notif) => ({
                    ...notif,
                    msg: `Erreur # ${data.message.sqlMessage || data.message.code}`,
                    type: 'error',
                    shown: true
                }))
            }
        } catch (error) {
            setErrors({ general: 'Une erreur est survenue. Veuillez réessayer plus tard.' });
            setNotification((notif) => ({
                ...notif,
                msg: `Erreur # ${error.message}`,
                type: 'error',
                shown: true
            }))
        }
    };

    return (
        <div className="max-w-full relative pb-12 md:px-22">
            {/* Motif décoratif */}
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

            {/* Titre avec ornement */}
            <div className="mb-12 text-center pt-8 relative">
                <div className="inline-block">
                    <div className="flex items-center justify-center mb-2">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-700"></div>
                        <Sparkles className="text-amber-800 mx-4 w-6 h-6" />
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-700"></div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Créer votre compte</h1>
                    <div className="flex items-center justify-center mt-2">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                        <Moon className="text-amber-800 mx-4 w-4 h-4" />
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                    </div>
                </div>
                <p className="text-gray-600 mt-4 max-w-xl mx-auto">Rejoignez notre communauté d'apprentissage et commencez votre parcours spirituel</p>
            </div>

            {/* Lien pour se connecter */}
            <div className="text-center mb-6">
                <p className="text-gray-600">
                    Vous avez déjà un compte ?
                    <span
                        onClick={() => setActiveTab('login')}
                        className="ml-2 text-amber-700 font-medium hover:text-amber-800 transition-colors cursor-pointer hover:underline"
                    >
                        Se connecter
                    </span>
                </p>
            </div>

            {/* Formulaire d'inscription */}
            <div className="max-w-full mx-auto">
                {submitted ? (
                    <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl mb-10 border border-amber-100">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Inscription réussie !</h2>
                            <p className="text-gray-600 mb-8">Merci {formData.prenom} {formData.nom} pour votre inscription. Nous avons envoyé un email de confirmation à {formData.email}.</p>
                            <button
                                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center font-medium"
                            >
                                <span onClick={() => setActiveTab('dashboard')}>Explorer nos formations</span>
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white/90 noScroll backdrop-blur-sm p-8 rounded-xl shadow-xl mb-10 border border-amber-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Prénom */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2 text-gray-700">Prénom <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-amber-700" />
                                    </div>
                                    <input
                                        type="text"
                                        name="prenom"
                                        className={`block w-full pl-12 pr-4 py-4 border ${errors.prenom ? 'border-red-300 bg-red-50' : 'border-amber-200'} rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700`}
                                        placeholder="Votre prénom"
                                        value={formData.prenom}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {errors.prenom && <p className="mt-2 text-sm text-red-600">{errors.prenom}</p>}
                            </div>

                            {/* Nom */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2 text-gray-700">Nom <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-amber-700" />
                                    </div>
                                    <input
                                        type="text"
                                        name="nom"
                                        className={`block w-full pl-12 pr-4 py-4 border ${errors.nom ? 'border-red-300 bg-red-50' : 'border-amber-200'} rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700`}
                                        placeholder="Votre nom"
                                        value={formData.nom}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {errors.nom && <p className="mt-2 text-sm text-red-600">{errors.nom}</p>}
                            </div>

                            {/* Date de naissance */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2 text-gray-700">Date de naissance <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Calendar className="h-5 w-5 text-amber-700" />
                                    </div>
                                    <input
                                        type="date"
                                        name="dateNaissance"
                                        className={`block w-full pl-12 pr-4 py-4 border ${errors.dateNaissance ? 'border-red-300 bg-red-50' : 'border-amber-200'} rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700`}
                                        value={formData.dateNaissance}
                                        onChange={handleChange}
                                        required
                                    />
                                    {formData.dateNaissance && (
                                        <div className="absolute inset-y-0 right-6 pr-4 flex items-center text-sm text-amber-700">
                                            {calculateAge(formData.dateNaissance)} ans
                                        </div>
                                    )}
                                </div>
                                {errors.dateNaissance && <p className="mt-2 text-sm text-red-600">{errors.dateNaissance}</p>}
                            </div>

                            {/* CIN */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2 text-gray-700">CIN <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <CreditCard className="h-5 w-5 text-amber-700" />
                                    </div>
                                    <input
                                        type="text"
                                        name="cin"
                                        className={`block w-full pl-12 pr-4 py-4 border ${errors.cin ? 'border-red-300 bg-red-50' : 'border-amber-200'} rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700`}
                                        placeholder="Votre numéro CIN"
                                        value={mineur ? 'Mineur' : formData.cin}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <label className='flex items-center justify-center w-fit gap-1 cursor-pointer text-sm text-gray-700'>
                                    <input name='mineur' type="checkbox" onClick={() => setMineur(e => !e)} />
                                    Mineur
                                </label>
                                {errors.cin && <p className="mt-2 text-sm text-red-600">{errors.cin}</p>}
                            </div>

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

                            {/* Téléphone */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2 text-gray-700">Téléphone <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-amber-700" />
                                    </div>
                                    <input
                                        type="text"
                                        name="tel"
                                        className={`block w-full pl-12 pr-4 py-4 border ${errors.tel ? 'border-red-300 bg-red-50' : 'border-amber-200'} rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700`}
                                        placeholder="0600000000"
                                        value={formData.tel}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {errors.tel && <p className="mt-2 text-sm text-red-600">{errors.tel}</p>}
                            </div>

                            {/* Mot de passe */}
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

                            {/* Confirmer le mot de passe */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2 text-gray-700">Confirmer le mot de passe <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-amber-700" />
                                    </div>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className={`block w-full pl-12 pr-4 py-4 border ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-amber-200'} rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700`}
                                        placeholder="Confirmer votre mot de passe"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
                            </div>

                            {/* Image */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2 text-gray-700">Image</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FileText className="h-5 w-5 text-amber-700" />
                                    </div>
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        className={`block w-full pl-12 pr-4 py-4 border ${errors.image ? 'border-red-300 bg-red-50' : 'border-amber-200'} rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700`}
                                        onChange={handleImageChange}
                                    />
                                </div>
                                {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image}</p>}
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="mt-6 mb-8">
                            <label className="block text-sm font-medium mb-2 text-gray-700">Bio</label>
                            <div className="relative">
                                <div className="absolute top-4 left-4 pointer-events-none">
                                    <FileText className="h-5 w-5 text-amber-700" />
                                </div>
                                <textarea
                                    name="bio"
                                    rows="4"
                                    className={`block w-full pl-12 pr-4 py-4 border ${errors.bio ? 'border-red-300 bg-red-50' : 'border-amber-200'} rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700`}
                                    placeholder="Parlez-nous de vous en quelques mots (facultatif)"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    maxLength="500"
                                ></textarea>
                                <div className="absolute bottom-2 right-3 text-xs text-gray-500">
                                    {formData.bio.length}/500 caractères
                                </div>
                            </div>
                            {errors.bio && <p className="mt-2 text-sm text-red-600">{errors.bio}</p>}
                        </div>

                        {/* Note d'information */}
                        <div className="bg-amber-50 p-4 rounded-lg mb-8 flex">
                            <Info className="h-5 w-5 text-amber-700 mr-3 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-700">
                                    En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                                    Vos données personnelles seront traitées conformément à la loi en vigueur.
                                </p>
                            </div>
                        </div>

                        {/* Captcha */}
                        <ReCAPTCHA
                            sitekey="6LdR5lQrAAAAAPonFpFT2ahDbEo97ia30GBPqOGP"
                            onChange={handleCaptcha}
                        />

                        {/* Bouton de soumission */}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="px-12 py-4 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center font-medium text-lg"
                            >
                                <span>S'inscrire</span>
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}