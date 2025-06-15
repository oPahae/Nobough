import {
    Search, Filter, Users, Clock, Navigation, Flag, TrendingUp,
    Tag, DollarSign, BookOpen, User, Bookmark, Check, FileText, Lock,
    ArrowRight, Heart, Star, ChevronDown, Grid, List, Mail, Phone, Calendar, Info, Moon, Sparkles,
    Plus
} from 'lucide-react'
import React, { useState } from 'react'

const Details = ({ session, setActiveTab, formation, etudiants, setNotification }) => {
    const handleJoin = async () => {
        try {
            const response = await fetch('/api/inscriptions/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ formationID: formation.id, etudiantID: session.id }),
            })

            if (response.ok) {
                setNotification((notif) => ({
                    ...notif,
                    msg: `Demande d\'inscription enregistrée avec succès !`,
                    type: 'success',
                    shown: true
                }))
                setTimeout(() => {
                    window.location.reload()
                }, 500)
            } else {
                const data = await response.json()
                setNotification((notif) => ({
                    ...notif,
                    msg: data.message || 'Erreur lors de l\'inscription.',
                    type: 'error',
                    shown: true
                }))
            }
        } catch (error) {
            setNotification((notif) => ({
                ...notif,
                msg: `Error # ${error.message}`,
                type: 'error',
                shown: true
            }))
        }
    }

    const handleCancel = async () => {
        try {
            const response = await fetch('/api/inscriptions/cancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ etudiantID: session.id, formationID: formation.id }),
            })

            if (response.ok) {
                setNotification((notif) => ({
                    ...notif,
                    msg: `Demande d\'inscription annulée !`,
                    type: 'info',
                    shown: true
                }))
                setTimeout(() => {
                    window.location.reload()
                }, 500)
            } else {
                const data = await response.json()
                setNotification((notif) => ({
                    ...notif,
                    msg: data.message || 'Erreur lors de l\'annulation.',
                    type: 'error',
                    shown: true
                }))
            }
        } catch (error) {
            setNotification((notif) => ({
                ...notif,
                msg: `Error # ${error.message}`,
                type: 'error',
                shown: true
            }))
        }
    }

    const handleQuit = async () => {
         try {
            const response = await fetch('/api/inscriptions/quit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ etudiantID: session.id, formationID: formation.id }),
            })

            if (response.ok) {
                setNotification((notif) => ({
                    ...notif,
                    msg: `Inscription quittée !`,
                    type: 'info',
                    shown: true
                }))
                setTimeout(() => {
                    window.location.reload()
                }, 500)
            } else {
                const data = await response.json()
                setNotification((notif) => ({
                    ...notif,
                    msg: data.message || 'Erreur lors de l\'opération.',
                    type: 'error',
                    shown: true
                }))
            }
        } catch (error) {
            setNotification((notif) => ({
                ...notif,
                msg: `Error # ${error.message}`,
                type: 'error',
                shown: true
            }))
        }
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
                    <h1 className="text-3xl font-bold text-gray-800">{formation.titre}</h1>
                    <div className="flex items-center justify-center mt-2">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                        <Moon className="text-amber-800 mx-4 w-4 h-4" />
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                    </div>
                </div>
                <p className="text-gray-600 mt-4 max-w-xl mx-auto">Détails de la formation {formation.categorie}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-full pb-16">
                <div className="md:col-span-2">
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden p-8 relative mb-8">
                        <div className="absolute right-0 top-0 w-24 h-24 opacity-10 rotate-45">
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <path d="M50 0L60 40H100L70 65L80 100L50 80L20 100L30 65L0 40H40L50 0Z" fill="currentColor" />
                            </svg>
                        </div>

                        <div className="relative mb-10">
                            <div className="flex items-center mb-4">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-md">
                                    <Info className="w-4 h-4 text-white" />
                                </div>
                                <h2 className="text-xl font-bold ml-3 text-gray-800">Description</h2>
                            </div>
                            <div className="pl-11">
                                <p className="text-gray-700 leading-relaxed">
                                    {formation.descr}
                                </p>
                            </div>
                        </div>

                        <div className="relative mb-10">
                            <div className="flex items-center mb-4">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-md">
                                    <BookOpen className="w-4 h-4 text-white" />
                                </div>
                                <h2 className="text-xl font-bold ml-3 text-gray-800">Contenu de la formation</h2>
                            </div>
                            <div className="pl-11 space-y-4">
                                {formation.duree &&
                                    <div className="flex items-center bg-amber-50 px-4 py-3 rounded-lg">
                                        <Clock className="w-5 h-5 text-amber-700 mr-3" />
                                        <span className="text-gray-700">{formation.duree} Mois</span>
                                    </div>
                                }
                                <div className="flex items-center bg-amber-50 px-4 py-3 rounded-lg">
                                    <Calendar className="w-5 h-5 text-amber-700 mr-3" />
                                    <span className="text-gray-700">Date début: {formation.created_At}</span>
                                </div>
                                <div className="flex items-center bg-amber-50 px-4 py-3 rounded-lg">
                                    <Users className="w-5 h-5 text-amber-700 mr-3" />
                                    <span className="text-gray-700">{etudiants.length} étudiant{etudiants.length > 1 && 's'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="flex items-center mb-4">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-md">
                                    <Tag className="w-4 h-4 text-white" />
                                </div>
                                <h2 className="text-xl font-bold ml-3 text-gray-800">Tags</h2>
                            </div>
                            <div className="pl-11">
                                <div className="flex flex-wrap gap-2">
                                    {(formation.tags || []).map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-block bg-amber-50 text-amber-800 px-4 py-2 rounded-full border border-amber-200 text-sm"
                                        >
                                            {tag.nom}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1">
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden sticky top-6">
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={formation.img}
                                alt={formation.titre}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            {formation.inscrit === 'inscrit' && (
                                <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 text-sm font-medium rounded-full shadow-md flex items-center">
                                    <Check className="w-4 h-4 mr-1" />
                                    Inscrit
                                </div>
                            )}
                            {formation.inscrit === 'enattente' && (
                                <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1.5 text-sm font-medium rounded-full shadow-md flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    Inscrit
                                </div>
                            )}
                            <div className="absolute bottom-0 left-0 p-4 w-full">
                                <div className="flex justify-between items-center">
                                    <div className="bg-gradient-to-r from-amber-600 to-amber-800 text-white px-3 py-1 rounded-full font-medium shadow-md flex items-center">
                                        <span>{formation.prix} DH</span>
                                    </div>
                                    <div className="flex space-x-1 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                                        {formation.type === "Avie" ?
                                            <Navigation className="w-3 h-3" /> :
                                            formation.type === "Niveaux" ?
                                                <TrendingUp className="w-3 h-3" /> :
                                                <Flag className="w-3 h-3" />
                                        }
                                        <span className="text-xs">{formation.type}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-5">Aperçu</h3>

                            <div className="space-y-4 mb-8">
                                {formation.duree &&
                                    <div className="flex items-center justify-between py-2 border-b border-dashed border-amber-200">
                                        <div className="flex items-center">
                                            <Clock className="w-5 h-5 text-amber-700 mr-2" />
                                            <span className="text-gray-700">Durée</span>
                                        </div>
                                        <span className="font-medium text-gray-800">{formation.duree} mois</span>
                                    </div>
                                }
                                <div className="flex items-center justify-between py-2 border-b border-dashed border-amber-200">
                                    <div className="flex items-center">
                                        <Users className="w-5 h-5 text-amber-700 mr-2" />
                                        <span className="text-gray-700">Étudiants</span>
                                    </div>
                                    <span className="font-medium text-gray-800">{etudiants.length}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-dashed border-amber-200">
                                    <div className="flex items-center">
                                        <DollarSign className="w-5 h-5 text-amber-700 mr-2" />
                                        <span className="text-gray-700">Prix</span>
                                    </div>
                                    <span className="font-medium text-gray-800">{formation.prix} DH</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-dashed border-amber-200">
                                    <div className="flex items-center">
                                        <Tag className="w-5 h-5 text-amber-700 mr-2" />
                                        <span className="text-gray-700">Catégorie</span>
                                    </div>
                                    <span className="font-medium text-gray-800">{formation.categorie}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-dashed border-amber-200">
                                    <div className="flex items-center">
                                        <User className="w-5 h-5 text-amber-700 mr-2" />
                                        <span className="text-gray-700">Genre</span>
                                    </div>
                                    <span className="font-medium text-gray-800">{formation.genre}</span>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-4">
                                {formation.inscrit === 'enattente' &&
                                    <span className='text-xs underline text-amber-600 self-end cursor-pointer' onClick={handleCancel}>Annuler</span>
                                }
                                {formation.inscrit === 'inscrit' &&
                                    <span className='text-xs underline text-amber-600 self-end cursor-pointer' onClick={handleQuit}>Quitter</span>
                                }
                                <button
                                    className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                                    onClick={handleJoin}
                                    disabled={formation.inscrit === 'inscrit' || formation.inscrit === 'enattente' || !session}
                                >
                                    {!session
                                        ? <Lock className="w-4 h-4 mr-2" />
                                        : formation.inscrit === 'inscrit'
                                            ? <Check className="w-4 h-4 mr-2" />
                                            : formation.inscrit === 'enattente'
                                                ? <Clock className="w-4 h-4 mr-2" />
                                                : <Plus className="w-4 h-4 mr-2" />
                                    }
                                    <span className="font-medium">{!session ? "Créez un compte d'abord" : formation.inscrit === 'inscrit' ? 'Déjà inscrit' : formation.inscrit === 'enattente' ? 'Inscription en attente de validation' : "S'inscrire maintenant"}</span>
                                </button>

                                <button
                                    className="w-full py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center cursor-pointer"
                                    onClick={() => setActiveTab('formations')}
                                >
                                    <ArrowRight className="w-4 h-4 mr-2" />
                                    <span className="font-medium">Retour aux formations</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Details