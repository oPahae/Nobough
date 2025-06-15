import { useState, useEffect } from 'react'

const Notification = ({ notification, setNotification}) => {
  const [isLeaving, setIsLeaving] = useState(false)
  
  useEffect(() => {
    if (notification.shown) {
      setIsLeaving(false)
      setNotification((notif) => ({ ...notif, shown: true }));
      
      if (notification.duration) {
        const timer = setTimeout(() => {
          handleClose()
        }, notification.duration)
        
        return () => clearTimeout(timer)
      }
    } else {
      setNotification((notif) => ({ ...notif, shown: false }));
    }
  }, [notification.shown, notification.duration])
  
  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      setNotification((notif) => ({ ...notif, shown: false }));
      if (notification.onClose) notification.onClose()
    }, 300)
  }
  
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        )
      case 'error':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        )
      case 'warning':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        )
      case 'info':
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        )
    }
  }

  const getTypeStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-500 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-500 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-500 text-yellow-800'
      case 'info':
      default:
        return 'bg-blue-50 border-blue-500 text-blue-800'
    }
  }
  
  const getIconBackgroundStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-500 text-white'
      case 'error':
        return 'bg-red-500 text-white'
      case 'warning':
        return 'bg-yellow-500 text-white'
      case 'info':
      default:
        return 'bg-blue-500 text-white'
    }
  }
  
  const ProgressBar = () => {
    const progressBarStyles = () => {
      switch (notification.type) {
        case 'success':
          return 'bg-green-500'
        case 'error':
          return 'bg-red-500'
        case 'warning':
          return 'bg-yellow-500'
        case 'info':
        default:
          return 'bg-blue-500'
      }
    }
    
    return (
      <div className="h-1 w-full bg-gray-200 absolute bottom-0 left-0">
        <div 
          className={`h-1 ${progressBarStyles()}`} 
          style={{ 
            width: '100%', 
            animation: `progress ${notification.duration}ms linear` 
          }}
        />
      </div>
    )
  }
  
  if (!notification.shown) return null
  
  return (
    <div 
      className={`fixed top-4 right-4 max-w-sm z-50 transform transition-all duration-300 ease-in-out
        ${isLeaving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
    >
      <style jsx>{`
        @keyframes progress {
          from { width: 100% }
          to { width: 0% }
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%) opacity: 0 }
          to { transform: translateX(0) opacity: 1 }
        }
      `}</style>
      
      <div 
        className={`${getTypeStyles()} border-l-4 rounded shadow-lg p-4 flex items-start
          animate-pulse-light overflow-hidden relative`}
      >
        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${getIconBackgroundStyles()} flex items-center justify-center mr-3`}>
          {getIcon()}
        </div>
        
        <div className="flex-grow">
          <div className="font-medium">{notification.msg}</div>
        </div>
        
        <button 
          onClick={handleClose}
          className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600 transition duration-150 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        {notification.duration > 0 && <ProgressBar />}
      </div>
    </div>
  )
}

export default Notification