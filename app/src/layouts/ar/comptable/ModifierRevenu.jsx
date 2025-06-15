import { useState, useEffect } from 'react'
import {
    ArrowRight, Calendar, DollarSign, FileText,
    CheckCircle, AlertCircle, Save, Trash2
} from 'lucide-react'

export default function ModifierRevenu({ setActiveTab, revenus, setRevenus }) {
    const [revenuID, setRevenuID] = useState('')

    useEffect(() => {
        const temp = sessionStorage.getItem('revenu')
        if (!temp) setActiveTab('revenus')
        else setRevenuID(temp)
    }, [])

    const [formData, setFormData] = useState({
        type: 'Inscriptions',
        montant: '',
        created_At: new Date().toISOString().split('T')[0],
        label: '',
        remarque: ''
    })
    const [showSuccess, setShowSuccess] = useState(false)
    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.type) newErrors.type = "الرجاء اختيار نوع"
        if (!formData.montant) {
            newErrors.montant = "الرجاء إدخال المبلغ"
        } else if (isNaN(formData.montant) || parseFloat(formData.montant) <= 0) {
            newErrors.montant = "الرجاء إدخال مبلغ صحيح"
        }
        if (!formData.created_At) newErrors.created_At = "الرجاء اختيار تاريخ"
        if (!formData.label) newErrors.label = "الرجاء إدخال تسمية"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    useEffect(() => {
        const fetchRevenu = async () => {
            if(revenuID === "") return
            try {
                const response = await fetch(`/api/finance/getRevenu?revenuID=${revenuID}`);
                const data = await response.json();

                if (data) {
                    setFormData({
                        type: data.type,
                        montant: data.montant.toString(),
                        created_At: new Date(data.created_At).toISOString().split('T')[0],
                        label: data.label,
                        remarque: data.descr || ''
                    });
                }
            } catch (error) {
                console.error('خطأ أثناء استرجاع الإيرادات:', error);
            }
        };

        fetchRevenu();
    }, [revenuID]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const response = await fetch('/api/finance/updateRevenu', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: revenuID,
                        label: formData.label,
                        type: formData.type,
                        montant: parseFloat(formData.montant),
                        descr: formData.remarque,
                        created_At: formData.created_At
                    }),
                });

                if (response.ok) {
                    const updatedRevenu = await response.json();
                    setRevenus(prev => prev.map(rev =>
                        rev.id === revenuID ? updatedRevenu : rev
                    ));
                    setShowSuccess(true);
                    setTimeout(() => {
                        setShowSuccess(false);
                        setActiveTab('revenus');
                    }, 2000);
                } else {
                    const data = await response.json();
                    setErrors({ submit: data.message || 'خطأ أثناء تعديل الإيرادات' });
                }
            } catch (error) {
                console.error('خطأ أثناء تعديل الإيرادات:', error);
                setErrors({ submit: 'حدث خطأ. الرجاء المحاولة مرة أخرى لاحقًا.' });
            }
        }
    };

    if (!revenus.some(rev => rev.id == revenuID)) {
        return (
            <div className="pt-4 pb-16" dir="rtl">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => setActiveTab('revenus')}
                        className="ml-4 p-2 rounded-full hover:bg-amber-100 transition-colors duration-200"
                    >
                        <ArrowRight className="w-5 h-5 text-amber-800" />
                    </button>
                    <h2 className="text-xl md:text-2xl font-semibold text-amber-800">تعديل إيرادات</h2>
                </div>

                <div className="p-6 bg-amber-50 border-r-4 border-amber-500 rounded-md flex items-start">
                    <AlertCircle className="w-5 h-5 text-amber-500 ml-3 mt-0.5" />
                    <div>
                        <h3 className="font-medium text-amber-800">الإيرادات غير موجودة</h3>
                        <p className="text-amber-700 mt-1">الإيرادات التي تحاول تعديلها غير موجودة أو تم حذفها.</p>
                        <button
                            onClick={() => setActiveTab('revenus')}
                            className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors duration-300"
                        >
                            العودة إلى قائمة الإيرادات
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="pt-4 pb-16" dir="rtl">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => setActiveTab('revenus')}
                    className="ml-4 p-2 rounded-full hover:bg-amber-100 transition-colors duration-200"
                >
                    <ArrowRight className="w-5 h-5 text-amber-800" />
                </button>
                <h2 className="text-xl md:text-2xl font-semibold text-amber-800">تعديل إيرادات</h2>
            </div>

            {showSuccess && (
                <div className="mb-6 p-4 bg-green-50 border-r-4 border-green-500 rounded-md flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 ml-3" />
                    <span className="text-green-700">تم تعديل الإيرادات بنجاح!</span>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-100">
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-amber-800 mb-1">
                                نوع الإيرادات *
                            </label>
                            <div className="relative">
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className={`w-full border ${errors.type ? 'border-red-300' : 'border-amber-200'} p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10`}
                                >
                                    <option value="inscriptions">التسجيلات</option>
                                    <option value="paiements_mensuels">المدفوعات الشهرية</option>
                                    <option value="dons">التبرعات</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <FileText className="h-5 w-5 text-amber-600" />
                                </div>
                            </div>
                            {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-amber-800 mb-1">
                                المبلغ (درهم) *
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="montant"
                                    value={formData.montant}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className={`w-full border ${errors.montant ? 'border-red-300' : 'border-amber-200'} p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10`}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <DollarSign className="h-5 w-5 text-amber-600" />
                                </div>
                            </div>
                            {errors.montant && <p className="mt-1 text-sm text-red-600">{errors.montant}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-amber-800 mb-1">
                                التاريخ *
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="created_At"
                                    value={formData.created_At}
                                    onChange={handleChange}
                                    className={`w-full border ${errors.created_At ? 'border-red-300' : 'border-amber-200'} p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10`}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-amber-600" />
                                </div>
                            </div>
                            {errors.created_At && <p className="mt-1 text-sm text-red-600">{errors.created_At}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-amber-800 mb-1">
                                التسمية *
                            </label>
                            <input
                                type="text"
                                name="label"
                                value={formData.label}
                                onChange={handleChange}
                                placeholder="أدخل تسمية وصفية"
                                className={`w-full border ${errors.label ? 'border-red-300' : 'border-amber-200'} p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
                            />
                            {errors.label && <p className="mt-1 text-sm text-red-600">{errors.label}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-amber-800 mb-1">
                                ملاحظة (اختياري)
                            </label>
                            <textarea
                                name="remarque"
                                value={formData.remarque}
                                onChange={handleChange}
                                rows="3"
                                placeholder="أضف تفاصيل إضافية إذا لزم الأمر"
                                className="w-full border border-amber-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                            ></textarea>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-start">
                        <button
                            type="button"
                            onClick={() => setActiveTab('revenus')}
                            className="px-4 py-2 ml-4 border border-amber-300 text-amber-700 rounded-md hover:bg-amber-50 transition-colors duration-300"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors duration-300 flex items-center"
                        >
                            <Save className="w-4 h-4 ml-2" />
                            حفظ التعديلات
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}