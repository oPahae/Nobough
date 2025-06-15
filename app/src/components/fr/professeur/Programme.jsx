import {
    Search, Filter, Users, Clock, Navigation, Flag, TrendingUp,
    Tag, DollarSign, BookOpen, User, Bookmark, Check, FileText,
    ArrowRight, Heart, Star, ChevronDown, Grid, List, Mail, Phone,
    Calendar, Info, MessageCircle, Library, Book, Video, File, Download,
    PlusCircle, Send, Paperclip, Image, FileText as FileIcon, Delete,
    MapPin, Moon, Sparkles
} from 'lucide-react'
import React from 'react'

const Programme = ({ programme, session }) => {
    return (
        <div className="max-w-full relative">
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
                    <h1 className="text-3xl font-bold text-gray-800">Programme de la formation</h1>
                    <div className="flex items-center justify-center mt-2">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                        <Moon className="text-amber-800 mx-4 w-4 h-4" />
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                    </div>
                </div>
                <p className="text-gray-600 mt-4 max-w-xl mx-auto">Découvrez le planning détaillé et enrichissez votre parcours éducatif</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl mb-10 max-w-5xl mx-auto border border-amber-100">
                <div className="flex items-center mb-6">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-md">
                        <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold ml-3 text-gray-800">Calendrier des séances</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {programme.map((prog, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-2xl group relative border border-amber-100">
                            <div className="relative p-1 bg-gradient-to-r from-amber-500 to-amber-700">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                <h3 className="text-center font-bold py-2 text-white">Séance {index + 1}</h3>
                            </div>
                            <div className="p-6 relative">
                                <div className="absolute right-0 top-0 w-24 h-24 opacity-10 rotate-45">
                                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M50 0L60 40H100L70 65L80 100L50 80L20 100L30 65L0 40H40L50 0Z" fill="currentColor" />
                                    </svg>
                                </div>
                                <div className="flex items-center my-4 bg-amber-50 p-3 rounded-lg">
                                    <Calendar className="w-5 h-5 mr-3 text-amber-700 flex-shrink-0" />
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-700">Jour:</span>
                                        <span className="text-gray-600">{prog.jour}</span>
                                    </div>
                                </div>
                                <div className="flex items-center my-4 bg-amber-50 p-3 rounded-lg">
                                    <Clock className="w-5 h-5 mr-3 text-amber-700 flex-shrink-0" />
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-700">Horaire:</span>
                                        <span className="text-gray-600">{prog.heure}</span>
                                    </div>
                                </div>
                                <div className="flex items-center my-4 bg-amber-50 p-3 rounded-lg">
                                    <MapPin className="w-5 h-5 mr-3 text-amber-700 flex-shrink-0" />
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-700">Salle:</span>
                                        <span className="text-gray-600">{prog.salle}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Programme