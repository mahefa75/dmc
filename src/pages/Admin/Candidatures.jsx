import { Header, Sidebar } from '../../components/Layout'
import { Card, Table, Badge, Select } from '../../components/UI'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'

const AdminCandidatures = () => {
  const { candidatures, offres, users, updateCandidature } = useData()
  const { t } = useLanguage()

  const candidaturesWithDetails = candidatures.map(c => {
    const offre = offres.find(o => o.id === c.offreId)
    const candidat = users.find(u => u.id === c.candidatId)
    return { ...c, offre, candidat }
  })

  const columns = [
    { header: 'Candidat', accessor: 'candidat', render: (candidat) => candidat ? `${candidat.prenom} ${candidat.nom}` : 'N/A' },
    { header: 'Offre', accessor: 'offre', render: (offre) => offre?.titre || 'N/A' },
    { header: 'Date', accessor: 'dateCandidature', render: (date) => new Date(date).toLocaleDateString() },
    {
      header: 'Statut',
      accessor: 'statut',
      render: (statut, row) => (
        <Select
          value={statut}
          onChange={(e) => updateCandidature(row.id, { statut: e.target.value })}
          options={['en_attente', 'selectionne', 'entretien', 'accepte', 'refuse']}
        />
      )
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-display font-bold mb-8 text-gray-100">{t('admin.candidatures')}</h1>

          <Card>
            <Table columns={columns} data={candidaturesWithDetails} />
          </Card>
        </main>
      </div>
    </div>
  )
}

export default AdminCandidatures
