import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Header, Sidebar } from '../../components/Layout'
import { Card, Input, Select, Button } from '../../components/UI'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useToast } from '../../components/UI/Toast'

const AdminOffreForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { offres, addOffre, updateOffre } = useData()
  const { t } = useLanguage()
  const { showToast, ToastContainer } = useToast()
  const [formData, setFormData] = useState({
    titre: '',
    secteur: '',
    localisation: '',
    typeContrat: '',
    description: '',
    salaire: '',
    statut: 'active'
  })

  useEffect(() => {
    if (id) {
      const offre = offres.find(o => o.id === id)
      if (offre) setFormData(offre)
    }
  }, [id, offres])

  const handleSubmit = () => {
    if (id) {
      updateOffre(id, formData)
      showToast(t('admin.offresUpdated'), 'success')
    } else {
      addOffre({ ...formData, id: Date.now().toString(), datePublication: new Date().toISOString() })
      showToast(t('admin.offresCreated'), 'success')
    }
    navigate('/admin/offres')
  }

  const isEditMode = !!id

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-display font-bold mb-8 text-gray-100">
            {isEditMode ? t('admin.offresEditTitle') : t('admin.offresNewTitle')}
          </h1>

          <Card>
            <div className="space-y-4">
              <Input
                label="Titre"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
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
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 bg-navy-800 border border-navy-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                  required
                />
              </div>
              <Input
                label="Salaire"
                type="number"
                value={formData.salaire}
                onChange={(e) => setFormData({ ...formData, salaire: e.target.value })}
              />
              <Select
                label="Statut"
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                options={['active', 'expiree', 'pourvue']}
              />
              <div className="flex gap-4 pt-4">
                <Button onClick={handleSubmit} variant="gold">Enregistrer</Button>
                <Button onClick={() => navigate('/admin/offres')} variant="secondary">Annuler</Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}

export default AdminOffreForm
