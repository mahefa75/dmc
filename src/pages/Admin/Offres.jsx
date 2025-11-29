import { Link } from 'react-router-dom'
import { Header, Sidebar } from '../../components/Layout'
import { Card, Table, Button, Badge } from '../../components/UI'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'

const AdminOffres = () => {
  const { offres, deleteOffre } = useData()
  const { t } = useLanguage()

  const columns = [
    { header: 'Titre', accessor: 'titre' },
    { header: 'Entreprise', accessor: 'entrepriseNom' },
    { header: 'Secteur', accessor: 'secteur' },
    { header: 'Localisation', accessor: 'localisation' },
    {
      header: 'Statut',
      accessor: 'statut',
      render: (statut) => <Badge variant={statut === 'active' ? 'success' : 'warning'}>{statut}</Badge>
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (id) => (
        <div className="flex gap-2">
          <Link to={`/admin/offres/${id}/edit`}>
            <Button variant="outline" size="sm">Modifier</Button>
          </Link>
          <Button variant="danger" size="sm" onClick={() => deleteOffre(id)}>Supprimer</Button>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">{t('admin.offres')}</h1>
            <Link to="/admin/offres/nouvelle">
              <Button variant="primary">Nouvelle offre</Button>
            </Link>
          </div>

          <Card>
            <Table columns={columns} data={offres} />
          </Card>
        </main>
      </div>
    </div>
  )
}

export default AdminOffres





