// Données de démonstration pour la plateforme

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9)

// Hash simple pour les mots de passe (tous les mots de passe = "password123")
const hashPassword = (password) => {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString()
}

const passwordHash = hashPassword('password123')

// Candidats (50+)
const generateCandidats = () => {
  const prenoms = ['Jean', 'Marie', 'Paul', 'Sophie', 'Pierre', 'Julie', 'Marc', 'Anne', 'Luc', 'Claire', 'Thomas', 'Isabelle', 'David', 'Catherine', 'Nicolas', 'Valérie', 'Antoine', 'Nathalie', 'François', 'Sylvie']
  const noms = ['Rakoto', 'Rasoa', 'Rabe', 'Randria', 'Razafy', 'Andrianarivo', 'Ramanantsoa', 'Ratsimbazafy', 'Rakotomalala', 'Razafindrakoto', 'Rakotondrabe', 'Razafindrakoto', 'Rakotovao', 'Razafindrakoto', 'Rakotondrazaka', 'Razafindrakoto', 'Rakotondrazaka', 'Razafindrakoto', 'Rakotondrazaka', 'Razafindrakoto']
  const villes = ['Antananarivo', 'Toamasina', 'Mahajanga', 'Antsirabe', 'Fianarantsoa']
  const secteurs = ['Construction', 'Hôtellerie', 'Agriculture', 'Manufacture', 'Logistique', 'Nettoyage', 'Sécurité']
  const niveaux = ['Sans diplôme', 'CAP/BEP', 'BAC', 'BAC+2', 'BAC+3+']
  const langues = ['Français', 'Anglais', 'Malgache']
  const niveauxLangue = ['Débutant', 'Intermédiaire', 'Avancé', 'Courant', 'Natif']
  const disponibilites = ['Immédiate', 'Sous 1 mois', 'Sous 3 mois', 'À discuter']
  const typesContrat = ['CDI', 'CDD', 'Intérim', 'Saisonnier']

  const candidats = []

  for (let i = 0; i < 55; i++) {
    const sexe = Math.random() > 0.4 ? 'M' : 'F'
    const age = 20 + Math.floor(Math.random() * 30)
    const experience = Math.floor(Math.random() * 15)
    const secteurExp = secteurs[Math.floor(Math.random() * secteurs.length)]
    const niveau = niveaux[Math.floor(Math.random() * niveaux.length)]
    
    const languesParlees = []
    languesParlees.push({ langue: 'Malgache', niveau: 'Natif' })
    if (Math.random() > 0.2) {
      languesParlees.push({ 
        langue: 'Français', 
        niveau: niveauxLangue[Math.floor(Math.random() * 4) + 1] 
      })
    }
    if (Math.random() > 0.6) {
      languesParlees.push({ 
        langue: 'Anglais', 
        niveau: niveauxLangue[Math.floor(Math.random() * 3) + 1] 
      })
    }

    const experiences = []
    for (let j = 0; j < Math.min(experience, 5); j++) {
      experiences.push({
        poste: `Poste ${j + 1}`,
        entreprise: `Entreprise ${j + 1}`,
        dateDebut: new Date(2020 - j, 0, 1).toISOString(),
        dateFin: j === 0 ? null : new Date(2021 - j, 11, 31).toISOString(),
        description: `Description de l'expérience ${j + 1}`,
        secteur: secteurs[Math.floor(Math.random() * secteurs.length)]
      })
    }

    const diplomes = []
    if (niveau !== 'Sans diplôme') {
      for (let j = 0; j < Math.floor(Math.random() * 3) + 1; j++) {
        diplomes.push({
          intitule: `Diplôme ${j + 1}`,
          etablissement: `Établissement ${j + 1}`,
          annee: 2015 + j,
          niveau: niveau
        })
      }
    }

    candidats.push({
      id: generateId(),
      email: `candidat${i + 1}@example.com`,
      password: passwordHash,
      role: 'candidat',
      nom: noms[Math.floor(Math.random() * noms.length)],
      prenom: prenoms[Math.floor(Math.random() * prenoms.length)],
      telephone: `+261${Math.floor(Math.random() * 90000000) + 10000000}`,
      photo: null,
      cv: null,
      lettreMotivation: null,
      experiences,
      diplomes,
      langues: languesParlees,
      disponibilite: disponibilites[Math.floor(Math.random() * disponibilites.length)],
      cvVideo: Math.random() > 0.7 ? 'video-url' : null,
      statut: 'actif',
      dateNaissance: new Date(2000 - age, 0, 1).toISOString(),
      sexe,
      adresse: {
        ville: villes[Math.floor(Math.random() * villes.length)],
        region: 'Madagascar',
        pays: 'Madagascar'
      },
      competences: [`Compétence ${secteurExp} 1`, `Compétence ${secteurExp} 2`],
      permisConduire: Math.random() > 0.5 ? ['B'] : [],
      secteurRecherche: secteurExp,
      createdAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString()
    })
  }

  return candidats
}

