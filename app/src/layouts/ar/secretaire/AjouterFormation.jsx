import {
    Search, Filter, Users, Clock, Navigation, Flag, TrendingUp,
    Tag, DollarSign, BookOpen, User, Bookmark, Check, FileText,
    ArrowRight, Heart, Star, ChevronDown, Grid, List, Moon, Sparkles,
    Plus, X, Upload, Calendar, Clock3, School, Trash2
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { categoriesAr, sallesAr, joursAr } from '@/utils/Constants';

export default function AjouterFormation({ setActiveTab }) {
    const fileInputRef = useRef(null);
    const [formateurs, setFormateurs] = useState([]);

    const [formData, setFormData] = useState({
        titre: "",
        descr: "",
        img: "/formation.jpg",
        prix: 0,
        formateur: "",
        duree: 3,
        categorie: categoriesAr[0],
        type: "Avie",
        genre: "tous",
        salle: sallesAr[0],
        etudiants: 0,
        tags: [],
        seances: []
    });

    const [tempSeance, setTempSeance] = useState({
        jour: joursAr[0],
        horaire: "18:00"
    });

    const [tagInput, setTagInput] = useState("");

    useEffect(() => {
        const fetchFormateurs = async () => {
            try {
                const response = await fetch('/api/profs/getAll');
                const data = await response.json();
                setFormateurs(data);

                if (data.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        formateur: data[0].id.toString()
                    }));
                }
            } catch (error) {
                console.error('خطأ أثناء استرجاع المدرسين:', error);
            }
        };

        fetchFormateurs();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                setFormData({
                    ...formData,
                    img: loadEvent.target.result
                });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleTempSeanceChange = (e) => {
        const { name, value } = e.target;
        setTempSeance({
            ...tempSeance,
            [name]: value
        });
    };

    const handleAddSeance = () => {
        if (tempSeance.jour && tempSeance.horaire) {
            setFormData({
                ...formData,
                seances: [...formData.seances, { ...tempSeance }]
            });
        }
    };

    const handleRemoveSeance = (index) => {
        const updatedSeance = formData.seances.filter((_, idx) => idx !== index);
        setFormData({
            ...formData,
            seances: updatedSeance
        });
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({
                ...formData,
                tags: [...formData.tags, tagInput.trim()]
            });
            setTagInput("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleRemoveTag = (index) => {
        const updatedTags = formData.tags.filter((_, idx) => idx !== index);
        setFormData({
            ...formData,
            tags: updatedTags
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const imageBase64 = formData.img.split(',')[1];

            const submissionData = {
                ...formData,
                img: imageBase64,
                formateur: parseInt(formData.formateur)
            };

            const response = await fetch('/api/formations/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            if (response.ok) {
                setActiveTab('formations');
            } else {
                const data = await response.json();
                console.error('خطأ أثناء إضافة الدورة:', data.message);
            }
        } catch (error) {
            console.error('خطأ أثناء إرسال البيانات:', error);
        }
    };

    const PatternDecoration = () => (
        <div className="absolute left-0 top-0 w-24 h-24 opacity-10 -rotate-45">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0L60 40H100L70 65L80 100L50 80L20 100L30 65L0 40L40 40Z" fill="currentColor" />
            </svg>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto relative pb-16 pt-8" dir="rtl">
            {/* Motifs décoratifs */}
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

            {/* Titre avec ornement */}
            <div className="mb-8 text-center relative">
                <div className="inline-block">
                    <div className="flex items-center justify-center mb-2">
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-700"></div>
                        <Sparkles className="text-amber-800 mx-4 w-6 h-6" />
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-700"></div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">إضافة دورة</h1>
                    <div className="flex items-center justify-center mt-2">
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                        <Moon className="text-amber-800 mx-4 w-4 h-4" />
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                    </div>
                </div>
                <p className="text-gray-600 mt-4 max-w-xl mx-auto">أنشئ دورة جديدة لإثراء كتالوجنا</p>
            </div>

            {/* Formulaire avec design islamique */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-100 p-8 relative">
                <PatternDecoration />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Section Informations générales */}
                    <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-bl from-amber-400 to-amber-700 flex items-center justify-center shadow-md ml-3">
                                <FileText className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-amber-900">المعلومات العامة</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Titre */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">عنوان الدورة</label>
                                <input
                                    type="text"
                                    name="titre"
                                    value={formData.titre}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    placeholder="مثال: تصميم الويب مع ووردبريس"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">الوصف</label>
                                <textarea
                                    name="descr"
                                    value={formData.descr}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    placeholder="صف محتوى وأهداف هذه الدورة..."
                                    required
                                ></textarea>
                            </div>

                            {/* Image */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">الصورة</label>
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="w-32 h-32 relative rounded-lg overflow-hidden bg-amber-50 border border-amber-200">
                                        {formData.img && (
                                            <img
                                                src={formData.img}
                                                alt="معاينة"
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current.click()}
                                            className="w-full px-4 py-3 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-all flex items-center justify-center gap-2 border border-amber-200"
                                        >
                                            <Upload className="w-5 h-5" />
                                            <span>اختيار صورة</span>
                                        </button>
                                        <p className="text-xs text-gray-500 mt-2">التنسيق الموصى به: 800x600px، JPG أو PNG</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section Détails */}
                    <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-bl from-amber-400 to-amber-700 flex items-center justify-center shadow-md ml-3">
                                <Tag className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-amber-900">تفاصيل الدورة</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Prix */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">السعر (درهم)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <DollarSign className="h-5 w-5 text-amber-700" />
                                    </div>
                                    <input
                                        type="number"
                                        name="prix"
                                        value={formData.prix}
                                        onChange={handleChange}
                                        min="0"
                                        className="w-full pr-10 pl-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Formateur */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">المدرس</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-amber-700" />
                                    </div>
                                    <select
                                        name="formateur"
                                        value={formData.formateur}
                                        onChange={handleChange}
                                        className="w-full pr-10 pl-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none"
                                        required
                                    >
                                        {formateurs.map((formateur) => (
                                            <option key={formateur.id} value={formateur.id}>
                                                {formateur.prenom} {formateur.nom}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 left-0 flex items-center px-2 pointer-events-none">
                                        <ChevronDown className="h-5 w-5 text-amber-700" />
                                    </div>
                                </div>
                            </div>

                            {/* Catégorie */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">الفئة</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <BookOpen className="h-5 w-5 text-amber-700" />
                                    </div>
                                    <select
                                        name="categorie"
                                        value={formData.categorie}
                                        onChange={handleChange}
                                        className="w-full pr-10 pl-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none"
                                        required
                                    >
                                        {categoriesAr.map((categorie, index) => (
                                            <option key={index} value={categorie}>{categorie}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 left-0 flex items-center px-2 pointer-events-none">
                                        <ChevronDown className="h-5 w-5 text-amber-700" />
                                    </div>
                                </div>
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">النوع</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <Navigation className="h-5 w-5 text-amber-700" />
                                    </div>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="w-full pr-10 pl-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none"
                                        required
                                    >
                                        <option value="Avie">مدى الحياة</option>
                                        <option value="Niveaux">شهادات حسب المستوى</option>
                                        <option value="Cycle">مدة محددة</option>
                                    </select>
                                    <div className="absolute inset-y-0 left-0 flex items-center px-2 pointer-events-none">
                                        <ChevronDown className="h-5 w-5 text-amber-700" />
                                    </div>
                                </div>
                            </div>

                            {/* Durée */}
                            {formData.type !== "Avie" &&
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">المدة (شهور)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <Clock className="h-5 w-5 text-amber-700" />
                                        </div>
                                        <input
                                            type="number"
                                            name="duree"
                                            value={formData.duree}
                                            onChange={handleChange}
                                            min="0"
                                            className="w-full pr-10 pl-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            }

                            {/* Genre */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">الجنس</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <Users className="h-5 w-5 text-amber-700" />
                                    </div>
                                    <select
                                        name="genre"
                                        value={formData.genre}
                                        onChange={handleChange}
                                        className="w-full pr-10 pl-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none"
                                        required
                                    >
                                        <option value="tous">الجميع</option>
                                        <option value="Hommes">رجال</option>
                                        <option value="Femmes">نساء</option>
                                        <option value="Enfants">أطفال</option>
                                        <option value="Préadolescents">ما قبل المراهقة</option>
                                        <option value="Jeunes">شباب</option>
                                    </select>
                                    <div className="absolute inset-y-0 left-0 flex items-center px-2 pointer-events-none">
                                        <ChevronDown className="h-5 w-5 text-amber-700" />
                                    </div>
                                </div>
                            </div>

                            {/* Salle */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2 text-gray-700">القاعة</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <School className="h-5 w-5 text-amber-700" />
                                    </div>
                                    <select
                                        name="salle"
                                        value={formData.salle}
                                        onChange={handleChange}
                                        className="w-full pr-10 pl-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none"
                                        required
                                    >
                                        {sallesAr.map((salle, index) => (
                                            <option key={index} value={salle}>{salle}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 left-0 flex items-center px-2 pointer-events-none">
                                        <ChevronDown className="h-5 w-5 text-amber-700" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-bl from-amber-400 to-amber-700 flex items-center justify-center shadow-md ml-3">
                                <Tag className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-amber-900">العلامات</h3>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {formData.tags.map((tag, index) => (
                                <div key={index} className="bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full flex items-center">
                                    <span className="text-sm">{tag}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(index)}
                                        className="mr-2 text-amber-700 hover:text-amber-900"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {formData.tags.length === 0 && (
                                <div className="text-gray-500 text-sm italic">لم يتم إضافة أي علامة</div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="إضافة علامة (مثال: ووردبريس، القرآن...)"
                                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">اضغط على Enter أو انقر على + لإضافة علامة</p>
                    </div>

                    {/* Séance */}
                    <div>
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-bl from-amber-400 to-amber-700 flex items-center justify-center shadow-md ml-3">
                                <Calendar className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-amber-900">برنامج الجلسات</h3>
                        </div>

                        <div className="mb-4">
                            {formData.seances.length > 0 ? (
                                <div className="space-y-2 mb-4">
                                    {formData.seances.map((seance, index) => (
                                        <div key={index} className="flex items-center justify-between bg-amber-50 p-3 rounded-lg border border-amber-100">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 text-amber-700 ml-2" />
                                                <span className="text-gray-700 font-medium">{seance.jour}</span>
                                                <div className="mx-2 w-1 h-1 bg-amber-700 rounded-full"></div>
                                                <Clock3 className="w-4 h-4 text-amber-700 ml-2" />
                                                <span className="text-gray-700">{seance.horaire}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSeance(index)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-gray-500 text-sm italic mb-4">لا يوجد جلسات مجدولة</div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <Calendar className="h-5 w-5 text-amber-700" />
                                    </div>
                                    <select
                                        name="jour"
                                        value={tempSeance.jour}
                                        onChange={handleTempSeanceChange}
                                        className="w-full pr-10 pl-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    >
                                        {joursAr.map((jour, index) => (
                                            <option key={index} value={jour}>{jour}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <Clock3 className="h-5 w-5 text-amber-700" />
                                    </div>
                                    <input
                                        type="time"
                                        name="horaire"
                                        value={tempSeance.horaire}
                                        onChange={handleTempSeanceChange}
                                        className="w-full pr-10 pl-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddSeance}
                                    className="px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all sm:w-auto w-full"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex justify-between pt-6 border-t border-amber-200">
                        <button
                            type="button"
                            onClick={() => setActiveTab('formations')}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-gradient-to-l from-amber-600 to-amber-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center"
                        >
                            <span className="font-medium">إضافة الدورة</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}