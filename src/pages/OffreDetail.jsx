import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Header, Footer } from '../components/Layout'
import { Card, Badge, Button, Modal } from '../components/UI'
import { useLanguage } from '../contexts/LanguageContext'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/UI/Toast'
import { MapPin, Briefcase, DollarSign, Calendar, CheckCircle, Building2, Clock, Award, FileText, User } from 'lucide-react'

const OffreDetail = () => {
  const { id } = useParams()
  const { t } = useLanguage()
  const { offres, addCandidature, candidatures } = useData()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { showToast, ToastContainer } = useToast()
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const offre = offres.find(o => o.id === id)

  if (!offre) {
    return (
      <div className="min-h-screen flex flex-col bg-navy-900">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card>
            <p className="text-center text-gray-400">{t('offres.notFound')}</p>
            <Link to="/offres">
              <Button variant="gold" className="mt-4">
                {t('offres.backToOffers')}
              </Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  const isProfileComplete = () => {
    if (!user) return false
    // Vérifier les champs essentiels
    const hasBasicInfo = user.nom && user.prenom && user.email && user.telephone
    const hasCV = user.cv
    return hasBasicInfo && hasCV
  }

  const isAlreadyApplied = () => {
    if (!user || !candidatures) return false
    return candidatures.some(c => c.candidatId === user.id && c.offreId === offre.id)
  }

  const handlePostuler = () => {
    if (!isAuthenticated) {
      showToast(t('offres.pleaseLoginToApply'), 'warning')
      navigate('/login')
      return
    }

    if (user.role !== 'candidat') {
      showToast(t('offres.onlyCandidatesCanApply'), 'error')
      return
    }

    // Vérifier si déjà candidaté
    if (isAlreadyApplied()) {
      showToast(t('offres.alreadyApplied'), 'warning')
      return
    }

    // Vérifier profil complet
    if (!isProfileComplete()) {
      showToast(t('offres.completeProfileFirst'), 'warning')
      navigate('/candidat/profil')
      return
    }

    // Afficher modal de confirmation
    setShowConfirmModal(true)
  }

  const confirmApplication = () => {
    addCandidature({
      id: Date.now().toString(),
      candidatId: user.id,
      offreId: offre.id,
      dateCandidature: new Date().toISOString(),
      statut: 'en_attente',
      notes: '',
      documentsSupplementaires: []
    })

    setShowConfirmModal(false)
    showToast(t('offres.applicationSuccess'), 'success')
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/offres" className="text-gold-500 hover:text-gold-400 mb-4 inline-block">
            ← {t('offres.backToOffers')}
          </Link>

          {/* Image/Bannière */}
          {offre.image && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img src={offre.image} alt={offre.titre} className="w-full h-64 object-cover" />
            </div>
          )}

          <Card className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-display font-bold mb-2 text-gray-100">{offre.titre}</h1>
                {offre.entrepriseNom && (
                  <div className="flex items-center text-gray-400 mb-2">
                    <Building2 className="w-5 h-5 mr-2 text-gold-500" />
                    <span className="text-lg font-medium">{offre.entrepriseNom}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge variant="primary">{offre.secteur}</Badge>
                  {offre.typeContrat && (
                    <Badge variant="info">{offre.typeContrat}</Badge>
                  )}
                  {offre.statut === 'urgent' && (
                    <Badge variant="danger">{t('offres.urgent')}</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-400">
                <Briefcase className="w-5 h-5 mr-2 text-gold-500" />
                <span>{offre.secteur}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <MapPin className="w-5 h-5 mr-2 text-gold-500" />
                <span>{offre.localisation}</span>
              </div>
              {offre.salaire && (
                <div className="flex items-center text-gray-400">
                  <DollarSign className="w-5 h-5 mr-2 text-gold-500" />
                  <span>{offre.salaire.toLocaleString()} MUR</span>
                </div>
              )}
              {offre.typeContrat && (
                <div className="flex items-center text-gray-400">
                  <FileText className="w-5 h-5 mr-2 text-gold-500" />
                  <span>{offre.typeContrat}</span>
                </div>
              )}
              <div className="flex items-center text-gray-400">
                <Calendar className="w-5 h-5 mr-2 text-gold-500" />
                <span>{t('offres.publishedOn')} {new Date(offre.datePublication).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              {offre.dateExpiration && (
                <div className="flex items-center text-gray-400">
                  <Clock className="w-5 h-5 mr-2 text-gold-500" />
                  <span>{t('offres.deadline')} : {new Date(offre.dateExpiration).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              )}
            </div>

            <Button
              variant="gold"
              size="lg"
              className="w-full md:w-auto"
              onClick={handlePostuler}
            >
              <CheckCircle className="w-5 h-5 mr-2 inline" />
              {t('offres.postuler1clic')}
            </Button>
          </Card>

          <Card>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{t('offres.jobDescription')}</h2>
            <div className="prose max-w-none">
              <p className="text-gray-300 whitespace-pre-line">{offre.description}</p>
            </div>
          </Card>

          {offre.competencesRequises && offre.competencesRequises.length > 0 && (
            <Card className="mt-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-100">{t('offres.competencesRequises')}</h2>
              <div className="flex flex-wrap gap-2">
                {offre.competencesRequises.map((comp, index) => (
                  <Badge key={index} variant="info">{comp}</Badge>
                ))}
              </div>
            </Card>
          )}

          {offre.languesRequises && offre.languesRequises.length > 0 && (
            <Card className="mt-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-100">{t('offres.languesRequises')}</h2>
              <div className="space-y-2">
                {offre.languesRequises.map((langue, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span>{langue.langue}</span>
                    <Badge variant="primary">{langue.niveau}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {offre.experienceMin !== undefined && (
            <Card className="mt-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-100">{t('offres.minExperience')}</h2>
              <div className="flex items-center text-gray-300">
                <User className="w-5 h-5 mr-2 text-gold-500" />
                <span>{offre.experienceMin} {t('offres.yearsExperience')}</span>
              </div>
            </Card>
          )}

          {offre.profilRecherche && (
            <Card className="mt-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-100">{t('offres.searchedProfile')}</h2>
              <p className="text-gray-300 whitespace-pre-line">{offre.profilRecherche}</p>
            </Card>
          )}

          {offre.conditionsTravail && (
            <Card className="mt-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-100">{t('offres.workConditions')}</h2>
              <p className="text-gray-300 whitespace-pre-line">{offre.conditionsTravail}</p>
            </Card>
          )}

          {offre.avantages && (
            <Card className="mt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-100">
                <Award className="w-6 h-6 mr-2 text-gold-500" />
                {t('offres.benefits')}
              </h2>
              <div className="space-y-2">
                {offre.avantages.split(', ').map((avantage, index) => (
                  <div key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="w-4 h-4 mr-2 text-gold-500" />
                    <span>{avantage}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </main>
      <Footer />
      <ToastContainer />
      
      {/* Modal de confirmation */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={t('offres.confirmApplication')}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="gold" onClick={confirmApplication}>
              {t('common.confirm')}
            </Button>
          </>
        }
      >
        <p className="mb-4 text-gray-300">
          {t('offres.confirmApplicationText')} <strong className="text-gold-500">{offre?.titre}</strong> {t('offres.at')} <strong className="text-gold-500">{offre?.entrepriseNom}</strong> ?
        </p>
        <p className="text-sm text-gray-400">
          {t('offres.autoSendDocs')}
        </p>
      </Modal>
    </div>
  )
}

export default OffreDetail
