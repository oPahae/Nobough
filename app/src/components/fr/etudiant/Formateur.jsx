import {
    Search, Filter, Users, Clock, Navigation, Flag, TrendingUp,
    Tag, DollarSign, BookOpen, User, Bookmark, Check, FileText,
    ArrowRight, Heart, Star, ChevronDown, Grid, List, Mail, Phone,
    Calendar, Info, MessageCircle, Library, Book, Video, File, Download,
    PlusCircle, Send, Paperclip, Image, FileText as FileIcon, Delete,
    MapPin, Moon, Sparkles
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

const Formateur = ({ formationID }) => {
    const [formateur, setFormateur] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchFormateur = async () => {
            try {
                setIsLoading(true)
                const response = await fetch(`/api/formation/getProf?formationID=${formationID}`)

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des données du formateur')
                }

                const data = await response.json()

                const formattedFormateur = {
                    id: data.id,
                    img: data.img ? `data:image/jpeg;base64,${Buffer.from(data.img).toString('base64')}` : null,
                    nom: data.nom,
                    prenom: data.prenom,
                    tel: data.tel,
                    email: data.email,
                    birth: data.birth,
                    bio: data.bio,
                    specialites: data.specialites ? data.specialites.split(',') : [],
                    formations: data.formations || 0,
                    totalEtudiants: data.totalEtudiants || 0
                }

                setFormateur(formattedFormateur)
            } catch (error) {
                console.error('Erreur lors de la récupération du formateur:', error)
                setError(error.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchFormateur()
    }, [formationID])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-5xl mx-auto p-8 text-center">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-4">
                    <h2 className="text-red-700 font-medium">Erreur de chargement</h2>
                    <p className="text-red-600">{error}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="text-amber-600 hover:text-amber-800 underline"
                >
                    Réessayer
                </button>
            </div>
        )
    }

    if (!formateur) {
        return (
            <div className="max-w-5xl mx-auto p-8 text-center">
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md mb-4">
                    <h2 className="text-amber-700 font-medium">Formateur introuvable</h2>
                    <p className="text-amber-600">Le formateur de cette formation n'est pas disponible.</p>
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

            <div className="mb-12 text-center pt-8 relative">
                <div className="inline-block">
                    <div className="flex items-center justify-center mb-2">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-700"></div>
                        <Sparkles className="text-amber-800 mx-4 w-6 h-6" />
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-700"></div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Profil du Formateur</h1>
                    <div className="flex items-center justify-center mt-2">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                        <Moon className="text-amber-800 mx-4 w-4 h-4" />
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                    </div>
                </div>
                <p className="text-gray-600 mt-4 max-w-xl mx-auto">Découvrez les compétences et l'expérience de nos formateurs d'excellence</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl mb-10 max-w-5xl mx-auto border border-amber-100">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                        <div className="bg-amber-50/60 rounded-xl p-6 text-center relative overflow-hidden shadow-md border border-amber-100">
                            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-600/30 rounded-tl-2xl"></div>
                            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-amber-600/30 rounded-tr-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-amber-600/30 rounded-bl-2xl"></div>
                            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-amber-600/30 rounded-br-2xl"></div>

                            <div className="relative mb-6">
                                <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden shadow-md border-4 border-amber-100">
                                    <img
                                        src={formateur.img ? atob(formateur.img.split(',')[1]) : '/user.jpg'}
                                        alt={`${formateur.prenom} ${formateur.nom}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h2 className="text-xl font-bold mb-1 text-amber-900">{formateur.prenom} {formateur.nom}</h2>
                                <p className="text-gray-600 mb-2">Formateur</p>
                                <div className="flex items-center justify-center">
                                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400"></div>
                                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400"></div>
                                </div>
                            </div>

                            <div className="space-y-4 text-left mb-6">
                                <div className="flex items-center p-3 bg-white/70 rounded-lg shadow-sm hover:shadow transition-all">
                                    <Mail className="w-5 h-5 text-amber-700 mr-3" />
                                    <span className="text-gray-700">{formateur.email}</span>
                                </div>
                                <div className="flex items-center p-3 bg-white/70 rounded-lg shadow-sm hover:shadow transition-all">
                                    <Phone className="w-5 h-5 text-amber-700 mr-3" />
                                    <span className="text-gray-700">{formateur.tel}</span>
                                </div>
                                <div className="flex items-center p-3 bg-white/70 rounded-lg shadow-sm hover:shadow transition-all">
                                    <Calendar className="w-5 h-5 text-amber-700 mr-3" />
                                    <span className="text-gray-700">Né le {new Date(formateur.birth).toLocaleDateString('FR-fr')}</span>
                                </div>
                            </div>

                            <div className="flex justify-around mb-4 p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl shadow-sm">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-amber-800">{formateur.formations}</p>
                                    <p className="text-sm text-gray-600">Formations</p>
                                </div>
                                <div className="w-px h-12 bg-amber-200 mx-2"></div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-amber-800">{formateur.totalEtudiants}</p>
                                    <p className="text-sm text-gray-600">Étudiants</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-2/3">
                        <div className="bg-white border border-amber-100 rounded-xl shadow-md p-8 mb-6 relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-24 h-24 opacity-10 rotate-45">
                                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50 0L60 40H100L70 65L80 100L50 80L20 100L30 65L0 40H40L50 0Z" fill="currentColor" />
                                </svg>
                            </div>

                            <div className="flex items-center mb-6">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-md">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <h2 className="text-xl font-semibold ml-3 text-gray-800">Biographie</h2>
                            </div>

                            <div className="relative">
                                <div className="absolute top-0 left-0 w-4 h-8 border-t-2 border-l-2 border-amber-300"></div>
                                <p className="text-gray-700 mb-6 px-6 py-2">{formateur.bio}</p>
                                <div className="absolute bottom-0 right-0 w-4 h-8 border-b-2 border-r-2 border-amber-300"></div>
                            </div>
                        </div>

                        <div className="bg-white border border-amber-100 rounded-xl shadow-md p-8 relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-24 h-24 opacity-10 rotate-45">
                                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50 0L60 40H100L70 65L80 100L50 80L20 100L30 65L0 40H40L50 0Z" fill="currentColor" />
                                </svg>
                            </div>

                            <div className="flex items-center mb-6">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-md">
                                    <Tag className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold ml-3 text-gray-800">Spécialités</h3>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {formateur.specialites.map((specialite, index) => (
                                    <span key={index} className="bg-amber-50 text-amber-800 px-4 py-2 rounded-full border border-amber-200 shadow-sm flex items-center">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                                        {specialite}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Formateur