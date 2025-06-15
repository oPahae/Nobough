import {
    Search, Filter, Users, Clock, Navigation, Flag, TrendingUp,
    Tag, DollarSign, BookOpen, User, Bookmark, Check, FileText,
    ArrowRight, Heart, Star, ChevronDown, Grid, List, Moon, Sparkles
} from 'lucide-react'
import { useState, useEffect } from 'react'
import Loading from '@/utils/Loading'
import { categoriesFr } from '@/utils/Constants'

export default function Formations({ session, setActiveTab }) {
    const [formations, setFormations] = useState([])
    const [formateurs, setFormateurs] = useState([])
    const [activeTab2, setActiveTab2] = useState('grille')
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredFormations, setFilteredFormations] = useState([])
    const [filterOpen, setFilterOpen] = useState(false)
    const [filters, setFilters] = useState({
        categorie: 'tous',
        type: 'tous',
        formateur: 'tous',
        genre: 'tous'
    })
    const [x, y] = useState(true)
    const [xx, yy] = useState(true)

    useEffect(() => {
        if (formations && formations.length > 0) {
            setFilteredFormations(formations)
        }
    }, [formations])

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase()
        setSearchQuery(query)

        const filtered = formations.filter(formation => {
            const matchQuery = formation.titre.toLowerCase().includes(query) || formation.descr.toLowerCase().includes(query) || formation.tags.some(tag => tag.toLowerCase().includes(query))
            const matchCategorie = filters.categorie === 'tous' || formation.categorie === filters.categorie
            const matchType = filters.type === 'tous' || formation.type === filters.type
            const matchFormateur = filters.formateur === 'tous' || formation.formateurID == filters.formateur
            const matchGenre = filters.genre === 'tous' || formation.genre === filters.genre
            return matchQuery && matchCategorie && matchType && matchFormateur && matchGenre
        })
        setFilteredFormations(filtered)
    }

    const handleFilterChange = (filterType, value) => {
        setFilters({
            ...filters,
            [filterType]: value
        })
    }

    useEffect(() => {
        if (formations && formations.length > 0) {
            const filtered = formations.filter(formation => {
                const matchQuery = searchQuery === '' || formation.titre.toLowerCase().includes(searchQuery.toLowerCase()) || formation.descr.toLowerCase().includes(searchQuery.toLowerCase()) || formation.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                const matchCategorie = filters.categorie === 'tous' || formation.categorie === filters.categorie
                const matchType = filters.type === 'tous' || formation.type === filters.type
                const matchFormateur = filters.formateur === 'tous' || formation.formateurID == filters.formateur
                const matchGenre = filters.genre === 'tous' || formation.genre === filters.genre
                return matchQuery && matchCategorie && matchType && matchFormateur && matchGenre
            })
            setFilteredFormations(filtered)
        }
    }, [filters, searchQuery, formations])

    const cancelFilters = () => {
        setFilters({
            categorie: 'tous',
            type: 'tous',
            formateur: 'tous',
            genre: 'tous'
        })
        setFilterOpen(false)
    }

    const PatternDecoration = () => (
        <div className="absolute right-0 top-0 w-24 h-24 opacity-10 rotate-45">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0L60 40H100L70 65L80 100L50 80L20 100L30 65L0 40H40L50 0Z" fill="currentColor" />
            </svg>
        </div>
    )

    //////////////////////////////////////////////////////////

    useEffect(() => {
        fetchFormations()
        fetchProfs()
    }, [])

    const fetchFormations = async () => {
        try {
            const response = await fetch(`/api/formations/getAll2?etudiantID=${session?.id || 0}`)
            const data = await response.json()
            console.log(data)
            let formattedFormations = []

            if (data.length > 0) {
                formattedFormations = data.map(formation => ({
                    id: formation.id,
                    titre: formation.titre,
                    descr: formation.descr,
                    img: formation.img ? `data:image/jpeg;base64,${Buffer.from(formation.img).toString('base64')}` : "/formation.jpg",
                    prix: formation.prix,
                    duree: formation.duree,
                    etudiants: formation.etudiants,
                    formateur: formation.formateur,
                    formateurNom: formation.formateur_nom,
                    formateurPrenom: formation.formateur_prenom,
                    formateurID: formation.formateur_id,
                    categorie: formation.categorie,
                    type: formation.type,
                    tags: formation.tags || [],
                    inscrit: formation.inscrit || false
                }))
            }

            setFormations(formattedFormations)
            setFilteredFormations(formattedFormations)
        } catch (error) {
            console.error('Erreur lors de la récupération des formations:', error)
        } finally {
            y(false)
        }
    }

    const fetchProfs = async () => {
        try {
            const response = await fetch('/api/profs/getAll')
            const data = await response.json()
            setFormateurs(data)
        } catch (error) {
            console.error('خطأ أثناء استرجاع الأساتذة:', error)
        } finally {
            yy(false)
        }
    }

    if (x && xx) {
        return (
            <div className='w-screen flex justify-center items-center maxtop'>
                <Loading />
            </div>
        )
    }

    return (
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

            {/* Titre */}
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

            {/* Search */}
            <div className="mb-8 relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-amber-700" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-4 border-0 rounded-xl bg-white/80 shadow-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700"
                    placeholder="Rechercher une formation par nom, description ou tags..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <div className="absolute right-3 top-3 flex space-x-2">
                    <button
                        className="p-2 bg-amber-100 text-amber-800 rounded-lg flex items-center shadow-sm hover:bg-amber-200 transition-all"
                        onClick={() => setFilterOpen(!filterOpen)}
                    >
                        <Filter className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">Filtres</span>
                    </button>
                    <div className="flex bg-amber-100 rounded-lg shadow-sm">
                        <button
                            onClick={() => setActiveTab2('grille')}
                            className={`p-2 rounded-l-lg flex items-center ${activeTab2 === 'grille' ? 'bg-amber-700 text-white' : 'text-amber-800 hover:bg-amber-200'} transition-all`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setActiveTab2('liste')}
                            className={`p-2 rounded-r-lg flex items-center ${activeTab2 === 'liste' ? 'bg-amber-700 text-white' : 'text-amber-800 hover:bg-amber-200'} transition-all`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Filtres */}
            {filterOpen && (
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl mb-10 max-w-5xl mx-auto border border-amber-100">
                    <div className="flex items-center mb-6">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-md">
                            <Filter className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold ml-3 text-gray-800">Filtres avancés</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Catégorie */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Catégorie</label>
                            <div className="relative">
                                <select
                                    className="w-full p-3 pr-10 border border-amber-200 rounded-lg bg-white/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700 appearance-none"
                                    value={filters.categorie}
                                    onChange={(e) => handleFilterChange('categorie', e.target.value)}
                                >
                                    <option value="tous">Toutes les catégories</option>
                                    {categoriesFr.map((categorie, index) => (
                                        <option key={index} value={categorie}>{categorie}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <ChevronDown className="h-5 w-5 text-amber-700" />
                                </div>
                            </div>
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Type</label>
                            <div className="relative">
                                <select
                                    className="w-full p-3 pr-10 border border-amber-200 rounded-lg bg-white/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700 appearance-none"
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                >
                                    <option value="tous">Tous les types</option>
                                    <option value="Avie">À vie</option>
                                    <option value="Niveaux">Certificats aux niveaux</option>
                                    <option value="Cycle">Durée précise</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <ChevronDown className="h-5 w-5 text-amber-700" />
                                </div>
                            </div>
                        </div>

                        {/* Formateur */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Formateur</label>
                            <div className="relative">
                                <select
                                    className="w-full p-3 pr-10 border border-amber-200 rounded-lg bg-white/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700 appearance-none"
                                    value={filters.formateur}
                                    onChange={(e) => handleFilterChange('formateur', e.target.value)}
                                >
                                    <option value="tous">Tous les formateurs</option>
                                    {formateurs.map((formateur, index) => (
                                        <option key={index} value={formateur.id}>{formateur.nom + " " + formateur.prenom}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <ChevronDown className="h-5 w-5 text-amber-700" />
                                </div>
                            </div>
                        </div>

                        {/* Genre */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Genre</label>
                            <div className="relative">
                                <select
                                    className="w-full p-3 pr-10 border border-amber-200 rounded-lg bg-white/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700 appearance-none"
                                    value={filters.genre}
                                    onChange={(e) => handleFilterChange('genre', e.target.value)}
                                >
                                    <option value="tous">Tous les genres</option>
                                    <option value="Enfants">Enfants</option>
                                    <option value="préados">Préadolescents</option>
                                    <option value="Jeunes">Jeunes</option>
                                    <option value="Femmes">Femmes</option>
                                    <option value="Hommes">Hommes</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <ChevronDown className="h-5 w-5 text-amber-700" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center"
                            onClick={cancelFilters}
                        >
                            <span className="font-medium">Réinitialiser les filtres</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Nav */}
            {session &&
                <div className="max-w-5xl mx-auto mb-10">
                    <div className="flex justify-center border-b border-amber-200">
                        <button
                            onClick={() => setActiveTab2('grille')}
                            className={`py-4 px-8 font-medium relative transition-all ${activeTab2 === 'grille' || activeTab2 === 'liste' ? 'text-amber-800' : 'text-gray-600 hover:text-amber-700'}`}
                        >
                            Toutes les formations
                            {(activeTab2 === 'grille' || activeTab2 === 'liste') && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-700"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab2('mesCours')}
                            className={`py-4 px-8 font-medium relative transition-all ${activeTab2 === 'mesCours' ? 'text-amber-800' : 'text-gray-600 hover:text-amber-700'}`}
                        >
                            Mes formations
                            {activeTab2 === 'mesCours' && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-700"></div>
                            )}
                        </button>
                    </div>
                </div>
            }

            {/* Vue en grille améliorée */}
            {activeTab2 === 'grille' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto pb-16">
                    {filteredFormations.map((formation, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-2xl group relative">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={formation.img}
                                    alt={formation.titre}
                                    className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                {formation.inscrit && (
                                    <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 text-sm font-medium rounded-full shadow-md flex items-center">
                                        <Check className="w-4 h-4 mr-1" />
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
                                    {formation.tags.slice(0, 3).map((tag, i) => (
                                        <span key={i} className="inline-block bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full border border-gray-200">
                                            {tag}
                                        </span>
                                    ))}
                                    {formation.tags.length > 3 && (
                                        <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full border border-gray-200">
                                            +{formation.tags.length - 3}
                                        </span>
                                    )}
                                </div>
                                <button
                                    className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center cursor-pointer"
                                    onClick={() => { setActiveTab('formation'); sessionStorage.setItem('formation', formation.id) }}
                                >
                                    <span className="font-medium">Voir détails</span>
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab2 === 'mesCours' && (
                <div className="flex flex-col gap-8 bg-amber-50/40 px-6 py-8 rounded-2xl">
                    {/* Section Title with Islamic pattern decoration */}
                    <div className="relative flex items-center justify-center mb-2">
                        <div className="absolute left-0 w-1/4 h-px bg-gradient-to-r from-transparent to-amber-700/30"></div>
                        <h2 className="text-2xl font-bold text-amber-900 px-6">Mes Formations</h2>
                        <div className="absolute right-0 w-1/4 h-px bg-gradient-to-l from-transparent to-amber-700/30"></div>
                    </div>

                    {/* Enrolled Courses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredFormations.filter(f => f.inscrit).map((formation, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden border border-amber-100 hover:shadow-xl transition-shadow duration-300">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={formation.img}
                                        alt={formation.titre}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-0 right-0 bg-emerald-500 text-white px-3 py-1 m-3 rounded-full text-xs font-medium flex items-center">
                                        <Check className="w-3 h-3 mr-1" />
                                        Inscrit
                                    </div>
                                    {/* Islamic decorative element */}
                                    <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-amber-900/30 to-transparent"></div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-lg font-bold text-amber-900">{formation.titre}</h3>
                                    </div>
                                    <div className="flex items-center mb-4 text-gray-700">
                                        <User className="w-4 h-4 text-amber-700 mr-2" />
                                        <span className="text-sm">{formation.formateur}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center">
                                            {formation.duree && (
                                                <>
                                                    <Clock className="w-4 h-4 text-amber-600 mr-2" />
                                                    <span className="text-sm text-gray-700">{formation.duree} Mois</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="w-4 h-4 text-amber-600 mr-2" />
                                            <span className="text-sm text-gray-700">{formation.etudiants} étudiants</span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-1 mb-4 text-xs bg-amber-50 p-2 rounded-lg">
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
                                    </div>
                                    <button
                                        className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-xl hover:from-amber-700 hover:to-amber-900 transition-all flex items-center justify-center cursor-pointer font-medium"
                                        onClick={() => { setActiveTab('etudier'); sessionStorage.setItem('etudier', formation.id) }}
                                    >
                                        <span>Continuer</span>
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* No courses message with Islamic design elements */}
                    {filteredFormations.filter(f => f.inscrit).length === 0 && (
                        <div className="col-span-3 bg-white p-10 rounded-2xl shadow-md border border-amber-100 text-center relative overflow-hidden">
                            {/* Decorative Islamic patterns */}
                            <div className="absolute top-0 left-0 w-20 h-20 opacity-10">
                                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="currentColor" className="text-amber-900" d="M50,0 L100,50 L50,100 L0,50 Z"></path>
                                </svg>
                            </div>
                            <div className="absolute bottom-0 right-0 w-20 h-20 opacity-10">
                                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="currentColor" className="text-amber-900" d="M50,0 L100,50 L50,100 L0,50 Z"></path>
                                </svg>
                            </div>

                            <BookOpen className="w-16 h-16 text-amber-300 mx-auto mb-5" />
                            <h3 className="text-xl font-bold mb-3 text-amber-900">Aucune formation trouvée</h3>
                            <p className="text-gray-600 mb-6">Vous n'êtes inscrit à aucune formation correspondant à vos critères.</p>
                            <button
                                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-xl hover:from-amber-700 hover:to-amber-900 transition-all cursor-pointer font-medium"
                                onClick={() => setActiveTab2('grille')}
                            >
                                Explorer les formations
                            </button>
                        </div>
                    )}

                    {/* Recommended Courses with Islamic design */}
                    <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-amber-100 relative">
                        {/* Decorative Islamic corner elements */}
                        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-600/30 rounded-tl-2xl"></div>
                        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-amber-600/30 rounded-tr-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-amber-600/30 rounded-bl-2xl"></div>
                        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-amber-600/30 rounded-br-2xl"></div>

                        <h3 className="text-xl font-bold mb-8 text-amber-900 text-center">Formations recommandées pour vous</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {filteredFormations.filter(f => !f.inscrit).slice(0, 3).map((formation, index) => (
                                <div
                                    key={index}
                                    className="bg-amber-50/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
                                    onClick={() => { setActiveTab('formation'); sessionStorage.setItem('formation', formation.id) }}
                                >
                                    <div className="relative h-36 overflow-hidden">
                                        <img
                                            src={formation.img}
                                            alt={formation.titre}
                                            className="w-full h-full object-cover"
                                        />
                                        {formation.prix === 0 ? (
                                            <div className="absolute bottom-0 left-0 bg-emerald-500 text-white px-3 py-1 m-2 rounded-full text-xs font-medium">
                                                Gratuit
                                            </div>
                                        ) : (
                                            <div className="absolute bottom-0 left-0 bg-gradient-to-r from-amber-600 to-amber-800 text-white px-3 py-1 m-2 rounded-full text-xs font-medium">
                                                {formation.prix} DH
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-amber-900 mb-2">{formation.titre}</h4>
                                        <div className="flex items-center mb-3">
                                            <User className="w-3 h-3 text-amber-700 mr-1" />
                                            <span className="text-xs text-gray-600">{formation.formateur}</span>
                                        </div>
                                        <div className="flex space-x-1 mb-4 text-xs bg-white p-2 rounded-lg">
                                            {formation.type === "Avie" ? (
                                                <div className="flex items-center">
                                                    <Navigation className="w-3 h-3 text-amber-700 mr-1" />
                                                    <span className="text-gray-700">A vie</span>
                                                </div>
                                            ) : formation.type === "niveaux" ? (
                                                <div className="flex items-center">
                                                    <TrendingUp className="w-3 h-3 text-amber-700 mr-1" />
                                                    <span className="text-gray-700">Certificat par niveau</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <Flag className="w-3 h-3 text-amber-700 mr-1" />
                                                    <span className="text-gray-700">Certificat final</span>
                                                </div>
                                            )}
                                        </div>
                                        <button className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg hover:from-amber-700 hover:to-amber-900 transition-all flex items-center justify-center text-sm font-medium">
                                            <span>Détails</span>
                                            <ArrowRight className="w-3 h-3 ml-1" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* No results */}
            {filteredFormations.length === 0 && activeTab2 !== 'statistiques' && (
                <div className="bg-white p-10 rounded-2xl shadow-md border border-amber-100 text-center relative overflow-hidden">
                    {/* Decorative Islamic patterns */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-600/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-600/30 to-transparent"></div>

                    <Search className="w-16 h-16 text-amber-300 mx-auto mb-5" />
                    <h3 className="text-xl font-bold mb-3 text-amber-900">Aucune formation trouvée</h3>
                    <p className="text-gray-600 mb-6">Aucune formation ne correspond à vos critères de recherche.</p>
                    <button
                        className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-xl hover:from-amber-700 hover:to-amber-900 transition-all cursor-pointer font-medium"
                        onClick={() => {
                            setSearchQuery('')
                            setFilters({
                                categorie: 'tous',
                                type: 'tous',
                                formateur: 'tous',
                                genre: 'tous'
                            })
                            setFilteredFormations(formations)
                        }}
                    >
                        Réinitialiser les filtres
                    </button>
                </div>
            )}

            {/* List */}
            {activeTab2 === 'liste' && (
                <div className="space-y-6">
                    {filteredFormations.map((formation, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden border border-amber-100 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex flex-col md:flex-row">
                                <div className="relative md:w-64 h-48 md:h-auto overflow-hidden">
                                    <img
                                        src={formation.img}
                                        alt={formation.titre}
                                        className="w-full h-full object-cover"
                                    />
                                    {formation.inscrit && (
                                        <div className="absolute top-0 right-0 bg-emerald-500 text-white px-3 py-1 m-3 rounded-full text-xs font-medium flex items-center">
                                            <Check className="w-3 h-3 mr-1" />
                                            Inscrit
                                        </div>
                                    )}
                                    {formation.prix === 0 ? (
                                        <div className="absolute bottom-0 left-0 bg-emerald-500 text-white px-3 py-1 m-3 rounded-full text-xs font-medium">
                                            Gratuit
                                        </div>
                                    ) : (
                                        <div className="absolute bottom-0 left-0 bg-gradient-to-r from-amber-600 to-amber-800 text-white px-3 py-1 m-3 rounded-full text-xs font-medium">
                                            {formation.prix} DH
                                        </div>
                                    )}
                                    {/* Islamic decorative element */}
                                    <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-amber-900/30 to-transparent"></div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold text-amber-900">{formation.titre}</h3>
                                        <div className="flex space-x-1 bg-amber-50 p-2 rounded-lg">
                                            {formation.type === "Avie" ? (
                                                <div className="flex items-center">
                                                    <Navigation className="w-4 h-4 text-amber-700 mr-1" />
                                                    <span className="text-gray-700 text-sm">A vie</span>
                                                </div>
                                            ) : formation.type === "niveaux" ? (
                                                <div className="flex items-center">
                                                    <TrendingUp className="w-4 h-4 text-amber-700 mr-1" />
                                                    <span className="text-gray-700 text-sm">Certificat par niveau</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <Flag className="w-4 h-4 text-amber-700 mr-1" />
                                                    <span className="text-gray-700 text-sm">Certificat final</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                        {formation.descr}
                                    </p>
                                    <div className="flex items-center mb-4">
                                        <User className="w-4 h-4 text-amber-700 mr-2" />
                                        <span className="text-sm text-gray-700">{formation.formateur}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 mb-4">
                                        <div className="flex items-center">
                                            {formation.duree && (
                                                <>
                                                    <Clock className="w-4 h-4 text-amber-600 mr-2" />
                                                    <span className="text-sm text-gray-700">{formation.duree} Mois</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="w-4 h-4 text-amber-600 mr-2" />
                                            <span className="text-sm text-gray-700">{formation.etudiants} étudiants</span>
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
                                        <div className="flex items-center">
                                            <Tag className="w-4 h-4 text-amber-600 mr-2" />
                                            <span className="text-sm text-gray-700">{formation.categorie}</span>
                                        </div>
                                    </div>
                                    <div className="mb-5 flex flex-wrap gap-2">
                                        {formation.tags.map((tag, i) => (
                                            <span key={i} className="inline-block bg-amber-50 text-amber-800 text-xs px-3 py-1 rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <button
                                        className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-xl hover:from-amber-700 hover:to-amber-900 transition-all flex items-center justify-center cursor-pointer font-medium"
                                        onClick={() => { setActiveTab('formation'); sessionStorage.setItem('formation', formation.id) }}
                                    >
                                        <span>Voir détails</span>
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}