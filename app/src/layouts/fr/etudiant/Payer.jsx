import {
    Calendar, CreditCard, Upload, Check, Banknote, Copy, CheckCircle, CreditCard as PaymentIcon,
    Moon, Sparkles, DollarSign, X, ArrowRight, AlertCircle,
    Clock
} from 'lucide-react'
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Loading from '@/utils/Loading'
import { ribInfoFr } from '@/utils/Constants';

export default function Paiement({ session, setNotification }) {
    const [montantAPayer, setMontantAPayer] = useState(0);
    const [paiements, setPaiements] = useState([]);
    const [moisAPayer, setMoisAPayer] = useState(null);
    const [preuve, setPreuve] = useState(null);
    const [formationID, setFormationID] = useState(null);
    const [formations, setFormations] = useState([]);
    const [x, y] = useState(true)

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copied, setCopied] = useState(false);
    const [fileName, setFileName] = useState('');

    const formatMois = (mois) => {
        switch (mois.split("/")[1]) {
            case '01': return 'Janvier';
            case '02': return 'Février';
            case '03': return 'Mars';
            case '04': return 'Avril';
            case '05': return 'Mai';
            case '06': return 'Juin';
            case '07': return 'Juillet';
            case '08': return 'Août';
            case '09': return 'Septembre';
            case '10': return 'Octobre';
            case '11': return 'Novembre';
            case '12': return 'Décembre';
            default: return 'Mois invalide';
        }
    };

    ////////////////////////////////////////////////////////////

    useEffect(() => {
        fetchFormations();
    }, []);

    const fetchFormations = async () => {
        try {
            const response = await fetch(`/api/formations/getAll3?etudiantID=${session.id}`);
            const data = await response.json();
            console.log(data)
            setFormations(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des formations:', error);
        }
    };

    useEffect(() => {
        if (moisAPayer) {
            setMontantAPayer(moisAPayer.total);
        } else {
            setMontantAPayer(paiements.filter(p => p.status === 'nonpaye').reduce((a, b) => a + b.total, 0));
        }
    }, [paiements, moisAPayer]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreuve(file);
            setFileName(file.name);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    //////////////////////////////////////////////////

    useEffect(() => {
        fetchPaiements();
    }, [formationID, session]);

    const fetchPaiements = async () => {
        try {
            const response = await fetch(`/api/paiements/getEtudiant?etudiantID=${session.id}&formationID=${formationID}`);
            const data = await response.json();
            console.log(data || []);

            const formattedPaiements = data.map(paiement => ({
                id: paiement.id,
                mois: new Date(paiement.created_At).toLocaleDateString('FR-fr'),
                total: paiement.total,
                status: paiement.status,
                datePaiement: paiement.datePaiement ? new Date(paiement.datePaiement).toLocaleDateString('fr-FR') : null
            }));

            setPaiements(formattedPaiements);
        } catch (error) {
            console.error('Erreur lors de la récupération des paiements:', error);
        } finally {
            y(false)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!moisAPayer) {
                setNotification((notif) => ({
                    ...notif,
                    msg: 'Veuillez sélectionner un mois à payer',
                    type: 'info',
                    shown: true
                }))
                setIsSubmitting(false);
                return;
            }

            if (!preuve) {
                setNotification((notif) => ({
                    ...notif,
                    msg: 'Veuillez télécharger une preuve de paiement',
                    type: 'info',
                    shown: true
                }))
                setIsSubmitting(false);
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(preuve);
            reader.onloadend = async () => {
                const base64Image = reader.result.split(',')[1];

                const response = await fetch('/api/paiements/pay', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: moisAPayer.id,
                        status: 'enattente',
                        preuve: base64Image,
                        datePaiement: new Date().toISOString().split('T')[0]
                    }),
                });

                if (response.ok) {
                    setNotification((notif) => ({
                        ...notif,
                        msg: 'Paiement soumis avec succès! En attente de validation.',
                        type: 'success',
                        shown: true
                    }))
                    fetchPaiements();
                    setMoisAPayer(null);
                    setPreuve(null);
                    setFileName('');
                } else {
                    const data = await response.json();
                    setNotification((notif) => ({
                        ...notif,
                        msg: `Erreur: ${data.message}`,
                        type: 'error',
                        shown: true
                    }))
                }
            };
        } catch (error) {
            setNotification((notif) => ({
                ...notif,
                msg: 'Erreur # ' + error,
                type: 'error',
                shown: true
            }))
        } finally {
            setIsSubmitting(false);
        }
    };

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
                <title>Paiement en ligne - Académie Nobough</title>
                <link rel="icon" href="/logo2-nobg.png" />
            </Head>

            <div className="max-w-full relative">
                <div className="mb-12 text-center pt-8 relative">
                    <div className="inline-block">
                        <div className="flex items-center justify-center mb-2">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-700"></div>
                            <Sparkles className="text-amber-800 mx-4 w-6 h-6" />
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-700"></div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">Paiement en ligne</h1>
                        <div className="flex items-center justify-center mt-2">
                            <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                            <Moon className="text-amber-800 mx-4 w-4 h-4" />
                            <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                        </div>
                    </div>
                    <p className="text-gray-600 mt-4 max-w-xl mx-auto">Veuillez effectuer votre paiement par virement bancaire en utilisant les coordonnées ci-dessous</p>
                </div>

                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-2'>
                    {/* Payer */}
                    <div className="max-w-full">
                        <div className="bg-white rounded-xl shadow-xl overflow-hidden p-8 relative mb-8">
                            <div className="mb-8 p-6 bg-amber-50 rounded-xl border border-amber-200 text-center">
                                <div className="flex items-center justify-center mb-2">
                                    <PaymentIcon className="h-8 w-8 text-amber-700 mr-2" />
                                    <h2 className="text-xl font-semibold text-gray-800">{moisAPayer ? `Mois choisi : ${formatMois(moisAPayer.mois) + " " + moisAPayer.mois.split("/")[2]}` : 'Total à payer'}</h2>
                                </div>
                                <p className="text-4xl font-bold text-amber-700">{montantAPayer.toLocaleString('fr-MA')} MAD</p>
                            </div>

                            <div className="mb-8 p-6 bg-white rounded-xl border border-amber-200 shadow-md">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
                                    <Banknote className="h-6 w-6 text-amber-700" />
                                    Coordonnées bancaires
                                </h2>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-3 bg-amber-50/50 rounded-lg">
                                            <p className="text-sm font-medium text-amber-800">Titulaire</p>
                                            <p className="text-gray-800 font-medium">{ribInfoFr.titulaire}</p>
                                        </div>
                                        <div className="p-3 bg-amber-50/50 rounded-lg">
                                            <p className="text-sm font-medium text-amber-800">Banque</p>
                                            <p className="text-gray-800 font-medium">{ribInfoFr.banque}</p>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-amber-50/50 rounded-lg">
                                        <p className="text-sm font-medium text-amber-800 mb-2">RIB</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-gray-800 font-mono bg-white p-3 rounded-lg border border-amber-200 flex-grow">{ribInfoFr.rib}</p>
                                            <button
                                                onClick={() => copyToClipboard(ribInfoFr.rib)}
                                                className="p-3 rounded-lg hover:bg-amber-100 transition-colors"
                                                title="Copier le RIB"
                                            >
                                                {copied ? <CheckCircle className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5 text-amber-700" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="preuve" className="block text-sm font-medium text-gray-700">Preuve de paiement</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-amber-200 border-dashed rounded-xl bg-white/90 hover:bg-white transition-colors">
                                        <div className="space-y-1 text-center">
                                            <div className="flex justify-center">
                                                <Upload className="mx-auto h-12 w-12 text-amber-600" />
                                            </div>
                                            <div className="flex text-sm text-gray-600">
                                                <label htmlFor="preuve" className="relative cursor-pointer rounded-md font-medium text-amber-700 hover:text-amber-500 focus-within:outline-none">
                                                    <span>Télécharger un fichier</span>
                                                    <input
                                                        type="file"
                                                        id="preuve"
                                                        name="preuve"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="sr-only"
                                                        required
                                                    />
                                                </label>
                                                <p className="pl-1">ou glisser-déposer</p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, JPEG jusqu'à 10MB
                                            </p>
                                            {fileName && (
                                                <p className="text-sm text-green-600 font-medium mt-2">
                                                    Fichier sélectionné: {fileName}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="py-3 px-6 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center cursor-pointer disabled:opacity-50"
                                    >
                                        <span className="font-medium">Confirmer le paiement</span>
                                        {isSubmitting ? (
                                            <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                                        ) : (
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Table */}
                    <div className='max-w-full'>
                        <div className="space-y-2">
                            <select
                                id="formation"
                                name="formation"
                                value={formationID || ''}
                                onChange={(e) => setFormationID(e.target.value)}
                                className="mt-1 block w-fit pl-3 pr-10 py-2 text-base bg-white mb-2 border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
                            >
                                <option value="">Sélectionner une formation</option>
                                {formations.map((formation) => (
                                    <option key={formation.id} value={formation.id}>{formation.titre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="">
                            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-amber-100 overflow-x-scroll">
                                <table className="w-full">
                                    {/* Head */}
                                    <thead>
                                        <tr className="bg-gradient-to-r from-amber-50 to-amber-100 text-left">
                                            <th className="px-6 py-4 text-sm font-medium text-amber-900 uppercase tracking-wider rounded-tl-xl">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-2 text-amber-700" />
                                                    Mois
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-sm font-medium text-amber-900 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <DollarSign className="w-4 h-4 mr-2 text-amber-700" />
                                                    Montant
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-sm font-medium text-amber-900 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <Check className="w-4 h-4 mr-2 text-amber-700" />
                                                    Statut
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-sm font-medium text-amber-900 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-2 text-amber-700" />
                                                    Date de paiement
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>

                                    {/* Body */}
                                    <tbody className="divide-y divide-amber-100">
                                        {paiements.map((paiement, index) => (
                                            <tr key={index}
                                                className={paiement.status === "paye" ? "bg-green-50/70" : paiement.status === "enattente" ? "bg-yellow-50/70" : "bg-white hover:bg-amber-200 hover:translate-x-4 transition-all duration-200 cursor-pointer"}
                                                onClick={() => { if (paiement.status === "nonpaye") setMoisAPayer({ ...paiement }) }}>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">
                                                    {paiement.mois}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-amber-800">
                                                    {paiement.total} DH
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {paiement.status !== "nonpaye" ? (
                                                        <span className={`px-3 py-1 inline-flex items-center text-xs font-medium rounded-full ${paiement.status === "paye" ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                                            {paiement.status === "paye" ? <Check className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                                                            {paiement.status === "paye" ? 'Payé' : 'En attentte'}
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 inline-flex items-center text-xs font-medium rounded-full bg-red-100 text-red-800">
                                                            <AlertCircle className="w-3 h-3 mr-1" />
                                                            Non payé
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {paiement.datePaiement || "—"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
