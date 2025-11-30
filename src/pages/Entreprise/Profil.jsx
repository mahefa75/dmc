import { useState, useEffect } from 'react'
import { Header, Sidebar } from '../../components/Layout'
import { Card, Input, Button, Select, FileUpload } from '../../components/UI'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useToast } from '../../components/UI/Toast'

const EntrepriseProfil = () => {
  const { user, updateUser } = useAuth()
  const { t } = useLanguage()
  const { showToast, ToastContainer } = useToast()
  const [formData, setFormData] = useState({
    nomEntreprise: '',
    secteur: '',
    adresse: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    logo: null
  })

  useEffect(() => {
    if (user) {
      setFormData({
        nomEntreprise: user.nomEntreprise || '',
        secteur: user.secteur || '',
        adresse: user.adresse || '',
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        telephone: user.telephone || '',
        logo: user.logo || null
      })
    }
  }, [user])

  const handleSave = () => {
    updateUser(formData)
    showToast('Profil mis à jour avec succès', 'success')
  }

  const secteurs = ['Construction', 'Hôtellerie', 'Agriculture', 'Manufacture', 'Logistique', 'Nettoyage', 'Sécurité', 'Autre']

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="entreprise" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-display font-bold mb-8 text-gray-100">Mon profil</h1>

          <Card>
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-100">Informations de l'entreprise</h2>
                <div className="space-y-4">
                  <Input
                    label="Nom de l'entreprise"
                    value={formData.nomEntreprise}
                    onChange={(e) => setFormData({ ...formData, nomEntreprise: e.target.value })}
                    required
                  />
                  <Select
                    label="Secteur d'activité"
                    value={formData.secteur}
                    onChange={(e) => setFormData({ ...formData, secteur: e.target.value })}
                    options={['', ...secteurs]}
                    required
                  />
                  <Input
                    label="Adresse"
                    value={formData.adresse}
                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                  />
                  <FileUpload
                    label="Logo de l'entreprise"
                    accept=".jpg,.jpeg,.png,.svg"
                    onFileSelect={(file) => setFormData({ ...formData, logo: file })}
                    value={formData.logo ? { name: formData.logo.name || 'logo.png', size: formData.logo.size || 0 } : null}
                  />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-100">Informations du contact</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Prénom"
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      required
                    />
                    <Input
                      label="Nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      required
                    />
                  </div>
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Téléphone"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    required
                  />
                </div>
              </div>

              {user?.abonnement && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-100">Abonnement</h2>
                  <div className="bg-navy-800 p-4 rounded-lg border border-navy-600">
                    <p className="text-gray-100">
                      <strong>Type:</strong> {user.abonnement}
                    </p>
                    {user.dateFin && (
                      <p className="text-gray-100 mt-2">
                        <strong>Date d'expiration:</strong> {new Date(user.dateFin).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                    <p className="text-gray-100 mt-2">
                      <strong>Statut:</strong> {user.statut === 'actif' ? 'Actif' : 'Expiré'}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button onClick={handleSave} variant="gold">
                  Enregistrer les modifications
                </Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}

export default EntrepriseProfil

