import {
    Search, Filter, Users, Clock, Navigation, Flag, TrendingUp,
    Tag, DollarSign, BookOpen, User, Bookmark, Check, FileText, X,
    ArrowRight, Heart, Star, ChevronDown, Grid, List, Mail, Phone, Calendar, Info,
    CreditCard, AlertCircle, CheckCircle, ChevronRight, FileCheck, UserCheck, UserX,
    Book, GraduationCap, School, Award, Layers, Moon, Sparkles
} from 'lucide-react'
import React, { useState } from 'react'

const Inscriptions2 = ({ inscriptions, setNotification, fetchInscriptions }) => {
    const [showRefuseReason, setShowRefuseReason] = useState({})
    const [refuseReason, setRefuseReason] = useState({})

    const toggleRefuseReason = (id) => {
        setShowRefuseReason(prev => ({ ...prev, [id]: !prev[id] }))
    }

    ////////////////////////////////////////////////////////////////////////

    const handleValiderInscription = async (id, email, prix) => {
        try {
            const response = await fetch('/api/inscriptions/validerInscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            })

            if (response.ok) {
                setNotification((notif) => ({
                    ...notif,
                    msg: `Inscription #${id} validée avec succès !`,
                    type: 'success',
                    shown: true
                }))
                fetchInscriptions()
                envoyerEmail('valider', email, `${window.location.href.split('://')[1].split('/')[0]}/fr/Etudiant/PaiementPremierMois?id=${id}&prix=${prix}`)
            } else {
                const data = await response.json()
                setNotification((notif) => ({
                    ...notif,
                    msg: data.message || 'Erreur lors de la validation de l\'inscription.',
                    type: 'error',
                    shown: true
                }))
            }
        } catch (error) {
            setNotification((notif) => ({
                ...notif,
                msg: 'Une erreur est survenue. Veuillez réessayer plus tard.',
                type: 'success',
                shown: true
            }))
        }
    }

    const handleRefuserInscription = async (id, email, reason) => {
        try {
            const response = await fetch('/api/inscriptions/refuserInscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            })

            if (response.ok) {
                setNotification({
                    msg: `Inscription #${id} refusée : ${reason}`,
                    type: 'info'
                })
                setNotification((notif) => ({ ...notif, shown: true }))
                setShowRefuseReason(prev => ({ ...prev, [id]: false }))
                fetchInscriptions()
                envoyerEmail('refuser', email, reason)
            } else {
                const data = await response.json()
                setNotification({
                    msg: data.message || 'Erreur lors du refus de l\'inscription.',
                    type: 'error'
                })
                setNotification((notif) => ({ ...notif, shown: true }))
            }
        } catch (error) {
            setNotification({
                msg: 'Une erreur est survenue. Veuillez réessayer plus tard.',
                type: 'error'
            })
            setNotification((notif) => ({ ...notif, shown: true }))
        }
    }

    const envoyerEmail = async (type, email, param2) => {
        try {
            const res = await fetch(`/api/_mail/${type}Inscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: type === 'valider' ? JSON.stringify({ email, lien: param2 }) : JSON.stringify({ email, raison: param2 }),
            })

            const data = await res.json()

            if (res.ok) {
                console.log('Email envoyé avec succès !')
            } else {
                console.error('Erreur:', data)
            }
        } catch (error) {
            console.error('Erreur réseau:', error)
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
                    <h1 className="text-3xl font-bold text-gray-800">Gestion des inscriptions</h1>
                    <div className="flex items-center justify-center mt-2">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                        <Moon className="text-amber-800 mx-4 w-4 h-4" />
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                    </div>
                </div>
                <p className="text-gray-600 mt-4 max-w-xl mx-auto">Suivez et gérez les demandes d'inscription à vos formations</p>
            </div>

            <div className="space-y-6 max-w-6xl mx-auto">
                {inscriptions.map((inscription) => (
                    <div key={inscription.id} className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-2xl group relative border border-amber-100">
                        <div className="flex flex-col sm:flex-row justify-between p-6 relative">
                            <div className="flex mb-4 sm:mb-0">
                                <img
                                    src={atob(inscription.img.split(',')[1])}
                                    alt={`${inscription.prenom} ${inscription.nom}`}
                                    className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-amber-200 shadow-md"
                                />
                                <div>
                                    <h3 className="text-lg text-amber-800 font-semibold">
                                        {inscription.prenom} {inscription.nom}
                                    </h3>
                                    <p className="text-gray-600 text-sm">Inscrit le {new Date(inscription.created_At).toLocaleDateString('FR-fr')}</p>
                                    <div className="flex items-center mt-1 text-amber-700">
                                        <Book className="w-4 h-4 mr-1" />
                                        <ArrowRight className="w-3 h-3 mx-1" />
                                        <span className="font-medium">{inscription.formationTitre}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    className="py-3 px-6 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center"
                                    onClick={() => handleValiderInscription(inscription.id, inscription.email, inscription.formationPrix)}
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    <span className="font-medium">Valider</span>
                                </button>
                                {showRefuseReason[inscription.id] ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            className="py-3 px-4 border border-amber-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700"
                                            placeholder="Entrez la raison"
                                            onChange={(e) => setRefuseReason({ ...refuseReason, [inscription.id]: e.target.value })}
                                            value={refuseReason[inscription.id] || ""}
                                        />
                                        <button
                                            className="py-3 px-6 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center"
                                            onClick={() => handleRefuserInscription(inscription.id, inscription.email, refuseReason[inscription.id])}
                                            disabled={!refuseReason[inscription.id]}
                                        >
                                            <span className="font-medium">Confirmer</span>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="py-3 px-6 bg-gradient-to-r from-gray-200 to-gray-400 text-black rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center"
                                        onClick={() => toggleRefuseReason(inscription.id)}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        <span className="font-medium">Refuser</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        <details className="px-6 pb-6 border-t border-amber-200">
                            <summary className="py-3 cursor-pointer focus:outline-none text-amber-700 font-medium flex items-center justify-between">
                                <div className="flex items-center">
                                    <Info className="w-4 h-4 mr-2" />
                                    Voir détails de l'inscription
                                </div>
                                <ChevronRight className="w-5 h-5 transition-transform" />
                            </summary>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-100">
                                    <h4 className="font-semibold text-amber-800 mb-3 flex items-center">
                                        <User className="w-4 h-4 mr-2 text-amber-700" />
                                        Informations personnelles
                                    </h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center">
                                            <User className="w-4 h-4 text-amber-700 mr-2" />
                                            <span className="font-medium text-gray-700">Nom complet:</span>
                                            <span className="ml-2 text-gray-600">{inscription.prenom} {inscription.nom}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 text-amber-700 mr-2" />
                                            <span className="font-medium text-gray-700">Date de naissance:</span>
                                            <span className="ml-2 text-gray-600">{new Date(inscription.birth).toLocaleDateString('FR-fr')}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FileCheck className="w-4 h-4 text-amber-700 mr-2" />
                                            <span className="font-medium text-gray-700">CIN:</span>
                                            <span className="ml-2 text-gray-600">{inscription.cin}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-100">
                                    <h4 className="font-semibold text-amber-800 mb-3 flex items-center">
                                        <Mail className="w-4 h-4 mr-2 text-amber-700" />
                                        Coordonnées
                                    </h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center">
                                            <Mail className="w-4 h-4 text-amber-700 mr-2" />
                                            <span className="font-medium text-gray-700">Email:</span>
                                            <span className="ml-2 text-gray-600">{inscription.email}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Phone className="w-4 h-4 text-amber-700 mr-2" />
                                            <span className="font-medium text-gray-700">Téléphone:</span>
                                            <span className="ml-2 text-gray-600">{inscription.tel}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <h4 className="font-semibold text-amber-800 mb-3 flex items-center">
                                        <Layers className="w-4 h-4 mr-2 text-amber-700" />
                                        Détails de la formation
                                    </h4>
                                    <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm">
                                        <div className="flex items-center mb-3">
                                            <Book className="w-5 h-5 text-amber-700 mr-2" />
                                            <h5 className="font-semibold text-amber-800">{inscription.formationTitre}</h5>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="col-span-2 flex items-center bg-amber-50 px-4 py-3 rounded-lg">
                                                <DollarSign className="w-4 h-4 text-amber-700 mr-2" />
                                                <span className="font-medium text-gray-700">Prix:</span>
                                                <span className="ml-2 text-gray-600">{inscription.formationPrix}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </details>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Inscriptions2