import { useState, useEffect, useRef } from 'react'
import {
    ArrowDown, ArrowUp, AlertCircle, DollarSign,
    Calendar, FileText, Users, PieChart, Briefcase,
    Plus, Filter, Bell, Edit, Trash2, X, TrendingDown,
    Receipt, ChevronDown, Search
} from 'lucide-react'

export default function ({ depenses, setDepenses, setActiveTab }) {
    const [selectedDate, setSelectedDate] = useState(null)
    const [showFilterPopup, setShowFilterPopup] = useState(false)
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

    const filteredDepenses = filterDataByDate(depenses, selectedDate)

    //////////////////////////////////////////////////////////

    const handleDeleteDepense = async (id) => {
        try {
            const response = await fetch('/api/finance/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ table: 'Depenses', id }),
            });

            if (response.ok) {
                setDepenses(prev => prev.filter(item => item.id !== id));
            } else {
                const data = await response.json();
                setErrors({ submit: data.message || 'Erreur lors de la suppression de la dépense' });
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de la dépense:', error);
            setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer plus tard.' });
        }
    }

    // Calcul des statistiques
    const totalAmount = filteredDepenses.reduce((sum, item) => 
        sum + (typeof item.montant === 'string' ? parseFloat(item.montant) : item.montant), 0
    )

    const typeStats = filteredDepenses.reduce((acc, depense) => {
        acc[depense.type] = (acc[depense.type] || 0) + (typeof depense.montant === 'string' ? parseFloat(depense.montant) : depense.montant)
        return acc
    }, {})

    return (
        <div className="min-h-screen bg-gradient-to-br pt-6 pb-20">
            <div className="w-full mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
                        <div className="mb-4 lg:mb-0">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg">
                                    <TrendingDown className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">
                                        Gestion des Dépenses
                                    </h1>
                                    <p className="text-amber-600 text-lg">Suivez et analysez vos dépenses</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <button
                                    ref={filterButtonRef}
                                    className="group bg-white border-2 border-amber-200 text-amber-700 px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl hover:border-amber-300 transition-all duration-300 font-medium"
                                    onClick={() => setShowFilterPopup(!showFilterPopup)}
                                >
                                    <Filter className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                    Filtrer par période
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showFilterPopup ? 'rotate-180' : ''}`} />
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
                                className="group bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-medium"
                                onClick={() => setActiveTab('ajouterDepense')}
                            >
                                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                Nouvelle Dépense
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-amber-100/50">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-500 font-medium">Total des Dépenses</div>
                                    <div className="text-2xl font-bold text-red-600">
                                        {totalAmount.toLocaleString()} DH
                                    </div>
                                </div>
                            </div>
                            {selectedDate && (
                                <div className="text-xs text-amber-600 flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    Période: {new Date(selectedDate + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                                </div>
                            )}
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-amber-100/50">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                                    <Receipt className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-500 font-medium">Transactions</div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {filteredDepenses.length}
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500">
                                {filteredDepenses.length > 0 ? 'Dépenses enregistrées' : 'Aucune transaction'}
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-amber-100/50">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
                                    <PieChart className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-500 font-medium">Catégories</div>
                                    <div className="text-2xl font-bold text-green-600">
                                        {Object.keys(typeStats).length}
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500">
                                Types de dépenses différents
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Table */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-amber-100/50">
                    <div className="p-6 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border-b border-amber-100">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-amber-800 mb-1">Tableau des Dépenses</h2>
                                <p className="text-amber-600">Gérez et surveillez toutes vos dépenses</p>
                                {selectedDate && (
                                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs bg-amber-100 text-amber-700">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {new Date(selectedDate + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                                    </div>
                                )}
                            </div>
                            <div className="p-4 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl shadow-lg">
                                <FileText className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-amber-50 to-orange-50">
                                    <th className="px-6 py-4 text-left text-sm font-bold text-amber-800 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                            Type
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-amber-800 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                            Date
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-amber-800 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                            Description
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-bold text-amber-800 uppercase tracking-wider">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            Montant
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-bold text-amber-800 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-amber-50">
                                {filteredDepenses.length > 0 ? (
                                    filteredDepenses.map((depense, index) => (
                                        <DepenseLine 
                                            key={depense.id} 
                                            depense={depense} 
                                            index={index} 
                                            setActiveTab={setActiveTab} 
                                            handleDeleteDepense={handleDeleteDepense} 
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-20 h-20 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mb-4">
                                                    <AlertCircle className="w-10 h-10 text-amber-400" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune dépense trouvée</h3>
                                                <p className="text-gray-500 mb-4">
                                                    {selectedDate ? 'Aucune dépense pour cette période' : 'Commencez par ajouter votre première dépense'}
                                                </p>
                                                {selectedDate ? (
                                                    <button
                                                        className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors duration-300 font-medium"
                                                        onClick={() => setSelectedDate(null)}
                                                    >
                                                        Réinitialiser le filtre
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-medium shadow-lg"
                                                        onClick={() => setActiveTab('ajouterDepense')}
                                                    >
                                                        <Plus className="w-5 h-5 inline mr-2" />
                                                        Ajouter une dépense
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {filteredDepenses.length > 0 && (
                        <div className="p-6 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border-t border-amber-100">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-amber-700">
                                        <Receipt className="w-5 h-5" />
                                        <span className="font-medium">Transactions: {filteredDepenses.length}</span>
                                    </div>
                                    {Object.keys(typeStats).length > 0 && (
                                        <div className="flex gap-2">
                                            {Object.entries(typeStats).map(([type, amount]) => (
                                                <div key={type} className="px-3 py-1 bg-white rounded-full text-xs font-medium text-amber-700 shadow-sm">
                                                    {type}: {amount.toLocaleString()} DH
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-amber-600 font-medium mb-1">TOTAL DES DÉPENSES</div>
                                    <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                        {totalAmount.toLocaleString()} DH
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function FilterPopup({ filterPopupRef, selectedDate, setSelectedDate, setShowFilterPopup }) {
    return (
        <div
            ref={filterPopupRef}
            className="absolute right-0 top-full mt-3 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl z-20 w-80 border border-amber-200/50 overflow-hidden"
        >
            <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-amber-800">Filtrer par période</h3>
                </div>
                <button
                    onClick={() => setShowFilterPopup(false)}
                    className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded-lg transition-all duration-300"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            <div className="p-6">
                <label className="block text-sm font-medium text-amber-700 mb-3">
                    Sélectionner un mois
                </label>
                <input
                    type="month"
                    className="w-full border-2 border-amber-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 bg-amber-50/50"
                    onChange={(e) => setSelectedDate(e.target.value)}
                    value={selectedDate || ''}
                />
                <div className="flex justify-between gap-3 mt-6">
                    <button
                        className="flex-1 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
                        onClick={() => {
                            setSelectedDate(null)
                            setShowFilterPopup(false)
                        }}
                    >
                        Réinitialiser
                    </button>
                    <button
                        className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-medium shadow-lg"
                        onClick={() => setShowFilterPopup(false)}
                    >
                        Appliquer
                    </button>
                </div>
            </div>
        </div>
    )
}

function DepenseLine({ depense, index, setActiveTab, handleDeleteDepense }) {
    const getTypeColor = (type) => {
        switch(type) {
            case 'salaires': return 'from-amber-100 to-yellow-100 text-amber-700 border-amber-200'
            case 'fournitures': return 'from-green-100 to-emerald-100 text-green-700 border-green-200'
            default: return 'from-orange-100 to-red-100 text-orange-700 border-orange-200'
        }
    }

    return (
        <tr className={`group hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50 transition-all duration-300 ${
            index % 2 === 0 ? 'bg-white' : 'bg-amber-50/20'
        }`}>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-3 py-2 text-sm font-medium rounded-xl border-2 bg-gradient-to-r ${getTypeColor(depense.type)} shadow-sm`}>
                    {depense.type}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg">
                        <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                            {new Date(depense.created_At).toLocaleDateString('fr-FR', { 
                                day: 'numeric', 
                                month: 'short', 
                                year: 'numeric' 
                            })}
                        </div>
                        <div className="text-xs text-gray-500">
                            {new Date(depense.created_At).toLocaleDateString('fr-FR', { weekday: 'long' })}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="max-w-xs">
                    <div className="text-sm font-semibold text-gray-900 mb-1">{depense.label}</div>
                    {depense.remarque && (
                        <div className="text-sm text-gray-500 italic bg-gray-50 px-2 py-1 rounded-lg">
                            {depense.remarque}
                        </div>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold shadow-lg">
                    <ArrowDown className="w-4 h-4" />
                    -{depense.montant.toLocaleString()} DH
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex items-center justify-center space-x-2 transition-opacity duration-300">
                    <button
                        className="p-3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                        onClick={() => { setActiveTab('modifierDepense'); sessionStorage.setItem('depense', depense.id) }}
                        title="Modifier"
                    >
                        <Edit className="w-4 h-4 text-white" />
                    </button>
                    <button
                        className="p-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-xl hover:from-red-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                        onClick={() => handleDeleteDepense(depense.id)}
                        title="Supprimer"
                    >
                        <Trash2 className="w-4 h-4 text-white" />
                    </button>
                </div>
            </td>
        </tr>
    )
}