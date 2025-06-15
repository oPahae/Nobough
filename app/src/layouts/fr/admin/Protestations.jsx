import { useState, useEffect } from 'react'
import {
    ArrowDown, ArrowUp, AlertCircle, DollarSign,
    Calendar, FileText, Users, PieChart, Briefcase,
    Plus, Filter, Bell, Send, X
} from 'lucide-react'
import Loading from '@/utils/Loading'

export default function Protestations({ setNotification }) {
    const [protestations, setProtestations] = useState([])
    const [reponses, setReponses] = useState({})
    const [reponseEnCours, setReponseEnCours] = useState(null)
    const [x, y] = useState(true)

    const handleRepondre = (id) => {
        setReponseEnCours(id)
    }

    const handleAnnulerReponse = () => {
        setReponseEnCours(null)
    }

    const handleReponseChange = (id, message) => {
        setReponses(prev => ({
            ...prev,
            [id]: message
        }))
    }

    //////////////////////////////////////////////////////

    useEffect(() => {
        fetchProtestations()
    }, [])

    const fetchProtestations = async () => {
        try {
            const response = await fetch('/api/protestations/getAll')
            const data = await response.json()
            setProtestations(data || [])
            console.log(data)
        } catch (error) {
            console.error('Erreur lors de la récupération des protestations:', error)
        } finally {
            y(false)
        }
    }

    const handleEnvoyerReponse = async (id, email) => {
        const message = reponses[id]

        if (!message) {
            setNotification((notif) => ({
                ...notif,
                msg: 'Veuillez entrer un message de réponse',
                type: 'info',
                shown: true
            }))
            return
        }

        try {
            await fetch('/api/_mail/repondreProtestation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    message: message
                }),
            })

            const protestation = protestations.find(p => p.id === id)
            await fetch('/api/protestations/addFaq', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: protestation.message,
                    reponse: message
                }),
            })

            await fetch('/api/protestations/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            })

            setReponseEnCours(null)
            setNotification((notif) => ({
                ...notif,
                msg: `Réponse envoyée par email avec succès !`,
                type: 'success',
                shown: true
            }))
            fetchProtestations()
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la réponse:', error)
            setNotification((notif) => ({
                ...notif,
                msg: `Erreur lors de l'envoi de la réponse # ${error.message}`,
                type: 'error',
                shown: true
            }))
        }
    }

    if (x) {
        return (
            <div className='w-screen flex justify-center items-center maxtop'>
                <Loading />
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Protestations des étudiants / utilisateurs</h2>

                <div className="flex gap-2">
                    <button className="bg-white/50 backdrop-blur-xs shadow-xl p-2 rounded-md shadow-sm">
                        <Filter className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {protestations.map(protestation => (
                    <div key={protestation.id} className="bg-white/50 backdrop-blur-xs shadow-xl p-4 rounded-lg shadow">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{protestation.prenom} {protestation.nom}</h3>
                        </div>

                        <p className="text-gray-600 mb-3">{protestation.message}</p>

                        <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-gray-500">Reçue le {protestation.date}</span>
                            <span className="text-gray-500">{protestation.email}</span>
                        </div>

                        <div className="flex justify-end mt-2">
                            {reponseEnCours === protestation.id ? (
                                <div className="w-full mt-3">
                                    <textarea
                                        className="w-full p-2 border rounded-lg mb-2"
                                        placeholder="Entrez votre réponse ici..."
                                        value={reponses[protestation.id] || ''}
                                        onChange={(e) => handleReponseChange(protestation.id, e.target.value)}
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={handleAnnulerReponse}
                                            className="px-3 py-1 bg-gray-200 rounded-lg flex items-center"
                                        >
                                            <X className="w-4 h-4 mr-1" />
                                            Annuler
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleEnvoyerReponse(protestation.id, protestation.email)}
                                            className="px-3 py-1 bg-amber-600 text-white rounded-lg flex items-center"
                                        >
                                            <Send className="w-4 h-4 mr-1" />
                                            Envoyer
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => handleRepondre(protestation.id)}
                                    className="px-3 py-1 bg-amber-100 text-amber-800 rounded-lg flex items-center"
                                >
                                    <Send className="w-4 h-4 mr-1" />
                                    Répondre
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {protestations.length === 0 && (
                    <div className="bg-white/50 backdrop-blur-xs shadow-xl p-6 rounded-lg shadow text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">Aucune protestation à afficher pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    )
}