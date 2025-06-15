import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Heart, Star, Sparkles } from 'lucide-react';

const IslamicContent = () => {
  const [currentContent, setCurrentContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contentType, setContentType] = useState('hadith');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Données simulées (remplacez par vos vraies APIs)
  const mockData = {
    hadith: [
      {
        id: 1,
        text: "إنما الأعمال بالنيات وإنما لكل امرئ ما نوى",
        translation: "Les actions ne valent que par les intentions, et chacun n'aura que ce qu'il a eu l'intention de faire.",
        narrator: "البخاري",
        category: "النية"
      },
      {
        id: 2,
        text: "المؤمن للمؤمن كالبنيان يشد بعضه بعضا",
        translation: "Le croyant est pour le croyant comme une construction dont les parties se renforcent mutuellement.",
        narrator: "البخاري",
        category: "الأخوة"
      },
      {
        id: 3,
        text: "خير الناس أنفعهم للناس",
        translation: "Les meilleurs des gens sont ceux qui sont les plus utiles aux autres.",
        narrator: "الطبراني",
        category: "الخير"
      }
    ],
    quran: [
      {
        id: 1,
        arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
        translation: "Et quiconque craint Allah, Il lui donnera une issue favorable.",
        surah: "الطلاق",
        ayah: "2-3"
      },
      {
        id: 2,
        arabic: "وَبَشِّرِ الصَّابِرِينَ",
        translation: "Et annonce la bonne nouvelle aux endurants.",
        surah: "البقرة",
        ayah: "155"
      },
      {
        id: 3,
        arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
        translation: "Avec la difficulté il y a certes une facilité.",
        surah: "الشرح",
        ayah: "6"
      }
    ]
  };

  useEffect(() => {
    // Simulation d'un appel API
    const fetchContent = async () => {
      setLoading(true);
      // Remplacez ceci par votre vraie API
      setTimeout(() => {
        setCurrentContent(mockData[contentType][currentIndex]);
        setLoading(false);
      }, 1000);
    };

    fetchContent();
  }, [contentType, currentIndex]);

  const nextContent = () => {
    const maxIndex = mockData[contentType].length - 1;
    setCurrentIndex(currentIndex === maxIndex ? 0 : currentIndex + 1);
  };

  const prevContent = () => {
    const maxIndex = mockData[contentType].length - 1;
    setCurrentIndex(currentIndex === 0 ? maxIndex : currentIndex - 1);
  };

  const IslamicPattern = () => (
    <div className="absolute inset-0 opacity-5">
      <svg width="100%" height="100%" viewBox="0 0 60 60" className="fill-current text-amber-800">
        <defs>
          <pattern id="islamic-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="3" />
            <path d="M30 15 L45 30 L30 45 L15 30 Z" strokeWidth="1" stroke="currentColor" fill="none" />
            <circle cx="15" cy="15" r="2" />
            <circle cx="45" cy="15" r="2" />
            <circle cx="15" cy="45" r="2" />
            <circle cx="45" cy="45" r="2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
      </svg>
    </div>
  );

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-20">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-amber-200 rounded-full animate-spin border-t-amber-600"></div>
        <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-amber-600 w-6 h-6" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4">
      {/* Motif de fond */}
      <IslamicPattern />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* En-tête avec sélecteur de type */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6">
            <Star className="text-amber-600 w-8 h-8" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">
              كنوز الإسلام
            </h1>
            <Star className="text-amber-600 w-8 h-8" />
          </div>
          
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => {setContentType('hadith'); setCurrentIndex(0);}}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                contentType === 'hadith' 
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-amber-300' 
                  : 'bg-white text-amber-700 hover:bg-amber-50 border-2 border-amber-200'
              }`}
            >
              <BookOpen className="inline-block w-5 h-5 mr-2" />
              الأحاديث
            </button>
            <button
              onClick={() => {setContentType('quran'); setCurrentIndex(0);}}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                contentType === 'quran' 
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-amber-300' 
                  : 'bg-white text-amber-700 hover:bg-amber-50 border-2 border-amber-200'
              }`}
            >
              <Heart className="inline-block w-5 h-5 mr-2" />
              القرآن الكريم
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="relative">
          {/* Décorations d'angle */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-60"></div>
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-60"></div>
          <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-60"></div>
          <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-60"></div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-amber-200/50 overflow-hidden">
            {/* Bordure décorative supérieure */}
            <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400"></div>
            
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="p-8 md:p-12">
                {contentType === 'hadith' ? (
                  <div className="space-y-8">
                    {/* Catégorie */}
                    <div className="text-center">
                      <span className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-full text-sm font-medium border border-emerald-200">
                        {currentContent?.category}
                      </span>
                    </div>

                    {/* Texte arabe */}
                    <div className="text-center">
                      <p className="text-3xl md:text-4xl leading-relaxed text-amber-900 font-arabic" dir="rtl">
                        {currentContent?.text}
                      </p>
                    </div>

                    {/* Séparateur décoratif */}
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-300"></div>
                      <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                      <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-300"></div>
                    </div>

                    {/* Traduction */}
                    <div className="text-center">
                      <p className="text-lg md:text-xl text-amber-800 leading-relaxed italic">
                        "{currentContent?.translation}"
                      </p>
                    </div>

                    {/* Narrateur */}
                    <div className="text-center">
                      <p className="text-amber-700 font-medium">
                        — رواه {currentContent?.narrator}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Référence */}
                    <div className="text-center">
                      <span className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-full text-sm font-medium border border-emerald-200">
                        سورة {currentContent?.surah} - آية {currentContent?.ayah}
                      </span>
                    </div>

                    {/* Texte arabe */}
                    <div className="text-center">
                      <p className="text-3xl md:text-4xl leading-relaxed text-amber-900 font-arabic" dir="rtl">
                        {currentContent?.arabic}
                      </p>
                    </div>

                    {/* Séparateur décoratif */}
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-300"></div>
                      <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                      <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-300"></div>
                    </div>

                    {/* Traduction */}
                    <div className="text-center">
                      <p className="text-lg md:text-xl text-amber-800 leading-relaxed italic">
                        "{currentContent?.translation}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bordure décorative inférieure */}
            <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400"></div>
          </div>

          {/* Boutons de navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={prevContent}
              disabled={loading}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 group-hover:transform group-hover:translate-x-1 transition-transform" />
              السابق
            </button>

            <div className="flex gap-2">
              {mockData[contentType].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-amber-500 scale-125' 
                      : 'bg-amber-200 hover:bg-amber-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextContent}
              disabled={loading}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              التالي
              <ChevronLeft className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Compteur */}
        <div className="text-center mt-8">
          <p className="text-amber-700 font-medium">
            {currentIndex + 1} من {mockData[contentType].length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IslamicContent;