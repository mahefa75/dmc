import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, Sidebar } from '../../components/Layout'
import { Card, Input, Select, Button, FileUpload } from '../../components/UI'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useToast } from '../../components/UI/Toast'
import { Plus, X } from 'lucide-react'

const EntrepriseNouvelleDemande = () => {
  const { user } = useAuth()
  const { addDemandeEntreprise } = useData()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { showToast, ToastContainer } = useToast()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    posteRecherche: '',
    secteur: '',
    localisation: '',
    typeContrat: '',
    nombrePostes: '1',
    salaireMin: '',
    salaireMax: '',
    dateDebut: '',
    experienceMin: '',
    niveauEtudes: '',
    competences: [],
    competencesSouhaitees: [],
    langues: [],
    ageMin: '',
    ageMax: '',
    sexe: '',
    description: '',
    missions: '',
    responsabilites: '',
    conditions: '',
    avantages: '',
    evolution: '',
    urgence: 'normal',
    delai: '',
    budget: '',
    signatureNom: ''
  })
  const [file, setFile] = useState(null)
  const [autresDocuments, setAutresDocuments] = useState(null)
  const [newCompetence, setNewCompetence] = useState('')
  const [newCompetenceSouhaitee, setNewCompetenceSouhaitee] = useState('')
  const [newLangue, setNewLangue] = useState('')

  const validateStep = (stepNum) => {
    switch (stepNum) {
      case 1:
        return formData.posteRecherche && formData.secteur && formData.localisation && formData.typeContrat
      case 2:
        return true // Étape optionnelle
      case 3:
        return formData.description
      case 4:
        return true // Étape optionnelle
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 5) {
        setStep(step + 1)
      }
    } else {
      showToast('Veuillez remplir tous les champs requis', 'error')
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = () => {
    const demande = {
      id: Date.now().toString(),
      entrepriseId: user.id,
      nomEntreprise: user.nomEntreprise,
      email: user.email,
      ...formData,
      fichePoste: file,
      autresDocuments: autresDocuments,
      statut: 'en_attente',
      dateCreation: new Date().toISOString()
    }

    addDemandeEntreprise(demande)
    showToast(`Demande envoyée avec succès ! Numéro: ${demande.id}`, 'success')
    setTimeout(() => {
      navigate('/entreprise/demandes')
    }, 1500)
  }

  const addCompetence = () => {
    if (newCompetence.trim()) {
      setFormData({
        ...formData,
        competences: [...formData.competences, newCompetence.trim()]
      })
      setNewCompetence('')
    }
  }

  const removeCompetence = (index) => {
    setFormData({
      ...formData,
      competences: formData.competences.filter((_, i) => i !== index)
    })
  }

  const addCompetenceSouhaitee = () => {
    if (newCompetenceSouhaitee.trim()) {
      setFormData({
        ...formData,
        competencesSouhaitees: [...formData.competencesSouhaitees, newCompetenceSouhaitee.trim()]
      })
      setNewCompetenceSouhaitee('')
    }
  }

  const removeCompetenceSouhaitee = (index) => {
    setFormData({
      ...formData,
      competencesSouhaitees: formData.competencesSouhaitees.filter((_, i) => i !== index)
    })
  }

  const addLangue = () => {
    if (newLangue.trim()) {
      setFormData({
        ...formData,
        langues: [...formData.langues, newLangue.trim()]
      })
      setNewLangue('')
    }
  }

  const removeLangue = (index) => {
    setFormData({
      ...formData,
      langues: formData.langues.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="entreprise" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-display font-bold mb-8 text-gray-100">{t('entreprise.nouvelleDemande')}</h1>

          <Card>
            <div className="mb-6">
              <div className="flex items-center justify-center w-full max-w-2xl mx-auto">
                {[1, 2, 3, 4, 5].map(s => (
                  <div key={s} className="flex items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold flex-shrink-0 z-10 ${
                      step >= s ? 'bg-gold-500 text-navy-900' : 'bg-navy-700 text-gray-400'
                    }`}>
                      {s}
                    </div>
                    {s < 5 && (
                      <div 
                        className={`h-1 flex-1 mx-1 ${step > s ? 'bg-gold-500' : 'bg-navy-700'}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Étape 1 : Informations poste */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-100">Informations sur le poste</h2>
                <Input
                  label="Intitulé du poste"
                  value={formData.posteRecherche}
                  onChange={(e) => setFormData({ ...formData, posteRecherche: e.target.value })}
                  required
                />
                <Select
                  label="Secteur"
                  value={formData.secteur}
                  onChange={(e) => setFormData({ ...formData, secteur: e.target.value })}
                  options={['', 'Construction', 'Hôtellerie', 'Agriculture', 'Manufacture', 'Logistique', 'Nettoyage', 'Sécurité']}
                  required
                />
                <Input
                  label="Localisation"
                  value={formData.localisation}
                  onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
                  required
                />
                <Select
                  label="Type de contrat"
                  value={formData.typeContrat}
                  onChange={(e) => setFormData({ ...formData, typeContrat: e.target.value })}
                  options={['', 'CDI', 'CDD', 'Intérim', 'Saisonnier']}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Nombre de postes"
                    type="number"
                    value={formData.nombrePostes}
                    onChange={(e) => setFormData({ ...formData, nombrePostes: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Salaire minimum (MUR)"
                    type="number"
                    value={formData.salaireMin}
                    onChange={(e) => setFormData({ ...formData, salaireMin: e.target.value })}
                    placeholder="Minimum"
                  />
                  <Input
                    label="Salaire maximum (MUR)"
                    type="number"
                    value={formData.salaireMax}
                    onChange={(e) => setFormData({ ...formData, salaireMax: e.target.value })}
                    placeholder="Maximum"
                  />
                </div>
                <Input
                  label="Date de début souhaitée"
                  type="date"
                  value={formData.dateDebut}
                  onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                />
                <div className="flex gap-4">
                  <Button onClick={handleNext} variant="gold">Suivant</Button>
                </div>
              </div>
            )}

            {/* Étape 2 : Profil recherché */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-100">Profil recherché</h2>
                <Select
                  label="Niveau d'études"
                  value={formData.niveauEtudes}
                  onChange={(e) => setFormData({ ...formData, niveauEtudes: e.target.value })}
                  options={['', 'Sans diplôme', 'CAP/BEP', 'BAC', 'BAC+2', 'BAC+3', 'Master']}
                />
                <Input
                  label="Expérience minimale (années)"
                  type="number"
                  value={formData.experienceMin}
                  onChange={(e) => setFormData({ ...formData, experienceMin: e.target.value })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-2">Compétences requises</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newCompetence}
                      onChange={(e) => setNewCompetence(e.target.value)}
                      placeholder="Ajouter une compétence"
                      onKeyPress={(e) => e.key === 'Enter' && addCompetence()}
                    />
                    <Button onClick={addCompetence} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.competences.map((comp, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {comp}
                        <button onClick={() => removeCompetence(index)} className="text-blue-600 hover:text-blue-800">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-2">Compétences souhaitées (bonus)</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newCompetenceSouhaitee}
                      onChange={(e) => setNewCompetenceSouhaitee(e.target.value)}
                      placeholder="Ajouter une compétence souhaitée"
                      onKeyPress={(e) => e.key === 'Enter' && addCompetenceSouhaitee()}
                    />
                    <Button onClick={addCompetenceSouhaitee} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.competencesSouhaitees.map((comp, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {comp}
                        <button onClick={() => removeCompetenceSouhaitee(index)} className="text-purple-600 hover:text-purple-800">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-2">Langues requises</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newLangue}
                      onChange={(e) => setNewLangue(e.target.value)}
                      placeholder="Ajouter une langue"
                      onKeyPress={(e) => e.key === 'Enter' && addLangue()}
                    />
                    <Button onClick={addLangue} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.langues.map((langue, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {langue}
                        <button onClick={() => removeLangue(index)} className="text-green-600 hover:text-green-800">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Âge minimum"
                    type="number"
                    value={formData.ageMin}
                    onChange={(e) => setFormData({ ...formData, ageMin: e.target.value })}
                  />
                  <Input
                    label="Âge maximum"
                    type="number"
                    value={formData.ageMax}
                    onChange={(e) => setFormData({ ...formData, ageMax: e.target.value })}
                  />
                </div>
                <Select
                  label="Sexe"
                  value={formData.sexe}
                  onChange={(e) => setFormData({ ...formData, sexe: e.target.value })}
                  options={['', 'Tous', 'Homme', 'Femme']}
                />
                <div className="flex gap-4">
                  <Button onClick={handlePrevious} variant="secondary">Précédent</Button>
                  <Button onClick={handleNext} variant="gold">Suivant</Button>
                </div>
              </div>
            )}

            {/* Étape 3 : Description détaillée */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-100">Description détaillée</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">Description du poste *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-navy-800 text-gray-100 border border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 placeholder:text-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">Missions principales</label>
                  <textarea
                    value={formData.missions}
                    onChange={(e) => setFormData({ ...formData, missions: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-navy-800 text-gray-100 border border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 placeholder:text-gray-500"
                    placeholder="Décrivez les missions principales du poste..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">Responsabilités</label>
                  <textarea
                    value={formData.responsabilites}
                    onChange={(e) => setFormData({ ...formData, responsabilites: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-navy-800 text-gray-100 border border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 placeholder:text-gray-500"
                    placeholder="Listez les responsabilités..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">Conditions de travail</label>
                  <textarea
                    value={formData.conditions}
                    onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-navy-800 text-gray-100 border border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 placeholder:text-gray-500"
                    placeholder="Horaires, environnement, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">Avantages</label>
                  <textarea
                    value={formData.avantages}
                    onChange={(e) => setFormData({ ...formData, avantages: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-navy-800 text-gray-100 border border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 placeholder:text-gray-500"
                    placeholder="Avantages offerts (salaire, logement, transport, etc.)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">Évolution de carrière</label>
                  <textarea
                    value={formData.evolution}
                    onChange={(e) => setFormData({ ...formData, evolution: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-navy-800 text-gray-100 border border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 placeholder:text-gray-500"
                    placeholder="Perspectives d'évolution..."
                  />
                </div>
                <div className="flex gap-4">
                  <Button onClick={handlePrevious} variant="secondary">Précédent</Button>
                  <Button onClick={handleNext} variant="gold">Suivant</Button>
                </div>
              </div>
            )}

            {/* Étape 4 : Documents et urgence */}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-100">Documents et urgence</h2>
                <FileUpload
                  label="Fiche de poste (PDF, Word)"
                  accept=".pdf,.doc,.docx"
                  onFileSelect={setFile}
                  value={file ? { name: file.name || 'fiche-poste.pdf', size: file.size || 0 } : null}
                />
                <FileUpload
                  label="Autres documents (contrat type, présentation entreprise)"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onFileSelect={setAutresDocuments}
                  value={autresDocuments ? { name: autresDocuments.name || 'autres-documents.pdf', size: autresDocuments.size || 0 } : null}
                />
                <Select
                  label="Niveau d'urgence"
                  value={formData.urgence}
                  onChange={(e) => setFormData({ ...formData, urgence: e.target.value })}
                  options={[
                    { value: 'normal', label: 'Normal' },
                    { value: 'urgent', label: 'Urgent' },
                    { value: 'tres_urgent', label: 'Très urgent' }
                  ]}
                />
                <Input
                  label="Délai de recrutement souhaité"
                  type="date"
                  value={formData.delai}
                  onChange={(e) => setFormData({ ...formData, delai: e.target.value })}
                />
                <Input
                  label="Budget alloué (MUR)"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="Budget total pour ce recrutement"
                />
                <div className="flex gap-4">
                  <Button onClick={handlePrevious} variant="secondary">Précédent</Button>
                  <Button onClick={handleNext} variant="gold">Suivant</Button>
                </div>
              </div>
            )}

            {/* Étape 5 : Validation */}
            {step === 5 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-100">Récapitulatif et validation</h2>
                <div className="bg-navy-800 p-6 rounded-lg space-y-4 border border-navy-600">
                  <div>
                    <h3 className="font-semibold mb-2">Informations sur le poste</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Poste:</strong> {formData.posteRecherche}</p>
                      <p><strong>Secteur:</strong> {formData.secteur}</p>
                      <p><strong>Localisation:</strong> {formData.localisation}</p>
                      <p><strong>Type de contrat:</strong> {formData.typeContrat}</p>
                      {formData.nombrePostes && <p><strong>Nombre de postes:</strong> {formData.nombrePostes}</p>}
                      {(formData.salaireMin || formData.salaireMax) && (
                        <p><strong>Salaire:</strong> {
                          formData.salaireMin && formData.salaireMax 
                            ? `${formData.salaireMin} - ${formData.salaireMax} MUR`
                            : formData.salaireMin 
                            ? `À partir de ${formData.salaireMin} MUR`
                            : `Jusqu'à ${formData.salaireMax} MUR`
                        }</p>
                      )}
                    </div>
                  </div>
                  {formData.experienceMin && (
                    <div>
                      <h3 className="font-semibold mb-2">Profil recherché</h3>
                      <div className="space-y-1 text-sm">
                        {formData.experienceMin && <p><strong>Expérience minimale:</strong> {formData.experienceMin} ans</p>}
                        {formData.niveauEtudes && <p><strong>Niveau d'études:</strong> {formData.niveauEtudes}</p>}
                        {formData.competences.length > 0 && (
                          <p><strong>Compétences requises:</strong> {formData.competences.join(', ')}</p>
                        )}
                        {formData.competencesSouhaitees.length > 0 && (
                          <p><strong>Compétences souhaitées (bonus):</strong> {formData.competencesSouhaitees.join(', ')}</p>
                        )}
                        {formData.langues.length > 0 && (
                          <p><strong>Langues:</strong> {formData.langues.join(', ')}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {formData.description && (
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-sm whitespace-pre-line">{formData.description}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold mb-2">Informations complémentaires</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Urgence:</strong> {formData.urgence}</p>
                      {formData.delai && <p><strong>Délai souhaité:</strong> {new Date(formData.delai).toLocaleDateString('fr-FR')}</p>}
                      {formData.budget && <p><strong>Budget:</strong> {formData.budget} MUR</p>}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="accept"
                      required
                      className="w-4 h-4"
                    />
                    <label htmlFor="accept" className="text-sm text-gray-100">
                      J'accepte les conditions générales et confirme l'exactitude des informations fournies
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-100 mb-2">Signature électronique</label>
                    <Input
                      label="Nom et prénom"
                      value={formData.signatureNom}
                      onChange={(e) => setFormData({ ...formData, signatureNom: e.target.value })}
                      placeholder="Votre nom et prénom"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">En saisissant votre nom, vous confirmez votre signature électronique</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button onClick={handlePrevious} variant="secondary">Précédent</Button>
                  <Button 
                    onClick={handleSubmit} 
                    variant="gold"
                    disabled={!formData.signatureNom}
                  >
                    Envoyer la demande
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}

export default EntrepriseNouvelleDemande
