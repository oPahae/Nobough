import { useState } from 'react'
import {
    ArrowLeft, Calendar, DollarSign, FileText,
    CheckCircle, AlertCircle, Save
} from 'lucide-react'

export default function AjouterDepense({ setActiveTab, setDepenses }) {
    const [formData, setFormData] = useState({
        type: 'inscriptions',
        montant: '',
        date: new Date().toISOString().split('T')[0],
        label: '',
        remarque: ''
    })
    const [showSuccess, setShowSuccess] = useState(false)
    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'montant' ? value : value
        }))

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.type) newErrors.type = "Veuillez sélectionner un type"
        if (!formData.montant) {
            newErrors.montant = "Veuillez saisir un montant"
        } else if (isNaN(formData.montant) || parseFloat(formData.montant) <= 0) {
            newErrors.montant = "Veuillez saisir un montant valide"
        }
        if (!formData.date) newErrors.date = "Veuillez sélectionner une date"
        if (!formData.label) newErrors.label = "Veuillez saisir un libellé"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    /////////////////////////////////////////////////////////////

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (validateForm()) {
            try {
                const response = await fetch('/api/finance/addDepense', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        label: formData.label,
                        type: formData.type,
                        montant: parseFloat(formData.montant),
                        descr: formData.remarque,
                        created_At: formData.date
                    }),
                })

                if (response.ok) {
                    const newDepense = await response.json()
                    setDepenses(prev => [...prev, newDepense])
                    setShowSuccess(true)
                    setTimeout(() => {
                        setFormData({
                            type: 'Inscriptions',
                            montant: '',
                            date: new Date().toISOString().split('T')[0],
                            label: '',
                            remarque: ''
                        })
                        setShowSuccess(false)
                        setActiveTab('depenses')
                    }, 2000)
                } else {
                    const data = await response.json()
                    setErrors({ submit: data.message || 'Erreur lors de l\'ajout de la depense' })
                }
            } catch (error) {
                console.error('Erreur lors de l\'ajout de la depense:', error)
                setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer plus tard.' })
            }
        }
    }

    return (
        <div className="pt-4 pb-16">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => setActiveTab('depenses')}
                    className="mr-4 p-2 rounded-full hover:bg-amber-100 transition-colors duration-200"
                >
                    <ArrowLeft className="w-5 h-5 text-amber-800" />
                </button>
                <h2 className="text-xl md:text-2xl font-semibold text-amber-800">Ajouter une dépense</h2>
            </div>

            {showSuccess && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-green-700">La dépense a été ajouté avec succès!</span>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-100">
                <div className="p-4 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-white">
                    <h3 className="text-md font-medium text-amber-800">Informations de la dépense</h3>
                    <p className="text-sm text-amber-600 mt-1">Veuillez remplir tous les champs obligatoires (*)</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-amber-800 mb-1">
                                Type de dépense *
                            </label>
                            <div className="relative">
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className={`w-full border ${errors.type ? 'border-red-300' : 'border-amber-200'} p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 pl-10`}
                                >
                                    <option value="Salaires des professeurs">Salaires des professeurs</option>
                                    <option value="Fournitures">Fournitures</option>
                                    <option value="Autre">Autre</option>
                                </select>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FileText className="h-5 w-5 text-amber-600" />
                                </div>
                            </div>
                            {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-amber-800 mb-1">
                                Montant (DH) *
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="montant"
                                    value={formData.montant}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className={`w-full border ${errors.montant ? 'border-red-300' : 'border-amber-200'} p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 pl-10`}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <DollarSign className="h-5 w-5 text-amber-600" />
                                </div>
                            </div>
                            {errors.montant && <p className="mt-1 text-sm text-red-600">{errors.montant}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-amber-800 mb-1">
                                Date *
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className={`w-full border ${errors.date ? 'border-red-300' : 'border-amber-200'} p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 pl-10`}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-amber-600" />
                                </div>
                            </div>
                            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-amber-800 mb-1">
                                Libellé *
                            </label>
                            <input
                                type="text"
                                name="label"
                                value={formData.label}
                                onChange={handleChange}
                                placeholder="Entrez un libellé descriptif"
                                className={`w-full border ${errors.label ? 'border-red-300' : 'border-amber-200'} p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
                            />
                            {errors.label && <p className="mt-1 text-sm text-red-600">{errors.label}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-amber-800 mb-1">
                                Remarque (optionnel)
                            </label>
                            <textarea
                                name="remarque"
                                value={formData.remarque}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Ajoutez des détails supplémentaires si nécessaire"
                                className="w-full border border-amber-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                            ></textarea>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="button"
                            onClick={() => setActiveTab('depenses')}
                            className="px-4 py-2 mr-4 border border-amber-300 text-amber-700 rounded-md hover:bg-amber-50 transition-colors duration-300"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors duration-300 flex items-center"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}