import {
    Users, Clock, Navigation, Flag, TrendingUp,
    User, ArrowRight, Sparkles, Moon, Edit, Trash, PlusCircle,
    Download
} from 'lucide-react'
import { useState, useEffect, use } from 'react'
import Loading from '@/utils/Loading'

export default function Formations({ setActiveTab }) {
    const [formations, setFormations] = useState([])
    const [filteredFormations, setFilteredFormations] = useState([])
    const [x, y] = useState(true)

    useEffect(() => {
        if (formations && formations.length > 0) {
            setFilteredFormations(formations)
        }
    }, [formations])

    const PatternDecoration = () => (
        <div className="absolute right-0 top-0 w-24 h-24 opacity-10 rotate-45">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0L60 40H100L70 65L80 100L50 80L20 100L30 65L0 40H40L50 0Z" fill="currentColor" />
            </svg>
        </div>
    )

    ///////////////////////////////////////////////////////////

    useEffect(() => {
        fetchFormations()
    }, [])

    const fetchFormations = async () => {
        try {
            const response = await fetch('/api/formations/getAll')
            const data = await response.json()
            console.log(data)
            let formationsWithImages = []

            if (data.length > 0) {
                formationsWithImages = data.map(formation => {
                    if (formation.img) {
                        const buffer = formation.img.data
                        const base64Image = Buffer.from(buffer).toString('base64')
                        const imageUrl = `data:image/jpeg;base64,${base64Image}`
                        return { ...formation, img: imageUrl }
                    }
                    return formation
                })
            }

            setFormations(formationsWithImages)
        } catch (error) {
            console.error('Erreur lors de la récupération des formations:', error)
        } finally {
            y(false)
        }
    }

    const handleDelete = async (id) => {
        if(!confirm('Vous êtes sûres ?')) return
        try {
            const response = await fetch('/api/formations/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            })

            if (response.ok) {
                const updatedFormations = formations.filter(formation => formation.id !== id)
                setFormations(updatedFormations || [])
                setFilteredFormations(updatedFormations || [])
            } else {
                const data = await response.json()
                console.error('Erreur lors de la suppression:', data.message)
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error)
        }
    }

    const handleDownload = async () => {
        try {
            const response = await fetch('/api/_backups/formations');

            if (!response.ok) {
                throw new Error('Erreur de connexion');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'formations.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading the file:', error);
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
        <div className="max-w-full relative">
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
                    <h1 className="text-3xl font-bold text-gray-800">Catalogue des formations</h1>
                    <div className="flex items-center justify-center mt-2">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                        <Moon className="text-amber-800 mx-4 w-4 h-4" />
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                    </div>
                </div>
                <p className="text-gray-600 mt-4 max-w-xl mx-auto">Enrichissez votre parcours spirituel et personnel avec nos formations exclusives</p>
            </div>

            {/* Bouton d'ajout de formation */}
            <div className="flex justify-center mb-8 gap-6">
                <button
                    onClick={() => setActiveTab('ajouterFormation')}
                    className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform flex items-center"
                >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Ajouter</span>
                </button>

                <button
                    onClick={handleDownload}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                    <Download className="w-5 h-5" />
                </button>
            </div>

            {/* Vue en grille avec boutons de modification et suppression */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto pb-16">
                {filteredFormations.map((formation, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl group relative">
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={formation.img || "/formation.jpg"}
                                alt={formation.titre}
                                className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute top-3 left-3 flex space-x-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        sessionStorage.setItem('modifierFormation', formation.id)
                                        setActiveTab('modifierFormation');
                                    }}
                                    className="bg-amber-500 text-white p-2 rounded-full shadow-md hover:bg-amber-600 transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(formation.id);
                                    }}
                                    className="bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors"
                                >
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="absolute bottom-0 left-0 p-4 w-full">
                                <div className="flex justify-between items-center">
                                    {formation.prix === 0 ? (
                                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full font-medium shadow-md">
                                            Gratuit
                                        </div>
                                    ) : (
                                        <div className="bg-gradient-to-r from-amber-600 to-amber-800 text-white px-3 py-1 rounded-full font-medium shadow-md flex items-center">
                                            <span>{formation.prix} DH</span>
                                        </div>
                                    )}
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
                        <div className="p-6 relative">
                            <PatternDecoration />
                            <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight">{formation.titre}</h3>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {formation.descr}
                            </p>
                            <div className="flex items-center mb-4">
                                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                                    <User className="w-4 h-4 text-amber-700" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">{formation.formateur}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    {formation.duree &&
                                        <div className="flex items-center bg-amber-50 px-2 py-1 rounded-md">
                                            <Clock className="w-4 h-4 text-amber-700 mr-1" />
                                            <span className="text-sm">{formation.duree} Mois</span>
                                        </div>
                                    }
                                </div>
                                {formation.type === "Avie" ? (
                                    <div className="flex items-center">
                                        <Navigation className="w-4 h-4 text-amber-700 mr-1" />
                                        <span className="text-gray-700">A vie, pas de certificat</span>
                                    </div>
                                ) : formation.type === "Niveaux" ? (
                                    <div className="flex items-center">
                                        <TrendingUp className="w-4 h-4 text-amber-700 mr-1" />
                                        <span className="text-gray-700">Certificat à chaque niveau</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <Flag className="w-4 h-4 text-amber-700 mr-1" />
                                        <span className="text-gray-700">Certificat à la fin</span>
                                    </div>
                                )}
                                <div className="flex items-center bg-amber-50 px-2 py-1 rounded-md">
                                    <Users className="w-4 h-4 text-amber-700 mr-1" />
                                    <span className="text-sm">{formation.etudiants} étudiants</span>
                                </div>
                            </div>
                            <div className="mb-6 flex flex-wrap gap-1.5">
                                {formation.tags && formation.tags.slice(0, 3).map((tag, i) => (
                                    <span key={i} className="inline-block bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full border border-gray-200">
                                        {tag}
                                    </span>
                                ))}
                                {formation.tags && formation.tags.length > 3 && (
                                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full border border-gray-200">
                                        +{formation.tags.length - 3}
                                    </span>
                                )}
                            </div>
                            <button
                                className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center cursor-pointer"
                                onClick={() => setActiveTab('formation')}
                            >
                                <span className="font-medium">Voir détails</span>
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
