import {
    Calendar, ArrowRight, Phone, Mail, CreditCard, BookOpen, Trash2, Edit, Plus, X, Sparkles, Moon, Download
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import Loading from '@/utils/Loading'

export default function Profs({ setActiveTab }) {
    const [profs, setProfs] = useState([])
    const [x, y] = useState(true)

    useEffect(() => {
        const fetchProfs = async () => {
            try {
                const response = await fetch('/api/profs/getAll')
                const data = await response.json()
                console.log(data)
                let profsWithImages = []

                if (data.length > 0) {
                    profsWithImages = data.map(prof => {
                        if (prof.img && prof.img.data) {
                            const buffer = prof.img.data
                            const base64Image = Buffer.from(buffer).toString('base64')
                            const imageUrl = atob(base64Image)
                            return { ...prof, img: imageUrl }
                        }
                        return { ...prof, img: "/user.jpg" }
                    })
                }

                setProfs(profsWithImages)
                console.log(profsWithImages)
            } catch (error) {
                console.error('Erreur lors de la récupération des professeurs:', error)
            } finally {
                y(false)
            }
        }
        fetchProfs()
    }, [])

    const handleDelete = async (id) => {
        if(!confirm('Vous êtes sûres ?')) return
        try {
            const response = await fetch('/api/profs/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            })

            if (response.ok) {
                setProfs(profs.filter(prof => prof.id !== id))
            } else {
                const data = await response.json()
                console.error('Erreur lors de la suppression:', data.message)
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error)
        }
    }

    const handleDownload = async () => {
        try {
            const response = await fetch('/api/_backups/professeurs');

            if (!response.ok) {
                throw new Error('Erreur de connexion');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'formations.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading the file:', error);
        }
    }

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
                <title>Profs - Académie Nobough</title>
                <link rel="icon" href="/logo2-nobg.png" />
            </Head>

            <div className="w-full relative md:px-22">
                <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 opacity-20">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#B8860B" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                        </svg>
                    </div>
                    <div className="absolute top-1/2 -left-24 w-64 h-64 opacity-20">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#B8860B" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                        </svg>
                    </div>
                    <div className="absolute -bottom-24 right-1/4 w-72 h-72 opacity-20">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#B8860B" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
                        </svg>
                    </div>
                </div>

                <div className="mb-12 text-center pt-8 relative">
                    <div className="inline-block">
                        <div className="flex items-center justify-center mb-2">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-700"></div>
                            <Sparkles className="text-amber-800 mx-4 w-6 h-6" />
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-700"></div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">Liste des profs</h1>
                        <div className="flex items-center justify-center mt-2">
                            <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                            <Moon className="text-amber-800 mx-4 w-4 h-4" />
                            <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                        </div>
                    </div>
                    <p className="text-gray-600 mt-4 max-w-xl mx-auto">Gérez et suivez l'équipe pédagogique</p>
                </div>

                <div className="flex justify-end px-6 py-4 max-w-6xl mx-auto gap-6">
                    <button
                        onClick={() => setActiveTab('ajouterProf')}
                        className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center cursor-pointer"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        <span className="font-medium">Ajouter</span>
                    </button>

                    <button
                        onClick={handleDownload}
                        className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8 w-full mx-auto pb-16 md:px-6">
                    {profs.map((professeur) => (
                        <div key={professeur.id} className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-2xl relative">
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/4 h-64 md:h-auto relative overflow-hidden">
                                    <img
                                        src={professeur.img}
                                        alt={`${professeur.prenom} ${professeur.nom}`}
                                        className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                </div>

                                <div className="p-6 md:w-3/4 relative">
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button
                                            className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition cursor-pointer shadow-sm"
                                            onClick={() => { setActiveTab('modifierProf'); sessionStorage.setItem('modifierProf', professeur.id) }}
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(professeur.id)}
                                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition cursor-pointer shadow-sm"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-800 leading-tight mb-2">
                                        {professeur.prenom} {professeur.nom}
                                    </h3>

                                    <p className="text-sm text-gray-600 line-clamp-3 mb-2">{professeur.bio}</p>

                                    <div className='bg-blue-400 rounded-xl px-2 py-1 w-fit text-white mb-6'>Salaire: {professeur.salaire} DH</div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center text-gray-700 bg-amber-50 px-3 py-2 rounded-lg">
                                            <Calendar className="w-4 h-4 text-amber-700 mr-2" />
                                            <span className="text-sm">Né(e) le {new Date(professeur.birth).toLocaleDateString('FR-fr')}</span>
                                        </div>
                                        <div className="flex items-center text-gray-700 bg-amber-50 px-3 py-2 rounded-lg">
                                            <Phone className="w-4 h-4 text-amber-700 mr-2" />
                                            <span className="text-sm">{professeur.tel}</span>
                                        </div>
                                        <div className="flex items-center text-gray-700 bg-amber-50 px-3 py-2 rounded-lg">
                                            <Mail className="w-4 h-4 text-amber-700 mr-2" />
                                            <span className="text-sm">{professeur.email}</span>
                                        </div>
                                        <div className="flex items-center text-gray-700 bg-amber-50 px-3 py-2 rounded-lg">
                                            <CreditCard className="w-4 h-4 text-amber-700 mr-2" />
                                            <span className="text-sm">CIN: {professeur.cin}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="flex items-start text-gray-700">
                                            <BookOpen className="w-5 h-5 text-amber-700 mr-2 mt-1" />
                                            <div>
                                                <span className="font-medium">Spécialités:</span>
                                                <div className="flex flex-wrap mt-2 gap-2">
                                                    {professeur.specialites.split(",").map((specialite, index) => (
                                                        <span
                                                            key={index}
                                                            className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                                                        >
                                                            {specialite}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}