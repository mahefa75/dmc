import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Header, Sidebar } from '../../components/Layout'
import { Card, Input, Select, Button, FileUpload, Badge } from '../../components/UI'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useToast } from '../../components/UI/Toast'
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Languages, Award, Plus, Trash2, Upload, Save, X, Eye, FileText
} from 'lucide-react'

const AdminCandidatForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { users, addUser, updateUser } = useData()
  const { t } = useLanguage()
  const { showToast, ToastContainer } = useToast()
  
  // État du formulaire complet format LinkedIn
  const [formData, setFormData] = useState({
    // Informations personnelles
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    sexe: '',
    nationalite: 'Malgache',
    adresse: '',
    localisation: '',
    photo: null,
    
    // Informations professionnelles
    titrePoste: '',
    secteur: '',
    niveauEtudes: '',
    experienceAnnees: 0,
    disponibilite: 'immediate',
    pretentionSalariale: '',
    
    // Collections
    experiences: [],
    formations: [],
    competences: [],
    langues: [],
    
    // Documents
    cv: null,
    lettreMotivation: null,
    
    // Statut
    statut: 'actif',
    
    // Accès
    password: '',
    role: 'candidat'
  })

  // États pour les sous-formulaires
  const [newExperience, setNewExperience] = useState({ poste: '', entreprise: '', dateDebut: '', dateFin: '', description: '' })
  const [newFormation, setNewFormation] = useState({ diplome: '', etablissement: '', annee: '' })
  const [newCompetence, setNewCompetence] = useState('')
  const [newLangue, setNewLangue] = useState({ langue: '', niveau: 'Intermédiaire' })

  // Onglet actif
  const [activeTab, setActiveTab] = useState('personal')

  useEffect(() => {
    if (id && id !== 'nouveau') {
      const user = users.find(u => u.id === id)
      if (user) {
        setFormData({
          ...formData,
          ...user,
          experiences: user.experiences || [],
          formations: user.formations || [],
          competences: user.competences || [],
          langues: user.langues || []
        })
      }
    }
  }, [id, users])

  // Générer un mot de passe aléatoire
  const generatePassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
    let password = ''
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData({ ...formData, password })
    showToast(t('admin.passwordGenerated'), 'success')
  }

  // Ajouter une expérience
  const addExperience = () => {
    if (newExperience.poste && newExperience.entreprise) {
      setFormData({
        ...formData,
        experiences: [...formData.experiences, { ...newExperience, id: Date.now() }]
      })
      setNewExperience({ poste: '', entreprise: '', dateDebut: '', dateFin: '', description: '' })
    }
  }

  // Supprimer une expérience
  const removeExperience = (expId) => {
    setFormData({
      ...formData,
      experiences: formData.experiences.filter(e => e.id !== expId)
    })
  }

  // Ajouter une formation
  const addFormation = () => {
    if (newFormation.diplome && newFormation.etablissement) {
      setFormData({
        ...formData,
        formations: [...formData.formations, { ...newFormation, id: Date.now() }]
      })
      setNewFormation({ diplome: '', etablissement: '', annee: '' })
    }
  }

  // Supprimer une formation
  const removeFormation = (formId) => {
    setFormData({
      ...formData,
      formations: formData.formations.filter(f => f.id !== formId)
    })
  }

  // Ajouter une compétence
  const addCompetence = () => {
    if (newCompetence && !formData.competences.includes(newCompetence)) {
      setFormData({
        ...formData,
        competences: [...formData.competences, newCompetence]
      })
      setNewCompetence('')
    }
  }

  // Supprimer une compétence
  const removeCompetence = (comp) => {
    setFormData({
      ...formData,
      competences: formData.competences.filter(c => c !== comp)
    })
  }

  // Ajouter une langue
  const addLangue = () => {
    if (newLangue.langue) {
      setFormData({
        ...formData,
        langues: [...formData.langues, { ...newLangue, id: Date.now() }]
      })
      setNewLangue({ langue: '', niveau: 'Intermédiaire' })
    }
  }

  // Supprimer une langue
  const removeLangue = (langId) => {
    setFormData({
      ...formData,
      langues: formData.langues.filter(l => l.id !== langId)
    })
  }

  const handleSubmit = () => {
    // Validation
    if (!formData.nom || !formData.prenom || !formData.email) {
      showToast(t('admin.fillRequiredFields'), 'error')
      return
    }

    if (id && id !== 'nouveau') {
      updateUser(id, formData)
      showToast(t('admin.candidateUpdated'), 'success')
    } else {
      // Générer un password si vide
      const password = formData.password || 'candidat' + Date.now().toString().slice(-4)
      addUser({ 
        ...formData, 
        id: 'cand-' + Date.now().toString(), 
        role: 'candidat',
        password,
        createdAt: new Date().toISOString()
      })
      showToast(t('admin.candidateCreated'), 'success')
    }
    navigate('/admin/candidats')
  }

  const tabs = [
    { id: 'personal', label: t('admin.personalInfo'), icon: User },
    { id: 'professional', label: t('admin.professionalInfo'), icon: Briefcase },
    { id: 'experiences', label: t('admin.experiences'), icon: Briefcase },
    { id: 'formations', label: t('admin.formations'), icon: GraduationCap },
    { id: 'skills', label: t('admin.skills'), icon: Award },
    { id: 'documents', label: t('admin.documents'), icon: FileText },
    { id: 'access', label: t('admin.accessCredentials'), icon: Eye }
  ]

  return (
    <div className="h-screen flex flex-col bg-navy-900 overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role="admin" />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-100">
              {id === 'nouveau' ? t('admin.newCandidate') : t('admin.editCandidate')}
          </h1>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => navigate('/admin/candidats')}>
                <X className="w-4 h-4 mr-2" />
                {t('common.cancel')}
              </Button>
              <Button variant="gold" onClick={handleSubmit}>
                <Save className="w-4 h-4 mr-2" />
                {t('common.save')}
              </Button>
            </div>
          </div>

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
            {/* Onglet Informations personnelles */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
                  <User className="w-5 h-5 text-gold-500" />
                  {t('admin.personalInfo')}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                    label={t('admin.lastName') + ' *'}
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                required
              />
              <Input
                    label={t('admin.firstName') + ' *'}
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                required
              />
              <Input
                    label={t('admin.email') + ' *'}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                    label={t('admin.phone')}
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              />
                  <Input
                    label={t('admin.birthDate')}
                    type="date"
                    value={formData.dateNaissance}
                    onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                  />
                  <Select
                    label={t('admin.gender')}
                    value={formData.sexe}
                    onChange={(e) => setFormData({ ...formData, sexe: e.target.value })}
                    options={[
                      { value: '', label: t('admin.select') },
                      { value: 'M', label: t('admin.male') },
                      { value: 'F', label: t('admin.female') }
                    ]}
                  />
                  <Input
                    label={t('admin.nationality')}
                    value={formData.nationalite}
                    onChange={(e) => setFormData({ ...formData, nationalite: e.target.value })}
                  />
                  <Input
                    label={t('admin.location')}
                    value={formData.localisation}
                    onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
                  />
                </div>
                <Input
                  label={t('admin.fullAddress')}
                  value={formData.adresse}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                />
              </div>
            )}

            {/* Onglet Informations professionnelles */}
            {activeTab === 'professional' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-gold-500" />
                  {t('admin.professionalInfo')}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={t('admin.jobTitle')}
                    value={formData.titrePoste}
                    onChange={(e) => setFormData({ ...formData, titrePoste: e.target.value })}
                    placeholder="ex: Ouvrier qualifié, Chauffeur..."
                  />
                  <Select
                    label={t('admin.sector')}
                    value={formData.secteur}
                    onChange={(e) => setFormData({ ...formData, secteur: e.target.value })}
                    options={[
                      { value: '', label: t('admin.select') },
                      { value: 'Construction', label: 'Construction' },
                      { value: 'Hôtellerie', label: 'Hôtellerie' },
                      { value: 'Agriculture', label: 'Agriculture' },
                      { value: 'Manufacture', label: 'Manufacture' },
                      { value: 'Logistique', label: 'Logistique' },
                      { value: 'Nettoyage', label: 'Nettoyage' },
                      { value: 'Sécurité', label: 'Sécurité' }
                    ]}
                  />
                  <Select
                    label={t('admin.educationLevel')}
                    value={formData.niveauEtudes}
                    onChange={(e) => setFormData({ ...formData, niveauEtudes: e.target.value })}
                    options={[
                      { value: '', label: t('admin.select') },
                      { value: 'Sans diplôme', label: 'Sans diplôme' },
                      { value: 'BEPC', label: 'BEPC' },
                      { value: 'Bac', label: 'Bac' },
                      { value: 'Bac+2', label: 'Bac+2' },
                      { value: 'Bac+3', label: 'Bac+3' },
                      { value: 'Bac+5', label: 'Bac+5' }
                    ]}
                  />
                  <Input
                    label={t('admin.yearsExperience')}
                    type="number"
                    value={formData.experienceAnnees}
                    onChange={(e) => setFormData({ ...formData, experienceAnnees: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                  <Select
                    label={t('admin.availability')}
                    value={formData.disponibilite}
                    onChange={(e) => setFormData({ ...formData, disponibilite: e.target.value })}
                    options={[
                      { value: 'immediate', label: t('admin.immediate') },
                      { value: '1mois', label: t('admin.oneMonth') },
                      { value: '3mois', label: t('admin.threeMonths') }
                    ]}
                  />
                  <Input
                    label={t('admin.salaryExpectation')}
                    value={formData.pretentionSalariale}
                    onChange={(e) => setFormData({ ...formData, pretentionSalariale: e.target.value })}
                    placeholder="ex: 25000 MUR"
                  />
                </div>
              </div>
            )}

            {/* Onglet Expériences */}
            {activeTab === 'experiences' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-gold-500" />
                  {t('admin.workExperience')}
                </h2>

                {/* Liste des expériences */}
                {formData.experiences.length > 0 && (
                  <div className="space-y-3">
                    {formData.experiences.map((exp) => (
                      <div key={exp.id} className="p-4 bg-navy-800 rounded-lg flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-100">{exp.poste}</p>
                          <p className="text-sm text-gray-400">{exp.entreprise}</p>
                          <p className="text-xs text-gray-500">{exp.dateDebut} - {exp.dateFin || t('admin.present')}</p>
                          {exp.description && <p className="text-sm text-gray-400 mt-2">{exp.description}</p>}
                        </div>
                        <button onClick={() => removeExperience(exp.id)} className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Formulaire nouvelle expérience */}
                <div className="p-4 border border-navy-600 rounded-lg space-y-4">
                  <p className="font-medium text-gray-300">{t('admin.addExperience')}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label={t('admin.position')}
                      value={newExperience.poste}
                      onChange={(e) => setNewExperience({ ...newExperience, poste: e.target.value })}
                    />
                    <Input
                      label={t('admin.company')}
                      value={newExperience.entreprise}
                      onChange={(e) => setNewExperience({ ...newExperience, entreprise: e.target.value })}
                    />
                    <Input
                      label={t('admin.startDate')}
                      type="date"
                      value={newExperience.dateDebut}
                      onChange={(e) => setNewExperience({ ...newExperience, dateDebut: e.target.value })}
                    />
                    <Input
                      label={t('admin.endDate')}
                      type="date"
                      value={newExperience.dateFin}
                      onChange={(e) => setNewExperience({ ...newExperience, dateFin: e.target.value })}
                    />
                  </div>
                  <textarea
                    placeholder={t('admin.jobDescription')}
                    value={newExperience.description}
                    onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-navy-800 border border-navy-600 rounded-lg text-gray-100 focus:outline-none focus:border-gold-500"
                  />
                  <Button variant="outline" onClick={addExperience}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('admin.add')}
                  </Button>
                </div>
              </div>
            )}

            {/* Onglet Formations */}
            {activeTab === 'formations' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-gold-500" />
                  {t('admin.educationTraining')}
                </h2>

                {/* Liste des formations */}
                {formData.formations.length > 0 && (
                  <div className="space-y-3">
                    {formData.formations.map((form) => (
                      <div key={form.id} className="p-4 bg-navy-800 rounded-lg flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-100">{form.diplome}</p>
                          <p className="text-sm text-gray-400">{form.etablissement}</p>
                          <p className="text-xs text-gray-500">{form.annee}</p>
                        </div>
                        <button onClick={() => removeFormation(form.id)} className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Formulaire nouvelle formation */}
                <div className="p-4 border border-navy-600 rounded-lg space-y-4">
                  <p className="font-medium text-gray-300">{t('admin.addFormation')}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label={t('admin.diploma')}
                      value={newFormation.diplome}
                      onChange={(e) => setNewFormation({ ...newFormation, diplome: e.target.value })}
                    />
                    <Input
                      label={t('admin.institution')}
                      value={newFormation.etablissement}
                      onChange={(e) => setNewFormation({ ...newFormation, etablissement: e.target.value })}
                    />
                    <Input
                      label={t('admin.year')}
                      value={newFormation.annee}
                      onChange={(e) => setNewFormation({ ...newFormation, annee: e.target.value })}
                    />
                  </div>
                  <Button variant="outline" onClick={addFormation}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('admin.add')}
                  </Button>
                </div>
              </div>
            )}

            {/* Onglet Compétences et Langues */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                {/* Compétences */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-gold-500" />
                    {t('admin.skills')}
                  </h2>

                  {formData.competences.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.competences.map((comp, i) => (
                        <Badge key={i} variant="default" className="flex items-center gap-1">
                          {comp}
                          <button onClick={() => removeCompetence(comp)} className="ml-1 hover:text-red-400">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Input
                      placeholder={t('admin.addSkill')}
                      value={newCompetence}
                      onChange={(e) => setNewCompetence(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCompetence()}
                    />
                    <Button variant="outline" onClick={addCompetence}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Langues */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2 mb-4">
                    <Languages className="w-5 h-5 text-gold-500" />
                    {t('admin.languages')}
                  </h2>

                  {formData.langues.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {formData.langues.map((lang) => (
                        <div key={lang.id} className="p-3 bg-navy-800 rounded-lg flex justify-between items-center">
                          <div>
                            <span className="text-gray-100">{lang.langue}</span>
                            <span className="text-gray-400 text-sm ml-2">- {lang.niveau}</span>
                          </div>
                          <button onClick={() => removeLangue(lang.id)} className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Select
                      value={newLangue.langue}
                      onChange={(e) => setNewLangue({ ...newLangue, langue: e.target.value })}
                      options={[
                        { value: '', label: t('admin.selectLanguage') },
                        { value: 'Français', label: 'Français' },
                        { value: 'Anglais', label: 'Anglais' },
                        { value: 'Malgache', label: 'Malgache' },
                        { value: 'Créole', label: 'Créole' }
                      ]}
                      className="flex-1"
                    />
                    <Select
                      value={newLangue.niveau}
                      onChange={(e) => setNewLangue({ ...newLangue, niveau: e.target.value })}
                      options={[
                        { value: 'Débutant', label: t('admin.beginner') },
                        { value: 'Intermédiaire', label: t('admin.intermediate') },
                        { value: 'Avancé', label: t('admin.advanced') },
                        { value: 'Natif', label: t('admin.native') }
                      ]}
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={addLangue}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Documents */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gold-500" />
                  {t('admin.documents')}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border border-navy-600 rounded-lg">
                    <p className="font-medium text-gray-300 mb-3">{t('admin.cvDocument')}</p>
                    <FileUpload
                      accept=".pdf,.doc,.docx"
                      onFileSelect={(file) => setFormData({ ...formData, cv: file })}
                      value={formData.cv}
                    />
                    {formData.cv && (
                      <p className="text-sm text-green-400 mt-2 flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {typeof formData.cv === 'string' ? 'CV uploadé' : formData.cv.name}
                      </p>
                    )}
                  </div>

                  <div className="p-4 border border-navy-600 rounded-lg">
                    <p className="font-medium text-gray-300 mb-3">{t('admin.coverLetter')}</p>
                    <FileUpload
                      accept=".pdf,.doc,.docx"
                      onFileSelect={(file) => setFormData({ ...formData, lettreMotivation: file })}
                      value={formData.lettreMotivation}
                    />
                  </div>
                </div>

                <div className="p-4 bg-navy-800 rounded-lg">
                  <p className="text-sm text-gray-400">
                    {t('admin.documentsInfo')}
                  </p>
                </div>
              </div>
            )}

            {/* Onglet Accès */}
            {activeTab === 'access' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-gold-500" />
                  {t('admin.accessCredentials')}
                </h2>

                <div className="p-4 bg-navy-800 rounded-lg">
                  <p className="text-sm text-gray-400 mb-4">
                    {t('admin.accessInfo')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      label={t('admin.loginEmail')}
                      value={formData.email}
                      disabled
                      className="bg-navy-700"
                    />
                    <p className="text-xs text-gray-500 mt-1">{t('admin.emailAsLogin')}</p>
                  </div>
                  <div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          label={t('admin.password')}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder={t('admin.autoGenerated')}
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={generatePassword}
                        className="mt-6"
                      >
                        {t('admin.generate')}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{t('admin.passwordInfo')}</p>
                  </div>
                </div>

                <Select
                  label={t('admin.accountStatus')}
                  value={formData.statut}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                  options={[
                    { value: 'actif', label: t('admin.active') },
                    { value: 'inactif', label: t('admin.inactive') },
                    { value: 'suspendu', label: t('admin.suspended') }
                  ]}
                />
            </div>
            )}
          </Card>
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}

export default AdminCandidatForm
