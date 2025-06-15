import { useState, useEffect } from 'react'
import { X, Bell, MapPin, Info, HelpCircle, ShieldQuestion, Mail, Clock, Phone } from 'lucide-react'

import Head from 'next/head'
import Header from '../../../components/fr/comptable/Header'
import Alertes from '../../../components/fr/comptable/Alertes'

import Budget from '../../../layouts/fr/comptable/Budget'
import Revenus from '../../../layouts/fr/comptable/Revenus'
import Depenses from '../../../layouts/fr/comptable/Depenses'
import Dettes from '../../../layouts/fr/comptable/Dettes'
import Evenements from '../../../layouts/fr/comptable/Evenements'
import Salaires from '../../../layouts/fr/comptable/Salaires'

import AjouterRevenu from '../../../layouts/fr/comptable/AjouterRevenu'
import ModifierRevenu from '../../../layouts/fr/comptable/ModifierRevenu'
import AjouterDepense from '../../../layouts/fr/comptable/AjouterDepense'
import ModifierDepense from '../../../layouts/fr/comptable/ModifierDepense'
import AjouterDette from '../../../layouts/fr/comptable/AjouterDette'
import ModifierDette from '../../../layouts/fr/comptable/ModifierDette'
import AjouterEvenement from '../../../layouts/fr/comptable/AjouterEvenement'
import ModifierEvenement from '../../../layouts/fr/comptable/ModifierEvenement'
import { verifyAuth } from '@/middlewares/Comptable'

