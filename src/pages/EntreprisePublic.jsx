import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Header, Footer } from '../components/Layout'
import { Card, Button, Input, Select, FileUpload } from '../components/UI'
import { useLanguage } from '../contexts/LanguageContext'
import { useData } from '../contexts/DataContext'
import { useToast } from '../components/UI/Toast'
import { CheckCircle, Users, Shield, HeadphonesIcon, Star, Zap, Crown } from 'lucide-react'

const EntreprisePublic = () => {
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
    { icon: Users, titre: 'Base de CV qualifiés', desc: 'Accédez à des centaines de profils vérifiés' },
    { icon: Shield, titre: 'Présélection rigoureuse', desc: 'Nous vérifions chaque candidat pour vous' },
    { icon: HeadphonesIcon, titre: 'Support administratif', desc: 'Accompagnement complet du processus' },
    { icon: CheckCircle, titre: 'Suivi post-recrutement', desc: 'Nous restons à vos côtés après l\'embauche' }
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
    showToast('Demande envoyée ! Vous recevrez une réponse sous 48h', 'success')
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Recrutez les meilleurs talents malgaches</h1>
            <p className="text-xl mb-8 text-green-100">
              Une plateforme dédiée au recrutement de travailleurs qualifiés pour votre entreprise à Maurice
            </p>
            <Button
              variant="outline"
              size="lg"
              className="bg-white text-green-600 hover:bg-green-50"
              onClick={() => setShowForm(true)}
            >
              Demander un accès
            </Button>
          </div>
        </section>

        {/* Avantages */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Nos avantages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {avantages.map((avantage, index) => {
                const Icon = avantage.icon
                return (
                  <Card key={index} hover className="text-center">
                    <Icon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{avantage.titre}</h3>
                    <p className="text-gray-600">{avantage.desc}</p>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Nos formules */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Nos formules</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Formule Basique */}
              <Card className="relative">
                <div className="text-center mb-6">
                  <Zap className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Basique</h3>
                  <div className="text-3xl font-bold text-green-600 mb-1">15 000 MUR</div>
                  <p className="text-gray-500 text-sm">par mois</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">50 CV consultables/mois</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Recherche de profils</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Support standard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Demandes de recrutement</span>
                  </li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowForm(true)}
                >
                  Choisir cette formule
                </Button>
              </Card>

              {/* Formule Standard */}
              <Card className="relative border-2 border-green-600 transform scale-105">
                <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 rounded-bl-lg text-sm font-semibold">
                  Populaire
                </div>
                <div className="text-center mb-6">
                  <Star className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Standard</h3>
                  <div className="text-3xl font-bold text-green-600 mb-1">30 000 MUR</div>
                  <p className="text-gray-500 text-sm">par mois</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">150 CV consultables/mois</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Recherche avancée</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Messagerie illimitée</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Support prioritaire</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Suivi personnalisé</span>
                  </li>
                </ul>
                <Button
                  variant="primary"
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => setShowForm(true)}
                >
                  Choisir cette formule
                </Button>
              </Card>

              {/* Formule Premium */}
              <Card className="relative">
                <div className="text-center mb-6">
                  <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Premium</h3>
                  <div className="text-3xl font-bold text-green-600 mb-1">50 000 MUR</div>
                  <p className="text-gray-500 text-sm">par mois</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Accès illimité aux CV</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Toutes les fonctionnalités</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Support prioritaire 24/7</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Gestionnaire de compte dédié</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Formations et webinaires</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Statistiques avancées</span>
                  </li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowForm(true)}
                >
                  Choisir cette formule
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Processus */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Notre processus de recrutement</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                'Demande d\'accès',
                'Validation sous 48h',
                'Définition des besoins',
                'Proposition de profils',
                'Entretiens',
                'Finalisation'
              ].map((etape, index) => (
                <Card key={index} className="text-center">
                  <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">
                    {index + 1}
                  </div>
                  <p className="text-sm font-medium">{etape}</p>
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
                <h2 className="text-2xl font-bold">Demande d'accès entreprise</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nom de l'entreprise"
                  name="nomEntreprise"
                  value={formData.nomEntreprise}
                  onChange={handleChange}
                  required
                />

                <Select
                  label="Secteur d'activité"
                  name="secteur"
                  value={formData.secteur}
                  onChange={handleChange}
                  options={secteurs}
                  required
                />

                <Input
                  label="Adresse complète à Maurice"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Prénom du contact"
                    name="prenomContact"
                    value={formData.prenomContact}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Nom du contact"
                    name="nomContact"
                    value={formData.nomContact}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Input
                  label="Fonction du contact"
                  name="fonctionContact"
                  value={formData.fonctionContact}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Email professionnel"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Téléphone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Nombre d'employés"
                  type="number"
                  name="nombreEmployes"
                  value={formData.nombreEmployes}
                  onChange={handleChange}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Besoins en recrutement
                  </label>
                  <textarea
                    name="besoins"
                    value={formData.besoins}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <FileUpload
                  label="KBIS ou document d'enregistrement"
                  accept=".pdf,.jpg,.png"
                  onFileSelect={setFile}
                  value={file}
                />

                <p className="text-sm text-gray-600">
                  Votre demande sera examinée sous 48h. Vous recevrez un email de confirmation avec vos identifiants de connexion.
                </p>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? 'Envoi...' : 'Envoyer la demande'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Annuler
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

export default EntreprisePublic



