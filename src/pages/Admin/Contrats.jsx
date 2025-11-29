import { Header, Sidebar } from '../../components/Layout'
import { Card, Table, Badge } from '../../components/UI'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'

const AdminContrats = () => {
  const { contrats } = useData()
  const { t } = useLanguage()

  const columns = [
    { header: 'Entreprise', accessor: 'entrepriseNom' },
    { header: 'Type', accessor: 'type' },
    { header: 'Montant', accessor: 'montant' },
    { header: 'Date début', accessor: 'dateDebut', render: (date) => new Date(date).toLocaleDateString() },
    { header: 'Date fin', accessor: 'dateFin', render: (date) => new Date(date).toLocaleDateString() },
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
          <h1 className="text-3xl font-bold mb-8">{t('admin.contrats')}</h1>

          <Card>
            {contrats.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Aucun contrat</p>
            ) : (
              <Table columns={columns} data={contrats} />
            )}
          </Card>
        </main>
      </div>
    </div>
  )
}

export default AdminContrats





