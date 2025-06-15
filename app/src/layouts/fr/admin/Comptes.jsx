import {
    UserPlus, Mail, Users, Edit, Trash2, Check, X, Shield,
    UserCheck, Sparkles, Moon, ChevronDown, Save
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Comptes() {
    const [accounts, setAccounts] = useState([]);
    const [newAccount, setNewAccount] = useState({
        email: '',
        role: 'Secrétaire'
    });
    const [editingId, setEditingId] = useState(null);
    const [editEmail, setEditEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const PatternDecoration = () => (
        <div className="absolute right-0 top-0 w-24 h-24 opacity-10 rotate-45">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0L60 40H100L70 65L80 100L50 80L20 100L30 65L0 40H40L50 0Z" fill="currentColor" />
            </svg>
        </div>
    );

    const handleEditStart = (account) => {
        setEditingId(account.id);
        setEditEmail(account.email);
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditEmail('');
    };

    const fetchAccounts = async () => {
        try {
            const response = await fetch('/api/comptes/getAll');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des comptes');
            }
            const data = await response.json();
            console.log(data)
            setAccounts(data || []);
        } catch (error) {
            console.error('Erreur lors de la récupération des comptes:', error);
        }
    };

    ///////////////////////////////////////////////////

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        if (!newAccount.email) return;

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/comptes/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAccount),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création du compte');
            }

            const createdAccount = await response.json();
            console.log(createdAccount)
            setAccounts([...accounts, createdAccount]);
            setNewAccount({ email: '', role: 'Secrétaire' });
            envoyerEmail(newAccount.role, newAccount.email, createdAccount.password)
        } catch (error) {
            console.error('Erreur lors de la création du compte:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditSubmit = async (id, role) => {
        if (!editEmail) return;

        try {
            const response = await fetch('/api/comptes/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, email: editEmail, role }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour du compte');
            }

            const updatedAccount = await response.json();
            setAccounts(accounts.map(acc => acc.id === id ? updatedAccount : acc));
            setEditingId(null);
            setEditEmail('');
        } catch (error) {
            console.error('Erreur lors de la mise à jour du compte:', error);
        }
    };

    const handleDeleteAccount = async (id, role) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
            try {
                const response = await fetch('/api/comptes/delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id, role }),
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression du compte');
                }

                setAccounts(accounts.filter(acc => acc.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression du compte:', error);
            }
        }
    };

    const envoyerEmail = async (type, email, password) => {
        try {
            const res = await fetch(`/api/_mail/${type === 'Comptable' ? 'creerComptable' : 'creerSecretaire'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            })

            const data = await res.json()

            if (res.ok) {
                console.log('Email envoyé avec succès !')
            } else {
                console.error('Erreur:', data)
            }
        } catch (error) {
            console.error('Erreur réseau:', error)
        }
    }

    return (
        <div className="w-full relative min-h-screen">
            {/* Motifs décoratifs */}
            <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 opacity-20">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#B8860B" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                    </svg>
                </div>
                <div className="absolute top-1/2 -left-24 w-64 h-64 opacity-20">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#B8860B" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                    </svg>
                </div>
                <div className="absolute -bottom-24 right-1/4 w-72 h-72 opacity-20">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#B8860B" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                    </svg>
                </div>
            </div>

            <div className="relative z-10 w-full mx-auto md:px-6 py-12">
                {/* Titre avec ornement */}
                <div className="mb-12 text-center">
                    <div className="inline-block">
                        <div className="flex items-center justify-center mb-2">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-700"></div>
                            <Shield className="text-amber-800 mx-4 w-6 h-6" />
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-700"></div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">Gestion des Comptes</h1>
                        <div className="flex items-center justify-center mt-2">
                            <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                            <Moon className="text-amber-800 mx-4 w-4 h-4" />
                            <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                        </div>
                    </div>
                    <p className="text-gray-600 mt-4 max-w-xl mx-auto">Créez et gérez les comptes secrétaire et comptable</p>
                </div>

                {/* Formulaire de création */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-12 border border-amber-100 relative overflow-hidden">
                    <PatternDecoration />

                    <div className="flex items-center justify-center mb-6 flex-wrap">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-md">
                            <UserPlus className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold ml-4 text-gray-800">Créer un nouveau compte</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Email */}
                            <div className="relative">
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Adresse email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-amber-700" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="block w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg bg-white/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700"
                                        placeholder="exemple@email.com"
                                        value={newAccount.email}
                                        onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Rôle */}
                            <div className="relative">
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Rôle
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full p-3 pr-10 border border-amber-200 rounded-lg bg-white/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700 appearance-none"
                                        value={newAccount.role}
                                        onChange={(e) => setNewAccount({ ...newAccount, role: e.target.value })}
                                    >
                                        <option value="Secrétaire">Secrétaire</option>
                                        <option value="Comptable">Comptable</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <ChevronDown className="h-5 w-5 text-amber-700" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleCreateAccount}
                                disabled={isSubmitting || !newAccount.email}
                                className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center font-medium"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                        Création...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Créer le compte
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Liste des comptes */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-100 overflow-hidden">
                    <div className="p-6 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-white">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-md">
                                <Users className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold ml-3 text-gray-800">Comptes existants</h3>
                            <div className="ml-auto bg-amber-100 px-3 py-1 rounded-full">
                                <span className="text-sm font-medium text-amber-800">
                                    {accounts.length} compte{accounts.length > 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    </div>

                    {accounts.length === 0 ? (
                        <div className="p-12 text-center">
                            <UserCheck className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                            <h4 className="text-lg font-medium text-gray-800 mb-2">Aucun compte créé</h4>
                            <p className="text-gray-600">Commencez par créer votre premier compte secrétaire ou comptable.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-amber-100">
                            {accounts.map((account) => (
                                <div key={account.id} className="p-6 hover:bg-amber-50/50 transition-colors relative">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 flex-1">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${account.role === 'Secrétaire'
                                                ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                                                : 'bg-gradient-to-br from-green-400 to-green-600'
                                                }`}>
                                                <UserCheck className="w-5 h-5 text-white" />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-1">
                                                    {editingId === account.id ? (
                                                        <input
                                                            type="email"
                                                            value={editEmail}
                                                            onChange={(e) => setEditEmail(e.target.value)}
                                                            className="flex-1 px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <span className="text-lg font-medium text-gray-800">{account.email}</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${account.role === 'Secrétaire'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {account.role}
                                                    </span>
                                                    <span>Créé le {new Date(account.created_At).toLocaleDateString('fr-FR')}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            {editingId === account.id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleEditSubmit(account.id, account.role)}
                                                        className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                                        title="Sauvegarder"
                                                    >
                                                        <Save className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={handleEditCancel}
                                                        className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                                        title="Annuler"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleEditStart(account)}
                                                        className="p-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                                                        title="Modifier"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAccount(account.id, account.role)}
                                                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Statistiques */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-amber-100 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <path fill="currentColor" className="text-amber-900" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                            </svg>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total des comptes</p>
                                <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-amber-100 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <path fill="currentColor" className="text-blue-600" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                            </svg>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Secrétaires</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {accounts.filter(acc => acc.role === 'Secrétaire').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                                <UserCheck className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-amber-100 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <path fill="currentColor" className="text-green-600" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                            </svg>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Comptables</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {accounts.filter(acc => acc.role === 'Comptable').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                                <UserCheck className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}