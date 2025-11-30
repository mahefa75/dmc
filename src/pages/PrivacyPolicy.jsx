import { Header, Footer } from '../components/Layout'
import { Card } from '../components/UI'
import { useLanguage } from '../contexts/LanguageContext'
import { Shield, Database, Share2, Lock, UserCheck, Cookie, Mail } from 'lucide-react'

const PrivacyPolicy = () => {
  const { t } = useLanguage()

  const sections = [
    { icon: Shield, title: t('privacy.introTitle'), text: t('privacy.introText') },
    { icon: Database, title: t('privacy.collectTitle'), text: t('privacy.collectText') },
    { icon: Share2, title: t('privacy.useTitle'), text: t('privacy.useText') },
    { icon: Lock, title: t('privacy.shareTitle'), text: t('privacy.shareText') },
    { icon: Shield, title: t('privacy.securityTitle'), text: t('privacy.securityText') },
    { icon: UserCheck, title: t('privacy.rightsTitle'), text: t('privacy.rightsText') },
    { icon: Cookie, title: t('privacy.cookiesTitle'), text: t('privacy.cookiesText') },
    { icon: Mail, title: t('privacy.contactTitle'), text: t('privacy.contactText') }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-r from-navy-800 to-navy-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-display font-bold mb-4 text-gray-100">{t('privacy.title')}</h1>
            <p className="text-xl text-gray-400">{t('privacy.subtitle')}</p>
            <p className="text-sm text-gray-500 mt-4">
              {t('privacy.lastUpdate')}: {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {sections.map((section, index) => {
                const Icon = section.icon
                return (
                  <Card key={index} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-gold-500" />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-100 mb-3">{section.title}</h2>
                        <p className="text-gray-400 leading-relaxed">{section.text}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default PrivacyPolicy

