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

    // Simulation d'envoi
    console.log('Envoi message contact:', formData, file)
    
    setTimeout(() => {
      setLoading(false)
      showToast('Message envoyé avec succès !', 'success')
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{t('nav.contact')}</h1>
            <p className="text-gray-600">
              Contactez-nous pour toute question ou demande d'information
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Informations de contact */}
            <Card>
              <h2 className="text-2xl font-semibold mb-6">Informations de contact</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Adresse</h3>
                  <p className="text-gray-600">
                    Antananarivo, Madagascar
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-gray-600">contact@recrutement-mg-mu.com</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Téléphone</h3>
                  <p className="text-gray-600">+261 34 00 000 00</p>
                </div>
              </div>
            </Card>

            {/* Formulaire */}
            <Card>
              <h2 className="text-2xl font-semibold mb-6">Envoyer un message</h2>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Objet
                  </label>
                  <select
                    name="objet"
                    value={formData.objet}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionner un objet</option>
                    <option value="candidat">Question candidat</option>
                    <option value="entreprise">Question entreprise</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <FileUpload
                  label="Document (optionnel)"
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
                  <label htmlFor="rgpd" className="text-sm text-gray-600">
                    J'accepte que mes données soient traitées
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
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





