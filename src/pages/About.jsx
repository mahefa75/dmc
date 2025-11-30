import { Link } from 'react-router-dom'
import { Header, Footer } from '../components/Layout'
import { Card, Button } from '../components/UI'
import { useLanguage } from '../contexts/LanguageContext'
import { Scale, Eye, Shield, Heart, Users, Target, Sparkles } from 'lucide-react'

const About = () => {
  const { t } = useLanguage()

  const valeurs = [
    { icon: Scale, title: t('about.valueEthics'), desc: t('about.valueEthicsDesc') },
    { icon: Eye, title: t('about.valueTransparency'), desc: t('about.valueTransparencyDesc') },
    { icon: Shield, title: t('about.valueProfessionalism'), desc: t('about.valueProfessionalismDesc') },
    { icon: Heart, title: t('about.valueCommitment'), desc: t('about.valueCommitmentDesc') }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-r from-navy-800 to-navy-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-display font-bold mb-4 text-gray-100">{t('about.title')}</h1>
            <p className="text-xl text-gray-400">{t('about.subtitle')}</p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Target className="w-12 h-12 text-gold-500" />
                  <h2 className="text-2xl font-bold text-gray-100">{t('about.missionTitle')}</h2>
                </div>
                <p className="text-gray-400 leading-relaxed">{t('about.missionText')}</p>
              </Card>
              <Card className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Sparkles className="w-12 h-12 text-gold-500" />
                  <h2 className="text-2xl font-bold text-gray-100">{t('about.visionTitle')}</h2>
                </div>
                <p className="text-gray-400 leading-relaxed">{t('about.visionText')}</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Valeurs */}
        <section className="py-16 bg-navy-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-gray-100">
              {t('about.valuesTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {valeurs.map((valeur, index) => {
                const Icon = valeur.icon
                return (
                  <Card key={index} hover className="text-center p-6">
                    <Icon className="w-12 h-12 text-gold-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-gray-100">{valeur.title}</h3>
                    <p className="text-gray-400 text-sm">{valeur.desc}</p>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Équipe */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Users className="w-16 h-16 text-gold-500 mx-auto mb-6" />
              <h2 className="text-3xl font-display font-bold mb-4 text-gray-100">{t('about.teamTitle')}</h2>
              <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed">{t('about.teamText')}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Membre 1 - Jean-Marc Dupont (Mauricien) */}
              <Card hover className="text-center p-6">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-gold-500/30">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" 
                    alt={t('about.team1Name')}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-100 mb-1">{t('about.team1Name')}</h3>
                <p className="text-gold-500 font-medium">{t('about.team1Role')}</p>
              </Card>
              {/* Membre 2 - Marie Razafindrabe (Malgache) */}
              <Card hover className="text-center p-6">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-gold-500/30">
                  <img 
                    src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=face" 
                    alt={t('about.team2Name')}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-100 mb-1">{t('about.team2Name')}</h3>
                <p className="text-gold-500 font-medium">{t('about.team2Role')}</p>
              </Card>
              {/* Membre 3 - Patrick Ramanantsoa (Malgache) */}
              <Card hover className="text-center p-6">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-gold-500/30">
                  <img 
                    src="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=200&h=200&fit=crop&crop=face" 
                    alt={t('about.team3Name')}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-100 mb-1">{t('about.team3Name')}</h3>
                <p className="text-gold-500 font-medium">{t('about.team3Role')}</p>
              </Card>
              {/* Membre 4 - Sonia Andriamahefa (Malgache) */}
              <Card hover className="text-center p-6">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-gold-500/30">
                  <img 
                    src="https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=200&h=200&fit=crop&crop=face" 
                    alt={t('about.team4Name')}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-100 mb-1">{t('about.team4Name')}</h3>
                <p className="text-gold-500 font-medium">{t('about.team4Role')}</p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-navy-800 via-navy-900 to-navy-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-100">{t('about.contactCta')}</h2>
            <Link to="/contact">
              <Button variant="gold" size="lg">{t('nav.contact')}</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default About

