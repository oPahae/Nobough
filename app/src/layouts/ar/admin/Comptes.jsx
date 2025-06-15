import {
    UserPlus, Mail, Users, Edit, Trash2, Check, X, Shield,
    UserCheck, Sparkles, Moon, ChevronDown, Save
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Comptes() {
    const [accounts, setAccounts] = useState([]);
    const [newAccount, setNewAccount] = useState({
        email: '',
        role: 'كاتب'
    });
    const [editingId, setEditingId] = useState(null);
    const [editEmail, setEditEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const PatternDecoration = () => (
        <div className="absolute left-0 top-0 w-24 h-24 opacity-10 -rotate-45">
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
                throw new Error('خطأ أثناء استرجاع الحسابات');
            }
            const data = await response.json();
            console.log(data)
            setAccounts(data || []);
        } catch (error) {
            console.error('خطأ أثناء استرجاع الحسابات:', error);
        }
    };

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
                throw new Error('خطأ أثناء إنشاء الحساب');
            }

            const createdAccount = await response.json();
            console.log(createdAccount)
            setAccounts([...accounts, createdAccount]);
            setNewAccount({ email: '', role: 'كاتب' });
            envoyerEmail(newAccount.role, newAccount.email, createdAccount.password)
        } catch (error) {
            console.error('خطأ أثناء إنشاء الحساب:', error);
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
                throw new Error('خطأ أثناء تحديث الحساب');
            }

            const updatedAccount = await response.json();
            setAccounts(accounts.map(acc => acc.id === id ? updatedAccount : acc));
            setEditingId(null);
            setEditEmail('');
        } catch (error) {
            console.error('خطأ أثناء تحديث الحساب:', error);
        }
    };

    const handleDeleteAccount = async (id, role) => {
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا الحساب؟')) {
            try {
                const response = await fetch('/api/comptes/delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id, role }),
                });

                if (!response.ok) {
                    throw new Error('خطأ أثناء حذف الحساب');
                }

                setAccounts(accounts.filter(acc => acc.id !== id));
            } catch (error) {
                console.error('خطأ أثناء حذف الحساب:', error);
            }
        }
    };

    const envoyerEmail = async (type, email, password) => {
        try {
            const res = await fetch(`/api/_mail/${type === 'محاسب' ? 'creerComptable' : 'creerSecretaire'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            })

            const data = await res.json()

            if (res.ok) {
                console.log('تم إرسال البريد الإلكتروني بنجاح!')
            } else {
                console.error('خطأ:', data)
            }
        } catch (error) {
            console.error('خطأ في الشبكة:', error)
        }
    }

    return (
        <div className="w-full relative min-h-screen" dir="rtl">
            <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 opacity-20">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#B8860B" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                    </svg>
                </div>
                <div className="absolute top-1/2 -right-24 w-64 h-64 opacity-20">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#B8860B" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                    </svg>
                </div>
                <div className="absolute -bottom-24 left-1/4 w-72 h-72 opacity-20">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#B8860B" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                    </svg>
                </div>
            </div>

            <div className="relative z-10 w-full mx-auto md:px-6 py-12">
                <div className="mb-12 text-center">
                    <div className="inline-block">
                        <div className="flex items-center justify-center mb-2">
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-700"></div>
                            <Shield className="text-amber-800 mx-4 w-6 h-6" />
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-700"></div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">إدارة الحسابات</h1>
                        <div className="flex items-center justify-center mt-2">
                            <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                            <Moon className="text-amber-800 mx-4 w-4 h-4" />
                            <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                        </div>
                    </div>
                    <p className="text-gray-600 mt-4 max-w-xl mx-auto">أنشئ وإدِر الحسابات للأمناء والمحاسبين</p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-12 border border-amber-100 relative overflow-hidden">
                    <PatternDecoration />

                    <div className="flex items-center justify-center mb-6 flex-wrap">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-md">
                            <UserPlus className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold mr-4 text-gray-800">إنشاء حساب جديد</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    عنوان البريد الإلكتروني
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-amber-700" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="block w-full pr-10 pl-4 py-3 border border-amber-200 rounded-lg bg-white/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700"
                                        placeholder="مثال@البريد.إي"
                                        value={newAccount.email}
                                        onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    الدور
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full p-3 pl-10 border border-amber-200 rounded-lg bg-white/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700 appearance-none"
                                        value={newAccount.role}
                                        onChange={(e) => setNewAccount({ ...newAccount, role: e.target.value })}
                                    >
                                        <option value="كاتب">كاتب</option>
                                        <option value="محاسب">محاسب</option>
                                    </select>
                                    <div className="absolute inset-y-0 left-0 flex items-center px-2 pointer-events-none">
                                        <ChevronDown className="h-5 w-5 text-amber-700" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-start">
                            <button
                                onClick={handleCreateAccount}
                                disabled={isSubmitting || !newAccount.email}
                                className="px-8 py-3 bg-gradient-to-l from-amber-600 to-amber-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center font-medium"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                        جاري الإنشاء...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4 ml-2" />
                                        إنشاء الحساب
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-100 overflow-hidden">
                    <div className="p-6 border-b border-amber-100 bg-gradient-to-l from-amber-50 to-white">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-md">
                                <Users className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mr-3 text-gray-800">الحسابات الموجودة</h3>
                            <div className="mr-auto bg-amber-100 px-3 py-1 rounded-full">
                                <span className="text-sm font-medium text-amber-800">
                                    {accounts.length} حساب{accounts.length !== 1 ? 'ات' : ''}
                                </span>
                            </div>
                        </div>
                    </div>

                    {accounts.length === 0 ? (
                        <div className="p-12 text-center">
                            <UserCheck className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                            <h4 className="text-lg font-medium text-gray-800 mb-2">لم يتم إنشاء أي حساب</h4>
                            <p className="text-gray-600">ابدأ بإنشاء حساب كاتب أو محاسب.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-amber-100">
                            {accounts.map((account) => (
                                <div key={account.id} className="p-6 hover:bg-amber-50/50 transition-colors relative">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 flex-1">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${account.role === 'كاتب'
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
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${account.role === 'كاتب'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {account.role}
                                                    </span>
                                                    <span>تم الإنشاء في {new Date(account.created_At).toLocaleDateString('FR-fr')}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            {editingId === account.id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleEditSubmit(account.id, account.role)}
                                                        className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                                        title="حفظ"
                                                    >
                                                        <Save className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={handleEditCancel}
                                                        className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                                        title="إلغاء"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleEditStart(account)}
                                                        className="p-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                                                        title="تعديل"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAccount(account.id, account.role)}
                                                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                                        title="حذف"
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

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-amber-100 p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-16 h-16 opacity-10">
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <path fill="currentColor" className="text-amber-900" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                            </svg>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">إجمالي الحسابات</p>
                                <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-amber-100 p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-16 h-16 opacity-10">
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <path fill="currentColor" className="text-blue-600" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                            </svg>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">الكتبة</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {accounts.filter(acc => acc.role === 'كاتب').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                                <UserCheck className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-amber-100 p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-16 h-16 opacity-10">
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <path fill="currentColor" className="text-green-600" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                            </svg>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">المحاسبون</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {accounts.filter(acc => acc.role === 'محاسب').length}
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