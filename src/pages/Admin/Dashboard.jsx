import { Header, Sidebar } from '../../components/Layout'
import { Card } from '../../components/UI'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { Users, Building, Briefcase, FileText } from 'lucide-react'

const AdminDashboard = () => {
  const { users, offres, candidatures } = useData()
  const { t } = useLanguage()

  const totalCandidats = users.filter(u => u.role === 'candidat').length
  const totalEntreprises = users.filter(u => u.role === 'entreprise').length
  const offresActives = offres.filter(o => o.statut === 'active').length
  const candidaturesMois = candidatures.length

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">{t('admin.dashboard')}</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{t('admin.totalCandidats')}</p>
                  <p className="text-2xl font-bold">{totalCandidats}</p>
                </div>
                <Users className="w-12 h-12 text-blue-600" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{t('admin.totalEntreprises')}</p>
                  <p className="text-2xl font-bold">{totalEntreprises}</p>
                </div>
                <Building className="w-12 h-12 text-green-600" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{t('admin.offresActives')}</p>
                  <p className="text-2xl font-bold">{offresActives}</p>
                </div>
                <Briefcase className="w-12 h-12 text-purple-600" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{t('admin.candidaturesMois')}</p>
                  <p className="text-2xl font-bold">{candidaturesMois}</p>
                </div>
                <FileText className="w-12 h-12 text-orange-600" />
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard





