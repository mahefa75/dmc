import { useState, useEffect } from 'react'
import { Header, Sidebar } from '../../components/Layout'
import { Card, Button } from '../../components/UI'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useMigration } from '../../hooks/useMigration'
import { Users, Building, Briefcase, FileText, Database, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

const AdminDashboard = () => {
  const { users, offres, candidatures } = useData()
  const { t } = useLanguage()
  const { isMigrating, migrationReport, localData, checkData, migrate, clearLocalStorage } = useMigration()
  const [showMigration, setShowMigration] = useState(false)

  useEffect(() => {
    // Vérifier automatiquement s'il y a des données à migrer au chargement
    checkData()
  }, [])

  const handleMigrate = async () => {
    const report = await migrate()
    if (report && report.success) {
      // Après migration réussie, re-vérifier les données
      checkData()
    }
  }

  const handleClearLocalStorage = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer les données du localStorage ? Cette action est irréversible.')) {
      clearLocalStorage()
      checkData()
      setShowMigration(false)
    }
  }

  const totalCandidats = users.filter(u => u.role === 'candidat').length
  const totalEntreprises = users.filter(u => u.role === 'entreprise').length
  const offresActives = offres.filter(o => o.statut === 'active').length
  const candidaturesMois = candidatures.length

  const hasLocalData = localData && localData.hasData

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-display font-bold mb-8 text-gray-100">{t('admin.dashboard')}</h1>

          {/* Alerte de migration */}
          {hasLocalData && !migrationReport && (
            <Card className="mb-6 border-amber-500/30 bg-amber-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="w-6 h-6 text-amber-500" />
                  <div>
                    <p className="font-semibold text-amber-400">Données détectées dans localStorage</p>
                    <p className="text-sm text-amber-300/70">
                      {localData.total} élément(s) trouvé(s). Souhaitez-vous les migrer vers Firebase ?
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setShowMigration(!showMigration)} variant="secondary">
                    {showMigration ? 'Masquer' : 'Détails'}
                  </Button>
                  <Button onClick={handleMigrate} disabled={isMigrating} variant="gold">
                    {isMigrating ? 'Migration...' : 'Migrer maintenant'}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Rapport de migration */}
          {migrationReport && (
            <Card className={`mb-6 ${migrationReport.success ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
              <div className="flex items-start gap-3">
                {migrationReport.success ? (
                  <CheckCircle className="w-6 h-6 text-emerald-500 mt-1" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500 mt-1" />
                )}
                <div className="flex-1">
                  <p className={`font-semibold ${migrationReport.success ? 'text-emerald-400' : 'text-red-400'}`}>
                    {migrationReport.success ? 'Migration terminée' : 'Migration avec erreurs'}
                  </p>
                  {migrationReport.stats && (
                    <div className="mt-2 text-sm space-y-1">
                      {Object.entries(migrationReport.stats).map(([key, stat]) => (
                        stat.migrated > 0 || stat.skipped > 0 || stat.errors > 0 ? (
                          <p key={key} className={migrationReport.success ? 'text-emerald-300/70' : 'text-red-300/70'}>
                            {key}: {stat.migrated} migré(s), {stat.skipped} ignoré(s), {stat.errors} erreur(s)
                          </p>
                        ) : null
                      ))}
                    </div>
                  )}
                  {migrationReport.success && hasLocalData && (
                    <div className="mt-3">
                      <Button onClick={handleClearLocalStorage} variant="secondary" size="sm">
                        Nettoyer le localStorage
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Détails des données localStorage */}
          {showMigration && localData && (
            <Card className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-100">
                <Database className="w-5 h-5 text-gold-500" />
                Détails des données localStorage
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Utilisateurs</p>
                  <p className="text-xl font-bold text-gray-100">{localData.stats.users}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Offres</p>
                  <p className="text-xl font-bold text-gray-100">{localData.stats.offres}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Candidatures</p>
                  <p className="text-xl font-bold text-gray-100">{localData.stats.candidatures}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Messages</p>
                  <p className="text-xl font-bold text-gray-100">{localData.stats.messages}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Notifications</p>
                  <p className="text-xl font-bold text-gray-100">{localData.stats.notifications}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Demandes</p>
                  <p className="text-xl font-bold text-gray-100">{localData.stats.demandesEntreprises}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Contrats</p>
                  <p className="text-xl font-bold text-gray-100">{localData.stats.contrats}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total</p>
                  <p className="text-xl font-bold text-gold-500">{localData.total}</p>
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{t('admin.totalCandidats')}</p>
                  <p className="text-2xl font-bold text-gray-100">{totalCandidats}</p>
                </div>
                <Users className="w-12 h-12 text-gold-500" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{t('admin.totalEntreprises')}</p>
                  <p className="text-2xl font-bold text-gray-100">{totalEntreprises}</p>
                </div>
                <Building className="w-12 h-12 text-gold-500" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{t('admin.offresActives')}</p>
                  <p className="text-2xl font-bold text-gray-100">{offresActives}</p>
                </div>
                <Briefcase className="w-12 h-12 text-gold-500" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{t('admin.candidaturesMois')}</p>
                  <p className="text-2xl font-bold text-gray-100">{candidaturesMois}</p>
                </div>
                <FileText className="w-12 h-12 text-gold-500" />
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
