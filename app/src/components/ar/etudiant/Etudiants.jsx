import {
    Search, Filter, Users, Clock, Navigation, Flag, TrendingUp,
    Tag, DollarSign, BookOpen, User, Bookmark, Check, FileText,
    ArrowRight, Heart, Star, ChevronDown, Grid, List, Mail, Phone,
    Calendar, Info, MessageCircle, Library, Book, Video, File, Download,
    PlusCircle, Send, Paperclip, Image, FileText as FileIcon, Delete,
    MapPin, Moon, Sparkles
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

const Etudiants = ({ formationID }) => {
    const [etudiants, setEtudiants] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredEtudiants, setFilteredEtudiants] = useState([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('grille');
    const [filters, setFilters] = useState({
        genre: 'tous',
        age: 'tous'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = etudiants.filter(etudiant => {
            const nomComplet = `${etudiant.prenom} ${etudiant.nom}`.toLowerCase();
            const matchQuery = nomComplet.includes(query) ||
                          etudiant.email.toLowerCase().includes(query) ||
                          etudiant.bio.toLowerCase().includes(query);
            const matchGenre = filters.genre === 'tous' || etudiant.genre === filters.genre;
            const matchAge = filters.age === 'tous' || checkAgeGroup(etudiant.birth, filters.age);
            return matchQuery && matchGenre && matchAge;
        });
        setFilteredEtudiants(filtered);
    };

    const checkAgeGroup = (birthDate, ageGroup) => {
        if (!birthDate) return false;
        const today = new Date();
        const birth = new Date(birthDate);
        const age = today.getFullYear() - birth.getFullYear();

        switch (ageGroup) {
            case 'moins18': return age < 18;
            case '18-25': return age >= 18 && age <= 25;
            case '26-35': return age >= 26 && age <= 35;
            case 'plus35': return age > 35;
            default: return true;
        }
    };

    const handleFilterChange = (filterType, value) => {
        setFilters({
            ...filters,
            [filterType]: value
        });
    };

    useEffect(() => {
        if (etudiants && etudiants.length > 0) {
            const filtered = etudiants.filter(etudiant => {
                const nomComplet = `${etudiant.prenom} ${etudiant.nom}`.toLowerCase();
                const matchQuery = searchQuery === '' ||
                                nomComplet.includes(searchQuery.toLowerCase()) ||
                                etudiant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                etudiant.bio.toLowerCase().includes(searchQuery.toLowerCase());
                const matchGenre = filters.genre === 'tous' || etudiant.genre === filters.genre;
                const matchAge = filters.age === 'tous' || checkAgeGroup(etudiant.birth, filters.age);
                return matchQuery && matchGenre && matchAge;
            });
            setFilteredEtudiants(filtered);
        }
    }, [filters, searchQuery, etudiants]);

    const cancelFilters = () => {
        setFilters({
            genre: 'tous',
            age: 'tous'
        });
        setFilterOpen(false);
    };

    const PatternDecoration = () => (
        <div className="absolute left-0 top-0 w-24 h-24 opacity-10 -rotate-45">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0L60 40H100L70 65L80 100L50 80L20 100L30 65L0 40H40L50 0Z" fill="currentColor" />
            </svg>
        </div>
    );

    useEffect(() => {
        const fetchEtudiants = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/formation/getEtudiants?formationID=${formationID}`);

                if (!response.ok) {
                    throw new Error('خطأ أثناء استرجاع الطلاب');
                }

                const data = await response.json();
                console.log(data);
                const formattedEtudiants = data.map(etudiant => ({
                    ...etudiant,
                    img: etudiant.img ? atob(Buffer.from(etudiant.img).toString('base64')) : null,
                    birth: new Date(etudiant.birth).toISOString(),
                    dateInscr: new Date(etudiant.dateInscr).toISOString()
                }));

                setEtudiants(formattedEtudiants);
                setFilteredEtudiants(formattedEtudiants);
            } catch (error) {
                console.error('خطأ أثناء استرجاع الطلاب:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEtudiants();
    }, [formationID]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-5xl mx-auto p-8 text-center">
                <div className="bg-red-50 border-r-4 border-red-500 p-4 rounded-md mb-4">
                    <h2 className="text-red-700 font-medium">خطأ في التحميل</h2>
                    <p className="text-red-600">{error}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="text-amber-600 hover:text-amber-800 underline"
                >
                    إعادة المحاولة
                </button>
            </div>
        );
    }

    if (etudiants.length === 0) {
        return (
            <div className="max-w-5xl mx-auto p-8 text-center">
                <div className="bg-amber-50 border-r-4 border-amber-500 p-4 rounded-md mb-4">
                    <h2 className="text-amber-700 font-medium">لم يتم العثور على أي طالب</h2>
                    <p className="text-amber-600">لا يوجد طلاب مسجلين في هذا التكوين.</p>
                </div>
            </div>
        );
    }

    return (
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
                <p className="text-gray-600 mt-4 max-w-xl mx-auto">اكتشف المشاركين في مجتمع التعلم لدينا</p>
            </div>

            <div className="mb-8 relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-amber-700" />
                </div>
                <input
                    type="text"
                    className="block w-full pr-12 pl-4 py-4 border-0 rounded-xl bg-white/80 shadow-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700"
                    placeholder="ابحث عن طالب حسب الاسم، البريد الإلكتروني أو السيرة الذاتية..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <div className="absolute left-3 top-3 flex space-x-2">
                    <button
                        className="p-2 bg-amber-100 text-amber-800 rounded-lg flex items-center shadow-sm hover:bg-amber-200 transition-all"
                        onClick={() => setFilterOpen(!filterOpen)}
                    >
                        <Filter className="w-4 h-4 ml-1" />
                        <span className="text-sm font-medium">المرشحات</span>
                    </button>
                    <div className="flex bg-amber-100 rounded-lg shadow-sm">
                        <button
                            onClick={() => setActiveTab('grille')}
                            className={`p-2 rounded-r-lg flex items-center ${activeTab === 'grille' ? 'bg-amber-700 text-white' : 'text-amber-800 hover:bg-amber-200'} transition-all`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setActiveTab('liste')}
                            className={`p-2 rounded-l-lg flex items-center ${activeTab === 'liste' ? 'bg-amber-700 text-white' : 'text-amber-800 hover:bg-amber-200'} transition-all`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {filterOpen && (
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl mb-10 max-w-5xl mx-auto border border-amber-100">
                    <div className="flex items-center mb-6">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-bl from-amber-400 to-amber-700 flex items-center justify-center shadow-md">
                            <Filter className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold mr-3 text-gray-800">المرشحات المتقدمة</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">الجنس</label>
                            <div className="relative">
                                <select
                                    className="w-full p-3 pl-10 border border-amber-200 rounded-lg bg-white/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700 appearance-none"
                                    value={filters.genre}
                                    onChange={(e) => handleFilterChange('genre', e.target.value)}
                                >
                                    <option value="tous">كل الأجناس</option>
                                    <option value="homme">رجال</option>
                                    <option value="femme">نساء</option>
                                </select>
                                <div className="absolute inset-y-0 left-0 flex items-center px-2 pointer-events-none">
                                    <ChevronDown className="h-5 w-5 text-amber-700" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">العمر</label>
                            <div className="relative">
                                <select
                                    className="w-full p-3 pl-10 border border-amber-200 rounded-lg bg-white/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700 appearance-none"
                                    value={filters.age}
                                    onChange={(e) => handleFilterChange('age', e.target.value)}
                                >
                                    <option value="tous">كل الأعمار</option>
                                    <option value="moins18">أقل من 18 سنة</option>
                                    <option value="18-25">18 إلى 25 سنة</option>
                                    <option value="26-35">26 إلى 35 سنة</option>
                                    <option value="plus35">أكثر من 35 سنة</option>
                                </select>
                                <div className="absolute inset-y-0 left-0 flex items-center px-2 pointer-events-none">
                                    <ChevronDown className="h-5 w-5 text-amber-700" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-start">
                        <button
                            className="px-6 py-3 bg-gradient-to-l from-amber-600 to-amber-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center"
                            onClick={cancelFilters}
                        >
                            <span className="font-medium">إعادة تعيين المرشحات</span>
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'grille' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto pb-16">
                    {filteredEtudiants.map((etudiant) => (
                        <div key={etudiant.id} className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-2xl group relative">
                            <div className="p-6 relative">
                                <PatternDecoration />
                                <div className="flex flex-col items-center mb-4">
                                    <img
                                        src={etudiant.img || '/user.jpg'}
                                        alt={`${etudiant.prenom} ${etudiant.nom}`}
                                        className="w-24 h-24 rounded-full object-cover border-4 border-amber-100 shadow-md mb-4"
                                    />
                                    <h3 className="text-xl font-bold text-amber-800 mb-1">{etudiant.prenom} {etudiant.nom}</h3>
                                    <p className="text-gray-500 text-sm">مسجل في {new Date(etudiant.dateInscr).toLocaleDateString('ar-EG')}</p>
                                </div>

                                <div className="mb-5 border-t border-amber-100 pt-4">
                                    <h4 className="text-lg font-semibold text-amber-700 mb-3 flex items-center">
                                        <Info className="w-4 h-4 ml-2" />
                                        معلومات الاتصال
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center bg-amber-50 p-2 rounded-lg">
                                            <Mail className="w-4 h-4 text-amber-700 ml-2" />
                                            <span className="text-gray-700 text-sm">{etudiant.email}</span>
                                        </div>
                                        <div className="flex items-center bg-amber-50 p-2 rounded-lg">
                                            <Phone className="w-4 h-4 text-amber-700 ml-2" />
                                            <span className="text-gray-700 text-sm">{etudiant.tel}</span>
                                        </div>
                                        <div className="flex items-center bg-amber-50 p-2 rounded-lg">
                                            <Calendar className="w-4 h-4 text-amber-700 ml-2" />
                                            <span className="text-gray-700 text-sm">ولد في {new Date(etudiant.birth).toLocaleDateString('ar-EG')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-amber-100 pt-4">
                                    <h4 className="text-lg font-semibold text-amber-700 mb-3 flex items-center">
                                        <User className="w-4 h-4 ml-2" />
                                        السيرة الذاتية
                                    </h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">{etudiant.bio}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'liste' && (
                <div className="space-y-6 max-w-6xl mx-auto pb-16">
                    {filteredEtudiants.map((etudiant) => (
                        <div key={etudiant.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-amber-100 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex flex-col md:flex-row">
                                <div className="p-6 md:w-64 flex flex-col items-center justify-center border-l border-amber-100">
                                    <img
                                        src={etudiant.img || '/user.jpg'}
                                        alt={`${etudiant.prenom} ${etudiant.nom}`}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-amber-100 shadow-md mb-4"
                                    />
                                    <h3 className="text-lg font-bold text-amber-800 text-center">{etudiant.prenom} {etudiant.nom}</h3>
                                    <p className="text-gray-500 text-sm text-center">مسجل في {new Date(etudiant.dateInscr).toLocaleDateString('ar-EG')}</p>
                                </div>
                                <div className="p-6 flex-1">
                                    <div className="mb-5">
                                        <h4 className="text-lg font-semibold text-amber-700 mb-3 flex items-center">
                                            <Info className="w-4 h-4 ml-2" />
                                            معلومات الاتصال
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div className="flex items-center bg-amber-50 p-2 rounded-lg">
                                                <Mail className="w-4 h-4 text-amber-700 ml-2" />
                                                <span className="text-gray-700 text-sm">{etudiant.email}</span>
                                            </div>
                                            <div className="flex items-center bg-amber-50 p-2 rounded-lg">
                                                <Phone className="w-4 h-4 text-amber-700 ml-2" />
                                                <span className="text-gray-700 text-sm">{etudiant.tel}</span>
                                            </div>
                                            <div className="flex items-center bg-amber-50 p-2 rounded-lg">
                                                <Calendar className="w-4 h-4 text-amber-700 ml-2" />
                                                <span className="text-gray-700 text-sm">ولد في {new Date(etudiant.birth).toLocaleDateString('ar-EG')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-amber-100 pt-4">
                                        <h4 className="text-lg font-semibold text-amber-700 mb-3 flex items-center">
                                            <User className="w-4 h-4 ml-2" />
                                            السيرة الذاتية
                                        </h4>
                                        <p className="text-gray-600 text-sm leading-relaxed">{etudiant.bio}</p>
                                    </div>

                                    <div className="mt-6 flex justify-start">
                                        <button className="px-6 py-3 bg-gradient-to-l from-amber-600 to-amber-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center cursor-pointer">
                                            <span className="font-medium">اتصل</span>
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {filteredEtudiants.length === 0 && (
                <div className="bg-white p-10 rounded-2xl shadow-md border border-amber-100 text-center relative overflow-hidden max-w-4xl mx-auto">
                    <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-amber-600/30 to-transparent"></div>
                    <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-amber-600/30 to-transparent"></div>

                    <Search className="w-16 h-16 text-amber-300 mx-auto mb-5" />
                    <h3 className="text-xl font-bold mb-3 text-amber-900">لم يتم العثور على أي طالب</h3>
                    <p className="text-gray-600 mb-6">لا يوجد طلاب يتوافقون مع معايير البحث الخاصة بك.</p>
                    <button
                        className="px-6 py-3 bg-gradient-to-l from-amber-600 to-amber-800 text-white rounded-xl hover:from-amber-700 hover:to-amber-900 transition-all cursor-pointer font-medium"
                        onClick={() => {
                            setSearchQuery('');
                            setFilters({
                                genre: 'tous',
                                age: 'tous'
                            });
                            setFilteredEtudiants(etudiants);
                        }}
                    >
                        إعادة تعيين المرشحات
                    </button>
                </div>
            )}
        </div>
    );
};

export default Etudiants;