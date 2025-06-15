import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'

import Programme from '../../../components/fr/etudiant/Programme'
import Chat from '../../../components/fr/etudiant/Chat'
import Biblio from '../../../components/fr/etudiant/Biblio'
import Formateur from '../../../components/fr/etudiant/Formateur'
import Etudiants from '../../../components/fr/etudiant/Etudiants'
import Loading from '@/utils/Loading'

export default function Formation({ session, setActiveTab }) {
    const [activeTab2, setActiveTab2] = useState('programme')
    const [formation, setFormation] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [formationID, setFormationID] = useState('')

    useEffect(() => {
        const temp = sessionStorage.getItem('etudier')
        if (!temp) setActiveTab('formations')
        else setFormationID(temp)
    }, [])

    useEffect(() => {
        const fetchFormation = async () => {
            if (!formationID) return
            try {
                setIsLoading(true)
                const response = await fetch(`/api/formation/getOne?formationID=${formationID}`)
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération de la formation')
                }
                const data = await response.json()

                const formattedFormation = {
                    id: data.id,
                    titre: data.titre,
                    description: data.description,
                    img: data.img ? `data:image/jpeg;base64,${Buffer.from(data.img).toString('base64')}` : "/formation.jpg",
                    formateur: data.formateur,
                    duree: data.duree,
                    etudiants: data.etudiants,
                    prix: data.prix,
                    categorie: data.categorie,
                    type: data.type,
                    tags: data.tags || [],
                    inscrit: data.inscrit || false,
                    genre: data.genre,
                    createdAt: data.created_At,
                    salle: data.salle,
                    programme: data.programme || []
                }
                console.log(formattedFormation)

                setFormation(formattedFormation)
            } catch (error) {
                console.error('Erreur lors de la récupération de la formation:', error)
                setError(error.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchFormation()
    }, [formationID, session])

    if (isLoading) {
        return (
            <div className='w-screen flex justify-center items-center maxtop'>
                <Loading />
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
                <Link href="/formations" className="text-amber-600 hover:text-amber-800 underline">
                    Retour à la liste des formations
                </Link>
            </div>
        )
    }

    if (!formation) {
        return (
            <div className="max-w-5xl mx-auto p-8 text-center">
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md mb-4">
                    <h2 className="text-amber-700 font-medium">Formation introuvable</h2>
                    <p className="text-amber-600">La formation demandée n'existe pas ou a été supprimée.</p>
                </div>
                <Link href="/formations" className="text-amber-600 hover:text-amber-800 underline">
                    Retour à la liste des formations
                </Link>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>{formation.titre} - Académie Nobough</title>
                <link rel="icon" href="/logo2-nobg.png" />
            </Head>

            <div className="max-w-full">
                <Programme programme={formation.programme} />
                <Chat formationID={formationID} session={session} />
                <Biblio formationID={formationID} />
                <Formateur formationID={formationID} />
                <Etudiants formationID={formationID} />
            </div>
        </>
    )
}