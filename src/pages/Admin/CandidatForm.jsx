import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Header, Sidebar } from '../../components/Layout'
import { Card, Input, Button } from '../../components/UI'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useToast } from '../../components/UI/Toast'

const AdminCandidatForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { users, addUser, updateUser } = useData()
  const { t } = useLanguage()
  const { showToast, ToastContainer } = useToast()
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    statut: 'actif'
  })

  useEffect(() => {
    if (id && id !== 'nouveau') {
      const user = users.find(u => u.id === id)
      if (user) setFormData(user)
    }
  }, [id, users])

  const handleSubmit = () => {
    if (id && id !== 'nouveau') {
      updateUser(id, formData)
      showToast('Candidat mis à jour', 'success')
    } else {
      addUser({ ...formData, id: Date.now().toString(), role: 'candidat', password: 'hash' })
      showToast('Candidat créé', 'success')
    }
    navigate('/admin/candidats')
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-display font-bold mb-8 text-gray-100">
            {id === 'nouveau' ? 'Nouveau candidat' : 'Modifier candidat'}
          </h1>

          <Card>
            <div className="space-y-4">
              <Input
                label="Nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                required
              />
              <Input
                label="Prénom"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                required
              />
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
              />
              <div className="flex gap-4 pt-4">
                <Button onClick={handleSubmit} variant="gold">Enregistrer</Button>
                <Button onClick={() => navigate('/admin/candidats')} variant="secondary">Annuler</Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}

export default AdminCandidatForm
