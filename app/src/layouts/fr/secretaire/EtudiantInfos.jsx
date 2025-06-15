import React, { useState, useRef, useEffect } from 'react'
import {
    User, Mail, Phone, Calendar, Edit, Save, X, DollarSign,
    Check, AlertCircle, CreditCard, FileText, Info
} from 'lucide-react'

const EtudiantInfos = ({ paiements, etudiant, setEtudiant, setNotification }) => {
    const [editMode, setEditMode] = useState(false)
    const [editData, setEditData] = useState({ ...etudiant })
    const [imgChanged, setImgChanged] = useState(false)
    const fileInputRef = useRef(null)

    const handleEdit = () => {
        setEditData({ ...etudiant })
        setEditMode(true)
    }

    const handleCancel = () => {
        setEditData({ ...etudiant })
        setEditMode(false)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setEditData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageChange = (e) => {
        setImgChanged(true)
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setEditData(prev => ({
                    ...prev,
                    img: reader.result
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleEditImageClick = () => {
        fileInputRef.current.click()
    }

    ////////////////////////////////////////////////////////

    const handleSave = async () => {
        try {
            const response = await fetch('/api/etudiants/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    etudiantID: etudiant.id,
                    ...editData,
                    img: imgChanged ? editData.img : atob(Buffer.from(editData.img).toString('base64'))
                }),
            });

            if (response.ok) {
                setEditMode(false)
                setNotification((notif) => ({
                    ...notif,
                    msg: 'Informations personnelles mises à jour avec succès',
                    type: 'success',
                    shown: true
                }))
                setEtudiant(editData)
            } else {
                const errorData = await response.json();
                setNotification((notif) => ({
                    ...notif,
                    msg: `Erreur: ${errorData.message}`,
                    type: 'error',
                    shown: true
                }))
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour des informations:', error);
            alert('Une erreur est survenue lors de la mise à jour des informations');
        }
    }

    return (
        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-xl mb-6 border border-amber-100 relative overflow-hidden">
            {/* Motifs décoratifs */}
            <div className="absolute -top-24 -right-24 w-64 h-64 opacity-5 pointer-events-none">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#B8860B" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                </svg>
            </div>
            <div className="absolute bottom-0 left-1/4 w-48 h-48 opacity-5 pointer-events-none">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#B8860B" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                </svg>
            </div>

            <div className="flex gap-2 flex-col md:flex-row lg:flex-row justify-between items-center mb-6">
                <div className="relative flex items-center">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-700 mr-3"></div>
                    <h2 className="text-2xl font-bold text-amber-900">Profil</h2>
                </div>
                {!editMode ? (
                    <button
                        onClick={handleEdit}
                        className="flex items-center bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white py-2 px-4 rounded-lg shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-4 rounded-lg shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Enregistrer
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Annuler
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 flex flex-col items-center">
                    <div className="relative">
                        <img
                            src={etudiant.img ? atob(`data:image/jpeg;base64,${Buffer.from(etudiant.img).toString('base64')}`.split(',')[1]) : '/user.jpg'}
                            alt={`${etudiant.prenom} ${etudiant.nom}`}
                            className="w-48 h-48 rounded-full object-cover mb-6 border-4 border-amber-100 shadow-md"
                        />
                        <div className="absolute inset-0 rounded-full border-2 border-amber-300 opacity-20"></div>
                    </div>

                    {editMode && (
                        <>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <button
                                onClick={handleEditImageClick}
                                className="bg-amber-100 hover:bg-amber-200 text-amber-800 py-2 px-4 rounded-lg transition-colors shadow-sm"
                            >
                                Modifier la photo
                            </button>
                        </>
                    )}

                    {!editMode && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 w-full mt-6 shadow-sm">
                            <h3 className="text-amber-800 font-semibold mb-2 flex items-center">
                                <Info className="w-4 h-4 mr-2 text-amber-700" />
                                Statut financier
                            </h3>
                            <div className="text-sm space-y-2">
                                <p className="flex justify-between">
                                    <span className="text-gray-700">Rabais:</span>
                                    <span className="font-semibold text-amber-800">{etudiant.rabais}%</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="text-gray-700">Paiements:</span>
                                    <span className="font-semibold text-amber-800">
                                        {paiements.filter(p => p.paye).length}/{paiements.length}
                                    </span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Prénom */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="prenom"
                                    value={editData.prenom}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            ) : (
                                <p className="text-gray-800 bg-white p-2 rounded-lg border border-amber-100 shadow-sm">{etudiant.prenom}</p>
                            )}
                        </div>

                        {/* Nom */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="nom"
                                    value={editData.nom}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            ) : (
                                <p className="text-gray-800 bg-white p-2 rounded-lg border border-amber-100 shadow-sm">{etudiant.nom}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            {editMode ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={editData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            ) : (
                                <div className="flex items-center text-gray-800 bg-white p-2 rounded-lg border border-amber-100 shadow-sm">
                                    <Mail className="w-4 h-4 text-amber-700 mr-2" />
                                    {etudiant.email}
                                </div>
                            )}
                        </div>

                        {/* Tel */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="tel"
                                    value={editData.tel}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            ) : (
                                <div className="flex items-center text-gray-800 bg-white p-2 rounded-lg border border-amber-100 shadow-sm">
                                    <Phone className="w-4 h-4 text-amber-700 mr-2" />
                                    {etudiant.tel}
                                </div>
                            )}
                        </div>

                        {/* Birth */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                            {editMode ? (
                                <input
                                    type="date"
                                    name="birth"
                                    value={new Date(etudiant.dateNaissance).toISOString().split('T')[0]}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            ) : (
                                <div className="flex items-center text-gray-800 bg-white p-2 rounded-lg border border-amber-100 shadow-sm">
                                    <Calendar className="w-4 h-4 text-amber-700 mr-2" />
                                    {new Date(etudiant.dateNaissance).toLocaleDateString('FR-fr')}
                                </div>
                            )}
                        </div>

                        {/* CIN */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CIN</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="cin"
                                    value={editData.cin}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            ) : (
                                <div className="flex items-center text-gray-800 bg-white p-2 rounded-lg border border-amber-100 shadow-sm">
                                    <FileText className="w-4 h-4 text-amber-700 mr-2" />
                                    {etudiant.cin}
                                </div>
                            )}
                        </div>

                        {/* Rabais */}
                        {editMode && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rabais (%)</label>
                                <input
                                    type="number"
                                    name="rabais"
                                    value={editData.rabais}
                                    onChange={handleChange}
                                    min="0"
                                    max="100"
                                    className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            </div>
                        )}
                    </div>

                    {/* Bio avec bordure décorative */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Biographie</label>
                        <div className="relative">
                            {/* Bordures décoratives */}
                            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-600/30 rounded-tl-lg pointer-events-none"></div>
                            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-amber-600/30 rounded-tr-lg pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-amber-600/30 rounded-bl-lg pointer-events-none"></div>
                            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-amber-600/30 rounded-br-lg pointer-events-none"></div>

                            {editMode ? (
                                <textarea
                                    name="bio"
                                    value={editData.bio}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                ></textarea>
                            ) : (
                                <p className="text-gray-800 bg-white p-6 rounded-lg border border-amber-100 shadow-sm">{etudiant.bio}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EtudiantInfos