import {
    Search, Filter, Users, Clock, Navigation, Flag, TrendingUp,
    Tag, PlusCircle, BookOpen, User, Bookmark, Check, FileText,
    ArrowRight, Heart, Star, ChevronDown, Grid, List, Mail, Phone,
    Calendar, Info, MessageCircle, Library, Book, Video, File, Download,
    MapPin, Sparkles, Moon, Image,
    DoorClosed
} from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'

const Biblio = ({ formationID, session }) => {
    const [docs, setDocs] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filterOpen, setFilterOpen] = useState(false)
    const [filters, setFilters] = useState({
        type: 'tous',
    })
    const [filteredDocuments, setFilteredDocuments] = useState([])
    const [showAddForm, setShowAddForm] = useState(false)
    const [newDoc, setNewDoc] = useState({
        titre: '',
        descr: '',
        file: null
    })
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setNewDoc({
                ...newDoc,
                file: file
            })
        }
    }

    const getFileIcon = (type) => {
        switch (type) {
            case 'pdf':
                return <FileText className="w-8 h-8 text-amber-700" />
            case 'image':
                return <Image className="w-8 h-8 text-amber-700" />
            case 'video':
                return <Video className="w-8 h-8 text-amber-700" />
            case 'archive':
                return <File className="w-8 h-8 text-amber-700" />
            default:
                return <FileText className="w-8 h-8 text-amber-700" />
        }
    }

    const handleDownload = (documentContenu, documentTitle) => {
        console.log(documentContenu)
        const link = document.createElement('a')
        link.href = documentContenu
        link.download = documentTitle
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase()
        setSearchQuery(query)

        const filtered = docs.filter(document => {
            const matchQuery = document.titre.toLowerCase().includes(query) || document.descr.toLowerCase().includes(query)
            const matchType = filters.type === 'tous' || document.type === filters.type
            return matchQuery && matchType
        })
        setFilteredDocuments(filtered)
    }

    const handleFilterChange = (filterType, value) => {
        setFilters({
            ...filters,
            [filterType]: value
        })
    }

    useEffect(() => {
        if (docs && docs.length > 0) {
            const filtered = docs.filter(document => {
                const matchQuery = searchQuery === '' ||
                    document.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    document.descr.toLowerCase().includes(searchQuery.toLowerCase())
                const matchType = filters.type === 'tous' || document.type === filters.type
                return matchQuery && matchType
            })
            setFilteredDocuments(filtered)
        }
    }, [filters, searchQuery, docs])

    const cancelFilters = () => {
        setFilters({
            type: 'tous',
        })
        setFilterOpen(false)
    }

    const fileTypes = [...new Set(docs.map(document => document.type))]

    const PatternDecoration = () => (
        <div className="absolute right-0 top-0 w-24 h-24 opacity-10 rotate-45 z-0">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0L60 40H100L70 65L80 100L50 80L20 100L30 65L0 40H40L50 0Z" fill="currentColor" />
            </svg>
        </div>
    )

    const getMimeType = (type) => {
        const mimeMap = {
            'pdf': 'application/pdf',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'txt': 'text/plain',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'mp4': 'video/mp4',
            'mp3': 'audio/mpeg',
        };
        return mimeMap[type.toLowerCase()] || 'application/octet-stream';
    }

    ///////////////////////////////////////////////////////////

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const response = await fetch(`/api/formation/getDocs?formationID=${formationID}`)

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des documents')
                }

                const data = await response.json()
                const formattedDocs = data.map(doc => ({
                    ...doc,
                    created_At: new Date(doc.created_At).toISOString(),
                    contenu: doc.contenu
                        ? `data:${getMimeType(doc.type)};base64,${Buffer.from(doc.contenu).toString('base64')}`
                        : null
                }));

                setDocs(formattedDocs)
                setFilteredDocuments(formattedDocs)
            } catch (error) {
                console.error('Erreur lors de la récupération des documents:', error)
                setError(error.message)
            }
        }

        fetchDocs()
    }, [formationID])

    const handleAddDoc = async (e) => {
        e.preventDefault()
        if (!newDoc.titre || !newDoc.file) {
            setNotification((notif) => ({
                ...notif,
                msg: 'Veuillez remplir tous les champs obligatoires',
                type: 'info',
                shown: true
            }))
            return
        }

        setIsUploading(true)
        setUploadProgress(0)

        try {
            const formData = new FormData()
            formData.append('titre', newDoc.titre)
            formData.append('descr', newDoc.descr)
            formData.append('file', newDoc.file)
            formData.append('formationID', formationID)

            const response = await fetch('/api/formation/addDoc', {
                method: 'POST',
                body: formData,
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    )
                    setUploadProgress(percentCompleted)
                }
            })

            if (response.ok) {
                const newDocument = await response.json()
                setDocs(prev => [...prev, newDocument])
                setFilteredDocuments(prev => [...prev, newDocument])
                setNewDoc({
                    titre: '',
                    descr: '',
                    file: null
                })
                setShowAddForm(false)
            } else {
                const errorData = await response.json()
                setNotification((notif) => ({
                    ...notif,
                    msg: `Erreur: ${errorData.message}`,
                    type: 'success',
                    shown: true
                }))
            }
        } catch (error) {
            setNotification((notif) => ({
                ...notif,
                msg: 'Error # ' + error,
                type: 'error',
                shown: true
            }))
        } finally {
            setIsUploading(false)
            setUploadProgress(0)
        }
    }

    const handleDeleteDoc = async (docID) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
            setIsDeleting(true)
            try {
                const response = await fetch('/api/formation/deleteDoc', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ docID }),
                })

                if (response.ok) {
                    setDocs(prev => prev.filter(doc => doc.id !== docID))
                    setFilteredDocuments(prev => prev.filter(doc => doc.id !== docID))
                } else {
                    const errorData = await response.json()
                    setNotification((notif) => ({
                        ...notif,
                        msg: `Erreur: ${errorData.message}`,
                        type: 'error',
                        shown: true
                    }))
                }
            } catch (error) {
                setNotification((notif) => ({
                    ...notif,
                    msg: 'Error # ' + error,
                    type: 'error',
                    shown: true
                }))
            } finally {
                setIsDeleting(false)
            }
        }
    }

    return (
        <div className="max-w-full relative">
            {/* btn ajout */}
            <div className="mb-8 flex justify-end">
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center"
                >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    <span className="font-medium">Ajouter un document</span>
                </button>
            </div>

            {/* Ajout */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
                        <div className="p-6 border-b border-amber-100">
                            <h2 className="text-xl font-bold text-amber-800">Ajouter un document</h2>
                            <p className="text-sm text-gray-600 mt-1">Remplissez les informations du document à ajouter</p>
                        </div>

                        <form onSubmit={handleAddDoc} className="p-6">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Titre du document *
                                    </label>
                                    <input
                                        type="text"
                                        value={newDoc.titre}
                                        onChange={(e) => setNewDoc({ ...newDoc, titre: e.target.value })}
                                        className="w-full p-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description (optionnelle)
                                    </label>
                                    <textarea
                                        value={newDoc.descr}
                                        onChange={(e) => setNewDoc({ ...newDoc, descr: e.target.value })}
                                        className="w-full p-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        rows="3"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fichier *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-md file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-amber-50 file:text-amber-700
                                            hover:file:bg-amber-100"
                                            required
                                        />
                                        {newDoc.file && (
                                            <div className="mt-2 p-3 bg-amber-50 rounded-lg">
                                                <p className="text-sm text-gray-700">
                                                    Fichier sélectionné: {newDoc.file.name} ({Math.round(newDoc.file.size / 1024)} Ko)
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {isUploading && (
                                    <div className="mt-4">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-amber-600 h-2.5 rounded-full"
                                                style={{ width: `${uploadProgress}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Téléchargement en cours: {uploadProgress}%
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUploading}
                                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center disabled:opacity-50"
                                >
                                    {isUploading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        <>
                                            <PlusCircle className="w-4 h-4 mr-2" />
                                            Ajouter le document
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                    <h1 className="text-3xl font-bold text-gray-800">Bibliothèque de ressources</h1>
                    <div className="flex items-center justify-center mt-2">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                        <Moon className="text-amber-800 mx-4 w-4 h-4" />
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                    </div>
                </div>
                <p className="text-gray-600 mt-4 max-w-xl mx-auto">Accédez à une collection de ressources éducatives de qualité pour enrichir votre parcours d'apprentissage</p>
            </div>

            <div className="mb-8 relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-amber-700" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-4 border-0 rounded-xl bg-white/80 shadow-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700"
                    placeholder="Rechercher un document par titre, description..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <div className="absolute right-3 top-3">
                    <button
                        className="p-2 bg-amber-100 text-amber-800 rounded-lg flex items-center shadow-sm hover:bg-amber-200 transition-all"
                        onClick={() => setFilterOpen(!filterOpen)}
                    >
                        <Filter className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">Filtres</span>
                    </button>
                </div>
            </div>

            {filterOpen && (
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl mb-10 max-w-5xl mx-auto border border-amber-100">
                    <div className="flex items-center mb-6">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-md">
                            <Filter className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold ml-3 text-gray-800">Filtres avancés</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Type de document</label>
                            <div className="relative">
                                <select
                                    className="w-full p-3 pr-10 border border-amber-200 rounded-lg bg-white/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700 appearance-none"
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                >
                                    <option value="tous">Tous les types</option>
                                    {fileTypes.map((type, index) => (
                                        <option key={index} value={type}>{type}</option>
                                    ))}
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

            <div className="space-y-6 max-w-5xl mx-auto">
                {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((document) => (
                        <div key={document.id} className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-2xl group relative border border-amber-100">
                            <div className="p-6 relative">
                                <PatternDecoration />
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex items-center justify-center bg-amber-50 p-4 rounded-xl">
                                        {getFileIcon(document.type)}
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{document.titre}</h3>
                                        <p className="text-sm text-gray-600 mb-4">{document.descr}</p>
                                        <div className="flex flex-wrap gap-4 mb-4">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 text-amber-600 mr-2" />
                                                <span className="text-sm text-gray-700">{new Date(document.created_At).toLocaleDateString('FR-fr')}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FileText className="w-4 h-4 text-amber-600 mr-2" />
                                                <span className="text-sm text-gray-700">
                                                    {document.taille < 1024
                                                        ? `${document.taille} o`
                                                        : document.taille < 1024 * 1024
                                                            ? `${(document.taille / 1024).toFixed(2)} ko`
                                                            : `${(document.taille / (1024 * 1024)).toFixed(2)} mo`
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center bg-amber-50 px-2 py-1 rounded-md">
                                                <Tag className="w-4 h-4 text-amber-700 mr-1" />
                                                <span className="text-sm">{document.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            className="py-3 px-5 z-10 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center"
                                            onClick={() => handleDownload(document.contenu, document.titre, document.type)}
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            <span className="font-medium">Télécharger</span>
                                        </button>
                                        <button
                                            className="p-2 z-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                                            onClick={() => handleDeleteDoc(document.id)}
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600"></div>
                                            ) : (
                                                <DoorClosed className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-10 rounded-2xl shadow-md border border-amber-100 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-600/30 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-600/30 to-transparent"></div>

                        <Search className="w-16 h-16 text-amber-300 mx-auto mb-5" />
                        <h3 className="text-xl font-bold mb-3 text-amber-900">Aucun document trouvé</h3>
                        <p className="text-gray-600 mb-6">Aucun document ne correspond à vos critères de recherche.</p>
                        <button
                            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-xl hover:from-amber-700 hover:to-amber-900 transition-all cursor-pointer font-medium"
                            onClick={() => {
                                setSearchQuery('')
                                setFilters({
                                    type: 'tous',
                                })
                                setFilteredDocuments(docs)
                            }}
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Biblio