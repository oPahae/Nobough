import { X, MapPin, Info, HelpCircle, ShieldQuestion, Mail, Clock, Phone } from 'lucide-react';
import { useState, useEffect, useRef, act } from 'react';
import Head from 'next/head';
import Header from '../../../components/ar/secretaire/Header';
import Annonces from '../../../layouts/ar/secretaire/Annonces';
import Formations from '../../../layouts/ar/secretaire/Formations';
import Etudiants from '../../../layouts/ar/secretaire/Etudiants';
import Etudiant from '../../../layouts/ar/secretaire/Etudiant';
import Inscriptions from '../../../layouts/ar/secretaire/Inscriptions';
import Adhesions from '../../../layouts/ar/secretaire/Adhesions';
import Professeurs from '../../../layouts/ar/secretaire/Professeurs';
import Protestations from '../../../layouts/ar/secretaire/Protestations';
import AjouterFormation from '../../../layouts/ar/secretaire/AjouterFormation';
import ModifierFormation from '../../../layouts/ar/secretaire/ModifierFormation';
import AjouterAnnonce from '../../../layouts/ar/secretaire/AjouterAnnonce';
import ModifierAnnonce from '../../../layouts/ar/secretaire/ModifierAnnonce.jsx';
import AjouterProf from '../../../layouts/ar/secretaire/AjouterProf';
import ModifierProf from '../../../layouts/ar/secretaire/ModifierProf.jsx';
import AjouterEtudiant from '../../../layouts/ar/secretaire/AjouterEtudiant.jsx';
import Paiements from '../../../layouts/ar/secretaire/Paiements.jsx';
import { verifyAuth } from '@/middlewares/Secretaire';

