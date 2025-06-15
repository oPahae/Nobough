import {
    Filter, Info, Phone, Mail, CreditCard, GraduationCap, Trash2, Plus, X, Sparkles, Moon,
    Trash, Search, Download
} from 'lucide-react'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Loading from '@/utils/Loading'

export default function Etudiants({ setActiveTab }) {
    const [etudiants, setEtudiants] = useState([])
    const [filter, setFilter] = useState('tous')
    const [filteredEtudiants, setFilteredEtudiants] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [x, y] = useState(true)

    const filterEtudiants = () => {
        if (filter === 'tous') {
            setFilteredEtudiants(etudiants.filter(e => e.moisNonPayes > 3))
            setFilter('nonpaye')
        }
        else {
            setFilteredEtudiants(etudiants)
            setFilter('tous')
        }
    }

    const getMoisNonPayesColor = (mois) => {
        if (mois === 0 || !mois) return 'bg-green-100 text-green-800'
        if (mois === 1) return 'bg-yellow-100 text-yellow-800'
        if (mois >= 2 && mois <= 3) return 'bg-orange-100 text-orange-800'
        return 'bg-red-500 text-white'
    }

    useEffect(() => {
        fetchEtudiants()
    }, [])

    useEffect(() => {
        const filtered = etudiants.filter(etudiant =>
            etudiant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            etudiant.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            etudiant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            etudiant.tel.includes(searchTerm)
        )
        setFilteredEtudiants(filtered)
    }, [etudiants, searchTerm])

    const fetchEtudiants = async () => {
        try {
            const response = await fetch('/api/etudiants/getAll');
            const data = await response.json();
            console.log(data)

            const formattedEtudiants = data.map(etudiant => ({
                id: etudiant.id,
                img: etudiant.img,
                nom: etudiant.nom,
                prenom: etudiant.prenom,
                birth: new Date(etudiant.birth).toLocaleDateString('fr-FR'),
                tel: etudiant.tel,
                email: etudiant.email,
                cin: etudiant.cin,
                bio: etudiant.bio,
                rabais: etudiant.rabais,
                moisNonPayes: etudiant.moisNonPayes
            }));

            setEtudiants(formattedEtudiants);
            setFilteredEtudiants(formattedEtudiants);
        } catch (error) {
            console.error('خطأ أثناء استرجاع الطلاب:', error);
        } finally {
            y(false)
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('هل أنت متأكد؟')) return
        try {
            const response = await fetch('/api/etudiants/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ etudiantID: id }),
            });

            if (response.ok) {
                setEtudiants(etudiants.filter(etudiant => etudiant.id !== id));
                setFilteredEtudiants(filteredEtudiants.filter(etudiant => etudiant.id !== id));
            } else {
                console.error('Failed to delete student');
            }
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    }

    const handleDownload = async () => {
        try {
            const response = await fetch('/api/_backups/etudiants');

            if (!response.ok) {
                throw new Error('Erreur de connexion');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'etudiants.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading the file:', error);
        }
    }

    if (x) {
        return (
            <div className='w-screen flex justify-center items-center maxtop'>
                <Loading />
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>الطلاب - أكاديمية نبوغ</title>
                <link rel="icon" href="/logo2-nobg.png" />
            </Head>

            <div className="max-w-full relative" dir="rtl">
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

                <div className="mb-12 text-center pt-8 relative">
                    <div className="inline-block">
                        <div className="flex items-center justify-center mb-2">
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-700"></div>
                            <Sparkles className="text-amber-800 mx-4 w-6 h-6" />
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-700"></div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">قائمة الطلاب</h1>
                        <div className="flex items-center justify-center mt-2">
                            <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                            <Moon className="text-amber-800 mx-4 w-4 h-4" />
                            <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                        </div>
                    </div>
                    <p className="text-gray-600 mt-4 max-w-xl mx-auto">إدارة ومتابعة مسار طلابك</p>
                </div>

                <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 px-4 py-4 max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                        <button
                            className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-all flex items-center w-full sm:w-auto"
                            onClick={filterEtudiants}
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            <span>{filter === 'tous' ? 'الكل' : 'غير مدفوع'}</span>
                        </button>

                        <div className="relative w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="بحث..."
                                className="w-full sm:w-auto px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
                        </div>
                    </div>

                    <button
                        onClick={() => setActiveTab('ajouterEtudiant')}
                        className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        <span className="font-medium">إضافة</span>
                    </button>

                    <button
                        onClick={handleDownload}
                        className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                </div>

                <div className="max-w-6xl mx-auto md:px-6 pb-16">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 overflow-x-scroll md:overflow-x-scroll">
                                <thead className="bg-amber-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الصورة</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم واللقب</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">البريد الإلكتروني</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الهاتف</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الهوية</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الشهور غير المدفوعة</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التفاصيل</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حذف</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredEtudiants.map((etudiant) => (
                                        <tr key={etudiant.id} className="hover:bg-gray-100 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img
                                                            src={etudiant.img ? atob(etudiant.img.split(',')[1]) : '/user.jpg'}
                                                            alt={`${etudiant.prenom} ${etudiant.nom}`}
                                                            className="h-full w-full rounded-full shrink-0"
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {etudiant.prenom} {etudiant.nom}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    خصم: {etudiant.rabais}%
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{etudiant.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{etudiant.tel}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{etudiant.cin}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getMoisNonPayesColor(etudiant.moisNonPayes)}`}>
                                                    {etudiant.moisNonPayes ? (etudiant.moisNonPayes == 0 ? 'محدث' : `${etudiant.moisNonPayes} شهر`) : 'محدث'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                                <button
                                                    onClick={() => { setActiveTab('etudiant'); sessionStorage.setItem('etudiant', etudiant.id) }}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    <Info className="w-5 h-5" />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                                <button
                                                    onClick={() => handleDelete(etudiant.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}