// Entreprises (10+)
const generateEntreprises = () => {
  const nomsEntreprises = [
    'Maurice Construction Ltd', 'Hotel Paradise', 'AgriMaurice', 'Manufacturing Co', 
    'Logistics Solutions', 'Clean Services', 'Security Pro', 'Hospitality Group',
    'Building Corp', 'Service Excellence', 'Quality Services', 'Professional Group'
  ]
  const secteurs = ['Construction', 'Hôtellerie', 'Agriculture', 'Manufacture', 'Logistique', 'Nettoyage', 'Sécurité']
  const abonnements = ['Basique', 'Standard', 'Premium']

  const entreprises = []

  for (let i = 0; i < 12; i++) {
    const dateDebut = new Date(2023, Math.floor(Math.random() * 12), 1)
    const duree = [1, 3, 6, 12][Math.floor(Math.random() * 4)]
    const dateFin = new Date(dateDebut)
    dateFin.setMonth(dateFin.getMonth() + duree)

    entreprises.push({
      id: generateId(),
      email: `entreprise${i + 1}@example.com`,
      password: passwordHash,
      role: 'entreprise',
      nom: nomsEntreprises[i] || `Entreprise ${i + 1}`,
      prenom: 'Contact',
      telephone: `+230${Math.floor(Math.random() * 9000000) + 1000000}`,
      nomEntreprise: nomsEntreprises[i] || `Entreprise ${i + 1}`,
      secteur: secteurs[Math.floor(Math.random() * secteurs.length)],
      abonnement: abonnements[Math.floor(Math.random() * abonnements.length)],
      dateDebut: dateDebut.toISOString(),
      dateFin: dateFin.toISOString(),
      statut: dateFin > new Date() ? 'actif' : 'expire',
      adresse: 'Maurice',
      createdAt: dateDebut.toISOString()
    })
  }

  return entreprises
}

// Admin
const generateAdmin = () => {
  return [{
    id: generateId(),
    email: 'admin@example.com',
    password: passwordHash,
    role: 'admin',
    nom: 'Admin',
    prenom: 'Système',
    telephone: '+261340000000',
    createdAt: new Date(2023, 0, 1).toISOString()
  }]
}

// Offres (30+)
const generateOffres = (entreprises) => {
  const titres = [
    'Ouvrier de chantier', 'Serveur/Serveuse', 'Agriculteur', 'Ouvrier de production',
    'Chauffeur livreur', 'Agent de nettoyage', 'Agent de sécurité', 'Cuisinier',
    'Maçon', 'Jardinier', 'Ouvrier polyvalent', 'Manutentionnaire'
  ]
  const secteurs = ['Construction', 'Hôtellerie', 'Agriculture', 'Manufacture', 'Logistique', 'Nettoyage', 'Sécurité']
  const localisations = ['Port-Louis', 'Curepipe', 'Quatre-Bornes', 'Flic-en-Flac', 'Grand-Baie']
  const typesContrat = ['CDI', 'CDD', 'Intérim', 'Saisonnier']
  const competences = [
    'Expérience terrain', 'Force physique', 'Ponctualité', 'Travail d\'équipe',
    'Autonomie', 'Rigueur', 'Adaptabilité', 'Communication'
  ]

  const offres = []

  // Générer environ 100 offres
  for (let i = 0; i < 100; i++) {
    const entreprise = entreprises[Math.floor(Math.random() * entreprises.length)]
    // Générer des dates récentes (derniers 6 mois) pour que la plupart soient actives
    const moisAlea = Math.floor(Math.random() * 6) // 0 à 5 mois
    const jourAlea = Math.floor(Math.random() * 28) + 1
    const datePublication = new Date()
    datePublication.setMonth(datePublication.getMonth() - moisAlea)
    datePublication.setDate(jourAlea)
    
    const dateExpiration = new Date(datePublication)
    dateExpiration.setMonth(dateExpiration.getMonth() + 3)

    // S'assurer que la plupart des offres sont actives (80% actives, 20% expirées)
    const isActive = Math.random() > 0.2 || dateExpiration > new Date()

    const profilsRecherches = [
      'Candidat motivé avec expérience dans le secteur. Capacité à travailler en équipe et autonomie requise.',
      'Profil dynamique avec sens du service et bonne présentation. Expérience similaire appréciée.',
      'Personne rigoureuse, ponctuelle et fiable. Capacité d\'adaptation et polyvalence recherchées.',
      'Candidat sérieux avec expérience professionnelle. Bonne condition physique et disponibilité immédiate.'
    ]
    
    const conditionsTravails = [
      'Horaires : 8h-17h du lundi au vendredi. Travail en équipe dans un environnement dynamique.',
      'Horaires variables selon planning. Travail en extérieur possible. Tenue de travail fournie.',
      'Horaires de jour, travail en équipe. Formation fournie. Possibilité d\'évolution.',
      'Travail en rotation, week-ends possibles. Environnement professionnel et sécurisé.'
    ]
    
    const avantagesList = [
      'Logement fourni, Transport pris en charge, Assurance santé, Repas de midi',
      'Transport, Assurance, Prime de performance, Formation continue',
      'Logement, Transport, Assurance, 13ème mois',
      'Transport, Repas, Assurance, Congés payés, Prime'
    ]

    offres.push({
      id: generateId(),
      titre: titres[Math.floor(Math.random() * titres.length)],
      secteur: secteurs[Math.floor(Math.random() * secteurs.length)],
      localisation: localisations[Math.floor(Math.random() * localisations.length)],
      typeContrat: typesContrat[Math.floor(Math.random() * typesContrat.length)],
      description: `Description détaillée du poste ${i + 1}. Nous recherchons un candidat motivé avec de l'expérience dans le secteur ${secteurs[Math.floor(Math.random() * secteurs.length)]}. Le poste nécessite de la rigueur, de la ponctualité et un bon esprit d'équipe.`,
      competencesRequises: competences.slice(0, Math.floor(Math.random() * 4) + 2),
      languesRequises: [
        { langue: 'Français', niveau: 'Intermédiaire' },
        { langue: 'Anglais', niveau: 'Débutant' }
      ],
      experienceMin: Math.floor(Math.random() * 5),
      salaire: Math.floor(Math.random() * 20000) + 15000,
      datePublication: datePublication.toISOString(),
      dateExpiration: dateExpiration.toISOString(),
      statut: isActive && dateExpiration > new Date() ? 'active' : 'expiree',
      image: null,
      logo: null,
      entrepriseId: entreprise.id,
      entrepriseNom: entreprise.nomEntreprise,
      profilRecherche: profilsRecherches[Math.floor(Math.random() * profilsRecherches.length)],
      conditionsTravail: conditionsTravails[Math.floor(Math.random() * conditionsTravails.length)],
      avantages: avantagesList[Math.floor(Math.random() * avantagesList.length)]
    })
  }

  return offres
}

