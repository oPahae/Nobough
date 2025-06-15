import { X, MapPin, Info, HelpCircle, ShieldQuestion, Mail, Clock, Phone, Bell } from 'lucide-react'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import Sidebar from '../../../components/fr/admin/Header'
import Alertes from '../../../components/fr/comptable/Alertes'

import Comptes from '../../../layouts/fr/admin/Comptes.jsx'

import Budget from '../../../layouts/fr/admin/Budget'
import Revenus from '../../../layouts/fr/admin/Revenus'
import Depenses from '../../../layouts/fr/admin/Depenses'
import Dettes from '../../../layouts/fr/admin/Dettes'
import Evenements from '../../../layouts/fr/admin/Evenements'
import Salaires from '../../../layouts/fr/admin/Salaires'
import AjouterRevenu from '../../../layouts/fr/admin/AjouterRevenu'
import ModifierRevenu from '../../../layouts/fr/admin/ModifierRevenu'
import AjouterDepense from '../../../layouts/fr/admin/AjouterDepense'
import ModifierDepense from '../../../layouts/fr/admin/ModifierDepense'
import AjouterDette from '../../../layouts/fr/admin/AjouterDette'
import ModifierDette from '../../../layouts/fr/admin/ModifierDette'
import AjouterEvenement from '../../../layouts/fr/admin/AjouterEvenement'
import ModifierEvenement from '../../../layouts/fr/admin/ModifierEvenement'

import Annonces from '../../../layouts/fr/admin/Annonces'
import Formations from '../../../layouts/fr/admin/Formations'
import Etudiants from '../../../layouts/fr/admin/Etudiants'
import Etudiant from '../../../layouts/fr/admin/Etudiant'
import Inscriptions from '../../../layouts/fr/admin/Inscriptions'
import Adhesions from '../../../layouts/fr/admin/Adhesions'
import Professeurs from '../../../layouts/fr/admin/Professeurs'
import Protestations from '../../../layouts/fr/admin/Protestations'
import AjouterFormation from '../../../layouts/fr/admin/AjouterFormation'
import ModifierFormation from '../../../layouts/fr/admin/ModifierFormation'
import AjouterAnnonce from '../../../layouts/fr/admin/AjouterAnnonce'
import ModifierAnnonce from '../../../layouts/fr/admin/ModifierAnnonce.jsx'
import AjouterProf from '../../../layouts/fr/admin/AjouterProf'
import ModifierProf from '../../../layouts/fr/admin/ModifierProf.jsx'
import AjouterEtudiant from '../../../layouts/fr/admin/AjouterEtudiant.jsx'
import Paiements from '../../../layouts/fr/admin/Paiements.jsx'
import { verifyAuth } from '@/middlewares/Admin'

