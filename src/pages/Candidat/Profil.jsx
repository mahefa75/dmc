import { useState, useEffect } from 'react'
import { Header, Sidebar } from '../../components/Layout'
import { Card, Input, Button, Select, FileUpload, Badge } from '../../components/UI'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useToast } from '../../components/UI/Toast'
import { Plus, X } from 'lucide-react'

const CandidatProfil = () => {
  const { user, updateUser } = useAuth()
  const { t } = useLanguage()
  const { showToast, ToastContainer } = useToast()
  const [activeTab, setActiveTab] = useState('personal')
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    sexe: '',
    adresse: { ville: '', region: '', pays: '' },
    photo: null,
    cv: null,
    lettreMotivation: null,
    cvVideo: null,
    experiences: [],
    diplomes: [],
    langues: [],
    competences: [],
    permisConduire: [],
    disponibilite: '',
    typeContratRecherche: []
  })

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        telephone: user.telephone || '',
        dateNaissance: user.dateNaissance || '',
        sexe: user.sexe || '',
        adresse: user.adresse || { ville: '', region: '', pays: '' },
        photo: user.photo || null,
        cv: user.cv || null,
        lettreMotivation: user.lettreMotivation || null,
        cvVideo: user.cvVideo || null,
        experiences: user.experiences || [],
        diplomes: user.diplomes || [],
        langues: user.langues || [],
        competences: user.competences || [],
        permisConduire: user.permisConduire || [],
        disponibilite: user.disponibilite || '',
        typeContratRecherche: user.typeContratRecherche || []
      })
    }
  }, [user])

  const handleSave = () => {
    updateUser(formData)
    showToast('Profil mis à jour avec succès', 'success')
  }

  const addExperience = () => {
    setFormData({
      ...formData,
      experiences: [...formData.experiences, {
        poste: '',
        entreprise: '',
        dateDebut: '',
        dateFin: '',
        description: '',
        secteur: ''
      }]
    })
  }

  const removeExperience = (index) => {
    setFormData({
      ...formData,
      experiences: formData.experiences.filter((_, i) => i !== index)
    })
  }

  const updateExperience = (index, field, value) => {
    const updated = [...formData.experiences]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, experiences: updated })
  }

  const addDiplome = () => {
    setFormData({
      ...formData,
      diplomes: [...formData.diplomes, {
        intitule: '',
        etablissement: '',
        annee: '',
        niveau: ''
      }]
    })
  }

  const removeDiplome = (index) => {
    setFormData({
      ...formData,
      diplomes: formData.diplomes.filter((_, i) => i !== index)
    })
  }

  const updateDiplome = (index, field, value) => {
    const updated = [...formData.diplomes]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, diplomes: updated })
  }

  const addLangue = () => {
    setFormData({
      ...formData,
      langues: [...formData.langues, { langue: '', niveau: '' }]
    })
  }

  const removeLangue = (index) => {
    setFormData({
      ...formData,
      langues: formData.langues.filter((_, i) => i !== index)
    })
  }

  const updateLangue = (index, field, value) => {
    const updated = [...formData.langues]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, langues: updated })
  }

  const tabs = [
    { id: 'personal', label: t('profil.personalInfo') },
    { id: 'documents', label: t('profil.documents') },
    { id: 'experiences', label: t('profil.experiences') },
    { id: 'diplomes', label: t('profil.diplomes') },
    { id: 'competences', label: t('profil.competences') },
    { id: 'disponibilite', label: t('profil.disponibilite') }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="candidat" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">{t('profil.title')}</h1>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-medium ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Card>
            {/* Informations personnelles */}
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <FileUpload
                  label={t('profil.photo')}
                  accept="image/*"
                  onFileSelect={(file) => {
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (e) => {
                        setFormData({ ...formData, photo: e.target.result })
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  value={formData.photo ? { name: 'photo.jpg' } : null}
                />
                {formData.photo && (
                  <img src={formData.photo} alt="Photo" className="w-32 h-32 rounded-full object-cover" />
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t('auth.lastName')}
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  />
                  <Input
                    label={t('auth.firstName')}
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  />
                </div>

                <Input
                  label={t('auth.email')}
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                <Input
                  label={t('auth.phone')}
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Date de naissance"
                    type="date"
                    value={formData.dateNaissance}
                    onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                  />
                  <Select
                    label="Sexe"
                    value={formData.sexe}
                    onChange={(e) => setFormData({ ...formData, sexe: e.target.value })}
                    options={['', 'M', 'F', 'Autre']}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="Ville"
                    value={formData.adresse.ville}
                    onChange={(e) => setFormData({
                      ...formData,
                      adresse: { ...formData.adresse, ville: e.target.value }
                    })}
                  />
                  <Input
                    label="Région"
                    value={formData.adresse.region}
                    onChange={(e) => setFormData({
                      ...formData,
                      adresse: { ...formData.adresse, region: e.target.value }
                    })}
                  />
                  <Input
                    label="Pays"
                    value={formData.adresse.pays}
                    onChange={(e) => setFormData({
                      ...formData,
                      adresse: { ...formData.adresse, pays: e.target.value }
                    })}
                  />
                </div>
              </div>
            )}

            {/* Documents */}
            {activeTab === 'documents' && (
              <div className="space-y-4">
                <FileUpload
                  label={t('profil.cv')}
                  accept=".pdf,.doc,.docx"
                  onFileSelect={(file) => setFormData({ ...formData, cv: file })}
                  value={formData.cv ? (typeof formData.cv === 'string' ? { name: 'CV.pdf', size: 0 } : formData.cv) : null}
                />
                {formData.cv && typeof formData.cv === 'string' && (
                  <p className="text-sm text-gray-600">CV actuel : CV.pdf</p>
                )}
                <FileUpload
                  label={t('profil.lettreMotivation')}
                  accept=".pdf,.doc,.docx"
                  onFileSelect={(file) => setFormData({ ...formData, lettreMotivation: file })}
                  value={formData.lettreMotivation ? (typeof formData.lettreMotivation === 'string' ? { name: 'Lettre_motivation.pdf', size: 0 } : formData.lettreMotivation) : null}
                />
                {formData.lettreMotivation && typeof formData.lettreMotivation === 'string' && (
                  <p className="text-sm text-gray-600">Lettre de motivation actuelle : Lettre_motivation.pdf</p>
                )}
                <FileUpload
                  label={t('profil.cvVideo')}
                  accept="video/*"
                  onFileSelect={(file) => setFormData({ ...formData, cvVideo: file })}
                  value={formData.cvVideo ? (typeof formData.cvVideo === 'string' ? { name: 'CV_video.mp4', size: 0 } : formData.cvVideo) : null}
                />
                {formData.cvVideo && typeof formData.cvVideo === 'string' && (
                  <p className="text-sm text-gray-600">CV vidéo actuel : CV_video.mp4</p>
                )}
              </div>
            )}

            {/* Expériences */}
            {activeTab === 'experiences' && (
              <div className="space-y-4">
                {formData.experiences.map((exp, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between mb-4">
                      <h3 className="font-semibold">Expérience {index + 1}</h3>
                      <button
                        onClick={() => removeExperience(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Poste"
                        value={exp.poste}
                        onChange={(e) => updateExperience(index, 'poste', e.target.value)}
                      />
                      <Input
                        label="Entreprise"
                        value={exp.entreprise}
                        onChange={(e) => updateExperience(index, 'entreprise', e.target.value)}
                      />
                      <Input
                        label="Date début"
                        type="date"
                        value={exp.dateDebut}
                        onChange={(e) => updateExperience(index, 'dateDebut', e.target.value)}
                      />
                      <Input
                        label="Date fin"
                        type="date"
                        value={exp.dateFin}
                        onChange={(e) => updateExperience(index, 'dateFin', e.target.value)}
                      />
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(index, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
                <Button onClick={addExperience} variant="outline">
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Ajouter une expérience
                </Button>
              </div>
            )}

            {/* Diplômes */}
            {activeTab === 'diplomes' && (
              <div className="space-y-4">
                {formData.diplomes.map((diplome, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between mb-4">
                      <h3 className="font-semibold">Diplôme {index + 1}</h3>
                      <button
                        onClick={() => removeDiplome(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Intitulé"
                        value={diplome.intitule}
                        onChange={(e) => updateDiplome(index, 'intitule', e.target.value)}
                      />
                      <Input
                        label="Établissement"
                        value={diplome.etablissement}
                        onChange={(e) => updateDiplome(index, 'etablissement', e.target.value)}
                      />
                      <Input
                        label="Année"
                        type="number"
                        value={diplome.annee}
                        onChange={(e) => updateDiplome(index, 'annee', e.target.value)}
                      />
                      <Select
                        label="Niveau"
                        value={diplome.niveau}
                        onChange={(e) => updateDiplome(index, 'niveau', e.target.value)}
                        options={['', 'CAP', 'BEP', 'BAC', 'BAC+2', 'BAC+3', 'Master']}
                      />
                    </div>
                  </Card>
                ))}
                <Button onClick={addDiplome} variant="outline">
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Ajouter un diplôme
                </Button>
              </div>
            )}

            {/* Compétences */}
            {activeTab === 'competences' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Langues parlées
                  </label>
                  {formData.langues.map((langue, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        placeholder="Langue"
                        value={langue.langue}
                        onChange={(e) => updateLangue(index, 'langue', e.target.value)}
                      />
                      <Select
                        value={langue.niveau}
                        onChange={(e) => updateLangue(index, 'niveau', e.target.value)}
                        options={['', 'Débutant', 'Intermédiaire', 'Avancé', 'Courant', 'Natif']}
                      />
                      <button
                        onClick={() => removeLangue(index)}
                        className="text-red-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <Button onClick={addLangue} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2 inline" />
                    Ajouter une langue
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permis de conduire
                  </label>
                  <div className="flex gap-2">
                    {['A', 'B', 'C', 'D'].map(permis => (
                      <label key={permis} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.permisConduire.includes(permis)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                permisConduire: [...formData.permisConduire, permis]
                              })
                            } else {
                              setFormData({
                                ...formData,
                                permisConduire: formData.permisConduire.filter(p => p !== permis)
                              })
                            }
                          }}
                          className="mr-2"
                        />
                        {permis}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Disponibilité */}
            {activeTab === 'disponibilite' && (
              <div className="space-y-4">
                <Select
                  label="Disponibilité"
                  value={formData.disponibilite}
                  onChange={(e) => setFormData({ ...formData, disponibilite: e.target.value })}
                  options={['', 'Immédiate', 'Sous 1 mois', 'Sous 3 mois', 'À discuter']}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de contrat recherché
                  </label>
                  <div className="flex gap-4">
                    {['CDI', 'CDD', 'Intérim', 'Saisonnier'].map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.typeContratRecherche.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                typeContratRecherche: [...formData.typeContratRecherche, type]
                              })
                            } else {
                              setFormData({
                                ...formData,
                                typeContratRecherche: formData.typeContratRecherche.filter(t => t !== type)
                              })
                            }
                          }}
                          className="mr-2"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave} variant="primary">
                {t('common.save')}
              </Button>
            </div>
          </Card>
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}

export default CandidatProfil





