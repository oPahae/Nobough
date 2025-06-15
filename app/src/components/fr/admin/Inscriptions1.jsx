import {
    Search, Filter, Users, Clock, Navigation, Flag, TrendingUp,
    Tag, DollarSign, BookOpen, User, Bookmark, Check, FileText, X,
    ArrowRight, Heart, Star, ChevronDown, Grid, List, Mail, Phone, Calendar, Info,
    CreditCard, AlertCircle, CheckCircle, ChevronRight, FileCheck, UserCheck, UserX,
    Sparkles, Moon
} from 'lucide-react'
import { useEffect, useState } from 'react'
import React from 'react'

const Inscriptions1 = ({ inscriptions, setNotification, fetchInscriptions }) => {
    const [showRefuseReason, setShowRefuseReason] = useState({})
    const [refuseReason, setRefuseReason] = useState({})

    const toggleRefuseReason = (id) => {
        setShowRefuseReason(prev => ({ ...prev, [id]: !prev[id] }))
    }

    ////////////////////////////////////////////////////////////////////////

    const handleValiderInscription = async (id, email) => {
        try {
            const response = await fetch('/api/adhesions/validerInscription', {
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
                envoyerEmail('valider', email, `${window.location.href.split('://')[1].split('/')[0]}/fr/Etudiant/Paiement?id=${id}`)
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
            const response = await fetch('/api/adhesions/refuserInscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, reason }),
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
                <p className="text-gray-600 mt-4 max-w-xl mx-auto">Validez ou refusez les demandes d'inscription des nouveaux membres</p>
            </div>

            <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-amber-100">
                <div className="p-6 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-amber-100/40">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-md">
                            <UserCheck className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold ml-3 text-amber-900">Nouvelles inscriptions ({inscriptions ? inscriptions.length : 0})</h2>
                    </div>
                </div>

                <div className="divide-y divide-amber-100">
                    {inscriptions && inscriptions.length > 0 && inscriptions.map((inscription) => (
                        <div key={inscription.id} className="p-6 relative transition-all hover:bg-amber-50/40">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div className="flex mb-4 sm:mb-0">
                                    <div className="relative">
                                        {inscription.img &&
                                            <img
                                                src={atob(inscription.img.split('base64,')[1])}
                                                alt={inscription.prenom}
                                                className="w-16 h-16 rounded-full object-cover border-2 border-amber-200 shadow-md"
                                            />
                                        }
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center border border-amber-300">
                                            <User className="w-3 h-3 text-amber-700" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-amber-800">
                                            {inscription.prenom} {inscription.nom}
                                        </h3>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="w-3 h-3 mr-1 text-amber-700" />
                                            Inscrit le {inscription.created_At}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 w-full sm:w-auto">
                                    <button
                                        className="py-2 px-4 flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center cursor-pointer"
                                        onClick={() => handleValiderInscription(inscription.id, inscription.email)}
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        <span className="font-medium">Valider</span>
                                    </button>
                                    {showRefuseReason[inscription.id] ? (
                                        <div className="flex items-center flex-1 sm:flex-none">
                                            <input
                                                type="text"
                                                className="py-2 px-4 border border-amber-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 mr-2 w-full"
                                                placeholder="Raison du refus..."
                                                onChange={(e) => setRefuseReason({ ...refuseReason, [inscription.id]: e.target.value })}
                                                value={refuseReason[inscription.id] || ""}
                                            />
                                            <button
                                                className="py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center cursor-pointer disabled:opacity-50"
                                                onClick={() => handleRefuserInscription(inscription.id, inscription.email, refuseReason[inscription.id])}
                                                disabled={!refuseReason[inscription.id]}
                                            >
                                                <span className="font-medium">Confirmer</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="py-2 px-4 flex-1 sm:flex-none bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center cursor-pointer"
                                            onClick={() => toggleRefuseReason(inscription.id)}
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            <span className="font-medium">Refuser</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <details className="mt-6">
                                <summary className="cursor-pointer focus:outline-none">
                                    <div className="flex items-center text-amber-700 font-medium py-2 px-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                                        <Info className="w-4 h-4 mr-2" />
                                        Voir détails de l'inscription
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </div>
                                </summary>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-amber-50/40 rounded-xl border border-amber-100">
                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <h4 className="font-medium text-amber-800 mb-3 flex items-center">
                                            <User className="w-4 h-4 mr-2" />
                                            Informations personnelles
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center">
                                                <span className="font-medium text-sm text-gray-700 sm:w-1/3">Nom complet:</span>
                                                <span className="text-gray-600 sm:w-2/3">{inscription.prenom} {inscription.nom}</span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center">
                                                <span className="font-medium text-sm text-gray-700 sm:w-1/3">Date de naissance:</span>
                                                <span className="text-gray-600 sm:w-2/3">{inscription.birth}</span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center">
                                                <span className="font-medium text-sm text-gray-700 sm:w-1/3">CIN:</span>
                                                <span className="text-gray-600 sm:w-2/3">{inscription.cin}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <h4 className="font-medium text-amber-800 mb-3 flex items-center">
                                            <Phone className="w-4 h-4 mr-2" />
                                            Coordonnées
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center">
                                                <span className="font-medium text-sm text-gray-700 sm:w-1/3">Email:</span>
                                                <span className="text-gray-600 sm:w-2/3">{inscription.email}</span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center">
                                                <span className="font-medium text-sm text-gray-700 sm:w-1/3">Téléphone:</span>
                                                <span className="text-gray-600 sm:w-2/3">{inscription.tel}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-sm">
                                        <h4 className="font-medium text-amber-800 mb-3 flex items-center">
                                            <FileText className="w-4 h-4 mr-2" />
                                            Biographie
                                        </h4>
                                        <p className="text-gray-600 text-sm bg-amber-50/80 p-4 rounded-lg border border-amber-100">
                                            {inscription.bio}
                                        </p>
                                    </div>
                                </div>
                            </details>
                        </div>
                    ))}

                    {(!inscriptions || inscriptions.length === 0) && (
                        <div className="p-16 text-center">
                            <div className="bg-amber-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                                <UserX className="w-8 h-8 text-amber-300" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-amber-900">Aucune inscription en attente</h3>
                            <p className="text-gray-600">Il n'y a pas de nouvelles demandes d'inscription à traiter pour le moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Inscriptions1