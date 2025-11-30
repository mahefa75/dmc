import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header, Footer } from '../components/Layout'
import { Card, Button, Input, Select, Badge, Modal } from '../components/UI'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { useToast } from '../components/UI/Toast'
import { 
  CheckCircle, MapPin, Briefcase, DollarSign, ArrowRight, 
  Search, Filter, Eye, Send, Clock, FileText, Calendar,
  MessageSquare, Building2, GraduationCap, Timer
} from 'lucide-react'

// Composant pour les candidats connectés
const EspaceCandidatConnecte = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { offres, candidatures, addCandidature } = useData()
  const { showToast, ToastContainer } = useToast()
  const navigate = useNavigate()
  
  // États pour la recherche et les filtres
  const [searchTerm, setSearchTerm] = useState('')
  const [typeContrat, setTypeContrat] = useState('')
  const [secteur, setSecteur] = useState('')
  const [niveauEtudes, setNiveauEtudes] = useState('')
  const [experience, setExperience] = useState('')
  
  // États pour la modal de candidature
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [selectedOffre, setSelectedOffre] = useState(null)
  
  // États pour la modal de détails d'offre
  const [showOffreModal, setShowOffreModal] = useState(false)
  const [offreDetails, setOffreDetails] = useState(null)

  // Candidatures de démonstration pour le profil démo
  const demoCandidatures = useMemo(() => {
    if (user?.isDemo && user?.id === 'demo-candidat-001' && offres.length > 0) {
      const activeOffres = offres.filter(o => o.statut === 'active')
      if (activeOffres.length >= 4) {
        return [
          {
            id: 'demo-cand-001',
            offreId: activeOffres[0]?.id,
            candidatId: user.id,
            statut: 'en_attente',
            dateCandidature: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            offre: activeOffres[0]
          },
          {
            id: 'demo-cand-002',
            offreId: activeOffres[1]?.id,
            candidatId: user.id,
            statut: 'selectionne',
            dateCandidature: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            offre: activeOffres[1]
          },
          {
            id: 'demo-cand-003',
            offreId: activeOffres[2]?.id,
            candidatId: user.id,
            statut: 'entretien',
            dateCandidature: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            dateEntretien: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            offre: activeOffres[2]
          },
          {
            id: 'demo-cand-004',
            offreId: activeOffres[3]?.id,
            candidatId: user.id,
            statut: 'accepte',
            dateCandidature: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            offre: activeOffres[3]
          }
        ]
      }
    }
    return []
  }, [user, offres])

  // Récupérer mes candidatures (réelles + démo)
  const mesCandidatures = useMemo(() => {
    const realCandidatures = candidatures
      .filter(c => c.candidatId === user?.id)
      .map(c => {
        const offre = offres.find(o => o.id === c.offreId)
        return { ...c, offre }
      })
    
    // Si utilisateur démo et pas de candidatures réelles, utiliser les candidatures démo
    const allCandidatures = realCandidatures.length > 0 ? realCandidatures : demoCandidatures
    
    return allCandidatures.sort((a, b) => new Date(b.dateCandidature) - new Date(a.dateCandidature))
  }, [candidatures, offres, user, demoCandidatures])

  // Filtrer les offres
  const offresFiltered = useMemo(() => {
    let filtered = offres.filter(o => o.statut === 'active')
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(o => 
        o.titre?.toLowerCase().includes(term) ||
        o.description?.toLowerCase().includes(term) ||
        o.entrepriseNom?.toLowerCase().includes(term)
      )
    }
    if (typeContrat) {
      filtered = filtered.filter(o => o.typeContrat === typeContrat)
    }
    if (secteur) {
      filtered = filtered.filter(o => o.secteur === secteur)
    }
    if (niveauEtudes) {
      filtered = filtered.filter(o => o.niveauEtudes === niveauEtudes)
    }
    if (experience) {
      filtered = filtered.filter(o => o.experienceMin <= parseInt(experience))
    }
    
    return filtered.slice(0, 6)
  }, [offres, searchTerm, typeContrat, secteur, niveauEtudes, experience])

  // Vérifier si déjà candidaté (candidatures réelles + démo)
  const hasApplied = (offreId) => {
    const realApplied = candidatures.some(c => c.candidatId === user?.id && c.offreId === offreId)
    const demoApplied = demoCandidatures.some(c => c.offreId === offreId)
    return realApplied || demoApplied
  }

  // Postuler à une offre
  const handleApply = (offre) => {
    if (hasApplied(offre.id)) {
      showToast(t('candidat.alreadyApplied'), 'warning')
      return
    }
    setSelectedOffre(offre)
    setShowApplyModal(true)
  }

  // Confirmer la candidature
  const confirmApply = () => {
    if (selectedOffre && addCandidature) {
      const nouvelleCandidature = {
        id: `cand-${Date.now()}`,
        offreId: selectedOffre.id,
        candidatId: user.id,
        candidatNom: `${user.prenom} ${user.nom}`,
        candidatEmail: user.email,
        statut: 'en_attente',
        dateCandidature: new Date().toISOString(),
        notes: ''
      }
      addCandidature(nouvelleCandidature)
      showToast(t('candidat.applicationSent'), 'success')
      setShowApplyModal(false)
      setSelectedOffre(null)
    }
  }

  // Voir les détails d'une offre
  const handleViewDetails = (offre) => {
    setOffreDetails(offre)
    setShowOffreModal(true)
  }

  // Obtenir les options uniques pour les filtres
  const secteurs = [...new Set(offres.map(o => o.secteur).filter(Boolean))]
  const typesContrat = [...new Set(offres.map(o => o.typeContrat).filter(Boolean))]

  // Obtenir le badge de statut
  const getStatutBadge = (statut) => {
    const badges = {
      en_attente: { variant: 'warning', label: t('candidatures.enAttente'), icon: Clock },
      selectionne: { variant: 'info', label: t('candidatures.selectionne'), icon: CheckCircle },
      entretien: { variant: 'info', label: t('candidatures.entretien'), icon: Calendar },
      accepte: { variant: 'success', label: t('candidatures.accepte'), icon: CheckCircle },
      refuse: { variant: 'danger', label: t('candidatures.refuse'), icon: null }
    }
    return badges[statut] || { variant: 'default', label: statut, icon: Clock }
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Recherche d'emploi */}
          <section className="mb-10">
            <h1 className="text-3xl font-display font-bold mb-6 text-gray-100">
              {t('candidat.searchJob')}
            </h1>
            
            {/* Barre de recherche */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('candidat.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-navy-800 border border-navy-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            {/* Filtres */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Select
                value={typeContrat}
                onChange={(e) => setTypeContrat(e.target.value)}
                options={[
                  { value: '', label: t('candidat.contractType') },
                  { value: 'CDI', label: 'CDI' },
                  { value: 'CDD', label: 'CDD' },
                  { value: 'Stage', label: 'Stage' },
                  { value: 'Freelance', label: 'Freelance' }
                ]}
              />
              <Select
                value={secteur}
                onChange={(e) => setSecteur(e.target.value)}
                options={[
                  { value: '', label: t('candidat.activitySector') },
                  ...secteurs.map(s => ({ value: s, label: s }))
                ]}
              />
              <Select
                value={niveauEtudes}
                onChange={(e) => setNiveauEtudes(e.target.value)}
                options={[
                  { value: '', label: t('candidat.educationLevel') },
                  { value: 'Bac', label: 'Bac' },
                  { value: 'Bac+2', label: 'Bac+2' },
                  { value: 'Bac+3', label: 'Bac+3' },
                  { value: 'Bac+4', label: 'Bac+4' },
                  { value: 'Bac+5', label: 'Bac+5' }
                ]}
              />
              <Select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                options={[
                  { value: '', label: t('candidat.experienceYears') },
                  { value: '0', label: t('candidat.noExperience') },
                  { value: '1', label: '1+ ' + t('candidat.years') },
                  { value: '3', label: '3+ ' + t('candidat.years') },
                  { value: '5', label: '5+ ' + t('candidat.years') }
                ]}
              />
            </div>

            {/* Liste des offres */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offresFiltered.length === 0 ? (
                <Card className="col-span-full">
                  <p className="text-center text-gray-400 py-8">
                    {t('candidat.noOffersFound')}
                  </p>
                </Card>
              ) : (
                offresFiltered.map((offre) => (
                  <Card key={offre.id} hover className="flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-gray-100">{offre.titre}</h3>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-400 text-sm">
                          <Building2 className="w-4 h-4 mr-2 text-gold-500" />
                          {offre.entrepriseNom || 'Entreprise'}
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <MapPin className="w-4 h-4 mr-2 text-gold-500" />
                          {offre.localisation}
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Briefcase className="w-4 h-4 mr-2 text-gold-500" />
                          {offre.typeContrat}
                        </div>
                        {offre.salaire && (
                          <div className="flex items-center text-gray-400 text-sm">
                            <DollarSign className="w-4 h-4 mr-2 text-gold-500" />
                            {offre.salaire} MUR
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {hasApplied(offre.id) ? (
                        <Button variant="secondary" className="flex-1" disabled>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {t('candidat.applied')}
                        </Button>
                      ) : (
                        <Button 
                          variant="gold" 
                          className="flex-1"
                          onClick={() => handleApply(offre)}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {t('candidat.apply')}
                        </Button>
                      )}
                      <Button 
                        variant="outline"
                        onClick={() => handleViewDetails(offre)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {/* Voir toutes les offres */}
            <div className="text-center mt-6">
              <Link to="/offres">
                <Button variant="outline" className="inline-flex items-center gap-2">
                  {t('candidat.seeAllOffers')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </section>

          {/* Section Suivi des candidatures */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-gray-100">
                {t('candidat.applicationTracking')}
              </h2>
              <Link to="/candidat/candidatures">
                <Button variant="outline" size="sm">
                  {t('candidat.seeAll')}
                </Button>
              </Link>
            </div>

            <Card>
              {mesCandidatures.length === 0 ? (
                <p className="text-center text-gray-400 py-8">
                  {t('candidat.noApplicationYet')}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-navy-600">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">{t('candidatures.poste')}</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">{t('candidatures.entreprise')}</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">{t('candidatures.date')}</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">{t('candidatures.statut')}</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mesCandidatures.slice(0, 5).map((candidature) => {
                        const badgeInfo = getStatutBadge(candidature.statut)
                        return (
                          <tr key={candidature.id} className="border-b border-navy-700 hover:bg-navy-800/50">
                            <td className="py-3 px-4 text-gray-100">
                              {candidature.offre?.titre || 'N/A'}
                            </td>
                            <td className="py-3 px-4 text-gray-400">
                              {candidature.offre?.entrepriseNom || 'N/A'}
                            </td>
                            <td className="py-3 px-4 text-gray-400">
                              {new Date(candidature.dateCandidature).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={badgeInfo.variant}>
                                {badgeInfo.label}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Link to={`/offres/${candidature.offre?.id}`}>
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </Link>
                                <Link to="/candidat/messagerie">
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

      {/* Modal de candidature */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => {
          setShowApplyModal(false)
          setSelectedOffre(null)
        }}
        title={t('candidat.confirmApplication')}
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setShowApplyModal(false)
              setSelectedOffre(null)
            }}>
              {t('common.cancel')}
            </Button>
            <Button variant="gold" onClick={confirmApply}>
              <Send className="w-4 h-4 mr-2" />
              {t('candidat.sendApplication')}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            {t('candidat.applyingFor')} <strong className="text-gold-500">{selectedOffre?.titre}</strong> {t('candidat.at')} <strong className="text-gold-500">{selectedOffre?.entrepriseNom}</strong>
          </p>
          <div className="bg-navy-800 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-2">{t('candidat.yourProfileWillBeSent')}:</p>
            <ul className="space-y-1 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {t('candidat.yourCV')}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {t('candidat.yourCoverLetter')}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {t('candidat.yourContactInfo')}
              </li>
            </ul>
          </div>
          <p className="text-sm text-gray-400">
            {t('candidat.applicationOneClick')}
          </p>
        </div>
      </Modal>

      {/* Modal détails offre */}
      <Modal
        isOpen={showOffreModal}
        onClose={() => {
          setShowOffreModal(false)
          setOffreDetails(null)
        }}
        title={offreDetails?.titre || ''}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setShowOffreModal(false)
              setOffreDetails(null)
            }}>
              {t('common.close')}
            </Button>
            {!hasApplied(offreDetails?.id) && (
              <Button variant="gold" onClick={() => {
                setShowOffreModal(false)
                handleApply(offreDetails)
              }}>
                <Send className="w-4 h-4 mr-2" />
                {t('candidat.apply')}
              </Button>
            )}
          </>
        }
      >
        {offreDetails && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Building2 className="w-4 h-4 text-gold-500" />
                {offreDetails.entrepriseNom}
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4 text-gold-500" />
                {offreDetails.localisation}
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Briefcase className="w-4 h-4 text-gold-500" />
                {offreDetails.typeContrat}
              </div>
              {offreDetails.salaire && (
                <div className="flex items-center gap-2 text-gray-400">
                  <DollarSign className="w-4 h-4 text-gold-500" />
                  {offreDetails.salaire} MUR
                </div>
              )}
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-100 mb-2">{t('offres.jobDescription')}</h4>
              <p className="text-gray-400 whitespace-pre-line">{offreDetails.description}</p>
            </div>
            
            {offreDetails.competences && (
              <div>
                <h4 className="font-semibold text-gray-100 mb-2">{t('offres.requiredSkills')}</h4>
                <div className="flex flex-wrap gap-2">
                  {offreDetails.competences.map((comp, i) => (
                    <Badge key={i} variant="default">{comp}</Badge>
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
const CandidatPublicVisiteur = () => {
  const { t } = useLanguage()
  const { offres } = useData()

  const offresRecentes = offres
    .filter(offre => offre.statut === 'active')
    .sort((a, b) => new Date(b.datePublication) - new Date(a.datePublication))
    .slice(0, 6)

  const avantages = [
    t('candidat.freeRegistration'),
    t('candidat.accessVerifiedOffers'),
    t('candidat.personalizedSupport'),
    t('candidat.fullAdminSupport'),
    t('candidat.applicationTracking'),
    t('candidat.realTimeNotifications')
  ]

  const etapes = [
    { num: 1, titre: t('candidat.step1Title'), desc: t('candidat.step1Desc') },
    { num: 2, titre: t('candidat.step2Title'), desc: t('candidat.step2Desc') },
    { num: 3, titre: t('candidat.step3Title'), desc: t('candidat.step3Desc') },
    { num: 4, titre: t('candidat.step4Title'), desc: t('candidat.step4Desc') }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-r from-navy-800 to-navy-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-display font-bold mb-4 text-gray-100">
              {t('candidat.findJobTitle')} <span className="text-gold-500">{t('candidat.jobInMauritius')}</span> {t('candidat.atMauritius')}
            </h1>
            <p className="text-xl mb-8 text-gray-400">
              {t('candidat.publicSubtitle')}
            </p>
            <Link to="/register">
              <Button variant="gold" size="lg">
                {t('candidat.registerFree')}
              </Button>
            </Link>
          </div>
        </section>

        {/* Avantages */}
        <section className="py-16 bg-navy-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-gray-100">
              {t('candidat.whyChooseUs')} <span className="text-gold-500">{t('candidat.choose')}</span> ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {avantages.map((avantage, index) => (
                <Card key={index} hover>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-gold-500 flex-shrink-0 mt-1" />
                    <p className="text-gray-300">{avantage}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-gray-100">
              {t('candidat.howItWorks')} <span className="text-gold-500">{t('candidat.works')}</span> ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {etapes.map((etape) => (
                <Card key={etape.num} className="text-center">
                  <div className="w-12 h-12 bg-gold-500 text-navy-900 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {etape.num}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-100">{etape.titre}</h3>
                  <p className="text-gray-400">{etape.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Offres récentes */}
        <section className="py-16 bg-navy-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-display font-bold text-gray-100">
                {t('candidat.recentOffersTitle')} <span className="text-gold-500">{t('candidat.recent')}</span>
              </h2>
              <Link to="/offres">
                <Button variant="outline" className="flex items-center gap-2">
                  {t('candidat.seeAllOffers')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            {offresRecentes.length === 0 ? (
              <Card>
                <p className="text-center text-gray-400 py-8">
                  {t('candidat.noOfferAvailable')}
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offresRecentes.map((offre) => (
                  <Card key={offre.id} hover>
                    <h3 className="text-xl font-semibold mb-2 text-gray-100">{offre.titre}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-400 text-sm">
                        <Briefcase className="w-4 h-4 mr-2 text-gold-500" />
                        {offre.secteur}
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-gold-500" />
                        {offre.localisation}
                      </div>
                      {offre.salaire && (
                        <div className="flex items-center text-gray-400 text-sm">
                          <DollarSign className="w-4 h-4 mr-2 text-gold-500" />
                          {offre.salaire} MUR
                        </div>
                      )}
                    </div>
                    {offre.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {offre.description.substring(0, 100)}...
                      </p>
                    )}
                    <Link to={`/offres/${offre.id}`}>
                      <Button variant="gold" className="w-full">
                        {t('candidat.viewDetails')}
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-navy-800 via-navy-900 to-navy-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-display font-bold mb-4 text-gray-100">
              {t('candidat.readyTo')} <span className="text-gold-500">{t('candidat.start')}</span> ?
            </h2>
            <p className="text-xl mb-8 text-gray-400">
              {t('candidat.registerNowSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="gold" size="lg">
                  {t('candidat.registerNow')}
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  {t('candidat.alreadyRegistered')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

// Composant principal avec rendu conditionnel
const CandidatPublic = () => {
  const { user, isCandidat } = useAuth()

  // Si connecté en tant que candidat, afficher l'espace candidat
  if (user && isCandidat) {
    return <EspaceCandidatConnecte />
  }

  // Sinon, afficher la page publique
  return <CandidatPublicVisiteur />
}

export default CandidatPublic
