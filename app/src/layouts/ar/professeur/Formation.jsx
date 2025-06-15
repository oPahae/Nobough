import {
    Search, Filter, Users, Clock, Navigation, Flag, TrendingUp,
    Tag, DollarSign, BookOpen, User, Bookmark, Check, FileText,
    ArrowRight, Heart, Star, ChevronDown, Grid, List, Mail, Phone,
    Calendar, Info, MessageCircle, Library, Book, Video, File, Download,
    PlusCircle, Send, Paperclip, Image, FileText as FileIcon, Delete,
    MapPin
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Notification from '../../../utils/Notification'

import Programme from '../../../components/ar/professeur/Programme'
import Chat from '../../../components/ar/professeur/Chat'
import Biblio from '../../../components/ar/professeur/Biblio'
import Etudiants from '../../../components/ar/professeur/Etudiants'

export default function Formation({ setActiveTab, session, setNotification }) {
    const [activeTab2, setActiveTab2] = useState('programme')
    const [formation, setFormation] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [formationID, setFormationID] = useState('')

    useEffect(() => {
        const temp = sessionStorage.getItem('formationProf')
        if (!temp) setActiveTab('formations')
        else setFormationID(temp)
    }, [])

    useEffect(() => {
        const fetchFormation = async () => {
            if (formationID === "") return
            try {
                setIsLoading(true)
                const response = await fetch(`/api/formation/getOne?formationID=${formationID}`)
                if (!response.ok) {
                    throw new Error('خطأ أثناء استرجاع الدورة')
                }
                const data = await response.json()

                const formattedFormation = {
                    id: data.id,
                    titre: data.titre,
                    description: data.description,
                    img: data.img ? `data:image/jpeg;base64,${Buffer.from(data.img).toString('base64')}` : "/formation.jpg",
                    formateur: data.formateur,
                    duree: data.duree,
                    etudiants: data.etudiants,
                    prix: data.prix,
                    categorie: data.categorie,
                    type: data.type,
                    tags: data.tags || [],
                    inscrit: data.inscrit || false,
                    genre: data.genre,
                    createdAt: data.created_At,
                    salle: data.salle,
                    programme: data.programme || []
                }
                console.log(formattedFormation)

                setFormation(formattedFormation)
            } catch (error) {
                console.error('خطأ أثناء استرجاع الدورة:', error)
                setError(error.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchFormation()
    }, [formationID, session])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-5xl mx-auto p-8 text-center" dir="rtl">
                <div className="bg-red-50 border-r-4 border-red-500 p-4 rounded-md mb-4">
                    <h2 className="text-red-700 font-medium">خطأ في التحميل</h2>
                    <p className="text-red-600">{error}</p>
                </div>
                <Link href="/formations" className="text-amber-600 hover:text-amber-800 underline">
                    العودة إلى قائمة الدورات
                </Link>
            </div>
        )
    }

    if (!formation) {
        return (
            <div className="max-w-5xl mx-auto p-8 text-center" dir="rtl">
                <div className="bg-amber-50 border-r-4 border-amber-500 p-4 rounded-md mb-4">
                    <h2 className="text-amber-700 font-medium">الدورة غير موجودة</h2>
                    <p className="text-amber-600">الدورة المطلوبة غير موجودة أو تم حذفها.</p>
                </div>
                <Link href="/formations" className="text-amber-600 hover:text-amber-800 underline">
                    العودة إلى قائمة الدورات
                </Link>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>{formation.titre} - أكاديمية نبوغ</title>
                <link rel="icon" href="/logo2-nobg.png" />
            </Head>

            <div className="max-w-full" dir="rtl">
                <Programme programme={formation.programme} session={session} />
                <Chat formationID={formationID} session={session} />
                <Biblio formationID={formationID} session={session} />
                <Etudiants formationID={formationID} session={session} setNotification={setNotification} />
            </div>
        </>
    )
}