export default function Admin({ session, setNotification }) {
  const [activeTab, setActiveTab] = useState('budget')
  const [showAlertes, setShowAlertes] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  const [revenus, setRevenus] = useState([])
  const [depenses, setDepenses] = useState([])
  const [dettes, setDettes] = useState([])
  const [evenements, setEvenements] = useState()
  const [budget, setBudget] = useState({ total: 0, reel: 0 })
  const [sidebarOpened, setSidebarOpened] = useState(true)

  const [revenuID, setRevenuID] = useState(null)
  const [depenseID, setDepenseID] = useState(null)
  const [detteID, setDetteID] = useState(null)
  const [evenementID, setEvenementID] = useState(null)

  const [etudiantID, setEtudiantID] = useState(null)
  const [formationID, setFormationID] = useState(null)
  const [annonceID, setAnnonceID] = useState(null)
  const [profID, setProfID] = useState(null)

  useEffect(() => {
    localStorage.setItem('activeTabAdmin', activeTab)
  }, [activeTab])

  useEffect(() => {
    if (!session) window.location.href = './Admin/Login'
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
        setEvenements([]);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, []);

  const closeTransaction = () => {
    setSelectedImage(null)
  }

  return (
    <>
      <Head>
        <title>Tableau de bord Admin - Académie Nobough</title>
        <link rel="icon" href="/logo2-nobg.png" />
      </Head>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} sidebarOpened={sidebarOpened} setSidebarOpened={setSidebarOpened} etudiantID={etudiantID} setEtudiantID={setEtudiantID} />

      <div className={`h-screen overflow-y-scroll ${sidebarOpened ? 'ml-64' : 'ml-16'} pt-4 pb-16 px-2 md:px-0`}>
        {/* Alerts show */}
        <div className="fixed top-4 right-4 z-30">
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
            {activeTab === 'comptes' && (
              <Comptes setActiveTab={setActiveTab} />
            )}

            {/*  */}
            {activeTab === 'budget' && (
              <Budget
                revenus={revenus}
                depenses={depenses}
                dettes={dettes}
                budget={budget}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'salaires' && (
              <Salaires setActiveTab={setActiveTab} />
            )}

            {/*  */}
            {activeTab === 'revenus' && (
              <Revenus revenus={revenus} setRevenus={setRevenus} setRevenuID={setRevenuID} setActiveTab={setActiveTab} />
            )}
            {activeTab === 'ajouterRevenu' && (
              <AjouterRevenu setRevenus={setRevenus} setActiveTab={setActiveTab} />
            )}
            {activeTab === 'modifierRevenu' && (
              <ModifierRevenu revenus={revenus} revenuID={revenuID} setRevenus={setRevenus} setActiveTab={setActiveTab} />
            )}

            {/*  */}
            {activeTab === 'depenses' && (
              <Depenses depenses={depenses} setDepenses={setDepenses} setDepenseID={setDepenseID} setActiveTab={setActiveTab} />
            )}
            {activeTab === 'ajouterDepense' && (
              <AjouterDepense setDepenses={setDepenses} setActiveTab={setActiveTab} />
            )}
            {activeTab === 'modifierDepense' && (
              <ModifierDepense depenses={depenses} depenseID={depenseID} setDepenses={setDepenses} setActiveTab={setActiveTab} />
            )}

            {/*  */}
            {activeTab === 'dettes' && (
              <Dettes dettes={dettes} setDettes={setDettes} setDetteID={setDetteID} setActiveTab={setActiveTab} />
            )}
            {activeTab === 'ajouterDette' && (
              <AjouterDette setDettes={setDettes} setActiveTab={setActiveTab} />
            )}
            {activeTab === 'modifierDette' && (
              <ModifierDette dettes={dettes} detteID={detteID} setDettes={setDettes} setActiveTab={setActiveTab} />
            )}

            {/*  */}
            {activeTab === 'evenements' && (
              <Evenements budget={budget} evenements={evenements} setEvenementID={setEvenementID} setEvenements={setEvenements} setActiveTab={setActiveTab} />
            )}
            {activeTab === 'ajouterEvenement' && (
              <AjouterEvenement budget={budget} evenements={evenements} setEvenements={setEvenements} setActiveTab={setActiveTab} />
            )}
            {activeTab === 'modifierEvenement' && (
              <ModifierEvenement budget={budget} evenements={evenements} evenementID={evenementID} setEvenements={setEvenements} setActiveTab={setActiveTab} />
            )}

            {/*  */}
            {activeTab === 'adhesions' && (
              <Adhesions setSelectedImage={setSelectedImage} setNotification={setNotification} />
            )}
            {activeTab === 'inscriptions' && (
              <Inscriptions setSelectedImage={setSelectedImage} setNotification={setNotification} />
            )}
            {activeTab === 'paiements' && (
              <Paiements setSelectedImage={setSelectedImage} setNotification={setNotification} />
            )}

            {/*  */}
            {activeTab === 'etudiants' && (
              <Etudiants setActiveTab={setActiveTab} setEtudiantID={setEtudiantID} />
            )}
            {activeTab === 'etudiant' && (
              <Etudiant setActiveTab={setActiveTab} etudiantID={etudiantID} setNotification={setNotification} />
            )}
            {activeTab === 'ajouterEtudiant' && (
              <AjouterEtudiant setActiveTab={setActiveTab} setNotification={setNotification} />
            )}

            {/*  */}
            {activeTab === 'formations' && (
              <Formations setActiveTab={setActiveTab} setFormationID={setFormationID} />
            )}
            {activeTab === 'ajouterFormation' && (
              <AjouterFormation setActiveTab={setActiveTab} setNotification={setNotification} />
            )}
            {activeTab === 'modifierFormation' && (
              <ModifierFormation setActiveTab={setActiveTab} formationID={formationID} setNotification={setNotification} />
            )}

            {/*  */}
            {activeTab === 'annonces' && (
              <Annonces setActiveTab={setActiveTab} setAnnonceID={setAnnonceID} />
            )}
            {activeTab === 'ajouterAnnonce' && (
              <AjouterAnnonce setActiveTab={setActiveTab} setNotification={setNotification} />
            )}
            {activeTab === 'modifierAnnonce' && (
              <ModifierAnnonce setActiveTab={setActiveTab} annonceID={annonceID} setNotification={setNotification} />
            )}

            {/*  */}
            {activeTab === 'professeurs' && (
              <Professeurs setActiveTab={setActiveTab} setProfID={setProfID} />
            )}
            {activeTab === 'ajouterProf' && (
              <AjouterProf setActiveTab={setActiveTab} setNotification={setNotification} />
            )}
            {activeTab === 'modifierProf' && (
              <ModifierProf setActiveTab={setActiveTab} profID={profID} setNotification={setNotification} />
            )}

            {/*  */}
            {activeTab === 'protestations' && (
              <Protestations setNotification={setNotification} />
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

      {selectedImage && (
        <div className="maxtop fixed inset-0 top-0 left flex items-center justify-center bg-black/50 backdrop-blur-3xl cursor-pointer" onClick={closeTransaction} >
          <div className="max-w-4xl w-full p-4 bg-white rounded-lg shadow-lg">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              onClick={closeTransaction}
            >
              <X className="w-6 h-6 cursor-pointer" />
            </button>
            <img
              src={selectedImage}
              alt="Preuve de transaction agrandie"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  )
}

export async function getServerSideProps({ req, res }) {
  const admin = verifyAuth(req, res)

  if (admin) {
    return {
      props: {
        session: {
          id: admin.id
        }
      },
    }
  }

  return { props: { session: null } }
}