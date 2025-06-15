import { useState } from 'react'
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  Check,
  AlertCircle,
  Save
} from 'lucide-react'

export default function AjouterDette({ setActiveTab, setDettes }) {
  const [detteData, setDetteData] = useState({
    titre: '',
    montant: '',
    remarque: '',
    date: new Date().toISOString().split('T')[0],
    deadline: '',
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setDetteData(prev => ({
      ...prev,
      [name]: name === 'montant' ? (value === '' ? '' : parseFloat(value)) : value
    }))

    // Clear error when field is being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!detteData.titre.trim()) {
      newErrors.titre = "Le titre est requis"
    }

    if (!detteData.montant) {
      newErrors.montant = "Le montant est requis"
    } else if (isNaN(detteData.montant) || detteData.montant <= 0) {
      newErrors.montant = "Le montant doit être un nombre positif"
    }

    if (!detteData.date) {
      newErrors.date = "La date est requise"
    }

    if (!detteData.deadline) {
      newErrors.deadline = "La date d'échéance est requise"
    } else if (new Date(detteData.deadline) < new Date(detteData.date)) {
      newErrors.deadline = "La date d'échéance ne peut pas être antérieure à la date d'émission"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  //////////////////////////////////////////////////////////

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage('');

    try {
      const response = await fetch('/api/finance/addDette', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titre: detteData.titre,
          montant: parseFloat(detteData.montant),
          remarque: detteData.remarque,
          date: detteData.date,
          deadline: detteData.deadline,
          status: 'nonpayé'
        }),
      });

      if (response.ok) {
        const newDette = await response.json();

        // Mettre à jour l'état local avec la nouvelle dette
        setDettes(prev => [...prev, newDette]);

        // Réinitialiser le formulaire
        setDetteData({
          titre: '',
          montant: '',
          remarque: '',
          date: new Date().toISOString().split('T')[0],
          deadline: '',
        });

        // Afficher le message de succès
        setSuccessMessage('Dette ajoutée avec succès!');

        // Retour à la liste des dettes après 2 secondes
        setTimeout(() => {
          setActiveTab('dettes');
        }, 2000);
      } else {
        const data = await response.json();
        setErrors({ submit: data.message || "Une erreur est survenue lors de l'enregistrement de la dette." });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la dette:', error);
      setErrors({ submit: "Une erreur est survenue. Veuillez réessayer plus tard." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-4 pb-16">
      <div className="flex items-center mb-6">
        <button
          onClick={() => setActiveTab('dettes')}
          className="mr-4 p-2 rounded-full hover:bg-amber-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-amber-600" />
        </button>
        <h2 className="text-2xl font-semibold text-amber-800">Ajouter une dette</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-amber-100 overflow-hidden">
        <div className="p-4 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-white">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-amber-800">Détails de la dette</h3>
            <div className="bg-amber-100 p-2 rounded-full">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {successMessage && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-green-700">{successMessage}</span>
            </div>
          )}

          {errors.submit && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{errors.submit}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Titre de la dette*
              </label>
              <input
                type="text"
                name="titre"
                value={detteData.titre}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.titre ? 'border-red-300' : 'border-amber-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
                placeholder="Ex: Prêt bancaire"
              />
              {errors.titre && (
                <p className="mt-1 text-sm text-red-600">{errors.titre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Montant (DH)*
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="montant"
                  value={detteData.montant}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors.montant ? 'border-red-300' : 'border-amber-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 pr-12`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">DH</span>
                </div>
              </div>
              {errors.montant && (
                <p className="mt-1 text-sm text-red-600">{errors.montant}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Date d'émission*
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={detteData.date}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors.date ? 'border-red-300' : 'border-amber-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Calendar className="w-5 h-5 text-amber-500" />
                </div>
              </div>
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Date d'échéance*
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="deadline"
                  value={detteData.deadline}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors.deadline ? 'border-red-300' : 'border-amber-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Calendar className="w-5 h-5 text-amber-500" />
                </div>
              </div>
              {errors.deadline && (
                <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Remarque
              </label>
              <textarea
                name="remarque"
                value={detteData.remarque}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Informations complémentaires..."
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="button"
              onClick={() => setActiveTab('dettes')}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-md mr-4 hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors flex items-center"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}