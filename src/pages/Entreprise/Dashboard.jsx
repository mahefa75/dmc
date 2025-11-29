import { Header, Sidebar } from '../../components/Layout'
import { Card } from '../../components/UI'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { Users, FileCheck, Calendar, CheckCircle } from 'lucide-react'

const EntrepriseDashboard = () => {
  const { user } = useAuth()
  const { demandesEntreprises, candidatures } = useData()
  const { t } = useLanguage()

  const mesDemandes = demandesEntreprises.filter(d => d.entrepriseId === user?.id)
  const recrutementsEnCours = mesDemandes.filter(d => d.statut !== 'finalise').length

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="entreprise" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">{t('entreprise.dashboard')}</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{t('entreprise.recrutementsEnCours')}</p>
                  <p className="text-2xl font-bold">{recrutementsEnCours}</p>
                </div>
                <FileCheck className="w-12 h-12 text-blue-600" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{t('entreprise.candidatsPreselectionnes')}</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Users className="w-12 h-12 text-green-600" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{t('entreprise.entretiensPlanifies')}</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <Calendar className="w-12 h-12 text-purple-600" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{t('entreprise.postesPourvus')}</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <CheckCircle className="w-12 h-12 text-orange-600" />
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default EntrepriseDashboard





