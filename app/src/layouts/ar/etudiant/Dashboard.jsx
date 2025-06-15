import React, { useState, useEffect } from 'react'
import {
  ArrowDown, ArrowUp, AlertCircle, DollarSign,
  Calendar, FileText, Users, PieChart, Briefcase,
  Plus, Filter, Bell, Video, ChevronLeft, BookOpen,
  CreditCard, FileQuestion, BadgeCheck, Bookmark,
  Star, ChartBar, Clock, Award, Heart
} from 'lucide-react'
import Loading from '@/utils/Loading'

export default function Dashboard({ setActiveTab }) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [professeurs, setProfesseurs] = useState([]);
  const [annonces, setAnnonces] = useState([]);
  const [yt, setYt] = useState(false);
  const [x, y] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      if (loadingProgress < 100) {
        setLoadingProgress(prev => Math.min(prev + 5, 100));
      } else {
        clearInterval(interval);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [loadingProgress]);

  const quickLinks = [
    { titre: "التكوينات", icon: <Briefcase className="w-6 h-6" />, color: "from-orange-500 to-orange-700", tab: "formations" },
    { titre: "الإعلانات", icon: <AlertCircle className="w-6 h-6" />, color: "from-orange-300 to-orange-400", tab: "annonces" },
    { titre: "الأحداث", icon: <Calendar className="w-6 h-6" />, color: "from-yellow-500 to-yellow-700", tab: "evenements" },
    { titre: "التواصل", icon: <FileQuestion className="w-6 h-6" />, color: "from-orange-400 to-orange-600", tab: "protestation" },
    { titre: "الغرفة عبر الإنترنت", icon: <Video className="w-6 h-6" />, color: "from-[#c28e5c] to-[#9e6c3a]", tab: "room" },
    { titre: "الدفع", icon: <CreditCard className="w-6 h-6" />, color: "from-[#e4a544] to-[#b67d2d]", tab: "payer" }
  ];

  useEffect(() => {
    fetchAnnonces()
    fetchProfs()
  }, [])

  const fetchAnnonces = async () => {
    try {
      const response = await fetch('/api/annonces/getAll')
      const data = await response.json()
      let annoncesWithImages = []

      if (data.length > 0) {
        annoncesWithImages = data.map(annonce => {
          if (annonce.img) {
            const buffer = annonce.img.data
            const base64Image = Buffer.from(buffer).toString('base64')
            const imageUrl = `data:image/jpeg;base64,${base64Image}`
            return { ...annonce, img: imageUrl }
          }
          return annonce
        })
      }

      setAnnonces(annoncesWithImages || [])
      console.log(data)
    } catch (error) {
      console.error('خطأ أثناء استرجاع الإعلانات:', error)
    } finally {
      y(false)
    }
  }

  const fetchProfs = async () => {
    try {
      const response = await fetch('/api/profs/getAll2')
      const data = await response.json()
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

      console.log(data)
      setProfesseurs(profsWithImages)
    } catch (error) {
      console.error('خطأ أثناء استرجاع الأساتذة:', error)
    } finally {
      y(false)
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
    <div className="pt-4 pb-16" dir="rtl">
      {/* Welcome Banner with Islamic Pattern */}
      <div className="relative mb-8 rounded-lg overflow-hidden shadow-lg">
        <div
          className="px-6 py-8 text-white"
          style={{
            background: 'linear-gradient(135deg, #b78628 0%, #8A6E3D 50%, #d6ad60 100%)',
            backgroundSize: 'cover'
          }}
        >
          {/* Islamic pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" className="w-full h-full">
              <pattern id="arabesque" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M50,0 L0,50 L50,100 L100,50 Z M50,20 L20,50 L50,80 L80,50 Z" fill="#fff" />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#arabesque)" />
            </svg>
          </div>

          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: "'Noto Sans Arabic', 'Noto Sans', sans-serif" }}>
              مرحبًا بكم في أكاديمية نبوغ
            </h1>
            <p className="opacity-90 max-w-3xl">
              واصل مسيرتك التعليمية مع دوراتنا عالية الجودة. تقدم أكاديميتنا تدريبًا شاملاً لجميع المستويات، مع أساتذة ذوي خبرة ومتابعة شخصية.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="bg-white text-amber-700 px-4 py-2 rounded shadow hover:bg-amber-50 transition-colors duration-300 flex items-center font-medium">
                <BookOpen className="w-4 h-4 ml-2" />
                مواصلة دروسي
              </button>
              <button className="bg-amber-800 text-white px-4 py-2 rounded shadow hover:bg-amber-900 transition-colors duration-300 flex items-center font-medium">
                <Video className="w-4 h-4 ml-2" />
                الانضمام إلى جلسة
              </button>
            </div>
          </div>

          {/* Decorative element */}
          <div className="absolute top-0 left-0 h-full w-1/3 md:w-1/4 overflow-hidden hidden md:block">
            <div className="absolute top-0 right-0 h-full w-full bg-white opacity-10 transform skew-x-12 -translate-x-1/2"></div>
          </div>
        </div>
      </div>

      <div className="mx-auto md:px-4 lg:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - First 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Embedded YouTube Video */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">عرض لأكاديمية نبوغ</h2>
                <div className="bg-amber-100 p-1 rounded-full">
                  <Video className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <div className="h-96 bg-gray-100">
                {yt ?
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/WnY0hMoVCUE"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  :
                  <div id="thumbnail" className="w-full h-64 md:h-96 flex items-center justify-center bg-gray-200">
                    <div className="text-center bg-white/50 backdrop-blur-3xl p-4 rounded-xl">
                      <button onClick={() => setYt(y => !y)} className="w-16 h-16 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <p className="text-gray-600">فيديو عرض لأكاديمية نبوغ</p>
                      <p className="text-sm text-gray-500 mt-2">انقر لتشغيل الفيديو</p>
                    </div>
                  </div>
                }
              </div>
              <div className="p-4 bg-amber-50">
                <p className="text-sm text-gray-700">
                  اكتشف أكاديميتنا، وطريقتنا في التدريس، وشهادات طلابنا.
                  يقدم هذا الفيديو نهجنا التعليمي المبتكر وبيئة التعلم
                  التي أنشأناها لضمان نجاحكم.
                </p>
              </div>
            </div>

            {/* Fb + Profs */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
              <div className='w-full h-feull rounded-xl overflow-hidden'>
                <FacebookFeed />
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">أساتذتنا</h2>
                  <div className="bg-amber-100 p-1 rounded-full">
                    <Users className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-scroll">
                    {professeurs.map(professeur => (
                      <div key={professeur.id} className="flex bg-amber-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="w-1/3 relative">
                          <img
                            src={professeur.img}
                            alt={professeur.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-600 to-transparent py-1 px-2"></div>
                        </div>
                        <div className="w-2/3 p-3">
                          <h3 className="font-medium text-gray-800">{professeur.nom} {professeur.prenom}</h3>
                          <p className="text-amber-700 text-sm">{professeur.formationsCount} تكوينات</p>
                          <p className="text-gray-500 text-xs mt-1">{professeur.bio}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-600">
                            <Users className="w-3 h-3 ml-1" />
                            <span>{professeur.etudiantsCount} طالب</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Third column */}
          <div className="space-y-6">
            {/* Quick Access Links */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">روابط الوصول السريع</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {quickLinks.map((link, index) => (
                    <button
                      key={index}
                      className={`bg-gradient-to-l ${link.color} text-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300 flex flex-col items-center`}
                      onClick={() => setActiveTab(link.tab)}
                    >
                      <div className="p-2 bg-white bg-opacity-20 rounded-full mb-2">
                        {link.icon}
                      </div>
                      <span className="text-sm font-medium">{link.titre}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* News and Announcements */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">الأخبار</h2>
                <div className="bg-amber-100 p-1 rounded-full">
                  <Bell className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <div>
                {annonces.map((annonce, index) => (
                  <div key={index} className={`p-4 hover:bg-amber-50 transition-colors duration-200 ${index !== annonces.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <div className="flex items-start">
                      <div className="p-1 rounded-full ml-3 mt-1 shadow-sm bg-amber-100">
                        {annonce.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{annonce.titre}</h3>
                        <p className="text-sm text-gray-600 mt-1">{annonce.descr}</p>
                        <p className="text-xs text-gray-500 mt-1">{annonce.created_At}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-3 bg-amber-50 text-center">
                  <button onClick={() => setActiveTab('annonces')} className="text-amber-700 hover:text-amber-900 font-medium text-sm flex items-center justify-center mx-auto">
                    <span>عرض جميع الأخبار</span>
                    <ChevronLeft className="w-4 h-4 mr-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FacebookFeed() {
  useEffect(() => {
    if (!window.FB) {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/ar_AR/sdk.js#xfbml=1&version=v18.0";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else {
      window.FB.XFBML.parse();
    }
  }, []);

  return (
    <div className="w-full rounded-xl">
      <div className="fb-page w-full"
        data-href="https://www.facebook.com/noboughacademy"
        data-tabs="timeline"
        data-width="500"
        data-height=""
        data-small-header="false"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile="true">
        <blockquote cite="https://www.facebook.com/noboughacademy" className="fb-xfbml-parse-ignore">
          <a href="https://www.facebook.com/noboughacademy">أكاديمية نبوغ</a>
        </blockquote>
      </div>
    </div>
  );
}