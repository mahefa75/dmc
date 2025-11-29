import { Header, Sidebar } from '../../components/Layout'
import { Card, Table, Badge } from '../../components/UI'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'

const AdminUtilisateurs = () => {
  const { users } = useData()
  const { t } = useLanguage()

  const admins = users.filter(u => u.role === 'admin')

  const columns = [
    { header: 'Nom', accessor: 'nom', render: (nom, row) => `${row.prenom} ${nom}` },
    { header: 'Email', accessor: 'email' },
    { header: 'Rôle', accessor: 'role' },
    { header: 'Date création', accessor: 'createdAt', render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A' }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">{t('admin.utilisateurs')}</h1>

          <Card>
            <Table columns={columns} data={admins} />
          </Card>
        </main>
      </div>
    </div>
  )
}

export default AdminUtilisateurs






