import { Link } from 'react-router-dom'
import { Header, Footer } from '../components/Layout'
import { Card, Button } from '../components/UI'
import { useLanguage } from '../contexts/LanguageContext'
import { useData } from '../contexts/DataContext'
import { CheckCircle, MapPin, Briefcase, DollarSign, ArrowRight } from 'lucide-react'

const CandidatPublic = () => {
  const { t } = useLanguage()
  const { offres } = useData()

  // Récupérer les 6 offres les plus récentes
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

export default CandidatPublic
