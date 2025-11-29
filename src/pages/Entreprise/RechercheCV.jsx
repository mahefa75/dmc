import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Header, Sidebar } from '../../components/Layout'
import { Card, Input, Select, Button, Badge, Pagination } from '../../components/UI'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { Search } from 'lucide-react'

const EntrepriseRechercheCV = () => {
  const { users } = useData()
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    secteur: '',
    experience: '',
    niveau: '',
    langue: ''
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const candidats = users.filter(u => u.role === 'candidat')

  const filteredCandidats = useMemo(() => {
    return candidats.filter(candidat => {
      if (searchTerm && !candidat.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !candidat.nom?.toLowerCase().includes(searchTerm.toLowerCase())) return false
      if (filters.secteur && candidat.secteurRecherche !== filters.secteur) return false
      return true
    })
  }, [candidats, searchTerm, filters])

  const paginatedCandidats = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredCandidats.slice(start, start + itemsPerPage)
  }, [filteredCandidats, currentPage])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="entreprise" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">{t('entreprise.rechercheCV')}</h1>

          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Rechercher un candidat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Select
                label="Secteur"
                value={filters.secteur}
                onChange={(e) => setFilters({ ...filters, secteur: e.target.value })}
                options={['', 'Construction', 'Hôtellerie', 'Agriculture', 'Manufacture', 'Logistique', 'Nettoyage', 'Sécurité']}
              />
              <Select
                label="Expérience"
                value={filters.experience}
                onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                options={['', '0-2 ans', '2-5 ans', '5-10 ans', '10+ ans']}
              />
              <Select
                label="Niveau"
                value={filters.niveau}
                onChange={(e) => setFilters({ ...filters, niveau: e.target.value })}
                options={['', 'Sans diplôme', 'CAP/BEP', 'BAC', 'BAC+']}
              />
              <Select
                label="Langue"
                value={filters.langue}
                onChange={(e) => setFilters({ ...filters, langue: e.target.value })}
                options={['', 'Français', 'Anglais']}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedCandidats.map(candidat => (
              <Card key={candidat.id} hover>
                <div className="text-center mb-4">
                  {candidat.photo ? (
                    <img src={candidat.photo} alt="Photo" className="w-24 h-24 rounded-full mx-auto object-cover" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto flex items-center justify-center">
                      <span className="text-2xl">{candidat.prenom?.[0]}{candidat.nom?.[0]}</span>
                    </div>
                  )}
                  <h3 className="font-semibold mt-2">{candidat.prenom} {candidat.nom}</h3>
                  <p className="text-sm text-gray-600">{candidat.secteurRecherche}</p>
                </div>
                <div className="space-y-2 mb-4">
                  {candidat.langues?.slice(0, 2).map((langue, i) => (
                    <Badge key={i} variant="info">{langue.langue} - {langue.niveau}</Badge>
                  ))}
                </div>
                <Link to={`/entreprise/candidat/${candidat.id}`}>
                  <Button variant="primary" className="w-full">Voir le profil</Button>
                </Link>
              </Card>
            ))}
          </div>

          {filteredCandidats.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredCandidats.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              totalItems={filteredCandidats.length}
              itemsPerPage={itemsPerPage}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default EntrepriseRechercheCV




