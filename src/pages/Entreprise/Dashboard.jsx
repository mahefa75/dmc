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
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="entreprise" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-display font-bold mb-8 text-gray-100">{t('entreprise.dashboard')}</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{t('entreprise.recrutementsEnCours')}</p>
                  <p className="text-2xl font-bold text-gray-100">{recrutementsEnCours}</p>
                </div>
                <FileCheck className="w-12 h-12 text-gold-500" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{t('entreprise.candidatsPreselectionnes')}</p>
                  <p className="text-2xl font-bold text-gray-100">12</p>
                </div>
                <Users className="w-12 h-12 text-emerald-500" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{t('entreprise.entretiensPlanifies')}</p>
                  <p className="text-2xl font-bold text-gray-100">5</p>
                </div>
                <Calendar className="w-12 h-12 text-gold-500" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{t('entreprise.postesPourvus')}</p>
                  <p className="text-2xl font-bold text-gray-100">8</p>
                </div>
                <CheckCircle className="w-12 h-12 text-amber-500" />
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default EntrepriseDashboard
