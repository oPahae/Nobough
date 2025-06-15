import {
    User, Mail, Phone, Calendar, Edit, Save, X, DollarSign,
    Check, AlertCircle, CreditCard, Clock, Info,
    ArrowRight
} from 'lucide-react';

const EtudiantPaiement = ({ paiements, setPaiements, setNotification }) => {
    const totalPaye = paiements.reduce((total, paiement) => total + (paiement.status === "paye" ? paiement.total : 0), 0);
    const totalAPayer = paiements.reduce((total, paiement) => total + paiement.total, 0) - totalPaye;

    const PatternDecoration = () => (
        <div className="absolute left-0 top-0 w-24 h-24 opacity-10 -rotate-45">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0L60 40H100L70 65L80 100L50 80L20 100L30 65L0 40H40L50 0Z" fill="currentColor" />
            </svg>
        </div>
    );

    const handlePaiementChange = async (index, id) => {
        try {
            const response = await fetch(`/api/paiements/${paiements[index].status === 'nonpaye' ? 'validerPaiement' : 'annulerPaiement'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                const newPaiements = [...paiements];
                newPaiements[index].status = newPaiements[index].status === "paye" ? "nonpaye" : "paye";
                newPaiements[index].datePaiement = newPaiements[index].status === "paye" ? new Date().toLocaleDateString('ar-SA') : null;
                setPaiements(newPaiements);

                setNotification({
                    msg: newPaiements[index].status === "paye"
                        ? `تم وضع علامة دفع ${newPaiements[index].mois} كمدفوع`
                        : `تم وضع علامة دفع ${newPaiements[index].mois} كغير مدفوع`,
                    type: newPaiements[index].status === "paye" ? 'success' : 'warning'
                });
            } else {
                const data = await response.json();
                setNotification((notif) => ({
                    ...notif,
                    msg: data.message || 'خطأ أثناء التحقق من الدفع.',
                    type: 'error',
                    shown: true
                }));
            }
        } catch (error) {
            setNotification((notif) => ({
                ...notif,
                msg: 'حدث خطأ. يرجى المحاولة مرة أخرى لاحقًا.',
                type: 'error',
                shown: true
            }));
        }
    };

    return (
        <div className="max-w-full bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-xl mb-6 relative overflow-hidden" dir="rtl">
            {/* بطاقات الملخص */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md border-r-4 border-amber-600 p-5 relative">
                    <PatternDecoration />
                    <div className="flex items-start">
                        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-amber-100 text-amber-700 ml-4">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm mb-1">المبلغ الإجمالي للدفع</p>
                            <p className="text-2xl font-bold text-amber-800">{totalAPayer} درهم</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md border-r-4 border-green-600 p-5 relative">
                    <PatternDecoration />
                    <div className="flex items-start">
                        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-100 text-green-700 ml-4">
                            <Check className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm mb-1">مدفوع بالفعل</p>
                            <p className="text-2xl font-bold text-green-700">{totalPaye} درهم</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* الجدول مع نمط محسن */}
            <div className="overflow-x-auto">
                <div className="bg-white rounded-xl shadow-md border border-amber-100">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gradient-to-l from-amber-50 to-amber-100 text-right">
                                <th className="px-6 py-4 text-sm font-medium text-amber-900 uppercase tracking-wider rounded-tr-xl">
                                    <div className="flex items-center justify-end">
                                        <Calendar className="w-4 h-4 ml-2 text-amber-700" />
                                        الشهر
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-sm font-medium text-amber-900 uppercase tracking-wider">
                                    <div className="flex items-center justify-end">
                                        <DollarSign className="w-4 h-4 ml-2 text-amber-700" />
                                        المبلغ
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-sm font-medium text-amber-900 uppercase tracking-wider">
                                    <div className="flex items-center justify-end">
                                        <Check className="w-4 h-4 ml-2 text-amber-700" />
                                        الحالة
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-sm font-medium text-amber-900 uppercase tracking-wider">
                                    <div className="flex items-center justify-end">
                                        <Calendar className="w-4 h-4 ml-2 text-amber-700" />
                                        تاريخ الدفع
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-sm font-medium text-amber-900 uppercase tracking-wider rounded-tl-xl">
                                    الإجراء
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-100">
                            {paiements.map((paiement, index) => (
                                <tr key={index} className={paiement.status === "paye" ? "bg-green-50/70" : paiement.status === "enattente" ? "bg-orange-50/70" : "bg-white hover:bg-amber-50/40"}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">
                                        {paiement.mois}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-amber-800">
                                        {paiement.total} درهم
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {paiement.status !== "nonpaye" ? (
                                            <span className={`px-3 py-1 inline-flex items-center text-xs font-medium rounded-full ${paiement.status === "paye" ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                                {paiement.status === "paye" ? <Check className="w-3 h-3 ml-1" /> : <Clock className="w-3 h-3 ml-1" />}
                                                {paiement.status === "paye" ? 'مدفوع' : 'في انتظار'}
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 inline-flex items-center text-xs font-medium rounded-full bg-red-100 text-red-800">
                                                <AlertCircle className="w-3 h-3 ml-1" />
                                                غير مدفوع
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {paiement.datePaiement || "—"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handlePaiementChange(index, paiement.id)}
                                            className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium shadow-sm transition-all hover:-translate-y-0.5 ${paiement.status === "paye"
                                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                                : paiement.status === "nonpaye"
                                                    ? "bg-gradient-to-l from-green-600 to-green-800 text-white hover:from-green-700 hover:to-green-900"
                                                    : "bg-gradient-to-l from-yellow-600 to-yellow-800 text-white hover:from-yellow-700 hover:to-yellow-900"
                                                }`}
                                        >
                                            {paiement.status === "paye" ? (
                                                <div className="flex items-center">
                                                    <X className="w-3 h-3 ml-1" />
                                                    إلغاء الدفع
                                                </div>
                                            ) : paiement.status === "enattente" ? (
                                                <div className="flex items-center">
                                                    <ArrowRight className="w-3 h-3 ml-1" />
                                                    عرض التفاصيل
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <CreditCard className="w-3 h-3 ml-1" />
                                                    وضع علامة مدفوع
                                                </div>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EtudiantPaiement;