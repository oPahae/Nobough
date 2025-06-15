import { Mail, Clock, Phone, MapPin, Info, ShieldQuestion, HelpCircle } from "lucide-react";
import { useState, useEffect, useRef, act } from 'react'
import Head from 'next/head'
import Header from '../../../components/ar/professeur/Header'
import Formations from '../../../layouts/ar/professeur/Formations'
import Formation from '../../../layouts/ar/professeur/Formation'
import Room from '../../../layouts/ar/professeur/Room'
import Profile from '../../../layouts/ar/professeur/Profile'
import Documents from '../../../layouts/ar/professeur/Documents'
import { verifyAuth } from '@/middlewares/Professeur'

export default function Professeur({ session, setNotification }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [formationID, setFormationID] = useState(null)
  const [headerOpened, setHeaderOpened] = useState(true)

  useEffect(() => {
    localStorage.setItem('activeTabProfesseur', activeTab)
  }, [activeTab])

  useEffect(() => {
    if(!session) window.location.href = './Professeur/Login'
  })

  return (
    <div dir="rtl">
      <Head>
        <title>مساحة الأستاذ - أكاديمية نبوغ</title>
        <link rel="icon" href="/logo2-nobg.png" />
      </Head>

      <Header session={session} activeTab={activeTab} setActiveTab={setActiveTab} headerOpened={headerOpened} setHeaderOpened={setHeaderOpened} formationID={formationID} setFormationID={setFormationID} />

      <div className={`h-screen overflow-y-scroll`}>
        <main className={`container mx-auto p-4 ${headerOpened && 'mt-36 md:mt-46 lg:mt-46'}`}>
          {activeTab === 'formations' && (
            <Formations setActiveTab={setActiveTab} setFormationID={setFormationID} session={session} setNotification={setNotification} />
          )}
          {activeTab === 'formation' && (
            <Formation formationID={formationID} setActiveTab={setActiveTab} session={session} setNotification={setNotification} />
          )}
          {activeTab === 'room' && (
            <Room session={session} setNotification={setNotification} />
          )}
          {activeTab === 'profile' && (
            <Profile session={session} setNotification={setNotification} />
          )}
          {activeTab === 'documents' && (
            <Documents session={session} setNotification={setNotification} />
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
  )
}

export async function getServerSideProps({ req, res }) {
  const professeur = verifyAuth(req, res)

  if (professeur) {
    return {
      props: {
        session: {
          id: professeur.id,
          nom: professeur.nom,
          prenom: professeur.prenom,
          email: professeur.email,
          tel: professeur.tel,
          cin: professeur.cin,
          bio: professeur.bio,
          created_At: professeur.created_At,
        }
      },
    }
  }

  return { props: { session: null } }
}