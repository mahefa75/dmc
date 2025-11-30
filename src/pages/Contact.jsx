import { useState } from 'react'
import { Header, Footer } from '../components/Layout'
import { Input, Button, Card, FileUpload } from '../components/UI'
import { useLanguage } from '../contexts/LanguageContext'
import { useToast } from '../components/UI/Toast'

const Contact = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    objet: '',
    message: ''
  })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const { t } = useLanguage()
  const { showToast, ToastContainer } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    console.log('Envoi message contact:', formData, file)
    
    setTimeout(() => {
      setLoading(false)
      showToast(t('contact.messageSent'), 'success')
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        objet: '',
        message: ''
      })
      setFile(null)
    }, 1000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold mb-4 text-gray-100">{t('nav.contact')}</h1>
            <p className="text-gray-400">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Informations de contact */}
            <Card className="flex flex-col h-full">
              <h2 className="text-2xl font-semibold mb-6 text-gold-500">{t('contact.contactInfo')}</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold mb-2 text-gray-100">{t('contact.address')}</h3>
                  <p className="text-gray-400">
                    Antananarivo, Madagascar
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-100">{t('auth.email')}</h3>
                  <p className="text-gray-400">contact@recrutement-mg-mu.com</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-100">{t('auth.phone')}</h3>
                  <p className="text-gray-400">+261 34 00 000 00</p>
                </div>
              </div>
              {/* Carte OpenStreetMap */}
              <div className="flex-grow min-h-[300px] rounded-lg overflow-hidden border border-navy-600">
                <iframe
                  title="Localisation Antananarivo"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=47.4800%2C-18.9300%2C47.5500%2C-18.8700&layer=mapnik&marker=-18.8792%2C47.5079"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '300px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Card>

            {/* Formulaire */}
            <Card>
              <h2 className="text-2xl font-semibold mb-6 text-gold-500">{t('contact.sendMessage')}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t('auth.firstName')}
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label={t('auth.lastName')}
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Input
                  label={t('auth.email')}
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
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {t('contact.subject')}
                  </label>
                  <select
                    name="objet"
                    value={formData.objet}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-navy-800 border border-navy-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                    required
                  >
                    <option value="" className="bg-navy-800">{t('contact.selectSubject')}</option>
                    <option value="candidat" className="bg-navy-800">{t('contact.candidateQuestion')}</option>
                    <option value="entreprise" className="bg-navy-800">{t('contact.companyQuestion')}</option>
                    <option value="autre" className="bg-navy-800">{t('contact.other')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {t('contact.message')}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-2 bg-navy-800 border border-navy-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                    required
                  />
                </div>

                <FileUpload
                  label={t('contact.documentOptional')}
                  accept=".pdf,.doc,.docx"
                  onFileSelect={setFile}
                  value={file}
                />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rgpd"
                    required
                    className="mr-2"
                  />
                  <label htmlFor="rgpd" className="text-sm text-gray-400">
                    {t('contact.dataConsent')}
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? t('common.loading') : t('common.submit')}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  )
}

export default Contact
