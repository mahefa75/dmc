import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Header, Sidebar } from '../../components/Layout'
import { Card, Badge, Button, Input, Select, Pagination, Highlight } from '../../components/UI'
import { useLanguage } from '../../contexts/LanguageContext'
import { useData } from '../../contexts/DataContext'
import { useDebounce } from '../../hooks/useDebounce'
import { Search, MapPin, Briefcase, DollarSign, ArrowUpDown, X } from 'lucide-react'

const CandidatOffres = () => {
  const { t } = useLanguage()
  const { offres } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [filters, setFilters] = useState({
    secteur: '',
    localisation: '',
    typeContrat: ''
  })
  const [sortBy, setSortBy] = useState('recent') // 'recent', 'salaire', 'pertinence'
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const resetFilters = () => {
    setSearchTerm('')
    setFilters({
      secteur: '',
      localisation: '',
      typeContrat: ''
    })
    setSortBy('recent')
    setCurrentPage(1)
  }

  const hasActiveFilters = searchTerm || filters.secteur || filters.localisation || filters.typeContrat

  const filteredAndSortedOffres = useMemo(() => {
    let filtered = offres.filter(offre => {
      if (offre.statut !== 'active') return false
      if (debouncedSearchTerm && !offre.titre.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) return false
      if (filters.secteur && offre.secteur !== filters.secteur) return false
      if (filters.localisation && offre.localisation !== filters.localisation) return false
      if (filters.typeContrat && offre.typeContrat !== filters.typeContrat) return false
      return true
    })

    // Tri
    filtered.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.datePublication) - new Date(a.datePublication)
      }
      if (sortBy === 'salaire') {
        return (b.salaire || 0) - (a.salaire || 0)
      }
      // 'pertinence' basé sur la recherche
      if (sortBy === 'pertinence' && debouncedSearchTerm) {
        const aMatch = a.titre.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ? 1 : 0
        const bMatch = b.titre.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ? 1 : 0
        return bMatch - aMatch
      }
      return 0
    })

    return filtered
  }, [offres, debouncedSearchTerm, filters, sortBy])

  const paginatedOffres = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredAndSortedOffres.slice(start, start + itemsPerPage)
  }, [filteredAndSortedOffres, currentPage])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="candidat" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">{t('offres.title')}</h1>

          <div className="mb-6 space-y-4">
            <div className="flex gap-4 items-end">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                <Select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-40"
                >
                  <option value="recent">Plus récent</option>
                  <option value="salaire">Salaire (décroissant)</option>
                  <option value="pertinence">Pertinence</option>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Select
                label="Secteur"
                value={filters.secteur}
                onChange={(e) => setFilters({ ...filters, secteur: e.target.value })}
                options={['', 'Construction', 'Hôtellerie', 'Agriculture', 'Manufacture', 'Logistique', 'Nettoyage', 'Sécurité']}
              />
              <Select
                label="Localisation"
                value={filters.localisation}
                onChange={(e) => setFilters({ ...filters, localisation: e.target.value })}
                options={['', 'Port-Louis', 'Curepipe', 'Quatre-Bornes', 'Flic-en-Flac', 'Grand-Baie']}
              />
              <Select
                label="Type de contrat"
                value={filters.typeContrat}
                onChange={(e) => setFilters({ ...filters, typeContrat: e.target.value })}
                options={['', 'CDI', 'CDD', 'Intérim', 'Saisonnier']}
              />
            </div>
            {hasActiveFilters && (
              <div className="flex justify-end">
                <Button
                  onClick={resetFilters}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>

          {paginatedOffres.length === 0 ? (
            <Card>
              <p className="text-center text-gray-500 py-8">
                Aucune offre ne correspond à vos critères
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedOffres.map(offre => (
                <Card key={offre.id} hover>
                  <h3 className="text-xl font-semibold mb-2">
                    <Highlight text={offre.titre} searchTerm={searchTerm} />
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {offre.secteur}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      {offre.localisation}
                    </div>
                    {offre.salaire && (
                      <div className="flex items-center text-gray-600 text-sm">
                        <DollarSign className="w-4 h-4 mr-2" />
                        {offre.salaire} MUR
                      </div>
                    )}
                  </div>
                  <Link to={`/candidat/offres/${offre.id}`}>
                    <Button variant="primary" className="w-full">
                      {t('offres.details')}
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}

          {filteredAndSortedOffres.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredAndSortedOffres.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              totalItems={filteredAndSortedOffres.length}
              itemsPerPage={itemsPerPage}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default CandidatOffres




