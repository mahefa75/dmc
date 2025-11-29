import { useParams } from 'react-router-dom'
import { Header, Sidebar } from '../../components/Layout'
import { Card, Badge, Button } from '../../components/UI'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'

const EntrepriseProfilCandidat = () => {
  const { id } = useParams()
  const { users } = useData()
  const { t } = useLanguage()

  const candidat = users.find(u => u.id === id && u.role === 'candidat')

  if (!candidat) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex flex-1">
          <Sidebar role="entreprise" />
          <main className="flex-1 p-8">
            <Card>
              <p className="text-center text-gray-500">Candidat non trouvé</p>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="entreprise" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Profil candidat</h1>

          <Card className="mb-6">
            <div className="text-center mb-6">
              {candidat.photo ? (
                <img src={candidat.photo} alt="Photo" className="w-32 h-32 rounded-full mx-auto object-cover" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto flex items-center justify-center">
                  <span className="text-4xl">{candidat.prenom?.[0]}{candidat.nom?.[0]}</span>
                </div>
              )}
              <h2 className="text-2xl font-bold mt-4">{candidat.prenom} {candidat.nom}</h2>
              <p className="text-gray-600">{candidat.secteurRecherche}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{candidat.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Téléphone</p>
                <p className="font-medium">{candidat.telephone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Disponibilité</p>
                <p className="font-medium">{candidat.disponibilite}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Localisation</p>
                <p className="font-medium">{candidat.adresse?.ville}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Langues</h3>
              <div className="flex flex-wrap gap-2">
                {candidat.langues?.map((langue, i) => (
                  <Badge key={i} variant="info">{langue.langue} - {langue.niveau}</Badge>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Expériences</h3>
              <div className="space-y-4">
                {candidat.experiences?.map((exp, i) => (
                  <div key={i} className="border-l-2 border-blue-600 pl-4">
                    <h4 className="font-medium">{exp.poste} - {exp.entreprise}</h4>
                    <p className="text-sm text-gray-600">{exp.dateDebut} - {exp.dateFin || 'En cours'}</p>
                    <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="primary">Contacter</Button>
              <Button variant="secondary">Ajouter aux favoris</Button>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default EntrepriseProfilCandidat




