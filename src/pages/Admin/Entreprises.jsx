import { Header, Sidebar } from '../../components/Layout'
import { Card, Table, Badge } from '../../components/UI'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'

const AdminEntreprises = () => {
  const { users } = useData()
  const { t } = useLanguage()

  const entreprises = users.filter(u => u.role === 'entreprise')

  const columns = [
    { header: 'Entreprise', accessor: 'nomEntreprise' },
    { header: 'Secteur', accessor: 'secteur' },
    { header: 'Email', accessor: 'email' },
    { header: 'Abonnement', accessor: 'abonnement' },
    {
      header: 'Statut',
      accessor: 'statut',
      render: (statut) => <Badge variant={statut === 'actif' ? 'success' : 'warning'}>{statut}</Badge>
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">{t('admin.entreprises')}</h1>

          <Card>
            <Table columns={columns} data={entreprises} />
          </Card>
        </main>
      </div>
    </div>
  )
}

export default AdminEntreprises





