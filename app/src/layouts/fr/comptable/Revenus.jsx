import { useState, useEffect, useRef } from 'react'
import {
    ArrowDown, ArrowUp, AlertCircle, DollarSign,
    Calendar, FileText, Users, PieChart, Briefcase,
    Plus, Filter, Bell, Edit, Trash2, X
} from 'lucide-react'

export default function ({ revenus, setRevenus, setActiveTab }) {
    const [filterPeriod, setFilterPeriod] = useState('dernier-mois')
    const [selectedDate, setSelectedDate] = useState(null)
    const [showFilterPopup, setShowFilterPopup] = useState(false)
    const [newRevenu, setNewRevenu] = useState({
        type: 'salaires',
        montant: '',
        label: '',
        remarque: ''
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

    const filteredRevenus = filterDataByDate(revenus, selectedDate)

    ////////////////////////////////////////////////////////////////////

    const handleDeleteRevenu = async (id) => {
        try {
            const response = await fetch('/api/finance/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ table: 'Revenus', id }),
            });

            if (response.ok) {
                setRevenus(prev => prev.filter(item => item.id !== id));
            } else {
                const data = await response.json();
                setErrors({ submit: data.message || 'Erreur lors de la suppression du revenu' });
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du revenu:', error);
            setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer plus tard.' });
        }
    };

    return (
        <div className="pt-4 pb-16">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <h2 className="text-xl md:text-2xl font-semibold text-amber-800">Revenus</h2>

                <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
                    <div className="relative">
                        <button
                            ref={filterButtonRef}
                            className="bg-amber-600 text-white px-3 py-2 rounded-md flex items-center gap-1 shadow-sm cursor-pointer hover:bg-amber-700 transition-colors duration-300"
                            onClick={() => setShowFilterPopup(!showFilterPopup)}
                        >
                            <Filter className="w-4 h-4" />
                            Filtrer
                        </button>

                        {showFilterPopup && (
                            <FilterPopup filterPopupRef={filterPopupRef} selectedDate={selectedDate} setSelectedDate={setSelectedDate} setShowFilterPopup={setShowFilterPopup} />
                        )}
                    </div>

                    <button
                        className="bg-amber-600 text-white px-3 py-2 rounded-md flex items-center gap-1 shadow-sm cursor-pointer hover:bg-amber-700 transition-colors duration-300"
                        onClick={() => setActiveTab('ajouterRevenu')}
                    >
                        <Plus className="w-4 h-4" />
                        Ajouter un revenu
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-100">
                <div className="p-4 border-b border-amber-100 flex justify-between items-center bg-gradient-to-r from-amber-50 to-white">
                    <div>
                        <h2 className="text-lg font-semibold text-amber-800">Récapitulatif des revenus</h2>
                        {selectedDate && (
                            <div className="text-xs text-amber-600 mt-1 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                Période: {selectedDate}
                            </div>
                        )}
                    </div>
                    <div className="bg-amber-100 p-2 rounded-full">
                        <DollarSign className="w-5 h-5 text-amber-600" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-amber-100">
                        <thead className="bg-amber-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                    Source
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-amber-800 uppercase tracking-wider">
                                    Montant
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-amber-800 uppercase tracking-wider">
                                    Remarque
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-amber-800 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-amber-100">
                            {filteredRevenus.length > 0 ? (
                                filteredRevenus.map((revenu, index) => (
                                    <RevenuLine key={revenu.id} revenu={revenu} index={index} setActiveTab={setActiveTab} handleDeleteRevenu={handleDeleteRevenu}/>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <AlertCircle className="w-8 h-8 text-amber-300 mb-2" />
                                            <p>Aucun revenu trouvé pour cette période</p>
                                            {selectedDate && (
                                                <button
                                                    className="mt-2 text-amber-600 hover:text-amber-800 text-xs underline"
                                                    onClick={() => setSelectedDate(null)}
                                                >
                                                    Réinitialiser le filtre
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-gradient-to-r from-amber-50 to-white border-t border-amber-100">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-amber-700">Nombre de transactions: {filteredRevenus.length}</span>
                        <div className="text-right">
                            <span className="text-xs text-amber-600 block">TOTAL</span>
                            <span className="text-lg font-bold text-amber-800">
                                {filteredRevenus.reduce((sum, item) => sum + (typeof item.montant === 'string' ? parseFloat(item.montant) : item.montant), 0).toLocaleString()} DH
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function FilterPopup({ filterPopupRef, selectedDate, setSelectedDate, setShowFilterPopup }) {
    return (
        <div
            ref={filterPopupRef}
            className="absolute right-0 top-full mt-2 bg-white rounded-md shadow-lg z-10 w-64 border border-amber-200"
        >
            <div className="p-3 border-b border-amber-100 flex justify-between items-center">
                <h3 className="text-sm font-medium text-amber-800">Filtrer par date</h3>
                <button
                    onClick={() => setShowFilterPopup(false)}
                    className="text-amber-600 hover:text-amber-800"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            <div className="p-3">
                <input
                    type="month"
                    className="w-full border border-amber-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    onChange={(e) => setSelectedDate(e.target.value)}
                    value={selectedDate || ''}
                />
                <div className="flex justify-between mt-3">
                    <button
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        onClick={() => {
                            setSelectedDate(null)
                            setShowFilterPopup(false)
                        }}
                    >
                        Réinitialiser
                    </button>
                    <button
                        className="px-3 py-1 text-xs bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
                        onClick={() => setShowFilterPopup(false)}
                    >
                        Appliquer
                    </button>
                </div>
            </div>
        </div>
    )
}

function RevenuLine({ revenu, index, setActiveTab, handleDeleteRevenu }) {
    return (
        <tr className={`hover:bg-amber-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-amber-50/30'}`}>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-start">
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                            {revenu.type === 'inscriptions' && 'Inscriptions'}
                            {revenu.type === 'paiements_mensuels' && 'Paiements mensuels'}
                            {revenu.type === 'dons' && 'Dons'}
                        </div>
                        <div className="text-sm text-gray-500">{revenu.label}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-amber-500" />
                    {new Date(revenu.created_At).toLocaleDateString('FR-fr')}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    +{revenu.montant.toLocaleString()} DH
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
                {revenu.descr}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex items-center justify-center space-x-3">
                    <button
                        className="p-1.5 bg-amber-100 rounded-full hover:bg-amber-200 transition-colors duration-200"
                        onClick={() => { setActiveTab('modifierRevenu'); sessionStorage.setItem('revenu', revenu.id) }}
                        title="Modifier"
                    >
                        <Edit className="w-4 h-4 text-amber-600" />
                    </button>
                    <button
                        className="p-1.5 bg-red-100 rounded-full hover:bg-red-200 transition-colors duration-200"
                        onClick={() => handleDeleteRevenu(revenu.id)}
                        title="Supprimer"
                    >
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                </div>
            </td>
        </tr>
    )
}