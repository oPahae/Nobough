import { Mail, Clock, Phone, MapPin, Info, ShieldQuestion, HelpCircle } from "lucide-react";

import { useState, useEffect, useRef, act } from 'react'
import Head from 'next/head'
import Header from '../../../components/fr/professeur/Header'
import Formations from '../../../layouts/fr/professeur/Formations'
import Formation from '../../../layouts/fr/professeur/Formation'
import Room from '../../../layouts/fr/professeur/Room'
import Profile from '../../../layouts/fr/professeur/Profile'
import Documents from '../../../layouts/fr/professeur/Documents'
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
    <>
      <Head>
        <title>Espace Professeur - Académie Nobough</title>
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
    </>
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