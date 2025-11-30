import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Header, Sidebar } from '../../components/Layout'
import { Card, Input, Select, Button, Badge, FileUpload } from '../../components/UI'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useToast } from '../../components/UI/Toast'
import { 
  Save, X, Eye, Briefcase, MapPin, Euro, Calendar, 
  FileText, Building, Users, CheckCircle, Image, Upload
} from 'lucide-react'

const AdminOffreForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { offres, addOffre, updateOffre, users } = useData()
  const { t } = useLanguage()
  const { showToast, ToastContainer } = useToast()
  
  const [activeTab, setActiveTab] = useState('general')
  const [showPreview, setShowPreview] = useState(false)
  
  const [formData, setFormData] = useState({
    // Informations générales
    titre: '',
    entrepriseId: '',
    entrepriseNom: '',
    secteur: '',
    localisation: '',
    typeContrat: '',
    
    // Description
    description: '',
    missions: '',
    profilRecherche: '',
    
    // Conditions
    salaire: '',
    salaireMin: '',
    salaireMax: '',
    devise: 'MUR',
    niveauEtudes: '',
    experienceMin: 0,
    avantages: '',
    
    // Paramètres
    statut: 'brouillon',
    dateExpiration: '',
    urgent: false,
    featured: false,
    
    // Visuels
    logo: null,
    bannerImage: null
  })

  const entreprises = users.filter(u => u.role === 'entreprise')

  useEffect(() => {
    if (id) {
      const offre = offres.find(o => o.id === id)
      if (offre) {
        setFormData({
          ...formData,
          ...offre
        })
      }
    }
  }, [id, offres])

  const handleSubmit = (publishNow = false) => {
    // Validation
    if (!formData.titre || !formData.secteur || !formData.localisation || !formData.typeContrat) {
      showToast(t('admin.fillRequiredFields'), 'error')
      return
    }

    const dataToSave = {
      ...formData,
      statut: publishNow ? 'active' : formData.statut,
      datePublication: publishNow ? new Date().toISOString() : formData.datePublication
    }

    if (id) {
      updateOffre(id, dataToSave)
      showToast(t('admin.offresUpdated'), 'success')
    } else {
      addOffre({ 
        ...dataToSave, 
        id: 'offre-' + Date.now().toString(),
        dateCreation: new Date().toISOString(),
        candidatures: 0
      })
      showToast(publishNow ? t('admin.offrePublished') : t('admin.offresCreated'), 'success')
    }
    navigate('/admin/offres')
  }

  const handleSaveDraft = () => {
    setFormData({ ...formData, statut: 'brouillon' })
    handleSubmit(false)
  }

  const handlePublish = () => {
    handleSubmit(true)
  }

  const isEditMode = !!id

  const tabs = [
    { id: 'general', label: t('admin.generalInfo') || 'Général', icon: Briefcase },
    { id: 'description', label: t('admin.description') || 'Description', icon: FileText },
    { id: 'conditions', label: t('admin.conditions') || 'Conditions', icon: Euro },
    { id: 'settings', label: t('admin.settings') || 'Paramètres', icon: CheckCircle },
    { id: 'visuals', label: t('admin.visuals') || 'Visuels', icon: Image }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="flex-1 p-8 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-100">
              {isEditMode ? t('admin.offresEditTitle') : t('admin.offresNewTitle')}
            </h1>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => navigate('/admin/offres')}>
                <X className="w-4 h-4 mr-2" />
                {t('common.cancel')}
              </Button>
              <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Masquer aperçu' : 'Aperçu'}
              </Button>
              <Button variant="secondary" onClick={handleSaveDraft}>
                <Save className="w-4 h-4 mr-2" />
                Brouillon
              </Button>
              <Button variant="gold" onClick={handlePublish}>
                <Upload className="w-4 h-4 mr-2" />
                Publier
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulaire principal */}
            <div className={showPreview ? 'lg:col-span-2' : 'lg:col-span-3'}>
              {/* Onglets */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {tabs.map(tab => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? 'bg-gold-500 text-navy-900'
                          : 'bg-navy-800 text-gray-300 hover:bg-navy-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>

              <Card>
                {/* Onglet Général */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-gold-500" />
                      Informations générales
                    </h2>

                    <Input
                      label="Titre du poste *"
                      value={formData.titre}
                      onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                      placeholder="ex: Ouvrier qualifié en construction"
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Entreprise"
                        value={formData.entrepriseId}
                        onChange={(e) => {
                          const entreprise = entreprises.find(ent => ent.id === e.target.value)
                          setFormData({ 
                            ...formData, 
                            entrepriseId: e.target.value,
                            entrepriseNom: entreprise?.nom || ''
                          })
                        }}
                        options={[
                          { value: '', label: 'Sélectionner une entreprise' },
                          ...entreprises.map(e => ({ value: e.id, label: e.nom || e.email }))
                        ]}
                      />
                      <Input
                        label="Nom de l'entreprise (manuel)"
                        value={formData.entrepriseNom}
                        onChange={(e) => setFormData({ ...formData, entrepriseNom: e.target.value })}
                        placeholder="Nom de l'entreprise"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Secteur d'activité *"
                        value={formData.secteur}
                        onChange={(e) => setFormData({ ...formData, secteur: e.target.value })}
                        options={[
                          { value: '', label: 'Sélectionner' },
                          { value: 'Construction', label: 'Construction' },
                          { value: 'Hôtellerie', label: 'Hôtellerie' },
                          { value: 'Agriculture', label: 'Agriculture' },
                          { value: 'Manufacture', label: 'Manufacture' },
                          { value: 'Logistique', label: 'Logistique' },
                          { value: 'Nettoyage', label: 'Nettoyage' },
                          { value: 'Sécurité', label: 'Sécurité' },
                          { value: 'Restauration', label: 'Restauration' },
                          { value: 'Commerce', label: 'Commerce' }
                        ]}
                        required
                      />
                      <Input
                        label="Localisation *"
                        value={formData.localisation}
                        onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
                        placeholder="ex: Port-Louis, Maurice"
                        required
                      />
                    </div>

                    <Select
                      label="Type de contrat *"
                      value={formData.typeContrat}
                      onChange={(e) => setFormData({ ...formData, typeContrat: e.target.value })}
                      options={[
                        { value: '', label: 'Sélectionner' },
                        { value: 'CDI', label: 'CDI - Contrat à durée indéterminée' },
                        { value: 'CDD', label: 'CDD - Contrat à durée déterminée' },
                        { value: 'Intérim', label: 'Intérim' },
                        { value: 'Saisonnier', label: 'Saisonnier' }
                      ]}
                      required
                    />
                  </div>
                )}

                {/* Onglet Description */}
                {activeTab === 'description' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gold-500" />
                      Description du poste
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Description générale *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-2 bg-navy-800 border border-navy-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                        placeholder="Décrivez le poste, le contexte, l'environnement de travail..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Missions principales
                      </label>
                      <textarea
                        value={formData.missions}
                        onChange={(e) => setFormData({ ...formData, missions: e.target.value })}
                        rows={5}
                        className="w-full px-4 py-2 bg-navy-800 border border-navy-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                        placeholder="- Mission 1&#10;- Mission 2&#10;- Mission 3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Profil recherché
                      </label>
                      <textarea
                        value={formData.profilRecherche}
                        onChange={(e) => setFormData({ ...formData, profilRecherche: e.target.value })}
                        rows={5}
                        className="w-full px-4 py-2 bg-navy-800 border border-navy-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                        placeholder="Décrivez le profil idéal, les qualités requises..."
                      />
                    </div>
                  </div>
                )}

                {/* Onglet Conditions */}
                {activeTab === 'conditions' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
                      <Euro className="w-5 h-5 text-gold-500" />
                      Conditions & Rémunération
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Salaire minimum"
                        type="number"
                        value={formData.salaireMin}
                        onChange={(e) => setFormData({ ...formData, salaireMin: e.target.value })}
                        placeholder="ex: 20000"
                      />
                      <Input
                        label="Salaire maximum"
                        type="number"
                        value={formData.salaireMax}
                        onChange={(e) => setFormData({ ...formData, salaireMax: e.target.value })}
                        placeholder="ex: 35000"
                      />
                      <Select
                        label="Devise"
                        value={formData.devise}
                        onChange={(e) => setFormData({ ...formData, devise: e.target.value })}
                        options={[
                          { value: 'MUR', label: 'MUR - Roupie mauricienne' },
                          { value: 'EUR', label: 'EUR - Euro' },
                          { value: 'USD', label: 'USD - Dollar US' }
                        ]}
                      />
                    </div>

                    <Input
                      label="Salaire affiché (texte libre)"
                      value={formData.salaire}
                      onChange={(e) => setFormData({ ...formData, salaire: e.target.value })}
                      placeholder="ex: 25 000 - 35 000 MUR/mois + avantages"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Niveau d'études requis"
                        value={formData.niveauEtudes}
                        onChange={(e) => setFormData({ ...formData, niveauEtudes: e.target.value })}
                        options={[
                          { value: '', label: 'Non spécifié' },
                          { value: 'Sans diplôme', label: 'Sans diplôme' },
                          { value: 'BEPC', label: 'BEPC' },
                          { value: 'Bac', label: 'Bac' },
                          { value: 'Bac+2', label: 'Bac+2' },
                          { value: 'Bac+3', label: 'Bac+3' },
                          { value: 'Bac+5', label: 'Bac+5 et plus' }
                        ]}
                      />
                      <Input
                        label="Expérience minimum (années)"
                        type="number"
                        value={formData.experienceMin}
                        onChange={(e) => setFormData({ ...formData, experienceMin: parseInt(e.target.value) || 0 })}
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Avantages
                      </label>
                      <textarea
                        value={formData.avantages}
                        onChange={(e) => setFormData({ ...formData, avantages: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 bg-navy-800 border border-navy-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                        placeholder="- Logement fourni&#10;- Transport pris en charge&#10;- Assurance santé&#10;- Prime de performance"
                      />
                    </div>
                  </div>
                )}

                {/* Onglet Paramètres */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-gold-500" />
                      Paramètres de publication
                    </h2>

                    <Select
                      label="Statut"
                      value={formData.statut}
                      onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                      options={[
                        { value: 'brouillon', label: '📝 Brouillon' },
                        { value: 'active', label: '✅ Active (publiée)' },
                        { value: 'expiree', label: '⏰ Expirée' },
                        { value: 'pourvue', label: '🎉 Pourvue' },
                        { value: 'archivee', label: '📁 Archivée' }
                      ]}
                    />

                    <Input
                      label="Date d'expiration"
                      type="date"
                      value={formData.dateExpiration}
                      onChange={(e) => setFormData({ ...formData, dateExpiration: e.target.value })}
                    />

                    <div className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.urgent}
                          onChange={(e) => setFormData({ ...formData, urgent: e.target.checked })}
                          className="w-5 h-5 rounded border-navy-600 bg-navy-800 text-gold-500 focus:ring-gold-500"
                        />
                        <div>
                          <p className="text-gray-200 font-medium">🔥 Offre urgente</p>
                          <p className="text-sm text-gray-400">L'offre sera mise en avant comme urgente</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-5 h-5 rounded border-navy-600 bg-navy-800 text-gold-500 focus:ring-gold-500"
                        />
                        <div>
                          <p className="text-gray-200 font-medium">⭐ Offre à la une</p>
                          <p className="text-sm text-gray-400">L'offre sera affichée en priorité sur la page d'accueil</p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Onglet Visuels */}
                {activeTab === 'visuals' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
                      <Image className="w-5 h-5 text-gold-500" />
                      Visuels de l'offre
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Logo de l'entreprise
                        </label>
                        <FileUpload
                          accept="image/*"
                          onFileSelect={(file) => setFormData({ ...formData, logo: file })}
                          value={formData.logo}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Image de bannière
                        </label>
                        <FileUpload
                          accept="image/*"
                          onFileSelect={(file) => setFormData({ ...formData, bannerImage: file })}
                          value={formData.bannerImage}
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-navy-800 rounded-lg">
                      <p className="text-sm text-gray-400">
                        💡 Un logo et une bannière attractifs augmentent significativement le taux de clics sur vos offres.
                        Formats recommandés : PNG, JPG. Taille max : 5MB.
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Aperçu */}
            {showPreview && (
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-gold-500" />
                    Aperçu de l'offre
                  </h3>
                  
                  <div className="border border-navy-600 rounded-lg p-4 space-y-4">
                    {formData.urgent && (
                      <Badge variant="danger">🔥 Urgent</Badge>
                    )}
                    {formData.featured && (
                      <Badge variant="warning">⭐ À la une</Badge>
                    )}
                    
                    <h4 className="text-xl font-bold text-gray-100">
                      {formData.titre || 'Titre du poste'}
                    </h4>
                    
                    <p className="text-gold-500 font-medium">
                      {formData.entrepriseNom || 'Nom de l\'entreprise'}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {formData.localisation && (
                        <span className="flex items-center gap-1 text-sm text-gray-400">
                          <MapPin className="w-4 h-4" />
                          {formData.localisation}
                        </span>
                      )}
                      {formData.typeContrat && (
                        <Badge variant="info">{formData.typeContrat}</Badge>
                      )}
                      {formData.secteur && (
                        <Badge variant="default">{formData.secteur}</Badge>
                      )}
                    </div>
                    
                    {formData.salaire && (
                      <p className="text-lg font-semibold text-green-400">
                        {formData.salaire}
                      </p>
                    )}
                    
                    {formData.description && (
                      <p className="text-sm text-gray-400 line-clamp-4">
                        {formData.description}
                      </p>
                    )}

                    <div className="pt-4 border-t border-navy-600">
                      <Badge variant={formData.statut === 'active' ? 'success' : 'warning'}>
                        {formData.statut === 'active' ? '✅ Publiée' : `📝 ${formData.statut || 'Brouillon'}`}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}

export default AdminOffreForm
