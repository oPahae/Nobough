import {
    Search, Filter, Users, Clock, Navigation, Flag, TrendingUp,
    Tag, DollarSign, BookOpen, User, Bookmark, Check, FileText,
    ArrowRight, Heart, Star, ChevronDown, Grid, List, Mail, Phone,
    Calendar, Info, MessageCircle, Library, Book, Video, File, Download,
    PlusCircle, Send, Paperclip, Image, FileText as FileIcon, Delete,
    MapPin, Moon, Sparkles
} from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'
import { io } from "socket.io-client";
let socket;

const Chat = ({ formationID, session }) => {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const chatEndRef = useRef(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const PatternDecoration = () => (
        <div className="absolute right-0 top-0 w-24 h-24 opacity-10 rotate-45">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0L60 40H100L70 65L80 100L50 80L20,100L30,65L0,40L40,40 Z" fill="currentColor" />
            </svg>
        </div>
    )

    useEffect(() => {
        async function initSocket() {
            await fetch("/api/_lib/socket");
            socket = io({
                path: "/api/_lib/socket",
            });
            socket.on("connect", () => {
                console.log("Socket connected:", socket.id);
            });
            socket.on("newMessage", (message) => {
                fetchMessages();
            });
            socket.on("disconnect", () => {
                console.log("Socket disconnected");
            });
        }
        initSocket()
    }, [])

    ///////////////////////////////////////////////////////////

    useEffect(() => {
        fetchMessages()
    }, [formationID])

    const fetchMessages = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/formation/getMsgs?formationID=${formationID}`)

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des messages')
            }

            const data = await response.json()

            const formattedMessages = data.map(msg => ({
                ...msg,
                created_At: new Date(msg.created_At).toISOString()
            }))

            setMessages(formattedMessages)
            console.log(formattedMessages)
        } catch (error) {
            console.error('Erreur lors de la récupération des messages:', error)
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (newMessage.trim() === '') return

        try {
            const response = await fetch('/api/formation/addMsg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contenu: newMessage,
                    role: 'etudiant',
                    formationID: formationID,
                    sessionID: session.id
                }),
            })

            if (response.ok) {
                const newMsg = await response.json()
                setMessages([...messages, newMsg])
                setNewMessage('')
                socket.emit("sendMessage", newMessage);
            } else {
                const errorData = await response.json()
                setNotification((notif) => ({
                    ...notif,
                    msg: `Erreur: ${errorData.message}`,
                    type: 'error',
                    shown: true
                }))
            }
        } catch (error) {
            setNotification((notif) => ({
                ...notif,
                msg: 'Error # ' + error,
                type: 'error',
                shown: true
            }))
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-5xl mx-auto p-8 text-center">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-4">
                    <h2 className="text-red-700 font-medium">Erreur de chargement</h2>
                    <p className="text-red-600">{error}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="text-amber-600 hover:text-amber-800 underline"
                >
                    Réessayer
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-full relative md:px-22">
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
                    <h1 className="text-3xl font-bold text-gray-800">Chat en direct</h1>
                    <div className="flex items-center justify-center mt-2">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
                        <Moon className="text-amber-800 mx-4 w-4 h-4" />
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
                    </div>
                </div>
                <p className="text-gray-600 mt-4 max-w-xl mx-auto">Echanger les messages avec vos collègues / professeur et partager des informations</p>
            </div>

            <div className="bg-transparent rounded-xl shadow-xl mb-6 overflow-hidden relative">
                <PatternDecoration />
                <div className="flex flex-col h-screen max-h-[70vh]">
                    <div className="flex-grow overflow-y-auto p-6 bg-transparent">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`mb-6 ${msg.emetteurID === session.id ? 'flex justify-end' : 'flex justify-start'}`}>
                                {msg.emetteurID !== session.id && (
                                    <div className="mr-3">
                                        <div className="w-12 h-12 rounded-full border-2 border-amber-200 overflow-hidden shadow-md">
                                            <img
                                                src={msg.img || "/user.jpg"}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className={`max-w-[75%] ${msg.emetteurID === session.id ? 'order-1' : 'order-2'}`}>
                                    {true && (
                                        <div className="flex items-center mb-1.5 ml-1">
                                            <span className="font-semibold text-sm mr-2 text-gray-700">
                                                {msg.emetteur}
                                            </span>
                                            {msg.role === 'professeur' && (
                                                <span className="text-xs bg-amber-100 text-amber-800 rounded-full px-2 py-0.5 flex items-center">
                                                    <BookOpen className="w-3 h-3 mr-1" />
                                                    Formateur
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className={`rounded-2xl p-4 shadow-md ${msg.emetteurID === session.id
                                        ? 'bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-br-none'
                                        : msg.role === 'professeur'
                                            ? 'bg-amber-50 border border-amber-200 text-gray-800 rounded-bl-none'
                                            : 'bg-gray-100 border border-gray-200 text-gray-800 rounded-bl-none'
                                        }`}>
                                        <p className="break-words leading-relaxed">{msg.contenu}</p>
                                        <div className={`text-xs mt-2 ${msg.emetteurID === session.id ? 'text-amber-200' : 'text-gray-500'} text-right`}>
                                            {new Date(msg.created_At).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>

                                {msg.emetteurID === session.id && (
                                    <div className="ml-3">
                                        <div className="w-12 h-12 rounded-full border-2 border-amber-200 overflow-hidden shadow-md">
                                            <img
                                                src={msg.role === 'professeur' ? (msg.img ? atob(msg.img.split(',')[1]) : '/user.jpg') : msg.img || '/user.jpg'}
                                                alt="Utilisateur"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="border-t border-amber-100 p-6 bg-white">
                        <div className="flex gap-3 items-center">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Écrivez votre message ici..."
                                className="flex-grow p-4 border border-amber-200 rounded-xl bg-white/80 shadow-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-700"
                            />
                            <button
                                type="submit"
                                className="p-4 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Chat