export default function Comptable({ session, setNotification }) {
  const [activeTab, setActiveTab] = useState('budget')
  const [showAlertes, setShowAlertes] = useState(false)

  const [revenus, setRevenus] = useState([])
  const [depenses, setDepenses] = useState([])
  const [dettes, setDettes] = useState([])
  const [budget, setBudget] = useState({ total: 0, reel: 0 })
  const [headerOpened, setHeaderOpened] = useState(true)

  const [revenuID, setRevenuID] = useState(null)
  const [depenseID, setDepenseID] = useState(null)
  const [detteID, setDetteID] = useState(null)
  const [evenementID, setEvenementID] = useState(null)

  useEffect(() => {
    localStorage.setItem('activeTabComptable', activeTab)
  }, [activeTab])

  useEffect(() => {
    if (!session) window.location.href = './Comptable/Login'
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/finance/getAll');
        const data = await response.json();

        const totalRevenus = data.revenus.reduce((sum, item) => sum + item.montant, 0);
        const totalDepenses = data.depenses.reduce((sum, item) => sum + item.montant, 0);
        const budget = {
          total: totalRevenus - totalDepenses,
          reel: totalRevenus - totalDepenses - data.totalNonPaye
        };

        setRevenus(data.revenus);
        setDepenses(data.depenses);
        setDettes(data.dettes);
        setBudget(budget);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Tableau de bord comptable - Académie Nobough</title>
        <link rel="icon" href="/logo2-nobg.png" />
      </Head>

      <Header activeTab={activeTab} setActiveTab={setActiveTab} headerOpened={headerOpened} setHeaderOpened={setHeaderOpened} />

      <div className={`h-screen overflow-y-scroll pt-4 pb-16`}>
        <div className={`${headerOpened && 'mt-36 md:mt-46'}`}>
          {/* Alerts show */}
          <div className="fixed top-4 left-4 z-30">
            {showAlertes ?
              <button className="bg-amber-700 rounded-full text-white p-2 w-10 h-10 shadow-lg hover:bg-amber-800 transition-colors" onClick={() => setShowAlertes(false)}>
                <X className="w-6 h-6" />
              </button>
              :
              <button className="bg-amber-600 rounded-full text-white p-2 w-10 h-10 shadow-lg hover:bg-amber-700 transition-colors" onClick={() => setShowAlertes(true)}>
                <Bell className="w-6 h-6" />
              </button>
            }
          </div>

          <main className="container mx-auto md:px-4 lg:px-4">
            {/* Alerts */}
            {showAlertes && <Alertes budget={budget} dettes={dettes} />}

            {/* Routes */}
            <div className="rounded-lg overflow-hidden">
              {activeTab === 'budget' && (
                <Budget
                  revenus={revenus}
                  depenses={depenses}
                  dettes={dettes}
                  budget={budget}
                  setActiveTab={setActiveTab}
                  setNotification={setNotification}
                />
              )}
              {activeTab === 'salaires' && (
                <Salaires setActiveTab={setActiveTab} setNotification={setNotification} />
              )}

              {/*  */}
              {activeTab === 'revenus' && (
                <Revenus revenus={revenus} setRevenus={setRevenus} setRevenuID={setRevenuID} setActiveTab={setActiveTab} setNotification={setNotification} />
              )}
              {activeTab === 'ajouterRevenu' && (
                <AjouterRevenu setRevenus={setRevenus} setActiveTab={setActiveTab} setNotification={setNotification} />
              )}
              {activeTab === 'modifierRevenu' && (
                <ModifierRevenu revenus={revenus} revenuID={revenuID} setRevenus={setRevenus} setActiveTab={setActiveTab} setNotification={setNotification} />
              )}

              {/*  */}
              {activeTab === 'depenses' && (
                <Depenses depenses={depenses} setDepenses={setDepenses} setDepenseID={setDepenseID} setActiveTab={setActiveTab} setNotification={setNotification} />
              )}
              {activeTab === 'ajouterDepense' && (
                <AjouterDepense setDepenses={setDepenses} setActiveTab={setActiveTab} setNotification={setNotification} />
              )}
              {activeTab === 'modifierDepense' && (
                <ModifierDepense depenses={depenses} depenseID={depenseID} setDepenses={setDepenses} setActiveTab={setActiveTab} setNotification={setNotification} />
              )}

              {/*  */}
              {activeTab === 'dettes' && (
                <Dettes dettes={dettes} setDettes={setDettes} setDetteID={setDetteID} setActiveTab={setActiveTab} setNotification={setNotification} />
              )}
              {activeTab === 'ajouterDette' && (
                <AjouterDette setDettes={setDettes} setActiveTab={setActiveTab} setNotification={setNotification} />
              )}
              {activeTab === 'modifierDette' && (
                <ModifierDette dettes={dettes} detteID={detteID} setDettes={setDettes} setActiveTab={setActiveTab} setNotification={setNotification} />
              )}

              {/*  */}
              {activeTab === 'evenements' && (
                <Evenements setEvenementID={setEvenementID} setActiveTab={setActiveTab} setNotification={setNotification} />
              )}
              {activeTab === 'ajouterEvenement' && (
                <AjouterEvenement budget={budget} setActiveTab={setActiveTab} setNotification={setNotification} />
              )}
              {activeTab === 'modifierEvenement' && (
                <ModifierEvenement budget={budget} evenementID={evenementID} setActiveTab={setActiveTab} setNotification={setNotification} />
              )}
            </div>
          </main>

          <footer className="px-6 py-10 text-sm">
            <div className="backdrop-blur-3xl p-6 rounded-3xl max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Bloc entreprise */}
              <div className="text-amber-900 font-bold">
                <h2 className="text-xl font-semibold mb-4">Académie Nobough</h2>
                <p className="flex items-start gap-2 mb-1">
                  <MapPin className="w-4 h-4 mt-1 text-amber-500" />
                  204 شارع عبد الله كنون - حي ياسمينة - برشيد
                </p>
                <p className="flex items-center gap-2 mb-1">
                  <Phone className="w-4 h-4 text-amber-500" />
                  06.61.84.20.35 - 06.61.67.35.76
                </p>
              </div>

              {/* Bloc liens */}
              <div className="text-amber-900 font-bold">
                <h2 className="text-xl font-semibold mb-4">Liens utiles</h2>
                <ul className="space-y-2">
                  <li>
                    <a href="/fr/About.jsx" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                      <Info className="w-4 h-4" /> À propos
                    </a>
                  </li>
                  <li>
                    <a href="/fr/Faqs" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                      <HelpCircle className="w-4 h-4" /> FAQs
                    </a>
                  </li>
                  <li>
                    <a href="/fr/Privacy.jsx" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                      <ShieldQuestion className="w-4 h-4" /> Politique de confidentialité
                    </a>
                  </li>
                </ul>
              </div>

              {/* Bloc contact */}
              <div className="text-white font-bold">
                <h2 className="text-xl font-semibold mb-4">Contact</h2>
                <p className="flex items-center gap-2 mb-1">
                  <Mail className="w-4 h-4 text-amber-500" />
                  nobough.contact@gmail.com
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Lun - Dim, 9h00 - 23h00
                </p>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex flex-col-reverse mt-4 pt-4 text-center text-xs text-white font-bold">
              <b className="self-end">&copy; {new Date().getFullYear()} Académie Nobough. Tous droits réservés.</b>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ req, res }) {
  const comptable = verifyAuth(req, res)

  if (comptable) {
    return {
      props: {
        session: {
          id: comptable.id,
          email: comptable.email,
          created_At: comptable.created_At,
        }
      },
    }
  }

  return { props: { session: null } }
}