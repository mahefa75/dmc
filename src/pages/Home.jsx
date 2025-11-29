import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Header, Footer } from '../components/Layout'
import { Card } from '../components/UI'
import Button from '../components/UI/Button'
import { useLanguage } from '../contexts/LanguageContext'
import { useData } from '../contexts/DataContext'
import { Users, Briefcase, Award, TrendingUp, Scale, Eye, Shield, Heart, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const Home = () => {
  const { t } = useLanguage()
  const { users, offres } = useData()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const candidatsCount = users.filter(u => u.role === 'candidat').length
  const entreprisesCount = users.filter(u => u.role === 'entreprise').length
  const offresCount = offres.filter(o => o.statut === 'active').length
  const placementsCount = 150 // Simulé

  // Témoignages
  const temoignages = [
    {
      nom: 'Jean Rakoto',
      fonction: 'Ouvrier qualifié - Construction',
      entreprise: 'Mauritius Construction Ltd',
      citation: 'Grâce à cette plateforme, j\'ai trouvé un emploi stable à Maurice. Le processus a été transparent et l\'accompagnement excellent.',
      photo: null
    },
    {
      nom: 'Marie Rasoa',
      fonction: 'Serveuse - Hôtellerie',
      entreprise: 'Beach Resort Hotel',
      citation: 'L\'équipe m\'a aidée à préparer mon dossier et à comprendre les démarches. Aujourd\'hui, je travaille dans un hôtel 5 étoiles.',
      photo: null
    },
    {
      nom: 'Pierre Andriamalala',
      fonction: 'Chef d\'équipe - Agriculture',
      entreprise: 'Green Fields Co.',
      citation: 'Excellente expérience ! J\'ai pu postuler facilement et j\'ai été sélectionné rapidement. Je recommande vivement cette plateforme.',
      photo: null
    },
    {
      nom: 'Sophie Ranaivo',
      fonction: 'Responsable RH',
      entreprise: 'Mauritius Industries',
      citation: 'Nous avons recruté plusieurs candidats qualifiés via cette plateforme. Le service est professionnel et les profils sont vérifiés.',
      photo: null
    }
  ]

  // Auto-play du carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % temoignages.length)
    }, 5000) // Change toutes les 5 secondes

    return () => clearInterval(interval)
  }, [temoignages.length])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % temoignages.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + temoignages.length) % temoignages.length)
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('home.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              {t('home.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/candidat">
                <Button variant="outline" size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  {t('home.ctaCandidat')}
                </Button>
              </Link>
              <Link to="/entreprise">
                <Button variant="outline" size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  {t('home.ctaEntreprise')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">{t('home.chiffres')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-blue-600 mb-2">{candidatsCount}+</h3>
              <p className="text-gray-600">Candidats inscrits</p>
            </Card>
            <Card className="text-center">
              <Briefcase className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-green-600 mb-2">{offresCount}</h3>
              <p className="text-gray-600">Offres publiées</p>
            </Card>
            <Card className="text-center">
              <Award className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-orange-600 mb-2">{placementsCount}</h3>
              <p className="text-gray-600">Placements réussis</p>
            </Card>
            <Card className="text-center">
              <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-purple-600 mb-2">{entreprisesCount}</h3>
              <p className="text-gray-600">Entreprises partenaires</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">{t('home.services')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover>
              <h3 className="text-xl font-semibold mb-4">Pour les candidats</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Inscription gratuite</li>
                <li>✓ Offres vérifiées</li>
                <li>✓ Accompagnement personnalisé</li>
                <li>✓ Support administratif</li>
              </ul>
            </Card>
            <Card hover>
              <h3 className="text-xl font-semibold mb-4">Pour les entreprises</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Recrutement sur mesure</li>
                <li>✓ Base de CV qualifiés</li>
                <li>✓ Suivi personnalisé</li>
                <li>✓ Présélection rigoureuse</li>
              </ul>
            </Card>
            <Card hover>
              <h3 className="text-xl font-semibold mb-4">Notre accompagnement</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Présélection rigoureuse</li>
                <li>✓ Support administratif</li>
                <li>✓ Suivi post-recrutement</li>
                <li>✓ Médiation si nécessaire</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">{t('home.valeurs')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <Scale className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('home.valeursEthique')}</h3>
              <p className="text-gray-600">{t('home.valeursEthiqueDesc')}</p>
            </Card>
            <Card className="text-center">
              <Eye className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('home.valeursTransparence')}</h3>
              <p className="text-gray-600">{t('home.valeursTransparenceDesc')}</p>
            </Card>
            <Card className="text-center">
              <Shield className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('home.valeursProfessionnalisme')}</h3>
              <p className="text-gray-600">{t('home.valeursProfessionnalismeDesc')}</p>
            </Card>
            <Card className="text-center">
              <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('home.valeursEngagement')}</h3>
              <p className="text-gray-600">{t('home.valeursEngagementDesc')}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">{t('home.temoignages')}</h2>
          <div className="relative max-w-4xl mx-auto px-8 md:px-0">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
              <div className="flex items-center justify-center mb-6">
                <Quote className="w-12 h-12 text-blue-600" />
              </div>
              <div className="text-center mb-8">
                <p className="text-lg md:text-xl text-gray-700 italic mb-6">
                  "{temoignages[currentTestimonial].citation}"
                </p>
                <div className="flex items-center justify-center gap-4">
                  {temoignages[currentTestimonial].photo ? (
                    <img
                      src={temoignages[currentTestimonial].photo}
                      alt={temoignages[currentTestimonial].nom}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                  )}
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{temoignages[currentTestimonial].nom}</p>
                    <p className="text-sm text-gray-600">{temoignages[currentTestimonial].fonction}</p>
                    <p className="text-sm text-gray-500">{temoignages[currentTestimonial].entreprise}</p>
                  </div>
                </div>
              </div>
              {/* Indicateurs */}
              <div className="flex justify-center gap-2 mb-6">
                {temoignages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentTestimonial ? 'bg-blue-600 w-8' : 'bg-gray-300'
                    }`}
                    aria-label={`Témoignage ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            {/* Boutons navigation - masqués sur mobile, visibles sur tablette+ */}
            <button
              onClick={prevTestimonial}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors z-10"
              aria-label="Témoignage précédent"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={nextTestimonial}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors z-10"
              aria-label="Témoignage suivant"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
            {/* Boutons navigation mobile - intégrés dans la carte */}
            <div className="md:hidden flex justify-between items-center mt-4">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                aria-label="Témoignage précédent"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                aria-label="Témoignage suivant"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Rejoignez notre plateforme et trouvez votre emploi ou votre candidat idéal
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="outline" size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Inscription candidat
              </Button>
            </Link>
            <Link to="/entreprise">
              <Button variant="outline" size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Demande entreprise
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home



