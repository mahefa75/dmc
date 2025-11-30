import { Header, Sidebar } from '../../components/Layout'
import { Card } from '../../components/UI'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'

const AdminStatistiques = () => {
  const { users, offres, candidatures } = useData()
  const { t } = useLanguage()

  const totalCandidats = users.filter(u => u.role === 'candidat').length
  const totalEntreprises = users.filter(u => u.role === 'entreprise').length
  const offresActives = offres.filter(o => o.statut === 'active').length
  const totalCandidatures = candidatures.length

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-display font-bold mb-8 text-gray-100">{t('admin.statistiques')}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4 text-gold-500">Candidats</h2>
              <p className="text-3xl font-bold text-gray-100">{totalCandidats}</p>
            </Card>
            <Card>
              <h2 className="text-xl font-semibold mb-4 text-gold-500">Entreprises</h2>
              <p className="text-3xl font-bold text-gray-100">{totalEntreprises}</p>
            </Card>
            <Card>
              <h2 className="text-xl font-semibold mb-4 text-gold-500">Offres actives</h2>
              <p className="text-3xl font-bold text-gray-100">{offresActives}</p>
            </Card>
            <Card>
              <h2 className="text-xl font-semibold mb-4 text-gold-500">Candidatures</h2>
              <p className="text-3xl font-bold text-gray-100">{totalCandidatures}</p>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminStatistiques
