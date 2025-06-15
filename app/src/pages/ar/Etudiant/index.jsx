import { X, MapPin, Info, HelpCircle, ShieldQuestion, Mail, Clock, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../../components/ar/etudiant/Header';
import Dashboard from '../../../layouts/ar/etudiant/Dashboard';
import Formations from '../../../layouts/ar/etudiant/Formations';
import Formation from '../../../layouts/ar/etudiant/Formation';
import Annonces from '../../../layouts/ar/etudiant/Annonces';
import Evenements from '../../../layouts/ar/etudiant/Evenements';
import Protestation from '../../../layouts/ar/etudiant/Protestation';
import Payer from '../../../layouts/ar/etudiant/Payer';
import Room from '../../../layouts/ar/etudiant/Room';
import Documents from '../../../layouts/ar/etudiant/Documents';
import Etudier from '../../../layouts/ar/etudiant/Etudier';
import Profile from '../../../layouts/ar/etudiant/Profile';
import Register from '../../../layouts/ar/etudiant/Register';
import Login from '../../../layouts/ar/etudiant/Login';
import { verifyAuth } from '@/middlewares/Etudiant';

export default function Etudiant({ session, setNotification }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [formationID, setFormationID] = useState(null);
  const [headerOpened, setHeaderOpened] = useState(true);

  useEffect(() => {
    localStorage.setItem('activeTabEtudiant', activeTab);
  }, [activeTab]);

  return (
    <div dir="rtl">
      <Head>
        <title>مساحة الطالب - أكاديمية نبوغ</title>
        <link rel="icon" href="/logo2-nobg.png" />
      </Head>

      {!headerOpened &&
        <div className="fixed top-4 right-4 rounded-full bg-green-900 p-2 flex overflow-hidden cursor-pointer" onClick={() => setHeaderOpened(e => !e)}>
          <img
            src="/logo2.png"
            alt="شعار أكاديمية نبوغ"
            className="h-12 w-auto shrink-0 rounded-full"
          />
        </div>
      }

      <Header session={session} activeTab={activeTab} setActiveTab={setActiveTab} headerOpened={headerOpened} setHeaderOpened={setHeaderOpened} formationID={formationID} setFormationID={setFormationID} setNotification={setNotification} />

      <div className={`h-screen overflow-y-scroll`}>
        <main className={`mx-auto px-4 ${headerOpened && 'mt-36 md:mt-46 lg:mt-46'}`}>
          {activeTab === 'dashboard' && (
            <Dashboard session={session} setActiveTab={setActiveTab} setNotification={setNotification} />
          )}

          {activeTab === 'formations' && (
            <Formations session={session} setActiveTab={setActiveTab} setFormationID={setFormationID} setNotification={setNotification} />
          )}
          {activeTab === 'formation' && (
            <Formation session={session} formationID={formationID} setActiveTab={setActiveTab} setNotification={setNotification} />
          )}
          {activeTab === 'etudier' && (
            <Etudier session={session} formationID={formationID} setNotification={setNotification} />
          )}

          {activeTab === 'annonces' && (
            <Annonces session={session} setNotification={setNotification} />
          )}
          {activeTab === 'evenements' && (
            <Evenements session={session} setActiveTab={setActiveTab} setNotification={setNotification} />
          )}
          {activeTab === 'protestation' && (
            <Protestation session={session} setNotification={setNotification} />
          )}
          {activeTab === 'documents' && (
            <Documents session={session} setNotification={setNotification} />
          )}

          {activeTab === 'room' && (
            <Room session={session} setNotification={setNotification} />
          )}
          {activeTab === 'payer' && (
            <Payer session={session} setNotification={setNotification} />
          )}
          {activeTab === 'profile' && (
            <Profile session={session} setNotification={setNotification} />
          )}

          {activeTab === 'login' && (
            <Login session={session} setActiveTab={setActiveTab} setNotification={setNotification} />
          )}
          {activeTab === 'register' && (
            <Register session={session} setActiveTab={setActiveTab} setNotification={setNotification} />
          )}
        </main>

        <footer className="px-6 py-10 text-sm">
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
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const etudiant = verifyAuth(req, res);

  if (etudiant) {
    return {
      props: {
        session: {
          id: etudiant.id,
          nom: etudiant.nom,
          prenom: etudiant.prenom,
          email: etudiant.email,
          tel: etudiant.tel,
          cin: etudiant.cin,
          bio: etudiant.bio,
          rabais: etudiant.rabais,
          created_At: etudiant.created_At,
        }
      },
    };
  }

  return { props: { session: null } };
}