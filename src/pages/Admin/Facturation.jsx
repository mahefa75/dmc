import { Header, Sidebar } from '../../components/Layout'
import { Card, Table } from '../../components/UI'
import { useLanguage } from '../../contexts/LanguageContext'

const AdminFacturation = () => {
  const { t } = useLanguage()

  const factures = []

  const columns = [
    { header: 'Numéro', accessor: 'numero' },
    { header: 'Entreprise', accessor: 'entreprise' },
    { header: 'Montant', accessor: 'montant' },
    { header: 'Date', accessor: 'date', render: (date) => new Date(date).toLocaleDateString() },
    { header: 'Statut', accessor: 'statut' }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">{t('admin.facturation')}</h1>

          <Card>
            {factures.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Aucune facture</p>
            ) : (
              <Table columns={columns} data={factures} />
            )}
          </Card>
        </main>
      </div>
    </div>
  )
}

export default AdminFacturation






