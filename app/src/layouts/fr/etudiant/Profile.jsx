import {
  User, Mail, Phone, CreditCard, Calendar, Camera, Edit3,
  Lock, Key, Trash2, Save, X, Eye, EyeOff, Shield,
  Star, Moon, Sparkles, Heart
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import Loading from '@/utils/Loading'

export default function Profile({ session, setNotification }) {
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imgChanged, setImgChanged] = useState(false)
  const [emailOld, setEmailOld] = useState('');
  const [x, y] = useState(true)

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [personalInfo, setPersonalInfo] = useState({});
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  const IslamicPattern = ({ className = "" }) => (
    <div className={`absolute opacity-5 pointer-events-none ${className}`}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" className="text-amber-900" d="M50,0 L60,40 L100,40 L70,65 L80,100 L50,80 L20,100 L30,65 L0,40 L40,40 Z"></path>
      </svg>
    </div>
  );

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = async (e) => {
    setImgChanged(true)
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPersonalInfo(prev => ({
          ...prev,
          img: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  /////////////////////////////////////////////////////////////////

  const fetchInfos = async () => {
    try {
      const response = await fetch(`/api/etudiants/getOne?etudiantID=${session.id}`);

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des informations');
      }

      const data = await response.json();
      console.log(data)
      setPersonalInfo(data);
      setEmailOld(data.email)
    } catch (error) {
      console.error('Erreur lors de la récupération des informations:', error);
      setError(error.message);
    } finally {
      y(false)
    }
  };

  useEffect(() => {
    fetchInfos();
  }, []);

  const savePersonalInfo = async () => {
    console.log(personalInfo)
    try {
      const response = await fetch('/api/etudiants/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          etudiantID: session.id,
          ...personalInfo,
          img: imgChanged ? personalInfo.img : atob(Buffer.from(personalInfo.img).toString('base64'))
        }),
      });

      if (response.ok) {
        setEditingPersonal(false);
        envoyerEmail()
        setNotification((notif) => ({
          ...notif,
          msg: 'Informations personnelles mises à jour avec succès',
          type: 'success',
          shown: true
        }))
      } else {
        const errorData = await response.json()
        setNotification((notif) => ({
          ...notif,
          msg: `Erreur: ${errorData.error.code === "ER_DUP_ENTRY" ? "Email ou CIN déja utilisés" : errorData.message}`,
          type: 'error',
          shown: true
        }))
      }
    } catch (error) {
      setNotification((notif) => ({
        ...notif,
        msg: 'Erreur #' + error,
        type: 'error',
        shown: true
      }))
    }
  };

  const savePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification((notif) => ({
        ...notif,
        msg: "Les mots de passe ne correspondent pas",
        type: 'info',
        shown: true
      }))
      return;
    }

    try {
      const response = await fetch('/api/etudiants/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          etudiantID: session.id,
          ...passwordData
        }),
      });

      if (response.ok) {
        setEditingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setNotification((notif) => ({
          ...notif,
          msg: 'Mot de passe mis à jour avec succès',
          type: 'success',
          shown: true
        }))
      } else {
        const errorData = await response.json();
        setNotification((notif) => ({
          ...notif,
          msg: `Erreur: ${errorData.message}`,
          type: 'error',
          shown: true
        }))
      }
    } catch (error) {
      console.error();
      setNotification((notif) => ({
        ...notif,
        msg: 'Erreur #' + error,
        type: 'success',
        shown: true
      }))
    }
  };

  const deleteAccount = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.")) {
      try {
        const response = await fetch('/api/etudiants/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            etudiantID: session.id
          }),
        });

        if (response.ok) {
          setNotification((notif) => ({
            ...notif,
            msg: "Compte supprimé avec succès",
            type: 'success',
            shown: true
          }))
          window.location.href = '/fr/Etudiant';
        } else {
          const errorData = await response.json();
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
          msg: 'Erreur lors de la suppression du compte:' + error,
          type: 'error',
          shown: true
        }))
      }
    }
  }

  const envoyerEmail = async () => {
    try {
      const res = await fetch(`/api/_mail/notifierProfileModificationEtudiant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOld, personalInfo }),
      })

      const data = await res.json()

      if (res.ok) {
        console.log('Email envoyé avec succès !')
      } else {
        console.error('Erreur:', data)
      }
    } catch (error) {
      console.error('Erreur réseau:', error)
    }
  }

  if (x) {
    return (
      <div className='w-screen flex justify-center items-center maxtop'>
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full mx-auto md:p-8 text-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-4">
          <h2 className="text-red-700 font-medium">Erreur de chargement</h2>
          <p className="text-red-600">{error}</p>
        </div>
        <button
          onClick={fetchInfos}
          className="text-amber-600 hover:text-amber-800 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto md:p-6 relative">
      {/* Motifs décoratifs de fond */}
      <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
        <IslamicPattern className="top-10 left-10 w-32 h-32 rotate-12" />
        <IslamicPattern className="top-1/3 right-16 w-24 h-24 -rotate-45" />
        <IslamicPattern className="bottom-20 left-1/4 w-28 h-28 rotate-90" />
        <IslamicPattern className="bottom-10 right-10 w-20 h-20 -rotate-12" />
      </div>

      {/* En-tête avec ornements */}
      <div className="text-center mb-12 relative">
        <div className="inline-block">
          <div className="flex items-center justify-center mb-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-700"></div>
            <Sparkles className="text-amber-800 mx-4 w-6 h-6" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-700"></div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Mon Profil</h1>
          <div className="flex items-center justify-center">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700"></div>
            <Moon className="text-amber-800 mx-4 w-4 h-4" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700"></div>
          </div>
        </div>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Gérez vos informations personnelles et paramètres de sécurité
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section Informations Personnelles */}
        <div className="lg:col-span-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-100 overflow-hidden relative">
            {/* Bordures décoratives */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-amber-600/30 rounded-tl-2xl"></div>
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-amber-600/30 rounded-tr-2xl"></div>

            <div className="p-8">
              <div className="flex items-center justify-center md:justify-between mb-8 flex-wrap">
                <div className="flex items-center flex-wrap">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-md mr-4">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Infos Personnelles</h2>
                </div>
                {!editingPersonal ? (
                  <button
                    onClick={() => setEditingPersonal(true)}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Modifier
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={savePersonalInfo}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </button>
                    <button
                      onClick={() => {
                        setEditingPersonal(false);
                        fetchInfos();
                      }}
                      className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition-all"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Annuler
                    </button>
                  </div>
                )}
              </div>

              {/* Photo de profil */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 p-1 shadow-xl">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      {personalInfo.img ? (
                        <img
                          src={personalInfo.img ? atob(`data:image/jpeg;base64,${Buffer.from(personalInfo.img).toString('base64')}`.split(',')[1]) : '/user.jpg'}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-amber-700" />
                      )}
                    </div>
                  </div>
                  {editingPersonal && (
                    <button
                      onClick={triggerFileInput}
                      className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    accept="image/*"
                  />
                </div>
              </div>

              {/* Formulaire */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Nom</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-700" />
                    <input
                      type="text"
                      value={personalInfo.nom || ''}
                      onChange={(e) => handlePersonalInfoChange('nom', e.target.value)}
                      disabled={!editingPersonal}
                      className="w-full pl-11 pr-4 py-3 border border-amber-200 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Prénom</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-700" />
                    <input
                      type="text"
                      value={personalInfo.prenom || ''}
                      onChange={(e) => handlePersonalInfoChange('prenom', e.target.value)}
                      disabled={!editingPersonal}
                      className="w-full pl-11 pr-4 py-3 border border-amber-200 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-700" />
                    <input
                      type="email"
                      value={personalInfo.email || ''}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                      disabled={!editingPersonal}
                      className="w-full pl-11 pr-4 py-3 border border-amber-200 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-700" />
                    <input
                      type="tel"
                      value={personalInfo.tel || ''}
                      onChange={(e) => handlePersonalInfoChange('tel', e.target.value)}
                      disabled={!editingPersonal}
                      className="w-full pl-11 pr-4 py-3 border border-amber-200 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">CIN</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-700" />
                    <input
                      type="text"
                      value={personalInfo.cin || ''}
                      onChange={(e) => handlePersonalInfoChange('cin', e.target.value)}
                      disabled={!editingPersonal}
                      className="w-full pl-11 pr-4 py-3 border border-amber-200 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Date de naissance</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-700" />
                    <input
                      type="date"
                      value={personalInfo.dateNaissance ? new Date(personalInfo.dateNaissance).toISOString().split('T')[0] : ''}
                      onChange={(e) => handlePersonalInfoChange('dateNaissance', e.target.value)}
                      disabled={!editingPersonal}
                      className="w-full pl-11 pr-4 py-3 border border-amber-200 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">Biographie</label>
                <textarea
                  value={personalInfo.bio || ''}
                  onChange={(e) => handlePersonalInfoChange('bio', e.target.value)}
                  disabled={!editingPersonal}
                  rows={4}
                  className="w-full p-4 border border-amber-200 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-50 disabled:text-gray-600 resize-none"
                  placeholder="Parlez-nous de vous..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Colonne de droite - Sécurité et Actions */}
        <div className="space-y-8">
          {/* Section Mot de passe */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-100 overflow-hidden relative">
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-amber-600/30 rounded-bl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-amber-600/30 rounded-br-2xl"></div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-md mr-3">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Sécurité</h3>
                </div>
                {!editingPassword && (
                  <button
                    onClick={() => setEditingPassword(true)}
                    className="flex items-center px-3 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm"
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Modifier
                  </button>
                )}
              </div>

              {!editingPassword ? (
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <Shield className="w-5 h-5 text-amber-700 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">Mot de passe</p>
                      <p className="text-sm text-gray-600">Vous pouvez modifier votre mot de passe pour plus de sécurité.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Mot de passe actuel</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-700" />
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        className="w-full pl-11 pr-11 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Mot de passe actuel"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-700"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Nouveau mot de passe</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-700" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        className="w-full pl-11 pr-11 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Nouveau mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-700"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Confirmer le mot de passe</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-700" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        className="w-full pl-11 pr-11 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Confirmer le mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-700"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={savePassword}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </button>
                    <button
                      onClick={() => {
                        setEditingPassword(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition-all text-sm"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section Suppression du compte */}
          <div className="bg-red-50 rounded-2xl shadow-lg border border-red-200 p-6 relative">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-md mr-3">
                <Trash2 className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-red-800">Zone de danger</h3>
            </div>

            <p className="text-sm text-red-600 mb-4">
              La suppression de votre compte est irréversible. Toutes vos données seront définitivement perdues.
            </p>

            <button
              onClick={deleteAccount}
              className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg transition-all font-medium"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer mon compte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}