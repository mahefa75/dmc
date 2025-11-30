import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Header, Footer } from '../components/Layout'
import { Card } from '../components/UI'
import Button from '../components/UI/Button'
import { useLanguage } from '../contexts/LanguageContext'
import { useData } from '../contexts/DataContext'
import { Users, Briefcase, Award, TrendingUp, Scale, Eye, Shield, Heart, ChevronLeft, ChevronRight, Quote, Lightbulb, Target, Sparkles } from 'lucide-react'

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
    }, 5000)

    return () => clearInterval(interval)
  }, [temoignages.length])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % temoignages.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + temoignages.length) % temoignages.length)
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-navy-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-800 via-navy-900 to-navy-900"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
              <span className="text-gray-100">Recrutement.</span>{' '}
              <span className="text-gold-500">Excellence.</span>
              <br />
              <span className="text-gold-500">Opportunités</span>
              <span className="text-gray-100">.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-400 max-w-3xl mx-auto">
              {t('home.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/candidat">
                <Button variant="gold" size="lg">
                  {t('home.ctaCandidat')}
                </Button>
              </Link>
              <Link to="/entreprise">
                <Button variant="outline" size="lg">
                  {t('home.ctaEntreprise')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section valeurs - Style Elite */}
      <section className="py-20 bg-navy-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16">
            <span className="text-gold-500">Redéfinir</span>{' '}
            <span className="text-gray-100">le recrutement professionnel</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="default" className="text-center p-8">
              <Lightbulb className="w-12 h-12 text-gold-500 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-100 mb-4">Accès Direct</h3>
              <p className="text-gray-400">
                Connectez-vous directement avec des entreprises mauriciennes et des candidats malgaches qualifiés dans un environnement vérifié.
              </p>
            </Card>
            <Card variant="default" className="text-center p-8">
              <Target className="w-12 h-12 text-gold-500 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-100 mb-4">Expertise Exclusive</h3>
              <p className="text-gray-400">
                Bénéficiez de notre connaissance approfondie du marché et de nos rapports personnalisés pour vos recrutements.
              </p>
            </Card>
            <Card variant="default" className="text-center p-8">
              <Sparkles className="w-12 h-12 text-gold-500 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-100 mb-4">Croissance Stratégique</h3>
              <p className="text-gray-400">
                Développez votre réseau professionnel et accélérez votre trajectoire de carrière grâce à nos opportunités.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16 text-gray-100">
            {t('home.chiffres')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card variant="gradient" className="text-center p-8">
              <Users className="w-10 h-10 text-gold-500 mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-gold-500 mb-2">{candidatsCount}+</h3>
              <p className="text-gray-400">Candidats inscrits</p>
            </Card>
            <Card variant="gradient" className="text-center p-8">
              <Briefcase className="w-10 h-10 text-gold-500 mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-gold-500 mb-2">{offresCount}</h3>
              <p className="text-gray-400">Offres publiées</p>
            </Card>
            <Card variant="gradient" className="text-center p-8">
              <Award className="w-10 h-10 text-gold-500 mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-gold-500 mb-2">{placementsCount}</h3>
              <p className="text-gray-400">Placements réussis</p>
            </Card>
            <Card variant="gradient" className="text-center p-8">
              <TrendingUp className="w-10 h-10 text-gold-500 mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-gold-500 mb-2">{entreprisesCount}</h3>
              <p className="text-gray-400">Entreprises partenaires</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-navy-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16 text-gray-100">
            {t('home.services')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover variant="gold" className="p-8">
              <h3 className="text-xl font-semibold mb-6 text-gold-500">Pour les candidats</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-gold-500">✓</span> Inscription gratuite
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold-500">✓</span> Offres vérifiées
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold-500">✓</span> Accompagnement personnalisé
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold-500">✓</span> Support administratif
                </li>
              </ul>
            </Card>
            <Card hover variant="gold" className="p-8">
              <h3 className="text-xl font-semibold mb-6 text-gold-500">Pour les entreprises</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-gold-500">✓</span> Recrutement sur mesure
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold-500">✓</span> Base de CV qualifiés
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold-500">✓</span> Suivi personnalisé
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold-500">✓</span> Présélection rigoureuse
                </li>
              </ul>
            </Card>
            <Card hover variant="gold" className="p-8">
              <h3 className="text-xl font-semibold mb-6 text-gold-500">Notre accompagnement</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-gold-500">✓</span> Présélection rigoureuse
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold-500">✓</span> Support administratif
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold-500">✓</span> Suivi post-recrutement
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold-500">✓</span> Médiation si nécessaire
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16 text-gray-100">
            {t('home.valeurs')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="default" className="text-center p-6">
              <Scale className="w-10 h-10 text-gold-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-100">{t('home.valeursEthique')}</h3>
              <p className="text-gray-400 text-sm">{t('home.valeursEthiqueDesc')}</p>
            </Card>
            <Card variant="default" className="text-center p-6">
              <Eye className="w-10 h-10 text-gold-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-100">{t('home.valeursTransparence')}</h3>
              <p className="text-gray-400 text-sm">{t('home.valeursTransparenceDesc')}</p>
            </Card>
            <Card variant="default" className="text-center p-6">
              <Shield className="w-10 h-10 text-gold-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-100">{t('home.valeursProfessionnalisme')}</h3>
              <p className="text-gray-400 text-sm">{t('home.valeursProfessionnalismeDesc')}</p>
            </Card>
            <Card variant="default" className="text-center p-6">
              <Heart className="w-10 h-10 text-gold-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-100">{t('home.valeursEngagement')}</h3>
              <p className="text-gray-400 text-sm">{t('home.valeursEngagementDesc')}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20 bg-navy-800/50 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16 text-gray-100">
            {t('home.temoignages')}
          </h2>
          <div className="relative max-w-4xl mx-auto px-8 md:px-0">
            <Card variant="glass" className="p-8 md:p-12">
              <div className="flex items-center justify-center mb-6">
                <Quote className="w-12 h-12 text-gold-500" />
              </div>
              <div className="text-center mb-8">
                <p className="text-lg md:text-xl text-gray-300 italic mb-6">
                  "{temoignages[currentTestimonial].citation}"
                </p>
                <div className="flex items-center justify-center gap-4">
                  {temoignages[currentTestimonial].photo ? (
                    <img
                      src={temoignages[currentTestimonial].photo}
                      alt={temoignages[currentTestimonial].nom}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gold-500"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-navy-700 border-2 border-gold-500/50 flex items-center justify-center">
                      <Users className="w-8 h-8 text-gold-500" />
                    </div>
                  )}
                  <div className="text-left">
                    <p className="font-semibold text-gray-100">{temoignages[currentTestimonial].nom}</p>
                    <p className="text-sm text-gray-400">{temoignages[currentTestimonial].fonction}</p>
                    <p className="text-sm text-gold-500">{temoignages[currentTestimonial].entreprise}</p>
                  </div>
                </div>
              </div>
              {/* Indicateurs */}
              <div className="flex justify-center gap-2 mb-6">
                {temoignages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentTestimonial ? 'bg-gold-500 w-8' : 'bg-navy-600 w-2'
                    }`}
                    aria-label={`Témoignage ${index + 1}`}
                  />
                ))}
              </div>
            </Card>
            {/* Boutons navigation - masqués sur mobile */}
            <button
              onClick={prevTestimonial}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2 rounded-full bg-navy-700 border border-navy-600 shadow-lg hover:bg-navy-600 hover:border-gold-500/50 transition-all z-10"
              aria-label="Témoignage précédent"
            >
              <ChevronLeft className="w-6 h-6 text-gray-300" />
            </button>
            <button
              onClick={nextTestimonial}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-2 rounded-full bg-navy-700 border border-navy-600 shadow-lg hover:bg-navy-600 hover:border-gold-500/50 transition-all z-10"
              aria-label="Témoignage suivant"
            >
              <ChevronRight className="w-6 h-6 text-gray-300" />
            </button>
            {/* Boutons navigation mobile */}
            <div className="md:hidden flex justify-between items-center mt-4">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-navy-700 border border-navy-600 shadow-md hover:bg-navy-600 transition-colors"
                aria-label="Témoignage précédent"
              >
                <ChevronLeft className="w-5 h-5 text-gray-300" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-navy-700 border border-navy-600 shadow-md hover:bg-navy-600 transition-colors"
                aria-label="Témoignage suivant"
              >
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-navy-800 via-navy-900 to-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-100">
            Prêt à <span className="text-gold-500">transformer</span> votre carrière ?
          </h2>
          <p className="text-xl mb-10 text-gray-400 max-w-2xl mx-auto">
            Découvrez la différence d'une plateforme de recrutement véritablement professionnelle.
          </p>
          <Link to="/register">
            <Button variant="gold" size="lg" className="px-10">
              Rejoindre maintenant
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
