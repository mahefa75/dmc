import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Header, Sidebar } from '../../components/Layout'
import { Card, Badge, Table, Select, Pagination, Button, Modal } from '../../components/UI'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useToast } from '../../components/UI/Toast'
import { Eye, X } from 'lucide-react'

const CandidatMesCandidatures = () => {
  const { user } = useAuth()
  const { candidatures, offres, deleteCandidature } = useData()
  const { t } = useLanguage()
  const { showToast, ToastContainer } = useToast()
  const [statutFilter, setStatutFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [candidatureToRemove, setCandidatureToRemove] = useState(null)
  const itemsPerPage = 20

  const mesCandidatures = useMemo(() => {
    let filtered = candidatures.filter(c => c.candidatId === user?.id)
    if (statutFilter) {
      filtered = filtered.filter(c => c.statut === statutFilter)
    }
    return filtered.map(c => {
      const offre = offres.find(o => o.id === c.offreId)
      return { ...c, offre }
    })
  }, [candidatures, offres, user, statutFilter])

  const paginatedCandidatures = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return mesCandidatures.slice(start, start + itemsPerPage)
  }, [mesCandidatures, currentPage])

  const getStatutBadge = (statut) => {
    const badges = {
      en_attente: { variant: 'warning', label: t('candidatures.enAttente') },
      selectionne: { variant: 'info', label: t('candidatures.selectionne') },
      entretien: { variant: 'info', label: t('candidatures.entretien') },
      accepte: { variant: 'success', label: t('candidatures.accepte') },
      refuse: { variant: 'danger', label: t('candidatures.refuse') },
      pending: { variant: 'warning', label: t('candidatures.enAttente') },
      preselected: { variant: 'info', label: t('candidatures.selectionne') },
      'interview scheduled': { variant: 'info', label: t('candidatures.entretien') },
      selected: { variant: 'success', label: t('candidatures.accepte') },
      rejected: { variant: 'danger', label: t('candidatures.refuse') }
    }
    return badges[statut] || badges[statut?.toLowerCase()] || { variant: 'default', label: statut }
  }

  const handleRemove = (candidature) => {
    setCandidatureToRemove(candidature)
    setShowRemoveModal(true)
  }

  const confirmRemove = () => {
    if (candidatureToRemove && deleteCandidature) {
      deleteCandidature(candidatureToRemove.id)
      showToast(t('candidat.applicationRemoved'), 'success')
      setShowRemoveModal(false)
      setCandidatureToRemove(null)
    }
  }

  const columns = [
    { header: t('candidatures.poste'), accessor: 'offre', render: (offre) => offre?.titre || 'N/A' },
    { header: t('candidatures.entreprise'), accessor: 'offre', render: (offre) => offre?.entrepriseNom || 'N/A' },
    { header: t('candidatures.date'), accessor: 'dateCandidature', render: (date) => new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric', year: 'numeric' }) },
    {
      header: t('candidatures.statut'),
      accessor: 'statut',
      render: (statut) => {
        const badge = getStatutBadge(statut)
        return <Badge variant={badge.variant}>{badge.label}</Badge>
      }
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (id, row) => (
        <div className="flex gap-2">
          <Link to={`/offres/${row.offre?.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              {t('candidatures.voirDetails')}
            </Button>
          </Link>
          <Button variant="danger" size="sm" onClick={() => handleRemove(row)}>
            <X className="w-4 h-4 mr-1" />
            {t('candidat.remove')}
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="candidat" />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-100">{t('candidatures.title')}</h1>
            <Select
              value={statutFilter}
              onChange={(e) => {
                setStatutFilter(e.target.value)
                setCurrentPage(1)
              }}
              options={[
                { value: '', label: t('candidat.allStatuses') },
                { value: 'en_attente', label: t('candidatures.enAttente') },
                { value: 'selectionne', label: t('candidatures.selectionne') },
                { value: 'entretien', label: t('candidatures.entretien') },
                { value: 'accepte', label: t('candidatures.accepte') },
                { value: 'refuse', label: t('candidatures.refuse') }
              ]}
              className="w-48"
            />
          </div>

          <Card>
            {mesCandidatures.length === 0 ? (
              <p className="text-center text-gray-400 py-8">{t('candidat.noApplication')}</p>
            ) : (
              <>
                <Table columns={columns} data={paginatedCandidatures} />
                {mesCandidatures.length > itemsPerPage && (
                  <div className="mt-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(mesCandidatures.length / itemsPerPage)}
                      onPageChange={setCurrentPage}
                      totalItems={mesCandidatures.length}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                )}
              </>
            )}
          </Card>
        </main>
      </div>
      <ToastContainer />
      
      <Modal
        isOpen={showRemoveModal}
        onClose={() => {
          setShowRemoveModal(false)
          setCandidatureToRemove(null)
        }}
        title={t('candidat.removeApplication')}
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setShowRemoveModal(false)
              setCandidatureToRemove(null)
            }}>
              {t('common.cancel')}
            </Button>
            <Button variant="danger" onClick={confirmRemove}>
              {t('candidat.remove')}
            </Button>
          </>
        }
      >
        <p className="mb-4 text-gray-300">
          {t('candidat.confirmRemoveApplication')} <strong className="text-gold-500">{candidatureToRemove?.offre?.titre}</strong> {t('candidat.at')} <strong className="text-gold-500">{candidatureToRemove?.offre?.entrepriseNom}</strong> ?
        </p>
        <p className="text-sm text-gray-400">
          {t('candidat.actionIrreversible')}
        </p>
      </Modal>
    </div>
  )
}

export default CandidatMesCandidatures
