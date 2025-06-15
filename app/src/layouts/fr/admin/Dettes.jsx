import { useState, useEffect, useRef } from 'react'
import {
    ArrowDown, ArrowUp, AlertCircle, DollarSign,
    Calendar, FileText, Users, PieChart, Briefcase,
    Plus, Filter, Bell, Edit, Trash2, X, Clock,
    TrendingDown, AlertTriangle
} from 'lucide-react'

export default function ({ dettes, setDettes, setActiveTab }) {
    const [filterPeriod, setFilterPeriod] = useState('dernier-mois')
    const [selectedDate, setSelectedDate] = useState(null)
    const [showFilterPopup, setShowFilterPopup] = useState(false)
    const [newDette, setNewDette] = useState({
        titre: '',
        montant: '',
        remarque: '',
        deadline: ''
    })
    const filterButtonRef = useRef(null)
    const filterPopupRef = useRef(null)

    const filterDataByDate = (data, date) => {
        if (!date) return data
        const [year, month] = date.split('-')
        return data.filter(item => {
            const itemDate = item.created_At.split('-')
            return itemDate[0] === year && itemDate[1] === month
        })
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (filterPopupRef.current && !filterPopupRef.current.contains(event.target) &&
                filterButtonRef.current && !filterButtonRef.current.contains(event.target)) {
                setShowFilterPopup(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const filteredDettes = filterDataByDate(dettes, selectedDate)

    /////////////////////////////////////////////////////////

    const handleDeleteDette = async (id) => {
        try {
            const response = await fetch('/api/finance/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ table: 'Dettes', id }),
            });

            if (response.ok) {
                setDettes(prev => prev.filter(item => item.id !== id));
            } else {
                const data = await response.json();
                setErrors({ submit: data.message || 'Erreur lors de la suppression du revenu' });
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du revenu:', error);
            setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer plus tard.' });
        }
    }

    // Calculer les statistiques
    const totalAmount = filteredDettes.reduce((sum, item) => sum + (typeof item.montant === 'string' ? parseFloat(item.montant) : item.montant), 0)
    const overdueDebts = filteredDettes.filter(dette => new Date(dette.deadline) < new Date())
    const upcomingDebts = filteredDettes.filter(dette => {
        const deadline = new Date(dette.deadline)
        const today = new Date()
        const daysDiff = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
        return daysDiff <= 7 && daysDiff >= 0
    })

    return (
        <div className="min-h-screen bg-gradient-to-br pt-4 pb-16">
            {/* Header avec statistiques */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
                    <div className="mb-4 lg:mb-0">
                        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-800 via-orange-700 to-amber-900 bg-clip-text text-transparent">
                            Gestion des Dettes
                        </h1>
                        <p className="text-amber-600 mt-2 flex items-center">
                            <TrendingDown className="w-4 h-4 mr-2" />
                            Suivez et gérez vos obligations financières
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <div className="relative">
                            <button
                                ref={filterButtonRef}
                                className="group bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 font-medium"
                                onClick={() => setShowFilterPopup(!showFilterPopup)}
                            >
                                <Filter className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                Filtrer par période
                            </button>

                            {showFilterPopup && (
                                <FilterPopup 
                                    filterPopupRef={filterPopupRef} 
                                    selectedDate={selectedDate} 
                                    setSelectedDate={setSelectedDate} 
                                    setShowFilterPopup={setShowFilterPopup} 
                                />
                            )}
                        </div>

                        <button
                            className="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 font-medium"
                            onClick={() => setActiveTab('ajouterDette')}
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            Nouvelle Dette
                        </button>
                    </div>
                </div>

                {/* Cartes de statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-100/50 hover:shadow-xl transition-all duration-300 group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-amber-600 text-sm font-medium">Total des Dettes</p>
                                <p className="text-2xl font-bold text-amber-900">{totalAmount.toLocaleString()} DH</p>
                            </div>
                            <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <DollarSign className="w-6 h-6 text-amber-700" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-red-100/50 hover:shadow-xl transition-all duration-300 group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-600 text-sm font-medium">Dettes en Retard</p>
                                <p className="text-2xl font-bold text-red-900">{overdueDebts.length}</p>
                            </div>
                            <div className="bg-gradient-to-br from-red-100 to-red-200 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <AlertTriangle className="w-6 h-6 text-red-700" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-yellow-100/50 hover:shadow-xl transition-all duration-300 group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-600 text-sm font-medium">Échéances Proches</p>
                                <p className="text-2xl font-bold text-yellow-900">{upcomingDebts.length}</p>
                            </div>
                            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <Clock className="w-6 h-6 text-yellow-700" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-100/50 hover:shadow-xl transition-all duration-300 group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-amber-600 text-sm font-medium">Nombre Total</p>
                                <p className="text-2xl font-bold text-amber-900">{filteredDettes.length}</p>
                            </div>
                            <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <FileText className="w-6 h-6 text-amber-700" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tableau principal */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-amber-100/50">
                <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 p-6 border-b border-amber-100/50">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-amber-900 mb-2">
                                Liste des Dettes
                            </h2>
                            {selectedDate && (
                                <div className="flex items-center text-amber-700 bg-amber-100/50 px-4 py-2 rounded-xl backdrop-blur-sm">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span className="font-medium">Période sélectionnée: {selectedDate}</span>
                                    <button
                                        onClick={() => setSelectedDate(null)}
                                        className="ml-3 text-amber-600 hover:text-amber-800 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center mt-4 lg:mt-0">
                            <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-2xl">
                                <TrendingDown className="w-8 h-8 text-amber-700" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-amber-100/50">
                        <thead className="bg-gradient-to-r from-amber-50 to-orange-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Titre
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Date de Création
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-2" />
                                        Échéance
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">
                                    Remarque
                                </th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-amber-800 uppercase tracking-wider">
                                    <div className="flex items-center justify-end">
                                        <DollarSign className="w-4 h-4 mr-2" />
                                        Montant
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-amber-800 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-amber-100/30">
                            {filteredDettes.length > 0 ? (
                                filteredDettes.map((dette, index) => (
                                    <DetteLine 
                                        key={dette.id} 
                                        dette={dette} 
                                        index={index} 
                                        setActiveTab={setActiveTab} 
                                        handleDeleteDette={handleDeleteDette} 
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-6 rounded-3xl mb-4">
                                                <AlertCircle className="w-12 h-12 text-amber-400" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-amber-900 mb-2">
                                                Aucune dette trouvée
                                            </h3>
                                            <p className="text-amber-600 mb-4">
                                                {selectedDate ? 'Aucune dette pour cette période' : 'Commencez par ajouter votre première dette'}
                                            </p>
                                            {selectedDate ? (
                                                <button
                                                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5"
                                                    onClick={() => setSelectedDate(null)}
                                                >
                                                    Réinitialiser le filtre
                                                </button>
                                            ) : (
                                                <button
                                                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5"
                                                    onClick={() => setActiveTab('ajouterDette')}
                                                >
                                                    Ajouter une dette
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {filteredDettes.length > 0 && (
                    <div className="bg-gradient-to-r from-amber-50/80 via-orange-50/80 to-amber-50/80 backdrop-blur-sm p-6 border-t border-amber-100/50">
                        <div className="flex flex-col lg:flex-row justify-between items-center">
                            <div className="flex items-center space-x-6 mb-4 lg:mb-0">
                                <div className="flex items-center bg-white/60 px-4 py-2 rounded-xl">
                                    <FileText className="w-5 h-5 text-amber-600 mr-2" />
                                    <span className="text-amber-800 font-medium">{filteredDettes.length} dette(s)</span>
                                </div>
                                {overdueDebts.length > 0 && (
                                    <div className="flex items-center bg-red-100/60 px-4 py-2 rounded-xl">
                                        <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                                        <span className="text-red-800 font-medium">{overdueDebts.length} en retard</span>
                                    </div>
                                )}
                            </div>
                            <div className="text-right">
                                <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-2xl">
                                    <span className="text-amber-700 text-sm font-medium block mb-1">MONTANT TOTAL</span>
                                    <span className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-red-700 bg-clip-text text-transparent">
                                        {totalAmount.toLocaleString()} DH
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function FilterPopup({ filterPopupRef, selectedDate, setSelectedDate, setShowFilterPopup }) {
    return (
        <div
            ref={filterPopupRef}
            className="absolute right-0 top-full mt-3 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl z-20 w-80 border border-amber-200/50 overflow-hidden"
        >
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 border-b border-amber-100/50">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-amber-900 flex items-center">
                        <Filter className="w-5 h-5 mr-2" />
                        Filtrer par période
                    </h3>
                    <button
                        onClick={() => setShowFilterPopup(false)}
                        className="p-2 hover:bg-amber-100 rounded-xl transition-colors duration-200"
                    >
                        <X className="w-5 h-5 text-amber-600" />
                    </button>
                </div>
            </div>
            <div className="p-6">
                <label className="block text-sm font-medium text-amber-800 mb-3">
                    Sélectionner le mois et l'année
                </label>
                <input
                    type="month"
                    className="w-full border-2 border-amber-200 bg-white/70 p-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 font-medium"
                    onChange={(e) => setSelectedDate(e.target.value)}
                    value={selectedDate || ''}
                />
                <div className="flex justify-between gap-3 mt-6">
                    <button
                        className="flex-1 px-4 py-3 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5"
                        onClick={() => {
                            setSelectedDate(null)
                            setShowFilterPopup(false)
                        }}
                    >
                        Réinitialiser
                    </button>
                    <button
                        className="flex-1 px-4 py-3 text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5"
                        onClick={() => setShowFilterPopup(false)}
                    >
                        Appliquer
                    </button>
                </div>
            </div>
        </div>
    )
}

function DetteLine({ dette, index, setActiveTab, handleDeleteDette }) {
    const isOverdue = new Date(dette.deadline) < new Date()
    const isUpcoming = () => {
        const deadline = new Date(dette.deadline)
        const today = new Date()
        const daysDiff = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
        return daysDiff <= 7 && daysDiff >= 0
    }

    return (
        <tr className={`group hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50 transition-all duration-300 ${
            index % 2 === 0 ? 'bg-white/30' : 'bg-amber-50/20'
        }`}>
            <td className="px-6 py-5 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                        <FileText className="w-4 h-4 text-amber-700" />
                    </div>
                    <div className="text-sm font-bold text-gray-900">{dette.label}</div>
                </div>
            </td>
            <td className="px-6 py-5 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-700 bg-amber-50/50 px-3 py-2 rounded-lg">
                    <Calendar className="w-4 h-4 mr-2 text-amber-600" />
                    {new Date(dette.created_At).toLocaleDateString('FR-fr')}
                </div>
            </td>
            <td className="px-6 py-5 whitespace-nowrap">
                <span className={`px-4 py-2 inline-flex text-sm leading-5 font-bold rounded-xl border-2 ${
                    isOverdue
                        ? 'bg-red-100 text-red-800 border-red-200'
                        : isUpcoming()
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        : 'bg-green-100 text-green-800 border-green-200'
                }`}>
                    {isOverdue && <AlertTriangle className="w-4 h-4 mr-1" />}
                    {isUpcoming() && <Clock className="w-4 h-4 mr-1" />}
                    {new Date(dette.deadline).toLocaleDateString('FR-fr')}
                </span>
            </td>
            <td className="px-6 py-5">
                <div className="text-sm text-gray-600 bg-gray-50/50 px-3 py-2 rounded-lg max-w-xs truncate">
                    {dette.descr || 'Aucune remarque'}
                </div>
            </td>
            <td className="px-6 py-5 whitespace-nowrap text-right">
                <span className="px-4 py-2 inline-flex text-lg leading-6 font-bold rounded-xl bg-gradient-to-r from-red-100 to-red-200 text-red-900 border-2 border-red-200">
                    {dette.montant} DH
                </span>
            </td>
            <td className="px-6 py-5 whitespace-nowrap text-center">
                <div className="flex items-center justify-center space-x-2">
                    <button
                        className="group/btn p-3 bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        onClick={() => { setActiveTab('modifierDette'); sessionStorage.setItem('dette', dette.id) }}
                        title="Modifier cette dette"
                    >
                        <Edit className="w-5 h-5 text-amber-700 group-hover/btn:scale-110 transition-transform duration-300" />
                    </button>
                    <button
                        className="group/btn p-3 bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        onClick={() => handleDeleteDette(dette.id)}
                        title="Supprimer cette dette"
                    >
                        <Trash2 className="w-5 h-5 text-red-700 group-hover/btn:scale-110 transition-transform duration-300" />
                    </button>
                </div>
            </td>
        </tr>
    )
}