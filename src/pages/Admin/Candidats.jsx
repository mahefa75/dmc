import { Link } from 'react-router-dom'
import { Header, Sidebar } from '../../components/Layout'
import { Card, Table, Button, Badge } from '../../components/UI'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'

const AdminCandidats = () => {
  const { users, deleteUser } = useData()
  const { t } = useLanguage()

  const candidats = users.filter(u => u.role === 'candidat')

  const columns = [
    { header: 'Nom', accessor: 'nom', render: (nom, row) => `${row.prenom} ${nom}` },
    { header: 'Email', accessor: 'email' },
    { header: 'Secteur', accessor: 'secteurRecherche' },
    {
      header: 'Statut',
      accessor: 'statut',
      render: (statut) => <Badge variant={statut === 'actif' ? 'success' : 'warning'}>{statut}</Badge>
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (id) => (
        <div className="flex gap-2">
          <Link to={`/admin/candidats/${id}/edit`}>
            <Button variant="outline" size="sm">Modifier</Button>
          </Link>
          <Button variant="danger" size="sm" onClick={() => deleteUser(id)}>Supprimer</Button>
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-100">{t('admin.candidats')}</h1>
            <Link to="/admin/candidats/nouveau">
              <Button variant="gold">Nouveau candidat</Button>
            </Link>
          </div>

          <Card>
            <Table columns={columns} data={candidats} />
          </Card>
        </main>
      </div>
    </div>
  )
}

export default AdminCandidats
