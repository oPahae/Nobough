import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import EtudiantInfos from './EtudiantInfos'
import EtudiantPaiement from './EtudiantPaiement'
import EtudiantFormations from './EtudiantFormations'

export default function Etudiant({ setNotification }) {
    const [activeTab, setActiveTab] = useState('informations')
    const [etudiant, setEtudiant] = useState({})
    const [paiements, setPaiements] = useState([])
    const [formations, setFormations] = useState([])
    const [etudiantID, setEtudiantID] = useState('')

    useEffect(() => {
        const temp = sessionStorage.getItem('etudiant')
        if (!temp) setActiveTab('etudiants')
        else setEtudiantID(temp)
    }, [])

    useEffect(() => {
        const fetchEtudiant = async () => {
            if(etudiantID === "") return
            try {
                const response = await fetch(`/api/etudiants/getOne?etudiantID=${etudiantID}`);

                if (!response.ok) {
                    throw new Error('خطأ أثناء استرجاع المعلومات');
                }

                const data = await response.json();
                setEtudiant(data);
            } catch (error) {
                console.error('خطأ أثناء استرجاع المعلومات:', error);
            }
        }

        const fetchFormations = async () => {
            if(etudiantID === "") return
            try {
                const response = await fetch(`/api/formations/getEtudiant?etudiantID=${etudiantID}`);

                if (!response.ok) {
                    throw new Error('خطأ أثناء استرجاع المعلومات');
                }

                const data = await response.json()
                setFormations(data || [])
                console.log(data)
            } catch (error) {
                console.error('خطأ أثناء استرجاع المعلومات:', error);
            }
        }

        fetchEtudiant()
        fetchFormations()
    }, [etudiantID])

    useEffect(() => {
        const fetchPaiements = async () => {
            try {
                const response = await fetch(`/api/paiements/getEtudiant?etudiantID=${etudiantID}`)
                const data = await response.json()
                let formattedPaiements = []

                if (data.length > 0) {
                    formattedPaiements = data.map(paiement => ({
                        id: paiement.id,
                        mois: new Date(paiement.created_At).toLocaleDateString('FR-fr'),
                        total: paiement.total,
                        status: paiement.status,
                        datePaiement: paiement.datePaiement ? new Date(paiement.datePaiement).toLocaleDateString('FR-fr') : null
                    }))
                }

                setPaiements(formattedPaiements);
            } catch (error) {
                console.error('خطأ أثناء استرجاع المدفوعات:', error)
            }
        }
        fetchPaiements()
    }, [etudiantID])

    return (
        <>
            <Head>
                <title>{etudiant.nom + ' ' + etudiant.prenom} - أكاديمية نبوغ</title>
                <link rel="icon" href="/logo2-nobg.png" />
            </Head>

            <div className="max-w-full" dir="rtl">
                {/* Nav */}
                <div className="flex justify-center border-b border-amber-200 mb-6 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('informations')}
                        className={`py-3 px-6 font-medium relative transition-all ${activeTab === 'informations' ? 'text-amber-800' : 'text-gray-600 hover:text-amber-700'} cursor-pointer whitespace-nowrap`}
                    >
                        معلومات شخصية
                        {activeTab === 'informations' && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-800"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('paiements')}
                        className={`py-3 px-6 font-medium relative transition-all ${activeTab === 'paiements' ? 'text-amber-800' : 'text-gray-600 hover:text-amber-700'} cursor-pointer whitespace-nowrap`}
                    >
                        المدفوعات
                        {activeTab === 'paiements' && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-800"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('formations')}
                        className={`py-3 px-6 font-medium relative transition-all ${activeTab === 'formations' ? 'text-amber-800' : 'text-gray-600 hover:text-amber-700'} cursor-pointer whitespace-nowrap`}
                    >
                        التكوينات
                        {activeTab === 'formations' && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-800"></div>
                        )}
                    </button>
                </div>

                {/* Infos */}
                {activeTab === 'informations' && (
                    <EtudiantInfos paiements={paiements} etudiant={etudiant} setEtudiant={setEtudiant} setNotification={setNotification} />
                )}

                {/* Paiements */}
                {activeTab === 'paiements' && (
                    <EtudiantPaiement paiements={paiements} setPaiements={setPaiements} setNotification={setNotification} />
                )}

                {/* Formations */}
                {activeTab === 'formations' && (
                    <EtudiantFormations formations={formations} etudiantID={etudiantID} setNotification={setNotification} />
                )}
            </div>
        </>
    )
}