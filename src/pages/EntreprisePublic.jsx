import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Header, Footer } from '../components/Layout'
import { Card, Button, Input, Select, FileUpload, Badge, Modal } from '../components/UI'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { useToast } from '../components/UI/Toast'
import { 
  CheckCircle, Users, Shield, HeadphonesIcon, Star, Zap, Crown,
  Search, Eye, Download, Bookmark, BookmarkCheck, User, MapPin,
  Briefcase, GraduationCap, Calendar, MessageSquare, FileText,
  Clock, Phone, Mail, Globe
} from 'lucide-react'

// Composant pour les entreprises connectées
const EspaceEntrepriseConnecte = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { users, offres, candidatures } = useData()
  const { showToast, ToastContainer } = useToast()
  
  // États pour la recherche et les filtres
  const [searchTerm, setSearchTerm] = useState('')
  const [sexeFilter, setSexeFilter] = useState('')
  const [ageFilter, setAgeFilter] = useState('')
  const [experienceFilter, setExperienceFilter] = useState('')
  const [langueFilter, setLangueFilter] = useState('')
  
  // États pour les profils sauvegardés
  const [savedProfiles, setSavedProfiles] = useState([])
  
  // États pour les modals
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState(null)

  // Récupérer les candidats
  const candidats = useMemo(() => {
    let filtered = users.filter(u => u.role === 'candidat')
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(u => 
        u.nom?.toLowerCase().includes(term) ||
        u.prenom?.toLowerCase().includes(term) ||
        u.competences?.some(c => c.toLowerCase().includes(term)) ||
        u.secteur?.toLowerCase().includes(term)
      )
    }
    if (sexeFilter) {
      filtered = filtered.filter(u => u.sexe === sexeFilter)
    }
    if (experienceFilter) {
      filtered = filtered.filter(u => {
        const exp = u.experienceAnnees || 0
        if (experienceFilter === '0') return exp === 0
        if (experienceFilter === '1-3') return exp >= 1 && exp <= 3
        if (experienceFilter === '3-5') return exp >= 3 && exp <= 5
        if (experienceFilter === '5+') return exp >= 5
        return true
      })
    }
    if (langueFilter) {
      filtered = filtered.filter(u => 
        u.langues?.some(l => l.langue?.toLowerCase() === langueFilter.toLowerCase())
      )
    }
    
    return filtered.slice(0, 6)
  }, [users, searchTerm, sexeFilter, ageFilter, experienceFilter, langueFilter])

  // Données de suivi de démonstration pour l'entreprise
  const demoSuivi = useMemo(() => {
    if (user?.isDemo && user?.id === 'demo-entreprise-001') {
      return [
        {
          id: 'suivi-001',
          type: 'recrutement',
          poste: 'Ouvrier de production',
          candidatsSelectionnes: 5,
          entretiensPrevus: 2,
          dateCreation: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          statut: 'en_cours'
        },
        {
          id: 'suivi-002',
          type: 'recrutement',
          poste: 'Chauffeur livreur',
          candidatsSelectionnes: 3,
          entretiensPrevus: 1,
          dateCreation: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          statut: 'entretien'
        },
        {
          id: 'suivi-003',
          type: 'recrutement',
          poste: 'Manutentionnaire',
          candidatsSelectionnes: 8,
          entretiensPrevus: 0,
          dateCreation: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          statut: 'selection'
        },
        {
          id: 'suivi-004',
          type: 'recrutement',
          poste: 'Agent de sécurité',
          candidatsSelectionnes: 2,
          entretiensPrevus: 2,
          dateCreation: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          statut: 'finalise'
        }
      ]
    }
    return []
  }, [user])

  // Voir le profil d'un candidat
  const handleViewProfile = (candidat) => {
    setSelectedProfile(candidat)
    setShowProfileModal(true)
  }

  // Sauvegarder un profil
  const handleSaveProfile = (candidatId) => {
    if (savedProfiles.includes(candidatId)) {
      setSavedProfiles(savedProfiles.filter(id => id !== candidatId))
      showToast(t('entreprise.profileRemoved'), 'info')
    } else {
      setSavedProfiles([...savedProfiles, candidatId])
      showToast(t('entreprise.profileSaved'), 'success')
    }
  }

  // Télécharger le CV
  const handleDownloadCV = (candidat) => {
    showToast(t('entreprise.cvDownloading'), 'info')
    // Simulation du téléchargement
    setTimeout(() => {
      showToast(t('entreprise.cvDownloaded'), 'success')
    }, 1000)
  }

  // Obtenir le badge de statut
  const getStatutBadge = (statut) => {
    const badges = {
      selection: { variant: 'warning', label: t('entreprise.selectionInProgress') },
      en_cours: { variant: 'info', label: t('entreprise.inProgress') },
      entretien: { variant: 'info', label: t('entreprise.interviewScheduled') },
      finalise: { variant: 'success', label: t('entreprise.finalized') }
    }
    return badges[statut] || { variant: 'default', label: statut }
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Recherche de profil */}
          <section className="mb-10">
            <h1 className="text-3xl font-display font-bold mb-6 text-gray-100">
              {t('entreprise.searchProfile')}
            </h1>
            
            {/* Barre de recherche */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('entreprise.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-navy-800 border border-navy-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            {/* Filtres */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Select
                value={sexeFilter}
                onChange={(e) => setSexeFilter(e.target.value)}
                options={[
                  { value: '', label: t('entreprise.gender') },
                  { value: 'M', label: t('entreprise.male') },
                  { value: 'F', label: t('entreprise.female') }
                ]}
              />
              <Select
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
                options={[
                  { value: '', label: t('entreprise.age') },
                  { value: '18-25', label: '18-25 ' + t('entreprise.years') },
                  { value: '25-35', label: '25-35 ' + t('entreprise.years') },
                  { value: '35-45', label: '35-45 ' + t('entreprise.years') },
                  { value: '45+', label: '45+ ' + t('entreprise.years') }
                ]}
              />
              <Select
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                options={[
                  { value: '', label: t('entreprise.experience') },
                  { value: '0', label: t('entreprise.noExperience') },
                  { value: '1-3', label: '1-3 ' + t('entreprise.years') },
                  { value: '3-5', label: '3-5 ' + t('entreprise.years') },
                  { value: '5+', label: '5+ ' + t('entreprise.years') }
                ]}
              />
              <Select
                value={langueFilter}
                onChange={(e) => setLangueFilter(e.target.value)}
                options={[
                  { value: '', label: t('entreprise.language') },
                  { value: 'francais', label: 'Français' },
                  { value: 'anglais', label: 'English' },
                  { value: 'malgache', label: 'Malagasy' }
                ]}
              />
            </div>

            {/* Liste des profils */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidats.length === 0 ? (
                <Card className="col-span-full">
                  <p className="text-center text-gray-400 py-8">
                    {t('entreprise.noProfilesFound')}
                  </p>
                </Card>
              ) : (
                candidats.map((candidat) => (
                  <Card key={candidat.id} hover className="flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-gold-500" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-100">
                              {candidat.prenom} {candidat.nom?.charAt(0)}.
                            </h3>
                            <p className="text-sm text-gray-400">{candidat.secteur || t('entreprise.availableCandidate')}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleSaveProfile(candidat.id)}
                          className="text-gray-400 hover:text-gold-500 transition-colors"
                        >
                          {savedProfiles.includes(candidat.id) ? (
                            <BookmarkCheck className="w-5 h-5 text-gold-500" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <div className="space-y-2 mb-4">
                        {candidat.localisation && (
                          <div className="flex items-center text-gray-400 text-sm">
                            <MapPin className="w-4 h-4 mr-2 text-gold-500" />
                            {candidat.localisation}
                          </div>
                        )}
                        <div className="flex items-center text-gray-400 text-sm">
                          <Briefcase className="w-4 h-4 mr-2 text-gold-500" />
                          {candidat.experienceAnnees || 0} {t('entreprise.yearsExp')}
                        </div>
                        {candidat.niveauEtudes && (
                          <div className="flex items-center text-gray-400 text-sm">
                            <GraduationCap className="w-4 h-4 mr-2 text-gold-500" />
                            {candidat.niveauEtudes}
                          </div>
                        )}
                      </div>
                      {candidat.competences && candidat.competences.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {candidat.competences.slice(0, 3).map((comp, i) => (
                            <Badge key={i} variant="default" className="text-xs">{comp}</Badge>
                          ))}
                          {candidat.competences.length > 3 && (
                            <Badge variant="default" className="text-xs">+{candidat.competences.length - 3}</Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="gold" 
                        className="flex-1"
                        onClick={() => handleViewProfile(candidat)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {t('entreprise.viewProfile')}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleDownloadCV(candidat)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {/* Voir tous les profils */}
            <div className="text-center mt-6">
              <Link to="/entreprise/recherche-cv">
                <Button variant="outline" className="inline-flex items-center gap-2">
                  {t('entreprise.seeAllProfiles')}
                  <Users className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </section>

          {/* Section Tableau de suivi */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-gray-100">
                {t('entreprise.trackingTable')}
              </h2>
              <Link to="/entreprise/demandes">
                <Button variant="outline" size="sm">
                  {t('entreprise.seeAll')}
                </Button>
              </Link>
            </div>

            <Card>
              {demoSuivi.length === 0 ? (
                <p className="text-center text-gray-400 py-8">
                  {t('entreprise.noTrackingYet')}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-navy-600">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">{t('entreprise.position')}</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">{t('entreprise.selectedCandidates')}</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">{t('entreprise.scheduledInterviews')}</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">{t('entreprise.date')}</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">{t('entreprise.status')}</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demoSuivi.map((suivi) => {
                        const badgeInfo = getStatutBadge(suivi.statut)
                        return (
                          <tr key={suivi.id} className="border-b border-navy-700 hover:bg-navy-800/50">
                            <td className="py-3 px-4 text-gray-100 font-medium">
                              {suivi.poste}
                            </td>
                            <td className="py-3 px-4 text-gray-400">
                              {suivi.candidatsSelectionnes} {t('entreprise.candidates')}
                            </td>
                            <td className="py-3 px-4 text-gray-400">
                              {suivi.entretiensPrevus} {t('entreprise.interviews')}
                            </td>
                            <td className="py-3 px-4 text-gray-400">
                              {new Date(suivi.dateCreation).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={badgeInfo.variant}>
                                {badgeInfo.label}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Link to="/entreprise/messagerie">
                                  <Button variant="outline" size="sm">
                                    <MessageSquare className="w-4 h-4" />
                                  </Button>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </section>
        </div>
      </main>
      <Footer />
      <ToastContainer />

      {/* Modal détails profil */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false)
          setSelectedProfile(null)
        }}
        title={selectedProfile ? `${selectedProfile.prenom} ${selectedProfile.nom}` : ''}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setShowProfileModal(false)
              setSelectedProfile(null)
            }}>
              {t('common.close')}
            </Button>
            <Button variant="outline" onClick={() => handleDownloadCV(selectedProfile)}>
              <Download className="w-4 h-4 mr-2" />
              {t('entreprise.downloadCV')}
            </Button>
            <Button variant="gold" onClick={() => handleSaveProfile(selectedProfile?.id)}>
              <Bookmark className="w-4 h-4 mr-2" />
              {t('entreprise.saveProfile')}
            </Button>
          </>
        }
      >
        {selectedProfile && (
          <div className="space-y-6">
            {/* En-tête du profil */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gold-500/20 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-gold-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-100">{selectedProfile.prenom} {selectedProfile.nom}</h3>
                <p className="text-gray-400">{selectedProfile.secteur || t('entreprise.availableCandidate')}</p>
                {selectedProfile.disponibilite && (
                  <Badge variant="success" className="mt-2">{selectedProfile.disponibilite}</Badge>
                )}
              </div>
            </div>

            {/* Informations de contact */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-navy-800 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4 text-gold-500" />
                {selectedProfile.email}
              </div>
              {selectedProfile.telephone && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Phone className="w-4 h-4 text-gold-500" />
                  {selectedProfile.telephone}
                </div>
              )}
              {selectedProfile.localisation && (
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4 text-gold-500" />
                  {selectedProfile.localisation}
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-400">
                <Briefcase className="w-4 h-4 text-gold-500" />
                {selectedProfile.experienceAnnees || 0} {t('entreprise.yearsExp')}
              </div>
            </div>

            {/* Compétences */}
            {selectedProfile.competences && selectedProfile.competences.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-100 mb-3">{t('entreprise.skills')}</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProfile.competences.map((comp, i) => (
                    <Badge key={i} variant="default">{comp}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Langues */}
            {selectedProfile.langues && selectedProfile.langues.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-100 mb-3">{t('entreprise.languages')}</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProfile.langues.map((lang, i) => (
                    <Badge key={i} variant="info">
                      {lang.langue} - {lang.niveau}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Expériences */}
            {selectedProfile.experiences && selectedProfile.experiences.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-100 mb-3">{t('entreprise.experiences')}</h4>
                <div className="space-y-3">
                  {selectedProfile.experiences.map((exp, i) => (
                    <div key={i} className="p-3 bg-navy-800 rounded-lg">
                      <p className="font-medium text-gray-100">{exp.poste}</p>
                      <p className="text-sm text-gray-400">{exp.entreprise}</p>
                      <p className="text-xs text-gray-500">{exp.dateDebut} - {exp.dateFin || t('entreprise.present')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

// Composant pour les visiteurs non connectés
const EntreprisePublicVisiteur = () => {
  const { t } = useLanguage()
  const { addDemandeEntreprise } = useData()
  const { showToast, ToastContainer } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nomEntreprise: '',
    secteur: '',
    adresse: '',
    nomContact: '',
    prenomContact: '',
    fonctionContact: '',
    email: '',
    telephone: '',
    nombreEmployes: '',
    besoins: ''
  })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const secteurs = ['Construction', 'Hôtellerie', 'Agriculture', 'Manufacture', 'Logistique', 'Nettoyage', 'Sécurité', 'Autre']

  const avantages = [
    { icon: Users, titre: t('entreprise.qualifiedCVDatabase'), desc: t('entreprise.qualifiedCVDesc') },
    { icon: Shield, titre: t('entreprise.rigorousPreselection'), desc: t('entreprise.rigorousPreselectionDesc') },
    { icon: HeadphonesIcon, titre: t('entreprise.adminSupport'), desc: t('entreprise.adminSupportDesc') },
    { icon: CheckCircle, titre: t('entreprise.postRecruitmentFollow'), desc: t('entreprise.postRecruitmentFollowDesc') }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const demande = {
      id: Date.now().toString(),
      ...formData,
      fichePoste: file,
      statut: 'en_attente',
      dateCreation: new Date().toISOString()
    }

    addDemandeEntreprise(demande)
    showToast(t('entreprise.requestSentSuccess'), 'success')
    setFormData({
      nomEntreprise: '',
      secteur: '',
      adresse: '',
      nomContact: '',
      prenomContact: '',
      fonctionContact: '',
      email: '',
      telephone: '',
      nombreEmployes: '',
      besoins: ''
    })
    setFile(null)
    setShowForm(false)
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-r from-navy-800 to-navy-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-display font-bold mb-4 text-gray-100">
              {t('entreprise.recruitBestTalents')} <span className="text-gold-500">{t('entreprise.bestTalents')}</span> {t('entreprise.malagasyWorkers')}
            </h1>
            <p className="text-xl mb-8 text-gray-400">
              {t('entreprise.publicSubtitle')}
            </p>
            <Button
              variant="gold"
              size="lg"
              onClick={() => setShowForm(true)}
            >
              {t('entreprise.requestAccess')}
            </Button>
          </div>
        </section>

        {/* Avantages */}
        <section className="py-16 bg-navy-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-gray-100">
              {t('entreprise.ourAdvantages')} <span className="text-gold-500">{t('entreprise.advantages')}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {avantages.map((avantage, index) => {
                const Icon = avantage.icon
                return (
                  <Card key={index} hover className="text-center">
                    <Icon className="w-12 h-12 text-gold-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-gray-100">{avantage.titre}</h3>
                    <p className="text-gray-400">{avantage.desc}</p>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Nos formules */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-gray-100">
              {t('entreprise.ourPlans')} <span className="text-gold-500">{t('entreprise.plans')}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {/* Formule Basique */}
              <Card className="relative flex flex-col h-full">
                <div className="text-center mb-6">
                  <Zap className="w-12 h-12 text-gold-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2 text-gray-100">{t('entreprise.basicPlan')}</h3>
                  <div className="text-3xl font-bold text-gold-500 mb-1">15 000 MUR</div>
                  <p className="text-gray-400 text-sm">{t('entreprise.perMonth')}</p>
                </div>
                <ul className="space-y-3 flex-grow">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">50 {t('entreprise.cvPerMonth')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{t('entreprise.profileSearch')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{t('entreprise.standardSupport')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{t('entreprise.recruitmentRequests')}</span>
                  </li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full mt-6"
                  onClick={() => setShowForm(true)}
                >
                  {t('entreprise.choosePlan')}
                </Button>
              </Card>

              {/* Formule Standard */}
              <Card className="relative flex flex-col h-full border-2 border-gold-500 transform scale-105">
                <div className="absolute top-0 right-0 bg-gold-500 text-navy-900 px-3 py-1 rounded-bl-lg text-sm font-semibold">
                  {t('entreprise.popular')}
                </div>
                <div className="text-center mb-6">
                  <Star className="w-12 h-12 text-gold-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2 text-gray-100">{t('entreprise.standardPlan')}</h3>
                  <div className="text-3xl font-bold text-gold-500 mb-1">30 000 MUR</div>
                  <p className="text-gray-400 text-sm">{t('entreprise.perMonth')}</p>
                </div>
                <ul className="space-y-3 flex-grow">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">150 {t('entreprise.cvPerMonth')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{t('entreprise.advancedSearch')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{t('entreprise.unlimitedMessaging')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{t('entreprise.prioritySupport')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{t('entreprise.personalizedFollowUp')}</span>
                  </li>
                </ul>
                <Button
                  variant="gold"
                  className="w-full mt-6"
                  onClick={() => setShowForm(true)}
                >
                  {t('entreprise.choosePlan')}
                </Button>
              </Card>

              {/* Formule Premium */}
              <Card className="relative flex flex-col h-full">
                <div className="text-center mb-6">
                  <Crown className="w-12 h-12 text-gold-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2 text-gray-100">{t('entreprise.premiumPlan')}</h3>
                  <div className="text-3xl font-bold text-gold-500 mb-1">50 000 MUR</div>
                  <p className="text-gray-400 text-sm">{t('entreprise.perMonth')}</p>
                </div>
                <ul className="space-y-3 flex-grow">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{t('entreprise.unlimitedCVAccess')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{t('entreprise.allFeatures')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{t('entreprise.support247')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{t('entreprise.dedicatedManager')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{t('entreprise.trainingsWebinars')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{t('entreprise.advancedStats')}</span>
                  </li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full mt-6"
                  onClick={() => setShowForm(true)}
                >
                  {t('entreprise.choosePlan')}
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Processus */}
        <section className="py-16 bg-navy-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-gray-100">
              {t('entreprise.ourProcess')} <span className="text-gold-500">{t('entreprise.process')}</span> {t('entreprise.recruitmentProcess')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                t('entreprise.accessRequest'),
                t('entreprise.validation48h'),
                t('entreprise.needsDefinition'),
                t('entreprise.profileProposal'),
                t('entreprise.interviews'),
                t('entreprise.finalization')
              ].map((etape, index) => (
                <Card key={index} className="text-center">
                  <div className="w-10 h-10 bg-gold-500 text-navy-900 rounded-full flex items-center justify-center font-bold mx-auto mb-2">
                    {index + 1}
                  </div>
                  <p className="text-sm font-medium text-gray-300">{etape}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Formulaire modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-100">{t('entreprise.companyAccessRequest')}</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label={t('entreprise.companyName')}
                  name="nomEntreprise"
                  value={formData.nomEntreprise}
                  onChange={handleChange}
                  required
                />

                <Select
                  label={t('entreprise.activitySector')}
                  name="secteur"
                  value={formData.secteur}
                  onChange={handleChange}
                  options={secteurs}
                  required
                />

                <Input
                  label={t('entreprise.fullAddressMauritius')}
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t('entreprise.contactFirstName')}
                    name="prenomContact"
                    value={formData.prenomContact}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label={t('entreprise.contactLastName')}
                    name="nomContact"
                    value={formData.nomContact}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Input
                  label={t('entreprise.contactFunction')}
                  name="fonctionContact"
                  value={formData.fonctionContact}
                  onChange={handleChange}
                  required
                />

                <Input
                  label={t('entreprise.professionalEmail')}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <Input
                  label={t('auth.phone')}
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                />

                <Input
                  label={t('entreprise.numberOfEmployees')}
                  type="number"
                  name="nombreEmployes"
                  value={formData.nombreEmployes}
                  onChange={handleChange}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {t('entreprise.recruitmentNeeds')}
                  </label>
                  <textarea
                    name="besoins"
                    value={formData.besoins}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 bg-navy-800 border border-navy-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    required
                  />
                </div>

                <FileUpload
                  label={t('entreprise.kbisDocument')}
                  accept=".pdf,.jpg,.png"
                  onFileSelect={setFile}
                  value={file}
                />

                <p className="text-sm text-gray-400">
                  {t('entreprise.requestExaminedInfo')}
                </p>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    variant="gold"
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? t('entreprise.sending') : t('entreprise.sendRequest')}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowForm(false)}
                  >
                    {t('common.cancel')}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </main>
      <Footer />
      <ToastContainer />
    </div>
  )
}

// Composant principal avec rendu conditionnel
const EntreprisePublic = () => {
  const { user, isEntreprise } = useAuth()

  // Si connecté en tant qu'entreprise, afficher l'espace entreprise
  if (user && isEntreprise) {
    return <EspaceEntrepriseConnecte />
  }

  // Sinon, afficher la page publique
  return <EntreprisePublicVisiteur />
}

export default EntreprisePublic
