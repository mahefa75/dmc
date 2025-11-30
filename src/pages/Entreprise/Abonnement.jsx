import { Header, Sidebar } from '../../components/Layout'
import { Card, Badge } from '../../components/UI'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'

const EntrepriseAbonnement = () => {
  const { user } = useAuth()
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="entreprise" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-display font-bold mb-8 text-gray-100">{t('entreprise.abonnement')}</h1>

          <Card>
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Abonnement actuel</h2>
            <div className="space-y-2 text-gray-300">
              <p><strong className="text-gold-500">Formule:</strong> {user?.abonnement || 'Basique'}</p>
              <p><strong className="text-gold-500">Date de début:</strong> {user?.dateDebut ? new Date(user.dateDebut).toLocaleDateString() : 'N/A'}</p>
              <p><strong className="text-gold-500">Date de fin:</strong> {user?.dateFin ? new Date(user.dateFin).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Statut:</strong> <Badge variant={user?.statut === 'actif' ? 'success' : 'warning'}>{user?.statut || 'actif'}</Badge></p>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default EntrepriseAbonnement







