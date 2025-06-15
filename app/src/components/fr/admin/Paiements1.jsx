import {
    Search, Filter, Users, Clock, Navigation, Flag, TrendingUp,
    Tag, DollarSign, BookOpen, User, Bookmark, Check, FileText, X,
    ArrowRight, Heart, Star, ChevronDown, Grid, List, Mail, Phone, Calendar, Info,
    CreditCard, AlertCircle, CheckCircle, ChevronRight, FileCheck, UserCheck, UserX,
    Moon, Sparkles
} from 'lucide-react'
import { useState } from 'react'
import React from 'react'

const Paiements1 = ({ setSelectedImage, paiements, setNotification, fetchPaiements }) => {
    const [showRefuseReasonPaiement, setShowRefuseReasonPaiement] = useState({})
    const [refuseReasonPaiement, setRefuseReasonPaiement] = useState({})

    const toggleRefuseReasonPaiement = (id) => {
        setShowRefuseReasonPaiement(prev => ({ ...prev, [id]: !prev[id] }))
    }

    ///////////////////////////////////////////////////////////////

    const handleValiderPaiement = async (id, email) => {
        try {
            const response = await fetch('/api/adhesions/validerPaiement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            })

            if (response.ok) {
                setNotification((notif) => ({
                    ...notif,
                    msg: `Paiement #${id} validé avec succès !`,
                    type: 'success',
                    shown: true
                }))
                fetchPaiements()
                envoyerEmail('valider', email, `${window.location.href.split('://')[1].split('/')[0]}/fr/Etudiant`)
            } else {
                const data = await response.json()
                setNotification((notif) => ({
                    ...notif,
                    msg: data.message || 'Erreur lors de la validation du paiement.',
                    type: 'error',
                    shown: true
                }))
            }
        } catch (error) {
            setNotification((notif) => ({
                ...notif,
                msg: 'Une erreur est survenue. Veuillez réessayer plus tard.',
                type: 'error',
                shown: true
            }))
        }
    }

    const handleRefuserPaiement = async (id, email, raison) => {
        try {
            const response = await fetch('/api/adhesions/refuserPaiement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, raison }),
            })

            if (response.ok) {
                setNotification((notif) => ({
                    ...notif,
                    msg: `Paiement #${id} refusé : ${raison}`,
                    type: 'info',
                    shown: true
                }))
                setShowRefuseReasonPaiement(prev => ({ ...prev, [id]: false }))
                fetchPaiements()
                envoyerEmail('refuser', email, raison)
            } else {
                const data = await response.json()
                setNotification((notif) => ({
                    ...notif,
                    msg: data.message || 'Erreur lors du refus du paiement.',
                    type: 'error',
                    shown: true
                }))
                setNotification((notif) => ({ ...notif, shown: true }))
            }
        } catch (error) {
            setNotification((notif) => ({
                ...notif,
                msg: 'Une erreur est survenue. Veuillez réessayer plus tard.',
                type: 'error',
                shown: true
            }))
        }
    }

    const envoyerEmail = async (type, email, param2) => {
        try {
            const res = await fetch(`/api/_mail/${type}Paiement`, {
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
        <>
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
                        <h1 className="text-3xl font-bold text-gray-800">Gestion des paiements</h1>
                        <div className="flex items-center justify-center mt-2">
                            <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                            <Moon className="text-amber-800 mx-4 w-4 h-4" />
                            <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                        </div>
                    </div>
                    <p className="text-gray-600 mt-4 max-w-xl mx-auto">Validation des transactions et gestion des demandes de paiement</p>
                </div>

                <div className="max-w-6xl mx-auto pb-16">
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-amber-100 mb-8">
                        <div className="relative flex items-center justify-center p-6 bg-gradient-to-r from-amber-50 to-amber-100">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-md mr-4">
                                <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-amber-800">Nouveaux paiements ({paiements.length})</h2>
                        </div>

                        <div className="space-y-6 p-6">
                            {paiements.map((paiement) => (
                                <div key={paiement.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-amber-100 hover:shadow-lg">
                                    <div className="flex flex-col sm:flex-row justify-between p-6 relative">
                                        <div className="flex mb-4 sm:mb-0">
                                            {paiement.img &&
                                                <img
                                                    src={atob(paiement.img.split('base64,')[1])}
                                                    alt={`${paiement.prenom} ${paiement.nom}`}
                                                    className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-amber-200"
                                                />
                                            }
                                            <div>
                                                <h3 className="text-lg text-amber-800 font-semibold">
                                                    {paiement.prenom} {paiement.nom}
                                                </h3>
                                                <p className="text-gray-600 text-sm flex items-center">
                                                    <Calendar className="w-4 h-4 mr-1 text-amber-600" />
                                                    Paiement du {paiement.created_At}
                                                </p>
                                                <p className="font-medium text-amber-600 flex items-center mt-1">
                                                    <DollarSign className="w-4 h-4 mr-1" />
                                                    {paiement.montant} DH
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <button
                                                className="py-2 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center"
                                                onClick={() => handleValiderPaiement(paiement.id, paiement.email)}
                                            >
                                                <Check className="w-4 h-4 mr-2" />
                                                <span className="font-medium">Valider</span>
                                            </button>
                                            {showRefuseReasonPaiement[paiement.id] ? (
                                                <div className="flex items-center">
                                                    <input
                                                        type="text"
                                                        className="py-2 px-4 border border-amber-200 rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                        placeholder="Entrez la raison"
                                                        onChange={(e) => setRefuseReasonPaiement({ ...refuseReasonPaiement, [paiement.id]: e.target.value })}
                                                        value={refuseReasonPaiement[paiement.id] || ""}
                                                    />
                                                    <button
                                                        className="py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center"
                                                        onClick={() => handleRefuserPaiement(paiement.id, paiement.email, refuseReasonPaiement[paiement.id])}
                                                        disabled={!refuseReasonPaiement[paiement.id]}
                                                    >
                                                        <span className="font-medium">Confirmer</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    className="py-2 px-4 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center"
                                                    onClick={() => toggleRefuseReasonPaiement(paiement.id)}
                                                >
                                                    <X className="w-4 h-4 mr-2" />
                                                    <span className="font-medium">Refuser</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <details className="px-6 pb-6 border-t border-amber-100">
                                        <summary className="py-3 cursor-pointer focus:outline-none text-amber-700 font-medium flex items-center">
                                            <div className="flex items-center w-full">
                                                <Info className="w-4 h-4 mr-2" />
                                                <span>Voir détails du paiement</span>
                                                <ChevronRight className="w-4 h-4 ml-2 text-amber-600" />
                                                <div className="ml-auto h-px w-1/2 bg-gradient-to-r from-transparent to-amber-200"></div>
                                            </div>
                                        </summary>
                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-amber-50/50 p-4 rounded-xl">
                                                <h4 className="font-medium text-amber-800 mb-3 flex items-center">
                                                    <User className="w-4 h-4 mr-2" />
                                                    Informations personnelles
                                                </h4>
                                                <div className="space-y-3 text-sm">
                                                    <div className="flex items-center">
                                                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                                                            <User className="w-3 h-3 text-amber-700" />
                                                        </div>
                                                        <span className="font-medium text-gray-700">Nom complet:</span>
                                                        <span className="ml-2 text-gray-600">{paiement.prenom} {paiement.nom}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                                                            <Calendar className="w-3 h-3 text-amber-700" />
                                                        </div>
                                                        <span className="font-medium text-gray-700">Date de naissance:</span>
                                                        <span className="ml-2 text-gray-600">{paiement.birth}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                                                            <FileCheck className="w-3 h-3 text-amber-700" />
                                                        </div>
                                                        <span className="font-medium text-gray-700">CIN:</span>
                                                        <span className="ml-2 text-gray-600">{paiement.cin}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-amber-50/50 p-4 rounded-xl">
                                                <h4 className="font-medium text-amber-800 mb-3 flex items-center">
                                                    <Phone className="w-4 h-4 mr-2" />
                                                    Coordonnées
                                                </h4>
                                                <div className="space-y-3 text-sm">
                                                    <div className="flex items-center">
                                                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                                                            <Mail className="w-3 h-3 text-amber-700" />
                                                        </div>
                                                        <span className="font-medium text-gray-700">Email:</span>
                                                        <span className="ml-2 text-gray-600">{paiement.email}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                                                            <Phone className="w-3 h-3 text-amber-700" />
                                                        </div>
                                                        <span className="font-medium text-gray-700">Téléphone:</span>
                                                        <span className="ml-2 text-gray-600">{paiement.tel}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-amber-50/50 p-4 rounded-xl">
                                                <h4 className="font-medium text-amber-800 mb-3 flex items-center">
                                                    <DollarSign className="w-4 h-4 mr-2" />
                                                    Détails du paiement
                                                </h4>
                                                <div className="space-y-3 text-sm">
                                                    <div className="flex items-center">
                                                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                                                            <DollarSign className="w-3 h-3 text-amber-700" />
                                                        </div>
                                                        <span className="font-medium text-gray-700">Montant:</span>
                                                        <span className="ml-2 text-amber-600 font-medium">{paiement.montant} DH</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                                                            <Calendar className="w-3 h-3 text-amber-700" />
                                                        </div>
                                                        <span className="font-medium text-gray-700">Date:</span>
                                                        <span className="ml-2 text-gray-600">{new Date(paiement.created_At).toLocaleDateString('fr-FR')}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium flex items-center mb-2">
                                                            <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                                                                <FileText className="w-3 h-3 text-amber-700" />
                                                            </span>
                                                            Message:
                                                        </p>
                                                        <p className="text-gray-600 ml-8 bg-white p-3 rounded-lg border border-amber-100">{paiement.msg}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-amber-50/50 p-4 rounded-xl">
                                                <h4 className="font-medium text-amber-800 mb-3 flex items-center">
                                                    <FileCheck className="w-4 h-4 mr-2" />
                                                    Preuve de transaction
                                                </h4>
                                                {paiement.preuve &&
                                                    <img
                                                        src={'data:image/jpeg;base64,' + atob(paiement.preuve.split('base64,')[1])}
                                                        alt="Preuve de transaction"
                                                        className="border border-amber-200 rounded-lg w-full max-w-xs cursor-pointer shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                                                        onClick={() => setSelectedImage('data:image/jpeg;base64,' + atob(paiement.preuve.split('base64,')[1]))}
                                                    />
                                                }
                                            </div>
                                        </div>
                                    </details>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Paiements1