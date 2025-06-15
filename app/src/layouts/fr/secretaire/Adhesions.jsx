import {
  Search, Filter, Users, Clock, Navigation, Flag, TrendingUp,
  Tag, DollarSign, BookOpen, User, Bookmark, Check, FileText, X,
  ArrowRight, Heart, Star, ChevronDown, Grid, List, Mail, Phone, Calendar, Info,
  CreditCard, AlertCircle, CheckCircle, ChevronRight, FileCheck, UserCheck, UserX
} from 'lucide-react'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Inscriptions1 from '../../../components/fr/secretaire/Inscriptions1'
import Paiements1 from '../../../components/fr/secretaire/Paiements1'
import Loading from '@/utils/Loading'

export default function Adhesions({ setSelectedImage, setNotification }) {
  const [activeTab, setActiveTab] = useState('inscriptions')
  const [inscriptions, setInscriptions] = useState([])
  const [paiements, setPaiements] = useState([])
  const [x, y] = useState(true)

  ///////////////////////////////////////////////////////////////

  const fetchInscriptions = async () => {
    try {
      const response = await fetch('/api/adhesions/getInscriptions')
      const data = await response.json()
      setInscriptions(data || [])
    } catch (error) {
      console.error('Erreur lors de la récupération des inscriptions:', error)
    } finally {
      y(false)
    }
  }

  const fetchPaiements = async () => {
    try {
      const response = await fetch('/api/adhesions/getPaiements')
      const data = await response.json()
      console.log(data[0])
      setPaiements(data || [])
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements:', error)
    } finally {
      y(false)
    }
  }

  useEffect(() => {
    fetchInscriptions()
    fetchPaiements()
  }, [])

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
        <title>Administration - Académie Nobough</title>
        <link rel="icon" href="/logo2-nobg.png" />
      </Head>

      <div className="max-w-full">
        {/* Nav */}
        <div className="mb-10 max-w-5xl mx-auto">
          <div className="flex justify-center border-b border-amber-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('inscriptions')}
              className={`py-4 px-8 font-medium relative transition-all ${activeTab === 'inscriptions' ? 'text-amber-800' : 'text-gray-600 hover:text-amber-700'}`}
            >
              <div className="flex items-center">
                <UserCheck className="w-5 h-5 mr-2" />
                Nouvelles inscriptions
                <span className="ml-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md">
                  {inscriptions.length}
                </span>
                {activeTab === 'inscriptions' && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-700"></div>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('paiements')}
              className={`py-4 px-8 font-medium relative transition-all ${activeTab === 'paiements' ? 'text-amber-800' : 'text-gray-600 hover:text-amber-700'}`}
            >
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Nouveaux paiements
                <span className="ml-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md">
                  {paiements.length}
                </span>
                {activeTab === 'paiements' && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-700"></div>
                )}
              </div>
            </button>
          </div>
        </div>

        {activeTab === 'inscriptions' && (
          <Inscriptions1 inscriptions={inscriptions} setNotification={setNotification} fetchInscriptions={fetchInscriptions} />
        )}

        {activeTab === 'paiements' && (
          <Paiements1 setSelectedImage={setSelectedImage} paiements={paiements} fetchPaiements={fetchPaiements} setNotification={setNotification} />
        )}
      </div>
    </>
  )
}