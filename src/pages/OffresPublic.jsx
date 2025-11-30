import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Header, Footer } from '../components/Layout'
import { Card, Badge, Button, Input, Select, Pagination, Highlight } from '../components/UI'
import { useLanguage } from '../contexts/LanguageContext'
import { useData } from '../contexts/DataContext'
import { useDebounce } from '../hooks/useDebounce'
import { Search, MapPin, Briefcase, DollarSign, Calendar, Building2, ArrowUpDown, X } from 'lucide-react'

const OffresPublic = () => {
  const { t } = useLanguage()
  const { offres } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [filters, setFilters] = useState({
    secteur: '',
    localisation: '',
    typeContrat: '',
    salaireMin: ''
  })
  const [sortBy, setSortBy] = useState('recent') // 'recent', 'salaire', 'pertinence'
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const resetFilters = () => {
    setSearchTerm('')
    setFilters({
      secteur: '',
      localisation: '',
      typeContrat: '',
      salaireMin: ''
    })
    setSortBy('recent')
    setCurrentPage(1)
  }

  const hasActiveFilters = searchTerm || filters.secteur || filters.localisation || filters.typeContrat || filters.salaireMin

  const secteurs = ['Construction', 'Hôtellerie', 'Agriculture', 'Manufacture', 'Logistique', 'Nettoyage', 'Sécurité']
  const localisations = ['Port-Louis', 'Curepipe', 'Quatre-Bornes', 'Flic-en-Flac', 'Grand-Baie']
  const typesContrat = ['CDI', 'CDD', 'Intérim', 'Saisonnier']

  const filteredOffres = useMemo(() => {
    let result = offres.filter(offre => {
      if (offre.statut !== 'active') return false

      // Recherche textuelle
      if (debouncedSearchTerm) {
        const search = debouncedSearchTerm.toLowerCase()
        if (
          !offre.titre.toLowerCase().includes(search) &&
          !offre.description?.toLowerCase().includes(search) &&
          !offre.secteur?.toLowerCase().includes(search)
        ) {
          return false
        }
      }

      // Filtres
      if (filters.secteur && offre.secteur !== filters.secteur) return false
      if (filters.localisation && offre.localisation !== filters.localisation) return false
      if (filters.typeContrat && offre.typeContrat !== filters.typeContrat) return false
      if (filters.salaireMin && offre.salaire && offre.salaire < parseInt(filters.salaireMin)) return false

      return true
    })

    // Tri
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'salaire':
          return (b.salaire || 0) - (a.salaire || 0)
        case 'pertinence':
          // Tri par pertinence basé sur la recherche (simple)
          if (debouncedSearchTerm) {
            const aMatch = a.titre.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ? 1 : 0
            const bMatch = b.titre.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ? 1 : 0
            return bMatch - aMatch
          }
          return new Date(b.datePublication) - new Date(a.datePublication)
        case 'recent':
        default:
          return new Date(b.datePublication) - new Date(a.datePublication)
      }
    })

    return result
  }, [offres, debouncedSearchTerm, filters, sortBy])

  const paginatedOffres = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredOffres.slice(start, start + itemsPerPage)
  }, [filteredOffres, currentPage])

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value })
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-display font-bold mb-8 text-gray-100">{t('offres.title')}</h1>

          {/* Recherche et filtres */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Rechercher une offre..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                label="Secteur"
                value={filters.secteur}
                onChange={(e) => handleFilterChange('secteur', e.target.value)}
                options={['', ...secteurs]}
              />
              <Select
                label="Localisation"
                value={filters.localisation}
                onChange={(e) => handleFilterChange('localisation', e.target.value)}
                options={['', ...localisations]}
              />
              <Select
                label="Type de contrat"
                value={filters.typeContrat}
                onChange={(e) => handleFilterChange('typeContrat', e.target.value)}
                options={['', ...typesContrat]}
              />
              <Input
                label="Salaire minimum"
                type="number"
                value={filters.salaireMin}
                onChange={(e) => handleFilterChange('salaireMin', e.target.value)}
                placeholder="0"
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

          {/* Résultats et tri */}
          <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
            <p className="text-gray-400">
              {filteredOffres.length} offre{filteredOffres.length > 1 ? 's' : ''} trouvée{filteredOffres.length > 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <Select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-auto min-w-[180px]"
                options={[
                  { value: 'recent', label: 'Plus récent' },
                  { value: 'salaire', label: 'Salaire (décroissant)' },
                  { value: 'pertinence', label: 'Pertinence' }
                ]}
              />
            </div>
          </div>

          {/* Liste des offres */}
          {paginatedOffres.length === 0 ? (
            <Card>
              <p className="text-center text-gray-400 py-8">
                Aucune offre ne correspond à vos critères
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedOffres.map((offre) => {
                // Vérifier si l'offre est nouvelle (publiée il y a moins de 7 jours)
                const datePublication = new Date(offre.datePublication)
                const joursDepuisPublication = Math.floor((new Date() - datePublication) / (1000 * 60 * 60 * 24))
                const isNouveau = joursDepuisPublication <= 7
                
                // Vérifier si l'offre est urgente (expire dans moins de 7 jours)
                const dateExpiration = new Date(offre.dateExpiration)
                const joursAvantExpiration = Math.floor((dateExpiration - new Date()) / (1000 * 60 * 60 * 24))
                const isUrgent = joursAvantExpiration <= 7 && joursAvantExpiration > 0

                return (
                  <Card key={offre.id} hover>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold flex-1 text-gray-100">
                        <Highlight text={offre.titre} searchTerm={searchTerm} />
                      </h3>
                      <div className="flex gap-2 ml-2">
                        {isNouveau && (
                          <Badge variant="success">Nouveau</Badge>
                        )}
                        {isUrgent && (
                          <Badge variant="danger">Urgent</Badge>
                        )}
                      </div>
                    </div>
                    
                    {offre.entrepriseNom && (
                      <div className="flex items-center text-gray-400 text-sm mb-2">
                        <Building2 className="w-4 h-4 mr-2 text-gold-500" />
                        {offre.entrepriseNom}
                      </div>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-400 text-sm">
                        <Briefcase className="w-4 h-4 mr-2 text-gold-500" />
                        {offre.secteur}
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-gold-500" />
                        {offre.localisation}
                      </div>
                      {offre.salaire && (
                        <div className="flex items-center text-gray-400 text-sm">
                          <DollarSign className="w-4 h-4 mr-2 text-gold-500" />
                          {offre.salaire.toLocaleString()} MUR
                        </div>
                      )}
                      {offre.datePublication && (
                        <div className="flex items-center text-gray-500 text-xs">
                          <Calendar className="w-3 h-3 mr-2" />
                          Publié le {new Date(offre.datePublication).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      )}
                    </div>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {offre.description?.substring(0, 100)}...
                    </p>

                    <Link to={`/offres/${offre.id}`}>
                      <Button variant="gold" className="w-full">
                        {t('offres.details')}
                      </Button>
                    </Link>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {filteredOffres.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredOffres.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              totalItems={filteredOffres.length}
              itemsPerPage={itemsPerPage}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default OffresPublic



