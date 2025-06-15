import '@/styles/globals.css'
import Notification from '../utils/Notification'
import Loading from '../utils/Loading'
import { useState, useEffect } from 'react'
import { io } from "socket.io-client";
import { useRouter } from 'next/router';
let socket;

export default function App({ Component, pageProps }) {
  const [notification, setNotification] = useState({
    msg: '',
    type: 'info',
    duration: 3000,
    onClose: null,
    shown: false
  })

  const [isSocketReady, setIsSocketReady] = useState(false);

  async function initSocket() {
    try {
      await fetch("/api/_lib/socket");
      socket = io({
        path: "/api/_lib/socket",
      });

      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
        setIsSocketReady(true);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

    } catch (error) {
      console.error("Error initializing socket:", error);
    }
  }

  useEffect(() => {
    initSocket();

    // if (isSocketReady && socket) {
    //   socket.on("notification", (data) => {

    //   });
    // }

    return () => {
      if (socket) {
        socket.off("notification");
      }
    };
  }, [isSocketReady]);

  const router = useRouter()
  // useEffect(() => {
  //   const callSchedulerAPI = async () => {
  //     try {
  //       const response = await fetch('/api/_lib/scheduler');
  //       if (!response.ok) {
  //         throw new Error('Erreur lors de l\'appel de l\'API');
  //       }
  //       const data = await response.json();
  //       console.log('API appelée avec succès:', data);
  //     } catch (error) {
  //       console.error('Erreur lors de l\'appel de l\'API:', error);
  //     }
  //   };

  //   callSchedulerAPI();
  // }, [router.asPath]);

  return (
    <div className='bg-50/60 backdrop-blur-3xl'>
      <Notification notification={notification} setNotification={setNotification} />
      <Component {...pageProps} setNotification={setNotification} />
    </div>
  )
}