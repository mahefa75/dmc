import { Header, Sidebar } from '../../components/Layout'
import { Card, Badge } from '../../components/UI'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'

const EntrepriseAbonnement = () => {
  const { user } = useAuth()
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="entreprise" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">{t('entreprise.abonnement')}</h1>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Abonnement actuel</h2>
            <div className="space-y-2">
              <p><strong>Formule:</strong> {user?.abonnement || 'Basique'}</p>
              <p><strong>Date de début:</strong> {user?.dateDebut ? new Date(user.dateDebut).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Date de fin:</strong> {user?.dateFin ? new Date(user.dateFin).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Statut:</strong> <Badge variant={user?.statut === 'actif' ? 'success' : 'warning'}>{user?.statut || 'actif'}</Badge></p>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default EntrepriseAbonnement