export default function Secretaire({ session, setNotification }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('adhesions');
  const [etudiantID, setEtudiantID] = useState(null);
  const [formationID, setFormationID] = useState(null);
  const [annonceID, setannonceID] = useState(null);
  const [profID, setProfID] = useState(null);
  const [headerOpened, setHeaderOpened] = useState(true);

  useEffect(() => {
    localStorage.setItem('activeTabSecretaire', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (!session) window.location.href = './Secretaire/Login';
  });

  const closeTransaction = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <Head>
        <title>مساحة الكاتب - أكاديمية نبوغ</title>
        <link rel="icon" href="/logo2-nobg.png" />
      </Head>

      {!headerOpened && (
        <div className="fixed top-4 right-4 rounded-full bg-green-900 p-2 flex overflow-hidden cursor-pointer" onClick={() => setHeaderOpened(e => !e)}>
          <img
            src="/logo2.png"
            alt="شعار أكاديمية نبوغ"
            className="h-12 w-auto shrink-0 rounded-full"
          />
        </div>
      )}

      <Header activeTab={activeTab} setActiveTab={setActiveTab} headerOpened={headerOpened} setHeaderOpened={setHeaderOpened} etudiantID={etudiantID} setEtudiantID={setEtudiantID} />

      <div className={`h-screen overflow-y-scroll`} dir="rtl">
        <main className={`mx-auto p-4 ${headerOpened && 'mt-36 md:mt-46 lg:mt-46'}`}>
          {activeTab === 'adhesions' && (
            <Adhesions setSelectedImage={setSelectedImage} setNotification={setNotification} />
          )}
          {activeTab === 'inscriptions' && (
            <Inscriptions setSelectedImage={setSelectedImage} setNotification={setNotification} />
          )}
          {activeTab === 'paiements' && (
            <Paiements setSelectedImage={setSelectedImage} setNotification={setNotification} />
          )}

          {activeTab === 'etudiants' && (
            <Etudiants setActiveTab={setActiveTab} setEtudiantID={setEtudiantID} setNotification={setNotification} />
          )}
          {activeTab === 'etudiant' && (
            <Etudiant setActiveTab={setActiveTab} etudiantID={etudiantID} setNotification={setNotification} />
          )}
          {activeTab === 'ajouterEtudiant' && (
            <AjouterEtudiant setActiveTab={setActiveTab} setNotification={setNotification} />
          )}

          {activeTab === 'formations' && (
            <Formations setActiveTab={setActiveTab} setFormationID={setFormationID} setNotification={setNotification} />
          )}
          {activeTab === 'ajouterFormation' && (
            <AjouterFormation setActiveTab={setActiveTab} setNotification={setNotification} />
          )}
          {activeTab === 'modifierFormation' && (
            <ModifierFormation setActiveTab={setActiveTab} formationID={formationID} setNotification={setNotification} />
          )}

          {activeTab === 'annonces' && (
            <Annonces setActiveTab={setActiveTab} setAnnonceID={setannonceID} setNotification={setNotification} />
          )}
          {activeTab === 'ajouterAnnonce' && (
            <AjouterAnnonce setActiveTab={setActiveTab} setNotification={setNotification} />
          )}
          {activeTab === 'modifierAnnonce' && (
            <ModifierAnnonce setActiveTab={setActiveTab} annonceID={annonceID} setNotification={setNotification} />
          )}

          {activeTab === 'professeurs' && (
            <Professeurs setActiveTab={setActiveTab} setProfID={setProfID} setNotification={setNotification} />
          )}
          {activeTab === 'ajouterProf' && (
            <AjouterProf setActiveTab={setActiveTab} setNotification={setNotification} />
          )}
          {activeTab === 'modifierProf' && (
            <ModifierProf setActiveTab={setActiveTab} profID={profID} setNotification={setNotification} />
          )}

          {activeTab === 'protestations' && (
            <Protestations setNotification={setNotification} />
          )}
        </main>

        <footer className="px-6 py-10 text-sm" dir="rtl">
          <div className="backdrop-blur-3xl p-6 rounded-3xl max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-amber-900 font-bold">
              <h2 className="text-xl font-semibold mb-4">أكاديمية نبوغ</h2>
              <p className="flex items-start gap-2 mb-1">
                <MapPin className="w-4 h-4 mt-1 text-amber-500" />
                204 شارع عبد الله كنون - حي ياسمينة - برشيد
              </p>
              <p className="flex items-center gap-2 mb-1">
                <Phone className="w-4 h-4 text-amber-500" />
                06.61.84.20.35 - 06.61.67.35.76
              </p>
            </div>

            <div className="text-amber-900 font-bold">
              <h2 className="text-xl font-semibold mb-4">روابط مفيدة</h2>
              <ul className="space-y-2">
                <li>
                  <a href="/ar/About.jsx" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                    <Info className="w-4 h-4" /> حول
                  </a>
                </li>
                <li>
                  <a href="/ar/Faqs" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                    <HelpCircle className="w-4 h-4" /> الأسئلة الشائعة
                  </a>
                </li>
                <li>
                  <a href="/ar/Privacy.jsx" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                    <ShieldQuestion className="w-4 h-4" /> سياسة الخصوصية
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-white font-bold">
              <h2 className="text-xl font-semibold mb-4">اتصل بنا</h2>
              <p className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-amber-500" />
                nobough.contact@gmail.com
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                من الاثنين إلى الأحد، من 9 صباحاً إلى 11 مساءً
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse mt-4 pt-4 text-center text-xs text-white font-bold">
            <b className="self-start">&copy; {new Date().getFullYear()} أكاديمية نبوغ. كل الحقوق محفوظة.</b>
          </div>
        </footer>
      </div>

      {selectedImage && (
        <div className="maxtop fixed inset-0 top-0 left-0 flex items-center justify-center bg-black/50 backdrop-blur-3xl cursor-pointer" onClick={closeTransaction}>
          <div className="max-w-4xl w-full p-4 bg-white rounded-lg shadow-lg">
            <button
              className="absolute top-4 left-4 text-gray-600 hover:text-gray-800"
              onClick={closeTransaction}
            >
              <X className="w-6 h-6 cursor-pointer" />
            </button>
            <img
              src={selectedImage}
              alt="دليل المعاملة الموسع"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const secretaire = verifyAuth(req, res);

  if (secretaire) {
    return {
      props: {
        session: {
          id: secretaire.id,
          email: secretaire.email,
          created_At: secretaire.created_At,
        }
      },
    };
  }

  return { props: { session: null } };
}