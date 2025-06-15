import {
    Search, Filter, Users, Clock, Navigation, Flag, TrendingUp,
    Tag, DollarSign, BookOpen, User, Bookmark, Check, FileText,
    ArrowRight, Heart, Star, ChevronDown, Grid, List, Mail, Phone, Calendar, Info
} from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Details from '../../../components/fr/etudiant/Details'
import Formateur from '../../../components/fr/etudiant/Formateur'
import Etudiants from '../../../components/fr/etudiant/Etudiants'
import Loading from '@/utils/Loading'

export default function Formation({ session, setActiveTab, setNotification }) {
    const [activeTab2, setActiveTab2] = useState('details')
    const [formation, setFormation] = useState(null)
    const [formateur, setFormateur] = useState(null)
    const [etudiants, setEtudiants] = useState([])
    const [formationID, setFormationID] = useState('')
    const [x, y] = useState(true)

    useEffect(() => {
        const temp = sessionStorage.getItem('formation')
        if (!temp) setActiveTab('formations')
        else setFormationID(temp)
    }, [])

    useEffect(() => {
        if (formationID === "") return
        const fetchFormationData = async () => {
            try {
                const response = await fetch(`/api/formations/getOne2?formationID=${formationID}&etudiantID=${session ? session.id : 0}`)
                const data = await response.json()

                const formattedFormation = {
                    ...data?.formation,
                    img: data?.formation?.img ? `data:image/jpeg;base64,${Buffer.from(data.formation.img).toString('base64')}` : "/formation.jpg",
                    tags: data?.tags || [],
                    created_At: data?.formation?.created_At ? new Date(data.formation.created_At).toLocaleDateString('fr-FR') : null
                }

                const formattedFormateur = {
                    ...data?.formateur,
                    img: data?.formateur?.img ? `data:image/jpeg;base64,${Buffer.from(data.formateur.img).toString('base64')}` : "/user.jpg",
                    specialites: data?.formateur?.specialites ? data.formateur.specialites.split(',') : []
                }

                let formattedEtudiants = []
                if (data.etudiants?.length > 0) {
                    formattedEtudiants = data?.etudiants.map(etudiant => ({
                        ...etudiant,
                        img: etudiant.img ? atob(Buffer.from(etudiant.img).toString('base64')) : null,
                        birth: new Date(etudiant.birth).toISOString(),
                        dateInscr: new Date(etudiant.created_At).toISOString()
                    }))
                }

                setFormation(formattedFormation || {})
                setFormateur(formattedFormateur || {})
                setEtudiants(formattedEtudiants || [])
                console.log(data)
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error)
            } finally {
                y(false)
            }
        }

        fetchFormationData()
    }, [formationID, session])

    if (x) {
        return (
            <div className='w-screen flex justify-center items-center maxtop'>
                <Loading />
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>{formation.titre} - Académie Nobough</title>
                <link rel="icon" href="/logo2-nobg.png" />
            </Head>

            <div className="max-w-full relative">
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

                {/* Banner */}
                <div className="relative h-64 md:h-80 lg:h-96 mb-8 overflow-hidden rounded-xl shadow-xl">
                    <img
                        src={formation.img}
                        alt={formation.titre}
                        className="w-full h-full object-cover transform transition-transform hover:scale-105 duration-700"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h1 className="text-3xl font-bold mb-2">{formation.titre}</h1>
                        <div className="flex flex-wrap gap-4 items-center">
                            <span className="flex items-center bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-sm">
                                <Tag className="w-4 h-4 mr-1" />
                                {formation.categorie}
                            </span>
                            {formation.duree &&
                                <span className="flex items-center bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-sm">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {formation.duree} mois
                                </span>
                            }
                            <span className="flex items-center bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-sm">
                                <Users className="w-4 h-4 mr-1" />
                                {formation.etudiants} étudiants
                            </span>
                            <span className="flex items-center bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-sm">
                                {formation.type === "Avie" ? (
                                    <Navigation className="w-4 h-4 mr-1" />
                                ) : formation.type === "Niveaux" ? (
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                ) : (
                                    <Flag className="w-4 h-4 mr-1" />
                                )}
                                {formation.type === "Avie" ? "À vie" : formation.type === "Niveaux" ? "Niveaux" : "Cycle"}
                            </span>
                        </div>
                    </div>
                    {formation.prix === 0 ? (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 text-sm font-medium rounded-full shadow-md">
                            Gratuit
                        </div>
                    ) : (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-600 to-amber-800 text-white px-3 py-1.5 text-sm font-medium rounded-full shadow-md">
                            {formation.prix} DH
                        </div>
                    )}
                    {formation.inscrit === 'inscrit' && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 text-sm font-medium rounded-full shadow-md flex items-center">
                            <Check className="w-4 h-4 mr-1" />
                            Inscrit
                        </div>
                    )}
                    {formation.inscrit === 'enattente' && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1.5 text-sm font-medium rounded-full shadow-md flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            En attente...
                        </div>
                    )}
                </div>

                {/* Nav */}
                <div className="max-w-5xl mx-auto mb-10">
                    <div className="flex justify-start md:justify-center border-b border-amber-200 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab2('details')}
                            className={`py-4 px-8 font-medium relative transition-all ${activeTab2 === 'details' ? 'text-amber-800' : 'text-gray-600 hover:text-amber-700'}`}
                        >
                            Détails
                            {activeTab2 === 'details' && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-700"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab2('formateur')}
                            className={`py-4 px-8 font-medium relative transition-all ${activeTab2 === 'formateur' ? 'text-amber-800' : 'text-gray-600 hover:text-amber-700'}`}
                        >
                            Formateur
                            {activeTab2 === 'formateur' && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-700"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab2('etudiants')}
                            className={`py-4 px-8 font-medium relative transition-all ${activeTab2 === 'etudiants' ? 'text-amber-800' : 'text-gray-600 hover:text-amber-700'}`}
                        >
                            Étudiants
                            {activeTab2 === 'etudiants' && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-700"></div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Main */}
                <main className="md:p-6 mb-8">
                    {activeTab2 === 'details' && formation && (
                        <Details session={session} setActiveTab={setActiveTab} formation={formation} etudiants={etudiants} setNotification={setNotification} />
                    )}

                    {activeTab2 === 'formateur' && formateur && (
                        <Formateur formationID={formationID} />
                    )}

                    {activeTab2 === 'etudiants' && (
                        <Etudiants formationID={formationID} />
                    )}
                </main>
            </div>
        </>
    )
}
