import { useState } from 'react'
import { Header, Sidebar } from '../../components/Layout'
import { Card, Badge, Button } from '../../components/UI'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useToast } from '../../components/UI/Toast'
import { FileText, Calendar, User, Download, Eye, Edit, Trash2 } from 'lucide-react'

const EntrepriseMesDemandes = () => {
  const { user } = useAuth()
  const { demandesEntreprises, updateDemandeEntreprise, users } = useData()
  const { t } = useLanguage()
  const { showToast, ToastContainer } = useToast()
  const [draggedItem, setDraggedItem] = useState(null)
  const [selectedDemande, setSelectedDemande] = useState(null)

  const mesDemandes = demandesEntreprises.filter(d => d.entrepriseId === user?.id)

  // Mapping des statuts vers les colonnes Kanban
  const statutToColumn = {
    'en_attente': 'demande_envoyee',
    'preselection': 'preselection',
    'entretien_planifie': 'entretien_planifie',
    'validation': 'validation',
    'documents': 'documents',
    'finalise': 'finalise'
  }

  const columnToStatut = {
    'demande_envoyee': 'en_attente',
    'preselection': 'preselection',
    'entretien_planifie': 'entretien_planifie',
    'validation': 'validation',
    'documents': 'documents',
    'finalise': 'finalise'
  }

  const columns = [
    { id: 'demande_envoyee', label: 'Demande envoyée', color: 'bg-navy-700' },
    { id: 'preselection', label: 'Présélection', color: 'bg-amber-900/30' },
    { id: 'entretien_planifie', label: 'Entretien planifié', color: 'bg-purple-900/30' },
    { id: 'validation', label: 'Validation', color: 'bg-emerald-900/30' },
    { id: 'documents', label: 'Documents', color: 'bg-orange-900/30' },
    { id: 'finalise', label: 'Finalisé', color: 'bg-navy-600' }
  ]

  const getDemandesByColumn = (columnId) => {
    const statut = columnToStatut[columnId]
    return mesDemandes.filter(d => {
      const currentStatut = d.statut || 'en_attente'
      return statutToColumn[currentStatut] === columnId
    })
  }

  const handleDragStart = (e, demande) => {
    setDraggedItem(demande)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, columnId) => {
    e.preventDefault()
    if (draggedItem) {
      const newStatut = columnToStatut[columnId]
      updateDemandeEntreprise(draggedItem.id, { statut: newStatut })
      showToast(`Demande déplacée vers "${columns.find(c => c.id === columnId)?.label}"`, 'success')
      setDraggedItem(null)
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      // Note: deleteDemandeEntreprise n'est pas encore dans DataContext, on peut juste mettre à jour le statut
      updateDemandeEntreprise(id, { statut: 'supprime' })
      showToast('Demande supprimée', 'success')
    }
  }

  const getCandidatName = (demande) => {
    // Pour l'instant, on retourne un nom fictif
    // Dans une vraie app, on récupérerait le candidat associé
    return 'Candidat à assigner'
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="entreprise" />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-100">{t('entreprise.mesDemandes')}</h1>
            <Button variant="gold" onClick={() => window.location.href = '/entreprise/nouvelle-demande'}>
              Nouvelle demande
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
              {columns.map(column => {
                const demandes = getDemandesByColumn(column.id)
                return (
                  <div
                    key={column.id}
                    className={`min-w-[280px] ${column.color} rounded-lg p-4`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, column.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-100">{column.label}</h3>
                      <Badge variant="info">{demandes.length}</Badge>
                    </div>
                    <div className="space-y-3 min-h-[200px]">
                      {demandes.map(demande => (
                        <Card
                          key={demande.id}
                          className="cursor-move bg-navy-800 border border-navy-600 shadow-md hover:shadow-lg transition-shadow"
                          draggable
                          onDragStart={(e) => handleDragStart(e, demande)}
                          onClick={() => setSelectedDemande(selectedDemande?.id === demande.id ? null : demande)}
                        >
                          <div className="p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm mb-1 text-gray-100">{demande.posteRecherche || 'Poste non spécifié'}</h4>
                                <p className="text-xs text-gray-400 mb-1">{demande.secteur || 'Secteur non spécifié'}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(demande.dateCreation).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(demande.id)
                                  }}
                                  className="text-red-500 hover:text-red-700 text-xs"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            {demande.localisation && (
                              <p className="text-xs text-gray-500 mb-2">
                                📍 {demande.localisation}
                              </p>
                            )}
                            {demande.typeContrat && (
                              <Badge variant="outline" className="text-xs">
                                {demande.typeContrat}
                              </Badge>
                            )}
                            {selectedDemande?.id === demande.id && (
                              <div className="mt-3 pt-3 border-t space-y-2">
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" className="flex-1">
                                    <Eye className="w-3 h-3 mr-1" />
                                    Voir
                                  </Button>
                                  <Button variant="outline" size="sm" className="flex-1">
                                    <Edit className="w-3 h-3 mr-1" />
                                    Modifier
                                  </Button>
                                </div>
                                {demande.fichePoste && (
                                  <Button variant="outline" size="sm" className="w-full">
                                    <Download className="w-3 h-3 mr-1" />
                                    Télécharger fiche poste
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
                      {demandes.length === 0 && (
                        <div className="text-center text-gray-400 text-sm py-8">
                          Aucune demande
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}

export default EntrepriseMesDemandes
