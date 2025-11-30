import { Header, Sidebar } from '../../components/Layout'
import { Card, Table, Button, Badge } from '../../components/UI'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'

const AdminDemandesEntreprises = () => {
  const { demandesEntreprises, updateDemandeEntreprise } = useData()
  const { t } = useLanguage()

  const handleAccept = (id) => {
    updateDemandeEntreprise(id, { statut: 'accepte' })
  }

  const handleReject = (id) => {
    updateDemandeEntreprise(id, { statut: 'refuse' })
  }

  const columns = [
    { header: 'Entreprise', accessor: 'nomEntreprise' },
    { header: 'Secteur', accessor: 'secteur' },
    { header: 'Contact', accessor: 'email' },
    { header: 'Date', accessor: 'dateCreation', render: (date) => new Date(date).toLocaleDateString() },
    {
      header: 'Statut',
      accessor: 'statut',
      render: (statut) => <Badge variant={statut === 'en_attente' ? 'warning' : statut === 'accepte' ? 'success' : 'danger'}>{statut}</Badge>
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (id, row) => row.statut === 'en_attente' && (
        <div className="flex gap-2">
          <Button variant="success" size="sm" onClick={() => handleAccept(id)}>Accepter</Button>
          <Button variant="danger" size="sm" onClick={() => handleReject(id)}>Refuser</Button>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-display font-bold mb-8 text-gray-100">{t('admin.demandesEntreprises')}</h1>

          <Card>
            <Table columns={columns} data={demandesEntreprises} />
          </Card>
        </main>
      </div>
    </div>
  )
}

export default AdminDemandesEntreprises