// Candidatures (100+)
const generateCandidatures = (candidats, offres) => {
  const statuts = ['en_attente', 'selectionne', 'refuse', 'entretien']
  const candidatures = []

  for (let i = 0; i < 120; i++) {
    const candidat = candidats[Math.floor(Math.random() * candidats.length)]
    const offre = offres[Math.floor(Math.random() * offres.length)]
    const dateCandidature = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)

    candidatures.push({
      id: generateId(),
      candidatId: candidat.id,
      offreId: offre.id,
      dateCandidature: dateCandidature.toISOString(),
      statut: statuts[Math.floor(Math.random() * statuts.length)],
      notes: '',
      documentsSupplementaires: []
    })
  }

  return candidatures
}

// Messages (50+)
const generateMessages = (users) => {
  const sujets = [
    'Nouvelle offre correspondante', 'Mise à jour de candidature', 'Demande d\'information',
    'Confirmation d\'entretien', 'Documents requis', 'Feedback candidature'
  ]
  const messages = []

  for (let i = 0; i < 60; i++) {
    const expediteur = users[Math.floor(Math.random() * users.length)]
    let destinataire = users[Math.floor(Math.random() * users.length)]
    while (destinataire.id === expediteur.id) {
      destinataire = users[Math.floor(Math.random() * users.length)]
    }

    messages.push({
      id: generateId(),
      expediteurId: expediteur.id,
      expediteurNom: `${expediteur.prenom} ${expediteur.nom}`,
      expediteurRole: expediteur.role,
      destinataireId: destinataire.id,
      destinataireNom: `${destinataire.prenom} ${destinataire.nom}`,
      sujet: sujets[Math.floor(Math.random() * sujets.length)],
      contenu: `Contenu du message ${i + 1}. Ceci est un message de démonstration.`,
      dateEnvoi: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      lu: Math.random() > 0.5,
      pieceJointe: null,
      conversationId: null,
      reponseA: null
    })
  }

  return messages
}

// Notifications (30+ par type)
const generateNotifications = (users) => {
  const types = [
    'nouvelle_offre', 'changement_statut', 'nouveau_message', 'rappel_document', 'entretien_planifie'
  ]
  const notifications = []

  users.forEach(user => {
    for (let i = 0; i < 35; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      let message = ''

      switch (type) {
        case 'nouvelle_offre':
          message = 'Une nouvelle offre correspond à votre profil'
          break
        case 'changement_statut':
          message = 'Le statut de votre candidature a été mis à jour'
          break
        case 'nouveau_message':
          message = 'Vous avez reçu un nouveau message'
          break
        case 'rappel_document':
          message = 'N\'oubliez pas de compléter votre profil'
          break
        case 'entretien_planifie':
          message = 'Un entretien a été planifié pour vous'
          break
      }

      notifications.push({
        id: generateId(),
        userId: user.id,
        type,
        message,
        date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        lu: Math.random() > 0.6,
        lien: '#'
      })
    }
  })

  return notifications
}

// Génération complète
export const generateMockData = () => {
  const candidats = generateCandidats()
  const entreprises = generateEntreprises()
  const admin = generateAdmin()
  const users = [...candidats, ...entreprises, ...admin]
  const offres = generateOffres(entreprises)
  const candidatures = generateCandidatures(candidats, offres)
  const messages = generateMessages(users)
  const notifications = generateNotifications(users)

  return {
    users,
    offres,
    candidatures,
    messages,
    notifications,
    demandesEntreprises: [],
    contrats: []
  }
}

export default generateMockData



