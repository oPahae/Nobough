import React, { useState, useEffect } from 'react';
import {
  Calendar, Users, Plus, Filter,
  Bell, Trash2, Edit, DollarSign,
  MapPin, Clock, Tag, ChevronDown
} from 'lucide-react';

export default function Evenements({ setActiveTab }) {
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all');
  const [evenements, setEvenements] = useState([]);

  const filteredEvenements = evenements
    .filter(evenement => filterType === 'all' || evenement.type === filterType)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created_At) - new Date(a.created_At);
      } else if (sortBy === 'montant') {
        return parseFloat(b.depenses.montant) - parseFloat(a.depenses.montant);
      } else {
        return a.titre.localeCompare(b.titre);
      }
    });

  ////////////////////////////////////////////////////////////////

  useEffect(() => {
    const fetchEvenements = async () => {
      try {
        const response = await fetch('/api/evenements/getAll');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvenements(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvenements();
  }, []);

  const handleDeleteEvenement = async (evenementID) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      try {
        const response = await fetch('/api/evenements/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: evenementID }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete event');
        }

        const updatedEvenements = evenements.filter(evenement => evenement.id !== evenementID);
        setEvenements(updatedEvenements);
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  return (
    <div className="min-h-screen pt-4 pb-16 md:p-8">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative group">
              <select
                className="appearance-none bg-white/80 backdrop-blur-sm border-2 border-amber-200/50 rounded-xl py-3 pl-5 pr-12 text-amber-800 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-400 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">📅 Trier par date</option>
                <option value="montant">💰 Trier par coût</option>
                <option value="titre">🔤 Trier par titre</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-amber-600 group-hover:text-amber-700 transition-colors" />
              </div>
            </div>
          </div>

          <button
            className="group relative bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-8 py-3 rounded-xl flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:rotate-2 hover:-translate-y-1 font-semibold"
            onClick={() => setActiveTab('ajouterEvenement')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="relative">Ajouter un événement</span>
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredEvenements.map((evenement, index) => (
            <div key={evenement.id} 
                 className="animate-fadeInUp" 
                 style={{animationDelay: `${index * 100}ms`}}>
              <Evenement 
                evenement={evenement} 
                setActiveTab={setActiveTab} 
                handleDeleteEvenement={handleDeleteEvenement} 
              />
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredEvenements.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/30 to-orange-400/30 rounded-full blur-2xl scale-150"></div>
              <div className="relative bg-gradient-to-br from-amber-100 to-orange-100 p-8 rounded-3xl shadow-xl">
                <Calendar className="w-20 h-20 text-amber-500 mx-auto" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Aucun événement trouvé</h3>
            <p className="text-lg text-gray-600 max-w-md mb-8 leading-relaxed">
              Il n'y a pas d'événements correspondant à vos critères de recherche actuels.
            </p>
            <button
              className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-8 py-3 rounded-xl hover:from-amber-200 hover:to-orange-200 transition-all duration-300 shadow-lg hover:shadow-xl transform font-semibold border border-amber-200/50"
              onClick={() => {
                setSortBy('date');
                setFilterType('all');
              }}
            >
              🔄 Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

function Evenement({ evenement, setActiveTab, handleDeleteEvenement }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden transform transition-all duration-500 border border-amber-100/50 hover:shadow-2xl hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    > 
      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-amber-50/80 to-orange-50/80 backdrop-blur-sm border-b border-amber-100/50">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-amber-700 transition-colors duration-300">
                {evenement.titre}
              </h3>
              <div className="flex items-center text-sm text-amber-700 bg-amber-100/50 rounded-full px-3 py-1 w-fit">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="font-medium">
                  {new Date(evenement.created_At).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              <button
                className="group/btn p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full hover:from-amber-200 hover:to-orange-200 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                onClick={() => { setActiveTab('modifierEvenement'); sessionStorage.setItem('evenement', evenement.id) }}
              >
                <Edit className="w-4 h-4 text-amber-700 group-hover/btn:rotate-12 transition-transform duration-300" />
              </button>
              <button
                className="group/btn p-3 bg-gradient-to-br from-red-100 to-pink-100 rounded-full hover:from-red-200 hover:to-pink-200 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                onClick={() => handleDeleteEvenement(evenement.id)}
              >
                <Trash2 className="w-4 h-4 text-red-700 group-hover/btn:scale-110 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
          <img
            src={evenement.img ? atob(evenement.img.split(',')[1]) : "formation.jpg"}
            alt={evenement.titre}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-5">
          <p className="text-gray-700 leading-relaxed line-clamp-3">{evenement.descr}</p>

          <div className="space-y-3">
            <div className="flex items-center group/item">
              <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mr-3 group-hover/item:scale-110 transition-transform duration-300">
                <MapPin className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-gray-700 font-medium">{evenement.lieu}</span>
            </div>
            <div className="flex items-center group/item">
              <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mr-3 group-hover/item:scale-110 transition-transform duration-300">
                <Tag className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-gray-700 font-medium capitalize">{evenement.type || 'Non spécifié'}</span>
            </div>
            <div className="flex items-center group/item">
              <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mr-3 group-hover/item:scale-110 transition-transform duration-300">
                <Users className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-gray-700 font-medium">{evenement.participants || 'Ouvert à tous'}</span>
            </div>
          </div>

          {/* Dépenses */}
          <div className="pt-5 border-t border-gradient-to-r from-amber-200/30 to-orange-200/30">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-amber-800 flex items-center text-lg">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full mr-3">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                Dépenses
              </h4>
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                {evenement.depenses?.reduce((a, b) => a + b.montant, 0) || 0} DH
              </div>
            </div>

            {evenement.depenses?.length > 0 && (
              <details className="rounded-2xl overflow-hidden border-2 border-amber-200/50 bg-gradient-to-br from-amber-50/50 to-orange-50/50 backdrop-blur-sm shadow-lg">
                <summary className="p-4 cursor-pointer bg-gradient-to-r from-amber-100/80 to-orange-100/80 hover:from-amber-200/80 hover:to-orange-200/80 flex items-center justify-between font-semibold text-amber-800 transition-all duration-300 group/summary">
                  <span>💰 Détails des dépenses</span>
                  <ChevronDown className="w-5 h-5 text-amber-600 group-hover/summary:rotate-180 transition-transform duration-300" />
                </summary>
                <div className="p-4 space-y-4">
                  {evenement.depenses.map((dep, index) => (
                    <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-200/30 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <p className="text-gray-800 font-semibold mb-2 flex items-center justify-between">
                        <span>{dep.label}</span>
                        <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {dep.montant} DH
                        </span>
                      </p>
                      <div className="flex items-center text-xs text-gray-600 bg-amber-50/50 rounded-full px-3 py-1 w-fit">
                        <Calendar className="w-3 h-3 mr-2" />
                        <span>
                          Dépensé le {new Date(dep.created_At).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}