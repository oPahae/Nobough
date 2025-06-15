import React, { useState, useEffect } from 'react';
import {
  Calendar, Users, Plus, X,
  Save, DollarSign, MapPin,
  Tag, ArrowLeft, Trash2
} from 'lucide-react';

export default function ModifierEvenement({ setActiveTab }) {
  const [evenementID, setEvenementID] = useState('')

  useEffect(() => {
    const temp = sessionStorage.getItem('evenement')
    if (!temp) setActiveTab('evenements')
    else setEvenementID(temp)
  }, [])

  const [nouvelleDepense, setNouvelleDepense] = useState({
    label: '',
    montant: '',
    descr: ''
  });
  const [formData, setFormData] = useState({
    titre: '',
    created_At: '',
    descr: '',
    lieu: '',
    type: '',
    participants: '',
    img: null,
    depenses: []
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          img: reader.result
        }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDepenseChange = (e) => {
    const { name, value } = e.target;
    setNouvelleDepense({
      ...nouvelleDepense,
      [name]: value
    });
  };

  const ajouterDepense = (e) => {
    e.preventDefault();
    if (!nouvelleDepense.label || !nouvelleDepense.montant) {
      setNotification((notif) => ({
        ...notif,
        msg: "Veuillez remplir au moins le libellé et le montant de la dépense.",
        type: 'info',
        shown: true
      }))
      return;
    }
    setFormData({
      ...formData,
      depenses: [...formData.depenses, { ...nouvelleDepense, id: Date.now() }]
    });
    setNouvelleDepense({
      label: '',
      montant: '',
      descr: ''
    });
  };

  const supprimerDepense = (id) => {
    setFormData({
      ...formData,
      depenses: formData.depenses.filter(dep => dep.id !== id)
    });
  };

  ////////////////////////////////////////////////////////////////

  useEffect(() => {
    const fetchEvenement = async () => {
      if (evenementID === "") return
      try {
        const response = await fetch(`/api/evenements/getOne?id=${evenementID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event');
        }
        const data = await response.json();
        setFormData(data);
        setImagePreview(data.img ? atob(data.img.split(',')[1]) : '/user.jpg');
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvenement();
  }, [evenementID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titre || !formData.created_At || !formData.lieu || !formData.type) {
      setNotification((notif) => ({
        ...notif,
        msg: "Veuillez remplir tous les champs obligatoires (titre, date, lieu et type).",
        type: 'info',
        shown: true
      }))
      return;
    }
    try {
      const response = await fetch('/api/evenements/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, img: atob(formData.img.split(',')[1]), id: evenementID }),
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }
      setActiveTab('evenements');
    } catch (error) {
      setNotification((notif) => ({
        ...notif,
        msg: 'Error # ' + error,
        type: 'error',
        shown: true
      }))
    }
  };

  return (
    <div className="pt-4 pb-16 md:px-22">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => setActiveTab('evenements')}
          className="flex items-center gap-2 text-amber-700 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux événements
        </button>
      </div>

      {/* Main form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div>
            <h2 className="text-lg font-semibold text-amber-800 mb-4">Informations générales</h2>

            <div className="space-y-4">
              {/* Titre */}
              <div>
                <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-1">
                  Titre de l'événement *
                </label>
                <input
                  type="text"
                  id="titre"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  className="w-full border border-amber-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Conférence sur la langue arabe..."
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label htmlFor="created_At" className="block text-sm font-medium text-gray-700 mb-1">
                  Date de l'événement *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="created_At"
                    name="created_At"
                    value={formData.created_At?.slice(0, 10)}
                    onChange={handleChange}
                    className="w-full border border-amber-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                  <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-amber-600 pointer-events-none" />
                </div>
              </div>

              {/* Lieu */}
              <div>
                <label htmlFor="lieu" className="block text-sm font-medium text-gray-700 mb-1">
                  Lieu *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="lieu"
                    name="lieu"
                    value={formData.lieu}
                    onChange={handleChange}
                    className="w-full border border-amber-200 rounded-lg p-2 pl-8 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Salle polyvalente..."
                    required
                  />
                  <MapPin className="absolute left-2.5 top-2.5 w-4 h-4 text-amber-600" />
                </div>
              </div>

              {/* Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type d'événement *
                </label>
                <div className="relative">
                  <input
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full appearance-none border border-amber-200 rounded-lg p-2 pl-8 pr-10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                  <Tag className="absolute left-2.5 top-2.5 w-4 h-4 text-amber-600" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Image de l'événement
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-amber-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm text-gray-700"
                />
                {imagePreview && (
                  <div className="mt-2 relative">
                    <img
                      src={imagePreview}
                      alt="Prévisualisation"
                      className="w-full h-32 object-cover rounded-lg border border-amber-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData({ ...formData, img: null });
                      }}
                      className="absolute top-2 right-2 bg-red-100 rounded-full p-1 hover:bg-red-200 transition-colors"
                    >
                      <X className="w-4 h-4 text-red-700" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label htmlFor="descr" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="descr"
                name="descr"
                value={formData.descr}
                onChange={handleChange}
                rows="4"
                className="w-full border border-amber-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Description détaillée de l'événement..."
              ></textarea>
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* Depenses section */}
            <div>
              <h2 className="text-lg font-semibold text-amber-800 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-1" />
                Dépenses associées
              </h2>

              {/* Liste des dépenses existantes */}
              <div className="mb-4">
                {formData.depenses.length > 0 ? (
                  <div className="space-y-3">
                    {formData.depenses.map((dep) => (
                      <div
                        key={dep.id}
                        className="bg-amber-50 rounded-lg p-3 border border-amber-200 relative"
                      >
                        <div className="flex justify-between">
                          <h4 className="font-medium text-amber-800">{dep.label}</h4>
                          <div className="flex items-center">
                            <span className="font-bold text-amber-700 mr-2">{dep.montant} DH</span>
                            <button
                              type="button"
                              onClick={() => supprimerDepense(dep.id)}
                              className="bg-red-100 rounded-full p-1 hover:bg-red-200 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-700" />
                            </button>
                          </div>
                        </div>

                        {dep.descr && (
                          <p className="text-gray-600 text-sm mt-1">{dep.descr}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 bg-amber-50 rounded-lg border border-dashed border-amber-300">
                    <p className="text-amber-700">Aucune dépense ajoutée</p>
                  </div>
                )}
              </div>

              {/* Formulaire d'ajout de dépense */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Ajouter une dépense</h3>

                <div className="space-y-3">
                  {/* Libellé */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="depenseLabel" className="block text-xs text-gray-600 mb-1">
                        Libellé *
                      </label>
                      <input
                        type="text"
                        id="depenseLabel"
                        name="label"
                        value={nouvelleDepense.label}
                        onChange={handleDepenseChange}
                        className="w-full border border-gray-300 rounded-md p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Location de matériel..."
                      />
                    </div>

                    {/* Montant */}
                    <div>
                      <label htmlFor="depenseMontant" className="block text-xs text-gray-600 mb-1">
                        Montant (DH) *
                      </label>
                      <input
                        type="number"
                        id="depenseMontant"
                        name="montant"
                        value={nouvelleDepense.montant}
                        onChange={handleDepenseChange}
                        min="0"
                        step="0.01"
                        className="w-full border border-gray-300 rounded-md p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="depenseDescr" className="block text-xs text-gray-600 mb-1">
                      Description
                    </label>
                    <textarea
                      id="depenseDescr"
                      name="descr"
                      value={nouvelleDepense.descr}
                      onChange={handleDepenseChange}
                      rows="2"
                      className="w-full border border-gray-300 rounded-md p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Détails supplémentaires..."
                    ></textarea>
                  </div>

                  {/* Bouton d'ajout */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={ajouterDepense}
                      className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-md flex items-center gap-1 hover:bg-amber-200 transition-colors ml-auto text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter cette dépense
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit buttons */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setActiveTab('evenements')}
            className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
          >
            Annuler
          </button>

          <button
            type="submit"
            className="bg-gradient-to-r from-amber-500 to-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Save className="w-5 h-5" />
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
}