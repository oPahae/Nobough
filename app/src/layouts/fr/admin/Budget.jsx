import React, { useState, useEffect } from 'react';
import {
    ArrowDown, ArrowUp, AlertCircle, DollarSign,
    Calendar, FileText, Users, PieChart, Briefcase,
    Plus, Filter, Bell, Activity, Bot, TrendingDown,
    ChevronRight, BookOpen
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RPieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const getRandomColor = () => {
    const colors = [
        '#b78628', '#8A6E3D', '#d6ad60', '#9e6c3a', '#e4a544',
        '#c28e5c', '#b67d2d', '#d4a76a', '#e9bb62', '#e8c681',
        '#e4a544', '#d4a76a', '#b78628', '#c28e5c', '#e9bb62'
    ];

    return colors[Math.floor(Math.random() * colors.length)];
};

export default function Budget({ revenus, depenses, dettes, budget, setActiveTab }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        async function fetchRecommendations() {
            const formatData = (arr) =>
                arr.map(item => ({
                    label: item.label,
                    montant: item.montant
                }));

            const revenusFormat = formatData(revenus);
            const depensesFormat = formatData(depenses);
            const dettesFormat = formatData(dettes);

            const prompt = `
                Tu es un expert en gestion financière dans une association éducative. Voici les données :
                🔹 Revenus :
                ${JSON.stringify(revenusFormat, null, 2)}
                🔹 Dépenses :
                ${JSON.stringify(depensesFormat, null, 2)}
                🔹 Dettes :
                ${JSON.stringify(dettesFormat, null, 2)}
                🔹 Budget :
                ${JSON.stringify(budget, null, 2)}
                Donne-moi 4 recommandations claires, précises, réalistes, **actionnables** et en une seule phrase et sans numérotaions, pour améliorer la situation financière.
                Réponds sous forme d’un **tableau JSON** contenant des chaînes de texte (pas d’objets).
            `;

            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDwVqL80ycP0sMykaPmeq_u7OdCJw35Otc`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: prompt }]
                        }
                    ]
                })
            });

            const data = await res.json();

            try {
                const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.replaceAll('*', '') || "Erreur";
                const cleaned = rawText.replace(/```json|```/g, '').trim();
                const json = JSON.parse(cleaned);
                setRecommendations(json.recommandations || []);
            } catch (err) {
                console.error('Erreur lors de l’extraction des recommandations:', err);
                setRecommendations(["Erreur lors de la lecture des recommandations."]);
            }
        }


        fetchRecommendations();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (loadingProgress < 100) {
                setLoadingProgress(prev => Math.min(prev + 5, 100));
            } else {
                clearInterval(interval);
            }
        }, 200);
        return () => clearInterval(interval);
    }, [loadingProgress]);

    const filterDataByDate = (data, date) => {
        if (!date) return data;
        const [year, month] = date.split('-');
        return data.filter(item => {
            const itemDate = item.created_At.split('-');
            return itemDate[0] === year && itemDate[1] === month;
        });
    };

    const filteredRevenus = filterDataByDate(revenus, selectedDate);
    const filteredDepenses = filterDataByDate(depenses, selectedDate);
    const filteredDettes = filterDataByDate(dettes, selectedDate);

    const totalRevenus = filteredRevenus.reduce((sum, item) => sum + item.montant, 0);
    const totalDepenses = filteredDepenses.reduce((sum, item) => sum + (typeof item.montant === 'string' ? parseFloat(item.montant) : item.montant), 0);
    const totalDettes = filteredDettes.reduce((sum, item) => sum + item.montant, 0);

    const getLast6MonthsData = () => {
        const currentDate = new Date();
        const months = Array.from({ length: 6 }, (_, i) => {
            const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            return String(d.getMonth() + 1).padStart(2, '0');
        }).reverse();

        return months.map(month => {
            const monthRevenus = revenus.filter(item => item.created_At.split('-')[1] === month).reduce((sum, item) => sum + item.montant, 0);
            const monthDepenses = depenses.filter(item => item.created_At.split('-')[1] === month).reduce((sum, item) => sum + (typeof item.montant === 'string' ? parseFloat(item.montant) : item.montant), 0);
            return {
                mois: month,
                revenus: monthRevenus,
                depenses: monthDepenses,
                budget: monthRevenus - monthDepenses
            };
        });
    };

    const evolutionData = getLast6MonthsData([...revenus, ...depenses]);

    const depensesParCategorie = depenses.reduce((acc, item) => {
        const existing = acc.find(entry => entry.name === item.type);
        if (existing) {
            existing.value += typeof item.montant === 'string' ? parseFloat(item.montant) : item.montant;
        } else {
            acc.push({ name: item.type, value: typeof item.montant === 'string' ? parseFloat(item.montant) : item.montant, color: getRandomColor() });
        }
        return acc;
    }, []);

    const revenusParCategorie = revenus.reduce((acc, item) => {
        const existing = acc.find(entry => entry.name === item.type);
        if (existing) {
            existing.value += item.montant;
        } else {
            acc.push({ name: item.type, value: item.montant, color: getRandomColor() });
        }
        return acc;
    }, []);

    return (
        <div className="pt-4 pb-16">
            {/* Banner */}
            <div className="relative mb-8 rounded-lg overflow-hidden shadow-lg">
                <div
                    className="px-6 py-8 text-white"
                    style={{
                        background: 'linear-gradient(135deg, #b78628 0%, #8A6E3D 50%, #d6ad60 100%)',
                        backgroundSize: 'cover'
                    }}
                >
                    <div className="absolute inset-0 opacity-10">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" className="w-full h-full">
                            <pattern id="arabesque" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                                <path d="M50,0 L0,50 L50,100 L100,50 Z M50,20 L20,50 L50,80 L80,50 Z" fill="#fff" />
                            </pattern>
                            <rect x="0" y="0" width="100%" height="100%" fill="url(#arabesque)" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: "'Noto Sans Arabic', 'Noto Sans', sans-serif" }}>
                            Tableau de Bord Financier
                        </h1>
                        <p className="opacity-90 max-w-3xl">
                            Gérez et surveillez les finances de l'Académie Nobough avec notre tableau de bord complet. Analysez les revenus, dépenses et événements pour une meilleure prise de décision.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <button onClick={() => setActiveTab('dettes')} className="bg-white text-amber-700 px-4 py-2 rounded shadow hover:bg-amber-50 transition-colors duration-300 flex items-center font-medium">
                                <FileText className="w-4 h-4 mr-2" />
                                Consulter les dettes
                            </button>
                            <button onClick={() => setActiveTab('ajouterEvenement')} className="bg-amber-800 text-white px-4 py-2 rounded shadow hover:bg-amber-900 transition-colors duration-300 flex items-center font-medium">
                                <Plus className="w-4 h-4 mr-2" />
                                Ajouter un évenemennt
                            </button>
                        </div>
                    </div>

                    <div className="absolute top-0 right-0 h-full w-1/3 md:w-1/4 overflow-hidden hidden md:block">
                        <div className="absolute top-0 left-0 h-full w-full bg-white opacity-10 transform -skew-x-12 translate-x-1/2"></div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-8 flex justify-between items-center flex-col md:flex-row lg:flex-row">
                <h1 className="text-2xl font-bold text-gray-800">Analyse Financière</h1>
                <div className="flex space-x-4">
                    <button
                        className="px-3 py-2 flex items-center bg-amber-50 rounded-lg shadow-sm hover:bg-amber-100 cursor-pointer border border-amber-200"
                        onClick={() => setShowPopup(true)}
                    >
                        <Filter className="w-4 h-4 mr-2 text-amber-700" />
                        <span className="text-amber-700">Filtrer par date</span>
                    </button>
                    {selectedDate &&
                        <button className="px-3 py-2 flex items-center bg-amber-50 rounded-lg shadow-sm hover:bg-amber-100 border border-amber-200">
                            <Calendar className="w-4 h-4 mr-2 text-amber-700" />
                            <span className="text-amber-700">{selectedDate}</span>
                        </button>
                    }
                </div>
            </div>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-40 cursor-pointer" onClick={() => setShowPopup(false)}>
                    <div className="bg-white p-6 rounded-lg shadow-lg" onClick={e => e.stopPropagation()}>
                        <h2 className="text-lg font-semibold mb-4 text-amber-800">Sélectionner une date</h2>
                        <div className="w-full flex gap-2 items-center justify-center">
                            <input
                                type="month"
                                className="border border-amber-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                            <button
                                className="px-4 py-2 bg-amber-600 text-white rounded-md cursor-pointer hover:bg-amber-700"
                                onClick={() => setShowPopup(false)}
                            >
                                Appliquer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md overflow-hidden border-l-4 border-green-500">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-gray-800 font-medium">Total des revenus</h3>
                        <div className="p-2 bg-green-100 rounded-full">
                            <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-green-600 mb-2">
                        {totalRevenus.toLocaleString()} DHs
                    </p>
                    <div className="flex items-center text-sm">
                        <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-500 font-medium">+8.2%</span>
                        <span className="text-gray-600 ml-2">vs mois précédent</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md overflow-hidden border-l-4 border-amber-500">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-gray-800 font-medium">Total des dépenses</h3>
                        <div className="p-2 bg-amber-100 rounded-full">
                            <Activity className="w-5 h-5 text-amber-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-amber-600 mb-2">
                        {totalDepenses.toLocaleString()} DHs
                    </p>
                    <div className="flex items-center text-sm">
                        <ArrowDown className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-500 font-medium">-3.5%</span>
                        <span className="text-gray-600 ml-2">vs mois précédent</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md overflow-hidden border-l-4 border-red-500">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-gray-800 font-medium">Total des dettes</h3>
                        <div className="p-2 bg-red-100 rounded-full">
                            <Briefcase className="w-5 h-5 text-red-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-red-600 mb-2">
                        {totalDettes.toLocaleString()} DHs
                    </p>
                    <div className="flex items-center text-sm">
                        <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-500 font-medium">-12.3%</span>
                        <span className="text-gray-600 ml-2">vs mois précédent</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content - First 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Evolution Graph */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-800">Évolution Revenus vs Dépenses</h2>
                            <div className="bg-amber-100 p-1 rounded-full">
                                <ChartBar className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>
                        <div className="p-4">
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={evolutionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#b78628" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#d6ad60" stopOpacity={0.2} />
                                        </linearGradient>
                                        <linearGradient id="colorDepenses" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8A6E3D" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8A6E3D" stopOpacity={0.2} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="mois" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="revenus" stroke="#b78628" fillOpacity={1} fill="url(#colorRevenus)" name="Revenus" />
                                    <Area type="monotone" dataKey="depenses" stroke="#8A6E3D" fillOpacity={1} fill="url(#colorDepenses)" name="Dépenses" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="p-4 bg-amber-50">
                            <p className="text-sm text-gray-700">
                                L'évolution des revenus montre une tendance à la hausse depuis le début de l'année. Les mois de février et mai ont été particulièrement bons pour les inscriptions aux formations.
                            </p>
                        </div>
                    </div>

                    {/* Pie Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Dépenses */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-800">Répartition des dépenses</h2>
                                <div className="bg-amber-100 p-1 rounded-full">
                                    <PieChart className="w-5 h-5 text-amber-600" />
                                </div>
                            </div>
                            <div className="p-4">
                                <ResponsiveContainer width="100%" height={200}>
                                    <RPieChart>
                                        <Pie
                                            data={depensesParCategorie}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                        >
                                            {depensesParCategorie.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </RPieChart>
                                </ResponsiveContainer>
                                <div className="mt-4 space-y-3">
                                    {depensesParCategorie.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                                                <span className="text-sm">{item.name}</span>
                                            </div>
                                            <span className="font-medium text-sm">{item.value.toLocaleString()} DHs</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Revenus */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-800">Sources de revenus</h2>
                                <div className="bg-amber-100 p-1 rounded-full">
                                    <PieChart className="w-5 h-5 text-amber-600" />
                                </div>
                            </div>
                            <div className="p-4">
                                <ResponsiveContainer width="100%" height={200}>
                                    <RPieChart>
                                        <Pie
                                            data={revenusParCategorie}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                        >
                                            {revenusParCategorie.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </RPieChart>
                                </ResponsiveContainer>
                                <div className="mt-4 space-y-3">
                                    {revenusParCategorie.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                                                <span className="text-sm">{item.name}</span>
                                            </div>
                                            <span className="font-medium text-sm">{item.value.toLocaleString()} DHs</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-800">Analyse comparée mensuelle</h2>
                            <div className="bg-amber-100 p-1 rounded-full">
                                <Activity className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>
                        <div className="p-4">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={evolutionData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="mois" />
                                    <YAxis />
                                    <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                                    <Legend />
                                    <Bar name="Revenus" dataKey="revenus" fill="#b78628" radius={[4, 4, 0, 0]} />
                                    <Bar name="Dépenses" dataKey="depenses" fill="#8A6E3D" radius={[4, 4, 0, 0]} />
                                    <Bar name="Budget" dataKey="budget" fill="#d6ad60" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="p-4 bg-amber-50">
                            <p className="text-sm text-gray-700">
                                L'analyse mensuelle montre un budget positif sur chaque mois de l'année, avec une amélioration notable en mai grâce à l'augmentation des inscriptions aux formations spécialisées et la réduction des coûts opérationnels.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Third column */}
                <div className="space-y-6">
                    {/* Budget */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-800">Budget calculé</h2>
                            <div className="bg-amber-100 p-1 rounded-full">
                                <PieChart className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b">
                                    <span>Budget brut</span>
                                    <span className={`font-bold ${budget.total >= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                                        {budget.total.toLocaleString()} DHs
                                    </span>
                                </div>

                                <div className="flex justify-between items-center pb-3 border-b">
                                    <span>Salaires non payés</span>
                                    <span className="font-bold text-amber-600">
                                        - {budget.total - budget.reel} DHs
                                    </span>
                                </div>

                                <div className="flex justify-between items-center pt-3">
                                    <span className="font-semibold">Budget réel</span>
                                    <span className={`font-bold text-xl ${budget.reel >= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                                        {budget.reel.toLocaleString()} DHs
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recommandations */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-800">Recommandations</h2>
                            <div className="bg-amber-100 p-1 rounded-full">
                                <AlertCircle className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="bg-amber-50 p-5 rounded-lg text-amber-800">
                                <p className="font-medium mb-3 flex gap-2 items-center">
                                    <Bot className="w-5 h-5" />
                                    Recommandations par notre assistant
                                </p>
                                <ul className="space-y-3">
                                    {recommendations.map((rec, index) => (
                                        <li key={index} className="flex items-start">
                                            <div className="p-1 min-w-fit bg-amber-200 rounded-full mr-2 mt-1">
                                                <ChevronRight className="w-3 h-3 text-amber-700" />
                                            </div>
                                            <span className="text-sm">{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Dettes */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-800">Dettes à rembourser</h2>
                            <div className="bg-amber-100 p-1 rounded-full">
                                <Briefcase className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>
                        <div>
                            {filteredDettes.slice(0, 2).map((dette, index) => (
                                <div key={index} className={`p-4 hover:bg-amber-50 transition-colors duration-200 ${index !== filteredDettes.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-800">{dette.descr}</h3>
                                            <p className="text-xs text-gray-500 mt-1">Échéance: {new Date(dette.created_At).toLocaleDateString('FR-fr')}</p>
                                        </div>
                                        <span className="font-bold text-red-600">{dette.montant.toLocaleString()} DHs</span>
                                    </div>
                                </div>
                            ))}
                            <div className="p-3 bg-amber-50 text-center">
                                <button onClick={() => setActiveTab('dettes')} className="text-amber-700 hover:text-amber-900 font-medium text-sm flex items-center justify-center mx-auto">
                                    <span>Gérer toutes les dettes</span>
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ChartBar = ({ className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect x="18" y="3" width="4" height="18"></rect>
            <rect x="10" y="8" width="4" height="13"></rect>
            <rect x="2" y="13" width="4" height="8"></rect>
        </svg>
    );
};