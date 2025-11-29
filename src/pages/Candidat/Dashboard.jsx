import { Link } from 'react-router-dom'
import { Header, Sidebar } from '../../components/Layout'
import { Card, Button } from '../../components/UI'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { Briefcase, FileText, CheckCircle, Clock, User, Search, MessageSquare, Edit } from 'lucide-react'

const CandidatDashboard = () => {
  const { user } = useAuth()
  const { offres, candidatures } = useData()
  const { t } = useLanguage()

  const mesCandidatures = candidatures.filter(c => c.candidatId === user?.id)
  const enAttente = mesCandidatures.filter(c => c.statut === 'en_attente').length
  const selectionne = mesCandidatures.filter(c => c.statut === 'selectionne').length
  const entretien = mesCandidatures.filter(c => c.statut === 'entretien').length
  const accepte = mesCandidatures.filter(c => c.statut === 'accepte').length

  const offresRecentes = offres
    .filter(o => o.statut === 'active')
    .slice(0, 5)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="candidat" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">{t('nav.dashboard')}</h1>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Candidatures</p>
                  <p className="text-2xl font-bold">{mesCandidatures.length}</p>
                </div>
                <FileText className="w-12 h-12 text-blue-600" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">En attente</p>
                  <p className="text-2xl font-bold">{enAttente}</p>
                </div>
                <Clock className="w-12 h-12 text-yellow-600" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Présélectionné</p>
                  <p className="text-2xl font-bold">{selectionne}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Entretiens</p>
                  <p className="text-2xl font-bold">{entretien}</p>
                </div>
                <Briefcase className="w-12 h-12 text-purple-600" />
              </div>
            </Card>
          </div>

          {/* Actions rapides */}
          <Card className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/candidat/profil">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                  <Edit className="w-6 h-6" />
                  <span>Compléter mon profil</span>
                </Button>
              </Link>
              <Link to="/candidat/offres">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                  <Search className="w-6 h-6" />
                  <span>Voir les offres</span>
                </Button>
              </Link>
              <Link to="/candidat/candidatures">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                  <FileText className="w-6 h-6" />
                  <span>Mes candidatures</span>
                </Button>
              </Link>
              <Link to="/candidat/messagerie">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                  <MessageSquare className="w-6 h-6" />
                  <span>Nouveau message</span>
                </Button>
              </Link>
            </div>
          </Card>

          {/* Offres récentes */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Offres récentes</h2>
            {offresRecentes.length === 0 ? (
              <p className="text-gray-500">Aucune offre récente</p>
            ) : (
              <div className="space-y-4">
                {offresRecentes.map(offre => (
                  <div key={offre.id} className="border-b pb-4 last:border-0">
                    <h3 className="font-semibold">{offre.titre}</h3>
                    <p className="text-sm text-gray-600">{offre.secteur} - {offre.localisation}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  )
}

export default CandidatDashboard






