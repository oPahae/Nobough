import {
    Calendar, User, Phone, Mail, CreditCard, GraduationCap, Trash2, Info, Plus, X, Sparkles, Moon
} from 'lucide-react';
import { useState, useRef } from 'react';

const AjouterEtudiant = ({ setActiveTab, setNotification }) => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        birth: '',
        tel: '',
        email: '',
        cin: '',
        rabais: 0,
        img: '',
        password: ''
    });

    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
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
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitAdd = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/etudiants/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to add student');
            }

            setNotification({ type: 'success', message: 'تمت إضافة الطالب بنجاح!' });
            setActiveTab('etudiants');
        } catch (error) {
            console.error('Error adding student:', error);
            setNotification({ type: 'error', message: 'خطأ أثناء إضافة الطالب.' });
        }
    };

    return (
        <div className='w-full md:px-22' dir="rtl">
            <div className="w-full flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-full">
                    <div className="p-6 border-b border-amber-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-800">إضافة طالب جديد</h3>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitAdd} className="p-6 space-y-6">
                        <div className="flex flex-col items-center mb-6">
                            <div
                                className="w-32 h-32 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden cursor-pointer mb-3"
                                onClick={() => fileInputRef.current.click()}
                            >
                                {formData.img ? (
                                    <img src={formData.img} alt="معاينة" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-16 h-16 text-amber-300" />
                                )}
                            </div>
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
                                className="text-sm text-amber-700 hover:text-amber-800"
                            >
                                اختيار صورة
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">الاسم الشخصي</label>
                                <input
                                    type="text"
                                    name="prenom"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-amber-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">الاسم العائلي</label>
                                <input
                                    type="text"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-amber-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">تاريخ الميلاد</label>
                                <input
                                    type="date"
                                    name="birth"
                                    value={formData.birth}
                                    onChange={handleChange}
                                    placeholder="يوم/شهر/سنة"
                                    className="w-full p-3 border border-amber-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">الهاتف</label>
                                <input
                                    type="tel"
                                    name="tel"
                                    value={formData.tel}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-amber-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-amber-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">رقم البطاقة الوطنية</label>
                                <input
                                    type="text"
                                    name="cin"
                                    value={formData.cin}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-amber-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">الخصم (%)</label>
                                <input
                                    type="number"
                                    max={100}
                                    min={0}
                                    name="rabais"
                                    value={formData.rabais}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-amber-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">كلمة السر</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-amber-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-start space-x-4">
                            <button
                                type="button"
                                onClick={() => setActiveTab('etudiants')}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                            >
                                إلغاء
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 font-medium"
                            >
                                إضافة الطالب
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AjouterEtudiant;