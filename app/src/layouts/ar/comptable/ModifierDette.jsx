import { useState, useEffect } from 'react'
import {
  ArrowLeft, Calendar, DollarSign, FileText,
  CheckCircle, AlertCircle, Save, Trash2
} from 'lucide-react'

export default function ModifierDette({ setActiveTab, dettes, setDettes }) {
  const [formData, setFormData] = useState({
    titre: '',
    montant: '',
    created_At: new Date().toISOString().split('T')[0],
    deadline: '',
    remarque: '',
    status: 'nonpaye'
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [detteID, setDetteID] = useState('')

  useEffect(() => {
    const temp = sessionStorage.getItem('dette')
    if (!temp) setActiveTab('dettes')
    else setDetteID(temp)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.titre) newErrors.titre = "Veuillez saisir un titre"
    if (!formData.montant) {
      newErrors.montant = "Veuillez saisir un montant"
    } else if (isNaN(formData.montant) || parseFloat(formData.montant) <= 0) {
      newErrors.montant = "Veuillez saisir un montant valide"
    }
    if (!formData.created_At) newErrors.created_At = "Veuillez sélectionner une date"
    if (!formData.deadline) newErrors.deadline = "Veuillez sélectionner une date limite"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  ///////////////////////////////////////////////////

  useEffect(() => {
    const fetchDette = async () => {
      if(detteID === "") return
      try {
        const response = await fetch(`/api/finance/getDette?detteID=${detteID}`)
        const data = await response.json()

        if (data) {
          setFormData({
            titre: data.label,
            montant: data.montant.toString(),
            created_At: new Date(data.created_At).toISOString().split('T')[0],
            deadline: new Date(data.deadline).toISOString().split('T')[0],
            remarque: data.descr || '',
            status: data.status
          })
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la dette:', error)
      }
    }

    fetchDette()
  }, [detteID])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        const response = await fetch('/api/finance/updateDette', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: detteID,
            label: formData.titre,
            montant: parseFloat(formData.montant),
            descr: formData.remarque,
            created_At: formData.created_At,
            deadline: formData.deadline,
            status: formData.status
          }),
        })

        if (response.ok) {
          const updatedDette = await response.json()
          setDettes(prev => prev.map(dette =>
            dette.id === detteID ? updatedDette : dette
          ))

          setShowSuccess(true)
          setTimeout(() => {
            setShowSuccess(false)
            setActiveTab('dettes')
          }, 2000)
        } else {
          const data = await response.json()
          setErrors({ submit: data.message || 'Erreur lors de la modification de la dette' })
        }
      } catch (error) {
        console.error('Erreur lors de la modification de la dette:', error)
        setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer plus tard.' })
      }
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch('/api/finance/deleteDette', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: detteID }),
      })

      if (response.ok) {
        setDettes(prev => prev.filter(dette => dette.id !== detteID))
        setShowConfirmation(false)

        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false)
          setActiveTab('dettes')
        }, 2000)
      } else {
        const data = await response.json()
        setErrors({ submit: data.message || 'Erreur lors de la suppression de la dette' })
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la dette:', error)
      setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer plus tard.' })
    }
  }

  if (!dettes.some(dette => dette.id == detteID)) {
    return (
      <div className="pt-4 pb-16">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setActiveTab('dettes')}
            className="mr-4 p-2 rounded-full hover:bg-amber-100 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-amber-800" />
          </button>
          <h2 className="text-xl md:text-2xl font-semibold text-amber-800">Modifier une dette</h2>
        </div>

        <div className="p-6 bg-amber-50 border-l-4 border-amber-500 rounded-md flex items-start">
          <AlertCircle className="w-5 h-5 text-amber-500 mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">Dette introuvable</h3>
            <p className="text-amber-700 mt-1">La dette que vous essayez de modifier n'existe pas ou a été supprimée.</p>
            <button
              onClick={() => setActiveTab('dettes')}
              className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors duration-300"
            >
              Retour à la liste des dettes
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-4 pb-16">
      <div className="flex items-center mb-6">
        <button
          onClick={() => setActiveTab('dettes')}
          className="mr-4 p-2 rounded-full hover:bg-amber-100 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-amber-800" />
        </button>
        <h2 className="text-xl md:text-2xl font-semibold text-amber-800">Modifier une dette</h2>
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
          <span className="text-green-700">La dette a été modifiée avec succès!</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-100">
        <div className="p-4 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-white flex justify-between items-center">
          <div>
            <h3 className="text-md font-medium text-amber-800">Modifier les informations de la dette</h3>
            <p className="text-sm text-amber-600 mt-1">ID: {detteID}</p>
          </div>
          <button
            onClick={() => setShowConfirmation(true)}
            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors duration-300 flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Supprimer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-1">
                Titre *
              </label>
              <input
                type="text"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                placeholder="Titre de la dette"
                className={`w-full border ${errors.titre ? 'border-red-300' : 'border-amber-200'} p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
              />
              {errors.titre && <p className="mt-1 text-sm text-red-600">{errors.titre}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-800 mb-1">
                Montant (DH) *
              </label>
              <div className="relative">
                <input
                  type="number"
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
                Date de création *
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="created_At"
                  value={formData.created_At}
                  onChange={handleChange}
                  className={`w-full border ${errors.created_At ? 'border-red-300' : 'border-amber-200'} p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              {errors.created_At && <p className="mt-1 text-sm text-red-600">{errors.created_At}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-800 mb-1">
                Date limite *
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className={`w-full border ${errors.deadline ? 'border-red-300' : 'border-amber-200'} p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              {errors.deadline && <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-800 mb-1">
                Statut
              </label>
              <div className="relative">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-amber-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 pl-10"
                >
                  <option value="nonpayé">Non payé</option>
                  <option value="payé">Payé</option>
                  <option value="annulé">Annulé</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-amber-600" />
                </div>
              </div>
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
              onClick={() => setActiveTab('dettes')}
              className="px-4 py-2 mr-4 border border-amber-300 text-amber-700 rounded-md hover:bg-amber-50 transition-colors duration-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors duration-300 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full">
            <div className="p-4 border-b border-amber-100 bg-red-50">
              <h3 className="text-lg font-medium text-red-700">Confirmation de suppression</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700">
                Êtes-vous sûr de vouloir supprimer cette dette ? Cette action est irréversible.
              </p>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-300"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
