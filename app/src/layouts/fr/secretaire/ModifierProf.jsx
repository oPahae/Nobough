import {
    ArrowRight, User, Phone, Mail, CreditCard, BookOpen, Trash2, Edit, Plus, X, Sparkles, Moon, Upload
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

export default function ModifierProf({ setActiveTab, setNotification }) {
    const fileInputRef = useRef(null)
    const [profID, setProfID] = useState('')

    useEffect(() => {
        const temp = sessionStorage.getItem('modifierProf')
        if (!temp) setActiveTab('professeurs')
        else setProfID(temp)
    }, [])

    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        tel: '',
        cin: '',
        bio: '',
        specialites: '',
        salaire: '',
        img: '/user.jpg'
    })

    const [errors, setErrors] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(true)

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
                    img: reader.result
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    const validate = () => {
        const newErrors = {}

        if (!formData.nom.trim()) {
            newErrors.nom = "Le nom est requis"
        }

        if (!formData.prenom.trim()) {
            newErrors.prenom = "Le prénom est requis"
        }

        if (!formData.email.trim()) {
            newErrors.email = "L'email est requis"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Format d'email invalide"
        }

        if (!formData.tel.trim()) {
            newErrors.tel = "Le téléphone est requis"
        }

        if (!formData.cin.trim()) {
            newErrors.cin = "Le CIN est requis"
        }

        return newErrors
    }

    ////////////////////////////////////////////////////////

    useEffect(() => {
        fetchProf()
    }, [profID])

    const fetchProf = async () => {
        if(!profID) return
        try {
            setLoading(true)
            const response = await fetch(`/api/profs/getOne?id=${profID}`)
            const data = await response.json()
            console.log(data)

            setFormData({
                nom: data.nom || "",
                prenom: data.prenom || "",
                email: data.email || "",
                tel: data.tel || "",
                cin: data.cin || "",
                bio: data.bio || "",
                specialites: data.specialites || "",
                salaire: data.salaire || "",
                // img: data.img ? atob(data.img.split(',')[1]) : "/user.jpg"
                img: data.img || null
            })

            setLoading(false)
        } catch (error) {
            console.error('Erreur lors de la récupération du professeur:', error)
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newErrors = validate()

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            const submissionData = {
                id: profID,
                nom: formData.nom,
                prenom: formData.prenom,
                email: formData.email,
                tel: formData.tel,
                cin: formData.cin,
                bio: formData.bio,
                specialites: formData.specialites,
                salaire: formData.salaire,
                img: formData.img
            }

            const response = await fetch('/api/profs/update', {
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
                setErrors({ general: data.message || 'Erreur lors de la modification du professeur' })
            }
        } catch (error) {
            setErrors({ general: 'Une erreur est survenue. Veuillez réessayer plus tard.' })
        }
    }

    if (loading) {
        return (
            <div className="max-w-full relative">
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

                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-full relative">
            <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 opacity-20">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#B8860B" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                    </svg>
                </div>
            </div>
            <div className="mb-12 text-center pt-8 relative">
                <div className="inline-block">
                    <div className="flex items-center justify-center mb-2">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-700"></div>
                        <Sparkles className="text-amber-800 mx-4 w-6 h-6" />
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-700"></div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Modifier un professeur</h1>
                    <div className="flex items-center justify-center mt-2">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                        <Moon className="text-amber-800 mx-4 w-4 h-4" />
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                    </div>
                </div>
                <p className="text-gray-600 mt-4 max-w-xl mx-auto">Modifiez les informations de ce professeur</p>
            </div>

            <div className="max-w-4xl mx-auto">
                {submitted ? (
                    <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl mb-10 border border-amber-100">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Professeur modifié avec succès !</h2>
                            <p className="text-gray-600 mb-8">Les modifications ont été enregistrées.</p>
                            <button
                                onClick={() => setActiveTab('professeurs')}
                                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center font-medium"
                            >
                                <span>Retour à la liste</span>
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl mb-10 border border-amber-100">
                        <div className="grid grid-cols-1 gap-6">
                            {/* Image */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2 text-gray-700">Photo</label>
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="w-32 h-32 relative rounded-lg overflow-hidden bg-amber-50 border border-amber-200">
                                        {formData.img && (
                                            <img
                                                src={formData.img}
                                                alt="Aperçu"
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current.click()}
                                            className="w-full px-4 py-3 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-all flex items-center justify-center gap-2 border border-amber-200"
                                        >
                                            <Upload className="w-5 h-5" />
                                            <span>Choisir une image</span>
                                        </button>
                                        <p className="text-xs text-gray-500 mt-2">Format recommandé: 800x600px, JPG ou PNG</p>
                                    </div>
                                </div>
                            </div>

                            {/* Nom et Prénom */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">Nom <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="nom"
                                        value={formData.nom}
                                        onChange={handleChange}
                                        className={`block w-full px-4 py-3 border ${errors.nom ? 'border-red-300 bg-red-50' : 'border-amber-200'} rounded-lg bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700`}
                                        required
                                    />
                                    {errors.nom && <p className="mt-2 text-sm text-red-600">{errors.nom}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">Prénom <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="prenom"
                                        value={formData.prenom}
                                        onChange={handleChange}
                                        className={`block w-full px-4 py-3 border ${errors.prenom ? 'border-red-300 bg-red-50' : 'border-amber-200'} rounded-lg bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700`}
                                        required
                                    />
                                    {errors.prenom && <p className="mt-2 text-sm text-red-600">{errors.prenom}</p>}
                                </div>
                            </div>

                            {/* Email et Téléphone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">Email <span className="text-red-500">*</span></label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`block w-full px-4 py-3 border ${errors.email ? 'border-red-300 bg-red-50' : 'border-amber-200'} rounded-lg bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700`}
                                        required
                                    />
                                    {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">Téléphone <span className="text-red-500">*</span></label>
                                    <input
                                        type="tel"
                                        name="tel"
                                        value={formData.tel}
                                        onChange={handleChange}
                                        className={`block w-full px-4 py-3 border ${errors.tel ? 'border-red-300 bg-red-50' : 'border-amber-200'} rounded-lg bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700`}
                                        required
                                    />
                                    {errors.tel && <p className="mt-2 text-sm text-red-600">{errors.tel}</p>}
                                </div>
                            </div>

                            {/* CIN */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">CIN <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="cin"
                                    value={formData.cin}
                                    onChange={handleChange}
                                    className={`block w-full px-4 py-3 border ${errors.cin ? 'border-red-300 bg-red-50' : 'border-amber-200'} rounded-lg bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700`}
                                    required
                                />
                                {errors.cin && <p className="mt-2 text-sm text-red-600">{errors.cin}</p>}
                            </div>

                            {/* Salaire */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Salaire <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    name="salaire"
                                    value={formData.salaire}
                                    onChange={handleChange}
                                    className={`block w-full px-4 py-3 border ${errors.salaire ? 'border-red-300 bg-red-50' : 'border-amber-200'} rounded-lg bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700`}
                                    required
                                />
                                {errors.salaire && <p className="mt-2 text-sm text-red-600">{errors.salaire}</p>}
                            </div>

                            {/* Spécialités */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Spécialités</label>
                                <input
                                    type="text"
                                    name="specialites"
                                    value={formData.specialites}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-amber-200 rounded-lg bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700"
                                    placeholder="Séparer les spécialités par des virgules"
                                />
                                <p className="text-xs text-gray-500 mt-1">Exemple: Coran, Fiqh, Langue Arabe</p>
                            </div>

                            {/* Biographie */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Biographie</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows="4"
                                    className="block w-full px-4 py-3 border border-amber-200 rounded-lg bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700"
                                ></textarea>
                            </div>

                            {/* Boutons */}
                            <div className="flex justify-between mt-8">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('professeurs')}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center font-medium text-lg"
                                >
                                    <span>Modifier le professeur</span>
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </button>
                            </div>

                            {errors.general && <p className="mt-4 text-sm text-red-600 text-center">{errors.general}</p>}
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}