import {
    FileText, Download, BookOpen, User, Clock, Users, Tag,
    ArrowRight, Sparkles, Moon, Award, Receipt, Calendar,
    Filter, ChevronDown, GraduationCap, FileCheck
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Documents({ session }) {
    const generateAttestation = async () => {
        try {
            const response = await fetch(`/api/_documents/attestationProf?profID=${session.id}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'شهادة-عمل.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('خطأ أثناء توليد الشهادة:', error);
        }
    };

    const generateEmploi = async () => {
        try {
            const response = await fetch(`/api/_documents/emploiProf?profID=${session.id}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'جدول-المحاضرات.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('خطأ أثناء توليد جدول المحاضرات:', error);
        }
    };

    return (
        <div className="w-full mx-auto md:p-6" dir="rtl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-center mb-4">
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-600"></div>
                    <FileText className="text-amber-700 mx-4 w-8 h-8" />
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-600"></div>
                </div>
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">مستندي</h1>
                <p className="text-center text-gray-600">الوصول إلى جميع مستنداتك الأكاديمية</p>
            </div>

            {/* Block 1: Main Documents */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FileCheck className="w-5 h-5 ml-2 text-amber-600" />
                    المستندات الرئيسية
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={generateAttestation}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-all group"
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center ml-4">
                                <Award className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="text-right">
                                <h3 className="font-semibold text-gray-800">شهادة عمل</h3>
                                <p className="text-sm text-gray-600">وثيقة عمل رسمية</p>
                            </div>
                        </div>
                        <Download className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
                    </button>

                    <button
                        onClick={generateEmploi}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-all group"
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center ml-4">
                                <Calendar className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="text-right">
                                <h3 className="font-semibold text-gray-800">جدول المحاضرات</h3>
                                <p className="text-sm text-gray-600">جدول المحاضرات الحالي</p>
                            </div>
                        </div>
                        <Download className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
                    </button>
                </div>
            </div>
        </div>
    );
}