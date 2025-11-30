import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Header, Sidebar } from '../../components/Layout'
import { Card, Button, Badge, Table } from '../../components/UI'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useMigration } from '../../hooks/useMigration'
import { 
  Users, Building, Briefcase, FileText, Database, AlertCircle, CheckCircle, XCircle,
  TrendingUp, Clock, ArrowRight, Eye, UserCheck, FileCheck, Send, Award, Calendar
} from 'lucide-react'

const AdminDashboard = () => {
  const { users, offres, candidatures } = useData()
  const { t } = useLanguage()
  const { isMigrating, migrationReport, localData, checkData, migrate, clearLocalStorage } = useMigration()
  const [showMigration, setShowMigration] = useState(false)

  useEffect(() => {
    checkData()
  }, [])

  const handleMigrate = async () => {
    const report = await migrate()
    if (report && report.success) {
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

  // Statistiques globales
  const stats = useMemo(() => {
    const candidats = users.filter(u => u.role === 'candidat')
    const entreprises = users.filter(u => u.role === 'entreprise')
    
    return {
      totalCandidats: candidats.length,
      totalEntreprises: entreprises.length,
      offresActives: offres.filter(o => o.statut === 'active').length,
      totalCandidatures: candidatures.length,
      candidaturesEnAttente: candidatures.filter(c => c.statut === 'en_attente' || c.statut === 'nouvelle').length,
      candidaturesAcceptees: candidatures.filter(c => c.statut === 'acceptee' || c.statut === 'entretien').length,
      candidaturesRefusees: candidatures.filter(c => c.statut === 'refusee').length,
      candidaturesEnProcess: candidatures.filter(c => ['en_cours', 'entretien', 'test', 'selection'].includes(c.statut)).length
    }
  }, [users, offres, candidatures])

  // Étapes du processus candidat
  const processusCandidat = [
    { 
      id: 1, 
      label: t('admin.processStep1'), 
      description: t('admin.processStep1Desc'),
      icon: UserCheck, 
      color: 'bg-blue-500',
      count: stats.totalCandidats
    },
    { 
      id: 2, 
      label: t('admin.processStep2'), 
      description: t('admin.processStep2Desc'),
      icon: FileCheck, 
      color: 'bg-amber-500',
      count: users.filter(u => u.role === 'candidat' && u.cv).length
    },
    { 
      id: 3, 
      label: t('admin.processStep3'), 
      description: t('admin.processStep3Desc'),
      icon: Send, 
      color: 'bg-purple-500',
      count: stats.totalCandidatures
    },
    { 
      id: 4, 
      label: t('admin.processStep4'), 
      description: t('admin.processStep4Desc'),
      icon: Calendar, 
      color: 'bg-cyan-500',
      count: stats.candidaturesEnProcess
    },
    { 
      id: 5, 
      label: t('admin.processStep5'), 
      description: t('admin.processStep5Desc'),
      icon: Award, 
      color: 'bg-green-500',
      count: stats.candidaturesAcceptees
    }
  ]

  // Étapes du processus entreprise (client)
  const processusEntreprise = [
    { 
      id: 1, 
      label: t('admin.entrepriseStep1'), 
      description: t('admin.entrepriseStep1Desc'),
      icon: Building, 
      color: 'bg-blue-500',
      count: stats.totalEntreprises
    },
    { 
      id: 2, 
      label: t('admin.entrepriseStep2'), 
      description: t('admin.entrepriseStep2Desc'),
      icon: Briefcase, 
      color: 'bg-amber-500',
      count: offres.length
    },
    { 
      id: 3, 
      label: t('admin.entrepriseStep3'), 
      description: t('admin.entrepriseStep3Desc'),
      icon: Eye, 
      color: 'bg-purple-500',
      count: candidatures.filter(c => c.statut !== 'nouvelle' && c.statut !== 'en_attente').length
    },
    { 
      id: 4, 
      label: t('admin.entrepriseStep4'), 
      description: t('admin.entrepriseStep4Desc'),
      icon: UserCheck, 
      color: 'bg-cyan-500',
      count: stats.candidaturesEnProcess
    },
    { 
      id: 5, 
      label: t('admin.entrepriseStep5'), 
      description: t('admin.entrepriseStep5Desc'),
      icon: Award, 
      color: 'bg-green-500',
      count: stats.candidaturesAcceptees
    }
  ]

  // Dernières candidatures
  const dernieresCandidatures = useMemo(() => {
    return [...candidatures]
      .sort((a, b) => new Date(b.datePostulation || b.createdAt) - new Date(a.datePostulation || a.createdAt))
      .slice(0, 5)
  }, [candidatures])

  // Derniers candidats inscrits
  const derniersCandidats = useMemo(() => {
    return users
      .filter(u => u.role === 'candidat')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  }, [users])

  const hasLocalData = localData && localData.hasData

  const getStatusBadge = (statut) => {
    const variants = {
      'nouvelle': 'info',
      'en_attente': 'warning',
      'en_cours': 'info',
      'entretien': 'info',
      'test': 'info',
      'selection': 'info',
      'acceptee': 'success',
      'refusee': 'danger'
    }
    return <Badge variant={variants[statut] || 'default'}>{statut}</Badge>
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="flex-1 p-8 overflow-auto">
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
              </div>
            </Card>
          )}

          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{t('admin.totalCandidats')}</p>
                  <p className="text-2xl font-bold text-gray-100">{stats.totalCandidats}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </Card>
            <Card hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{t('admin.totalEntreprises')}</p>
                  <p className="text-2xl font-bold text-gray-100">{stats.totalEntreprises}</p>
                </div>
                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </Card>
            <Card hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{t('admin.offresActives')}</p>
                  <p className="text-2xl font-bold text-gray-100">{stats.offresActives}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </Card>
            <Card hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{t('admin.candidaturesMois')}</p>
                  <p className="text-2xl font-bold text-gray-100">{stats.totalCandidatures}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* Tableau de bord Processus Candidat */}
          <Card className="mb-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold-500" />
              {t('admin.candidateProcess')}
            </h2>
            <div className="flex flex-wrap justify-between items-start gap-4">
              {processusCandidat.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={step.id} className="flex items-center gap-4">
                    <div className="text-center">
                      <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-gray-100">{step.count}</p>
                      <p className="text-sm font-medium text-gray-300">{step.label}</p>
                      <p className="text-xs text-gray-500 max-w-[120px]">{step.description}</p>
                    </div>
                    {index < processusCandidat.length - 1 && (
                      <ArrowRight className="w-6 h-6 text-gray-600 hidden md:block" />
                    )}
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Tableau de bord Processus Entreprise */}
          <Card className="mb-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-6 flex items-center gap-2">
              <Building className="w-5 h-5 text-gold-500" />
              {t('admin.entrepriseProcess')}
            </h2>
            <div className="flex flex-wrap justify-between items-start gap-4">
              {processusEntreprise.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={step.id} className="flex items-center gap-4">
                    <div className="text-center">
                      <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-gray-100">{step.count}</p>
                      <p className="text-sm font-medium text-gray-300">{step.label}</p>
                      <p className="text-xs text-gray-500 max-w-[120px]">{step.description}</p>
                    </div>
                    {index < processusEntreprise.length - 1 && (
                      <ArrowRight className="w-6 h-6 text-gray-600 hidden md:block" />
                    )}
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Dernières activités */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dernières candidatures */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gold-500" />
                  {t('admin.recentApplications')}
                </h2>
                <Link to="/admin/candidatures">
                  <Button variant="outline" size="sm">{t('common.viewAll')}</Button>
                </Link>
              </div>
              {dernieresCandidatures.length > 0 ? (
                <div className="space-y-3">
                  {dernieresCandidatures.map(candidature => {
                    const candidat = users.find(u => u.id === candidature.candidatId)
                    const offre = offres.find(o => o.id === candidature.offreId)
                    return (
                      <div key={candidature.id} className="p-3 bg-navy-800 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-100">
                            {candidat?.prenom} {candidat?.nom}
                          </p>
                          <p className="text-sm text-gray-400">{offre?.titre}</p>
                        </div>
                        {getStatusBadge(candidature.statut)}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-400 py-8">{t('admin.noApplications')}</p>
              )}
            </Card>

            {/* Derniers candidats inscrits */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-gold-500" />
                  {t('admin.recentCandidates')}
                </h2>
                <Link to="/admin/candidats">
                  <Button variant="outline" size="sm">{t('common.viewAll')}</Button>
                </Link>
              </div>
              {derniersCandidats.length > 0 ? (
                <div className="space-y-3">
                  {derniersCandidats.map(candidat => (
                    <div key={candidat.id} className="p-3 bg-navy-800 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold-500/20 rounded-full flex items-center justify-center">
                          <span className="text-gold-500 font-medium">
                            {candidat.prenom?.[0]}{candidat.nom?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-100">
                            {candidat.prenom} {candidat.nom}
                          </p>
                          <p className="text-sm text-gray-400">{candidat.titrePoste || candidat.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {candidat.cv && (
                          <Badge variant="success" size="sm">CV</Badge>
                        )}
                        <Badge variant={candidat.statut === 'actif' ? 'info' : 'warning'}>
                          {candidat.statut || 'actif'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 py-8">{t('admin.noCandidates')}</p>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
