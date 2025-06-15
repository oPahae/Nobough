import React, { useState, useEffect } from 'react';
import {
    User, Mail, Phone, Calendar, Edit, Save, X, DollarSign,
    Check, AlertCircle, CreditCard, Clock, Info,
    ArrowRight, Book, LogOut, PlusCircle
} from 'lucide-react';

const EtudiantFormations = ({ formations, etudiantID, setNotification }) => {
    const [allFormations, setAllFormations] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedFormation, setSelectedFormation] = useState(null);

    //////////////////////////////////////////////////////////

    useEffect(() => {
        const fetchFormations = async () => {
            try {
                const response = await fetch(`/api/formations/getAll`);
                const data = await response.json();
                setAllFormations(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des formations:', error);
            }
        };

        fetchFormations();
    }, []);

    const handleJoin = async () => {
        if (!selectedFormation) return;

        try {
            const response = await fetch('/api/inscriptions/addNow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ formationID: selectedFormation.id, etudiantID }),
            });

            if (response.ok) {
                setNotification((notif) => ({
                    ...notif,
                    msg: `Inscription ajoutée avec succès !`,
                    type: 'success',
                    shown: true
                }));
            } else {
                const data = await response.json();
                setNotification((notif) => ({
                    ...notif,
                    msg: data.message || 'Erreur lors de l\'inscription.',
                    type: 'error',
                    shown: true
                }));
            }
        } catch (error) {
            setNotification((notif) => ({
                ...notif,
                msg: `Error # ${error.message}`,
                type: 'error',
                shown: true
            }));
        }
    };

    const handleQuit = async (formationID) => {
        try {
            const response = await fetch('/api/inscriptions/quit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ etudiantID, formationID }),
            });

            if (response.ok) {
                setNotification((notif) => ({
                    ...notif,
                    msg: `Etudiant retiré !`,
                    type: 'success',
                    shown: true
                }));
            } else {
                const data = await response.json();
                setNotification((notif) => ({
                    ...notif,
                    msg: data.message || 'Erreur lors de l\'opération.',
                    type: 'error',
                    shown: true
                }));
            }
        } catch (error) {
            setNotification((notif) => ({
                ...notif,
                msg: `Error # ${error.message}`,
                type: 'error',
                shown: true
            }));
        }
    };

    return (
        <div className="max-w-full bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-xl mb-6 relative overflow-hidden">
            <div className="mb-4">
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium bg-gradient-to-r from-amber-600 to-amber-800 text-white hover:from-amber-700 hover:to-amber-900 shadow-sm transition-all hover:-translate-y-0.5"
                >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Ajouter à une formation
                </button>
                {showDropdown && (
                    <div className="mt-2 bg-white rounded-lg shadow-lg p-4 flex flex-col gap-2">
                        <select
                            onChange={(e) => setSelectedFormation(JSON.parse(e.target.value))}
                            className="w-fit p-2 border border-gray-300 rounded-lg"
                        >
                            <option value="">Sélectionner une formation</option>
                            {allFormations.map((formation) => (
                                <option key={formation.id} value={JSON.stringify(formation)}>
                                    {formation.titre}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleJoin}
                            className="px-3 py-2 w-fit inline-flex items-center rounded-lg text-sm font-medium bg-gradient-to-r from-green-600 to-green-800 text-white hover:from-green-700 hover:to-green-900 shadow-sm transition-all hover:-translate-y-0.5"
                        >
                            <Check className="w-3 h-3 mr-1" />
                            Confirmer
                        </button>
                    </div>
                )}
            </div>
            <div className="overflow-x-auto">
                <div className="bg-white rounded-xl shadow-md border border-amber-100">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-amber-50 to-amber-100 text-left">
                                <th className="px-6 py-4 text-sm font-medium text-amber-900 uppercase tracking-wider rounded-tl-xl">
                                    <div className="flex items-center">
                                        <Book className="w-4 h-4 mr-2 text-amber-700" />
                                        Formation
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-sm font-medium text-amber-900 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-2 text-amber-700" />
                                        Date d’inscription
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-sm font-medium text-amber-900 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        <LogOut className="w-4 h-4 mr-2 text-amber-700" />
                                        Actions
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-100">
                            {formations.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                                        Cet étudiant ne fait partie d'aucune formation
                                    </td>
                                </tr>
                            ) : (
                                formations.map((formation, index) => (
                                    <tr key={index} className="bg-white hover:bg-amber-50/40">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">
                                            {formation.titre}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-amber-800">
                                            {new Date(formation.dateJoigne).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleQuit(formation.id)}
                                                className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium shadow-sm transition-all hover:-translate-y-0.5 ${formation.status === "paye"
                                                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                                                    : formation.status === "nonpaye"
                                                        ? "bg-gradient-to-r from-green-600 to-green-800 text-white hover:from-green-700 hover:to-green-900"
                                                        : "bg-gradient-to-r from-yellow-600 to-yellow-800 text-white hover:from-yellow-700 hover:to-yellow-900"
                                                    }`}
                                            >
                                                <div className="flex items-center">
                                                    <X className="w-3 h-3 mr-1" />
                                                    Retirer
                                                </div>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EtudiantFormations;