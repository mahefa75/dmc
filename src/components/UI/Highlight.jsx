import React from 'react'

/**
 * Composant pour surligner les termes de recherche dans un texte
 * @param {string} text - Le texte complet à afficher
 * @param {string} searchTerm - Le terme à surligner
 * @param {string} className - Classes CSS additionnelles
 */
const Highlight = ({ text, searchTerm, className = '' }) => {
  if (!searchTerm || !text) {
    return <span className={className}>{text}</span>
  }

  // Échapper les caractères spéciaux regex
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  try {
    // Créer une regex pour trouver toutes les occurrences (insensible à la casse)
    const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi')
    const parts = text.split(regex)

    return (
      <span className={className}>
        {parts.map((part, index) => {
          // Si la partie correspond au terme recherché (insensible à la casse)
          if (part.toLowerCase() === searchTerm.toLowerCase()) {
            return (
              <mark
                key={index}
                className="bg-yellow-200 text-gray-900 font-semibold px-0.5 rounded"
              >
                {part}
              </mark>
            )
          }
          return <React.Fragment key={index}>{part}</React.Fragment>
        })}
      </span>
    )
  } catch (error) {
    // En cas d'erreur, retourner le texte sans highlight
    console.error('Erreur lors du highlight:', error)
    return <span className={className}>{text}</span>
  }
}

export default Highlight
