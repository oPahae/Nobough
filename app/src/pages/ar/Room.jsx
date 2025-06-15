import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import {
    Mic,
    MicOff,
    Hand,
    PhoneOff,
    Copy,
    Check,
    ScreenShare,
    Volume2,
    VolumeX
} from 'lucide-react';
import { verifyAuth as verifyAuthEtudiant } from '@/middlewares/Etudiant'
import { verifyAuth as verifyAuthProfesseur } from '@/middlewares/Professeur'
import io from 'socket.io-client';

export default function Room({ session }) {
    const router = useRouter();
    const [isMuted, setIsMuted] = useState(false);
    const [isHandRaised, setIsHandRaised] = useState(false);
    const [isSharingScreen, setIsSharingScreen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [professor, setProfessor] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const roomCode = router.query.code || 'جاري التحميل...';

    const socketRef = useRef();
    const localStreamRef = useRef();
    const localVideoRef = useRef();
    const peerConnectionsRef = useRef({});
    const remoteStreamsRef = useRef({});

    const iceServers = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ]
    };

    useEffect(() => {
        if (!session || roomCode === 'جاري التحميل...') return;

        initializeWebRTC();

        return () => {
            cleanup();
        };
    }, [session, roomCode]);

    const initializeWebRTC = async () => {
        try {
            socketRef.current = io('http://localhost:5000');
            await getUserMedia();
            setupSocketEvents();
            socketRef.current.emit('join-room', {
                roomCode,
                userInfo: session
            });
            setIsConnected(true);
        } catch (error) {
            console.error('خطأ أثناء تهيئة WebRTC:', error);
            alert('تعذر الوصول إلى الميكروفون. يرجى التحقق من الأذونات.');
        }
    };

    const getUserMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: session.role === 'professeur'
            });

            localStreamRef.current = stream;

            if (localVideoRef.current && session.role === 'professeur') {
                localVideoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('خطأ في getUserMedia:', error);
            throw error;
        }
    };

    const setupSocketEvents = () => {
        const socket = socketRef.current;

        socket.on('room-participants', (allParticipants) => {
            const otherParticipants = allParticipants.filter(p => p.socketId !== socket.id);
            setParticipants(otherParticipants);
            otherParticipants.forEach(participant => {
                createPeerConnection(participant.socketId, true);
            });
        });

        socket.on('user-joined', (participant) => {
            setParticipants(prev => [...prev, participant]);
            createPeerConnection(participant.socketId, false);
        });

        socket.on('user-left', ({ socketId }) => {
            setParticipants(prev => prev.filter(p => p.socketId !== socketId));
            closePeerConnection(socketId);
        });

        socket.on('professor-info', (profInfo) => {
            setProfessor(profInfo);
        });

        socket.on('webrtc-offer', async ({ offer, senderSocketId }) => {
            await handleOffer(offer, senderSocketId);
        });

        socket.on('webrtc-answer', async ({ answer, senderSocketId }) => {
            await handleAnswer(answer, senderSocketId);
        });

        socket.on('webrtc-ice-candidate', async ({ candidate, senderSocketId }) => {
            await handleIceCandidate(candidate, senderSocketId);
        });

        socket.on('participant-mute-changed', ({ socketId, isMuted }) => {
            setParticipants(prev =>
                prev.map(p => p.socketId === socketId ? { ...p, isMuted } : p)
            );
        });

        socket.on('participant-hand-changed', ({ socketId, isHandRaised }) => {
            setParticipants(prev =>
                prev.map(p => p.socketId === socketId ? { ...p, isHandRaised } : p)
            );
        });
    };

    const createPeerConnection = async (socketId, isInitiator) => {
        try {
            const peerConnection = new RTCPeerConnection(iceServers);
            peerConnectionsRef.current[socketId] = peerConnection;

            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => {
                    peerConnection.addTrack(track, localStreamRef.current);
                });
            }

            peerConnection.ontrack = (event) => {
                remoteStreamsRef.current[socketId] = event.streams[0];
                forceUpdate();
            };

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    socketRef.current.emit('webrtc-ice-candidate', {
                        candidate: event.candidate,
                        targetSocketId: socketId,
                        roomCode
                    });
                }
            };

            if (isInitiator) {
                const offer = await peerConnection.createOffer();
                await peerConnection.setLocalDescription(offer);

                socketRef.current.emit('webrtc-offer', {
                    offer,
                    targetSocketId: socketId,
                    roomCode
                });
            }
        } catch (error) {
            console.error('خطأ أثناء إنشاء الاتصال:', error);
        }
    };

    const handleOffer = async (offer, senderSocketId) => {
        try {
            const peerConnection = peerConnectionsRef.current[senderSocketId];
            await peerConnection.setRemoteDescription(offer);

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            socketRef.current.emit('webrtc-answer', {
                answer,
                targetSocketId: senderSocketId,
                roomCode
            });
        } catch (error) {
            console.error('خطأ أثناء معالجة العرض:', error);
        }
    };

    const handleAnswer = async (answer, senderSocketId) => {
        try {
            const peerConnection = peerConnectionsRef.current[senderSocketId];
            await peerConnection.setRemoteDescription(answer);
        } catch (error) {
            console.error('خطأ أثناء معالجة الرد:', error);
        }
    };

    const handleIceCandidate = async (candidate, senderSocketId) => {
        try {
            const peerConnection = peerConnectionsRef.current[senderSocketId];
            await peerConnection.addIceCandidate(candidate);
        } catch (error) {
            console.error('خطأ أثناء إضافة ICE candidate:', error);
        }
    };

    const closePeerConnection = (socketId) => {
        if (peerConnectionsRef.current[socketId]) {
            peerConnectionsRef.current[socketId].close();
            delete peerConnectionsRef.current[socketId];
        }
        if (remoteStreamsRef.current[socketId]) {
            delete remoteStreamsRef.current[socketId];
        }
    };

    const cleanup = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }

        Object.values(peerConnectionsRef.current).forEach(pc => pc.close());

        if (socketRef.current) {
            socketRef.current.disconnect();
        }
    };

    const handleMuteToggle = () => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);

        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !newMutedState;
            }
        }

        if (socketRef.current && isConnected) {
            socketRef.current.emit('toggle-mute', {
                roomCode,
                isMuted: newMutedState
            });
        }
    };

    const handleHandRaise = () => {
        if (session.role !== 'etudiant') return;

        const newHandState = !isHandRaised;
        setIsHandRaised(newHandState);

        if (socketRef.current && isConnected) {
            socketRef.current.emit('toggle-hand-raise', {
                roomCode,
                isHandRaised: newHandState
            });
        }
    };

    const handleScreenShare = async () => {
        if (session.role !== 'professeur') return;

        try {
            if (!isSharingScreen) {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true
                });

                const videoTrack = screenStream.getVideoTracks()[0];

                for (const [socketId, pc] of Object.entries(peerConnectionsRef.current)) {
                    const sender = pc.getSenders().find(s => s.track?.kind === 'video');
                    if (sender) {
                        await sender.replaceTrack(videoTrack);
                    }

                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);

                    socketRef.current.emit('webrtc-offer', {
                        offer,
                        targetSocketId: socketId,
                        roomCode
                    });
                }

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = screenStream;
                }

                setIsSharingScreen(true);

                videoTrack.onended = () => {
                    handleStopScreenShare();
                };
            } else {
                handleStopScreenShare();
            }
        } catch (error) {
            console.error('خطأ أثناء مشاركة الشاشة:', error);
        }
    };

    const handleStopScreenShare = async () => {
        try {
            const cameraStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true
            });

            const videoTrack = cameraStream.getVideoTracks()[0];

            for (const [socketId, pc] of Object.entries(peerConnectionsRef.current)) {
                const sender = pc.getSenders().find(s => s.track?.kind === 'video');
                if (sender) {
                    await sender.replaceTrack(videoTrack);
                }

                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);

                socketRef.current.emit('webrtc-offer', {
                    offer,
                    targetSocketId: socketId,
                    roomCode
                });
            }

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = cameraStream;
            }

            setIsSharingScreen(false);
        } catch (error) {
            console.error('خطأ أثناء إيقاف مشاركة الشاشة:', error);
        }
    };

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(roomCode);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('خطأ أثناء النسخ:', err);
        }
    };

    const handleDisconnect = () => {
        cleanup();
        window.close();
    };

    const [, forceUpdateValue] = useState(0);
    const forceUpdate = () => forceUpdateValue(prev => prev + 1);

    if (!session) {
        return <div>جاري التحميل...</div>;
    }

    return (
        <div dir="rtl">
            {/* Controls */}
            <div className="flex justify-center fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleMuteToggle}
                            className={`p-4 rounded-xl transition-all duration-200 shadow-lg ${isMuted
                                ? 'bg-red-500/80 hover:bg-red-500 text-white'
                                : 'bg-white/20 hover:bg-white/30 text-white/90'
                                }`}
                            title={isMuted ? 'تفعيل الميكروفون' : 'كتم الميكروفون'}
                        >
                            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                        </button>

                        {session.role === 'etudiant' ? (
                            <button
                                onClick={handleHandRaise}
                                className={`p-4 rounded-xl transition-all duration-200 shadow-lg ${isHandRaised
                                    ? 'bg-yellow-500/80 hover:bg-yellow-500 text-white'
                                    : 'bg-white/20 hover:bg-white/30 text-white/90'
                                    }`}
                                title={isHandRaised ? 'خفض اليد' : 'رفع اليد'}
                            >
                                <Hand className="w-6 h-6" />
                            </button>
                        ) : (
                            <button
                                onClick={handleScreenShare}
                                className={`p-4 rounded-xl transition-all duration-200 shadow-lg ${isSharingScreen
                                    ? 'bg-blue-500/80 hover:bg-blue-500 text-white'
                                    : 'bg-white/20 hover:bg-white/30 text-white/90'
                                    }`}
                                title={isSharingScreen ? 'إيقاف المشاركة' : 'مشاركة الشاشة'}
                            >
                                <ScreenShare className="w-6 h-6" />
                            </button>
                        )}

                        <button
                            onClick={handleDisconnect}
                            className="p-4 bg-red-500/80 hover:bg-red-500 text-white rounded-xl transition-all duration-200 shadow-lg"
                            title="قطع الاتصال"
                        >
                            <PhoneOff className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Code */}
            <div className="flex justify-start mb-6 fixed bottom-4 left-4 z-50">
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-6 py-3 shadow-2xl">
                    <div className="flex items-center gap-3">
                        <span className="text-white/80 text-sm font-medium">رمز الغرفة:</span>
                        <span className="text-white font-bold text-lg tracking-wider">{roomCode}</span>
                        <button
                            onClick={handleCopyCode}
                            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 group"
                            title="نسخ الرمز"
                        >
                            {isCopied ? (
                                <Check className="w-4 h-4 text-green-400" />
                            ) : (
                                <Copy className="w-4 h-4 text-white/70 group-hover:text-white" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Status */}
            <div className="fixed top-4 right-4 z-50">
                <div className={`backdrop-blur-md border rounded-xl px-4 py-2 shadow-lg ${isConnected
                        ? 'bg-green-500/20 border-green-500/30 text-green-400'
                        : 'bg-red-500/20 border-red-500/30 text-red-400'
                    }`}>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'
                            }`}></div>
                        <span className="text-sm font-medium">
                            {isConnected ? 'متصل' : 'غير متصل'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Room */}
            <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 flex flex-col pt-20">
                <div className="flex-1 flex flex-col gap-6">
                    {/* Prof */}
                    <div className="backdrop-blur-md bg-white/5 border-4 border-gray-300/30 rounded-3xl p-6 shadow-2xl">
                        <div className="relative w-full h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                            {session.role === 'professeur' ? (
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    muted
                                    className="w-full h-full object-cover"
                                />
                            ) : professor && remoteStreamsRef.current[professor.socketId] ? (
                                <video
                                    autoPlay
                                    className="w-full h-full object-cover"
                                    ref={(video) => {
                                        if (video && remoteStreamsRef.current[professor.socketId]) {
                                            video.srcObject = remoteStreamsRef.current[professor.socketId];
                                        }
                                    }}
                                />
                            ) : (
                                <div className="text-white/50 text-center">
                                    <div className="text-lg mb-2">في انتظار الأستاذ...</div>
                                    <div className="text-sm">
                                        {professor ? `${professor.prenom} ${professor.nom}` : 'لا يوجد أستاذ متصل'}
                                    </div>
                                </div>
                            )}

                            {professor && (
                                <div className="absolute bottom-4 right-4">
                                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${professor.isMuted ? 'bg-red-500/80' : 'bg-green-500/80'
                                        }`}>
                                        {professor.isMuted ? (
                                            <VolumeX className="w-4 h-4 text-white" />
                                        ) : (
                                            <Volume2 className="w-4 h-4 text-white" />
                                        )}
                                        <span className="text-white text-sm">
                                            {professor.prenom} {professor.nom}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Students */}
                    <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-4 shadow-xl">
                        <h3 className="text-white/80 text-sm font-medium mb-4 px-2">
                            المشاركون ({participants.length + 1})
                        </h3>
                        <div className="h-fit overflow-y-auto">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                                {participants.map((participant) => (
                                    <div
                                        key={participant.socketId}
                                        className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-3 hover:bg-white/15 transition-all duration-200 group shadow-lg relative"
                                    >
                                        <div className="aspect-square relative mb-2">
                                            <div className="w-full h-full rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                                                <span className="text-white text-2xl font-bold">
                                                    {participant.prenom?.[0]}{participant.nom?.[0]}
                                                </span>
                                            </div>

                                            <div className={`absolute -bottom-1 -left-1 w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${participant.isMuted ? 'bg-red-500' : 'bg-green-500'
                                                }`}>
                                                {participant.isMuted ? (
                                                    <MicOff className="w-3 h-3 text-white" />
                                                ) : (
                                                    <Mic className="w-3 h-3 text-white" />
                                                )}
                                            </div>

                                            {participant.isHandRaised && (
                                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                                                    <Hand className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-white/90 text-xs font-medium text-center truncate">
                                            {participant.prenom} {participant.nom}
                                        </p>
                                        <p className="text-white/60 text-xs text-center">
                                            {participant.role}
                                        </p>

                                        {remoteStreamsRef.current[participant.socketId] && (
                                            <audio
                                                autoPlay
                                                ref={(audio) => {
                                                    if (audio && remoteStreamsRef.current[participant.socketId]) {
                                                        audio.srcObject = remoteStreamsRef.current[participant.socketId];
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export async function getServerSideProps({ req, res }) {
    const etudiant = verifyAuthEtudiant(req, res)
    const professeur = verifyAuthProfesseur(req, res)

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
                    role: 'etudiant'
                }
            },
        }
    }

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
                    role: 'professeur'
                }
            },
        }
    }

    return { props: { session: null } }
}