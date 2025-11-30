import { useState, useMemo } from 'react'
import { Header, Sidebar } from '../../components/Layout'
import { Card, Button, Input, FileUpload, Badge } from '../../components/UI'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useToast } from '../../components/UI/Toast'
import { Send, Inbox, Send as SendIcon, FileText, Archive, Trash2, Search, Paperclip, X, Reply, Forward } from 'lucide-react'

const CandidatMessagerie = () => {
  const { user } = useAuth()
  const { messages, addMessage, updateMessage, deleteMessage } = useData()
  const { t } = useLanguage()
  const { showToast, ToastContainer } = useToast()
  const [selectedFolder, setSelectedFolder] = useState('inbox')
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [newMessage, setNewMessage] = useState({ 
    sujet: '', 
    contenu: '', 
    pieceJointe: null,
    isDraft: false 
  })

  const mesMessages = useMemo(() => {
    let filtered = messages.filter(m => {
      if (selectedFolder === 'inbox') {
        return m.destinataireId === user?.id && !m.archive && !m.deleted
      } else if (selectedFolder === 'sent') {
        return m.expediteurId === user?.id && !m.archive && !m.deleted
      } else if (selectedFolder === 'drafts') {
        return m.expediteurId === user?.id && m.isDraft && !m.deleted
      } else if (selectedFolder === 'archived') {
        return (m.destinataireId === user?.id || m.expediteurId === user?.id) && m.archive && !m.deleted
      } else if (selectedFolder === 'trash') {
        return (m.destinataireId === user?.id || m.expediteurId === user?.id) && m.deleted
      }
      return false
    })

    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.sujet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.contenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.expediteurNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.destinataireNom.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered.sort((a, b) => new Date(b.dateEnvoi) - new Date(a.dateEnvoi))
  }, [messages, user, selectedFolder, searchTerm])

  const handleSend = () => {
    if (!newMessage.sujet || !newMessage.contenu) {
      showToast('Veuillez remplir le sujet et le message', 'error')
      return
    }

    const messageData = {
      id: Date.now().toString(),
      expediteurId: user.id,
      expediteurNom: `${user.prenom} ${user.nom}`,
      expediteurRole: user.role,
      destinataireId: 'admin',
      destinataireNom: 'Administrateur',
      sujet: newMessage.sujet,
      contenu: newMessage.contenu,
      dateEnvoi: new Date().toISOString(),
      lu: false,
      pieceJointe: newMessage.pieceJointe,
      archive: false,
      deleted: false,
      isDraft: false,
      conversationId: null,
      reponseA: null
    }

    addMessage(messageData)
    showToast('Message envoyé avec succès', 'success')
    setNewMessage({ sujet: '', contenu: '', pieceJointe: null, isDraft: false })
    setSelectedFolder('sent')
    setSelectedMessage(null)
  }

  const handleSaveDraft = () => {
    if (!newMessage.sujet && !newMessage.contenu) {
      showToast('Le brouillon doit contenir au moins un sujet ou un message', 'error')
      return
    }

    const messageData = {
      id: Date.now().toString(),
      expediteurId: user.id,
      expediteurNom: `${user.prenom} ${user.nom}`,
      expediteurRole: user.role,
      destinataireId: 'admin',
      destinataireNom: 'Administrateur',
      sujet: newMessage.sujet || '(Sans objet)',
      contenu: newMessage.contenu,
      dateEnvoi: new Date().toISOString(),
      lu: false,
      pieceJointe: newMessage.pieceJointe,
      archive: false,
      deleted: false,
      isDraft: true,
      conversationId: null,
      reponseA: null
    }

    addMessage(messageData)
    showToast('Brouillon enregistré', 'success')
    setNewMessage({ sujet: '', contenu: '', pieceJointe: null, isDraft: false })
    setSelectedFolder('drafts')
    setSelectedMessage(null)
  }

  const handleArchive = (messageId) => {
    updateMessage(messageId, { archive: true })
    showToast('Message archivé', 'success')
    setSelectedMessage(null)
  }

  const handleDelete = (messageId) => {
    updateMessage(messageId, { deleted: true })
    showToast('Message supprimé', 'success')
    setSelectedMessage(null)
  }

  const handleRestore = (messageId) => {
    updateMessage(messageId, { deleted: false })
    showToast('Message restauré', 'success')
    setSelectedMessage(null)
  }

  const handleMarkAsRead = (messageId) => {
    updateMessage(messageId, { lu: true })
  }

  const handleFileSelect = (file) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewMessage({
          ...newMessage,
          pieceJointe: {
            nom: file.name,
            type: file.type,
            taille: file.size,
            data: e.target.result
          }
        })
      }
      reader.readAsDataURL(file)
    } else {
      setNewMessage({ ...newMessage, pieceJointe: null })
    }
  }

  const unreadCount = messages.filter(m => 
    m.destinataireId === user?.id && !m.lu && !m.archive && !m.deleted
  ).length

  const folders = [
    { id: 'inbox', label: t('messagerie.inbox'), icon: Inbox, count: unreadCount },
    { id: 'sent', label: t('messagerie.sent'), icon: SendIcon },
    { id: 'drafts', label: t('messagerie.drafts'), icon: FileText },
    { id: 'archived', label: t('messagerie.archived'), icon: Archive },
    { id: 'trash', label: t('messagerie.trash'), icon: Trash2 }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="candidat" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-display font-bold mb-8 text-gray-100">{t('messagerie.title')}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Dossiers */}
            <div className="lg:col-span-1">
              <Card>
                <h2 className="font-semibold mb-4 text-gray-100">Dossiers</h2>
                <div className="space-y-2">
                  {folders.map(folder => {
                    const Icon = folder.icon
                    return (
                      <button
                        key={folder.id}
                        onClick={() => {
                          setSelectedFolder(folder.id)
                          setSelectedMessage(null)
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                          selectedFolder === folder.id
                            ? 'bg-gold-500/20 text-gold-500'
                            : 'text-gray-300 hover:bg-navy-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5" />
                          <span>{folder.label}</span>
                        </div>
                        {folder.count > 0 && (
                          <Badge variant="primary">{folder.count}</Badge>
                        )}
                      </button>
                    )
                  })}
                </div>
              </Card>
            </div>

            {/* Liste des messages */}
            <div className="lg:col-span-1">
              <Card>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {mesMessages.length === 0 ? (
                    <p className="text-center text-gray-400 py-8 text-sm">
                      {selectedFolder === 'inbox' && 'Aucun message reçu'}
                      {selectedFolder === 'sent' && 'Aucun message envoyé'}
                      {selectedFolder === 'drafts' && 'Aucun brouillon'}
                      {selectedFolder === 'archived' && 'Aucun message archivé'}
                      {selectedFolder === 'trash' && 'Corbeille vide'}
                    </p>
                  ) : (
                    mesMessages.map(msg => (
                      <div
                        key={msg.id}
                        onClick={() => {
                          setSelectedMessage(msg)
                          if (msg.destinataireId === user?.id && !msg.lu) {
                            handleMarkAsRead(msg.id)
                          }
                        }}
                        className={`p-3 rounded cursor-pointer transition-colors ${
                          selectedMessage?.id === msg.id
                            ? 'bg-gold-500/20 border-l-4 border-gold-500'
                            : !msg.lu && msg.destinataireId === user?.id
                            ? 'bg-gold-500/10 hover:bg-gold-500/20'
                            : 'hover:bg-navy-600'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <p className={`font-medium text-sm ${!msg.lu && msg.destinataireId === user?.id ? 'font-bold' : ''}`}>
                            {selectedFolder === 'sent' ? msg.destinataireNom : msg.expediteurNom}
                          </p>
                          {msg.pieceJointe && (
                            <Paperclip className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 truncate mb-1">{msg.sujet}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(msg.dateEnvoi).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            {/* Détail message ou nouveau message */}
            <div className="lg:col-span-2">
              {selectedMessage ? (
                <Card>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                  <h2 className="text-xl font-semibold mb-2 text-gray-100">{selectedMessage.sujet}</h2>
                  <div className="text-sm text-gray-400 space-y-1">
                        <p>
                          <span className="font-medium">De:</span> {selectedMessage.expediteurNom}
                        </p>
                        <p>
                          <span className="font-medium">À:</span> {selectedMessage.destinataireNom}
                        </p>
                        <p>
                          <span className="font-medium">Date:</span>{' '}
                          {new Date(selectedMessage.dateEnvoi).toLocaleString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {selectedFolder !== 'trash' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleArchive(selectedMessage.id)}
                          >
                            <Archive className="w-4 h-4 mr-1" />
                            Archiver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(selectedMessage.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Supprimer
                          </Button>
                        </>
                      )}
                      {selectedFolder === 'trash' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestore(selectedMessage.id)}
                        >
                          Restaurer
                        </Button>
                      )}
                    </div>
                  </div>

                  {selectedMessage.pieceJointe && (
                    <div className="mb-4 p-3 bg-navy-800 rounded-lg border border-navy-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-5 h-5 text-gray-400" />
                          <span className="text-sm font-medium">{selectedMessage.pieceJointe.nom}</span>
                        </div>
                        {selectedMessage.pieceJointe.data && (
                          <a
                            href={selectedMessage.pieceJointe.data}
                            download={selectedMessage.pieceJointe.nom}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Télécharger
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="prose max-w-none">
                    <p className="text-gray-300 whitespace-pre-line">{selectedMessage.contenu}</p>
                  </div>

                  {selectedFolder !== 'trash' && selectedMessage.expediteurId !== user?.id && (
                    <div className="mt-6 pt-6 border-t">
                      <Button
                        variant="primary"
                        onClick={() => {
                          setNewMessage({
                            sujet: `Re: ${selectedMessage.sujet}`,
                            contenu: '',
                            pieceJointe: null,
                            isDraft: false
                          })
                          setSelectedMessage(null)
                        }}
                      >
                        <Reply className="w-4 h-4 mr-2" />
                        Répondre
                      </Button>
                    </div>
                  )}
                </Card>
              ) : (
                <Card>
                  <h2 className="font-semibold mb-4 text-gray-100">
                    {selectedFolder === 'drafts' ? 'Nouveau brouillon' : 'Nouveau message'}
                  </h2>
                  <div className="space-y-4">
                    <Input
                      label={t('messagerie.subject')}
                      value={newMessage.sujet}
                      onChange={(e) => setNewMessage({ ...newMessage, sujet: e.target.value })}
                      placeholder="Sujet du message"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        {t('messagerie.content')}
                      </label>
                      <textarea
                        value={newMessage.contenu}
                        onChange={(e) => setNewMessage({ ...newMessage, contenu: e.target.value })}
                        rows={10}
                        className="w-full px-4 py-2 bg-navy-800 border border-navy-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                        placeholder="Votre message..."
                      />
                    </div>
                    <div>
                      <FileUpload
                        label="Pièce jointe (optionnel)"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        maxSize={10 * 1024 * 1024}
                        onFileSelect={handleFileSelect}
                        value={newMessage.pieceJointe ? {
                          name: newMessage.pieceJointe.nom,
                          size: newMessage.pieceJointe.taille
                        } : null}
                      />
                      {newMessage.pieceJointe && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                          <Paperclip className="w-4 h-4" />
                          <span>{newMessage.pieceJointe.nom}</span>
                          <button
                            onClick={() => setNewMessage({ ...newMessage, pieceJointe: null })}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSend} variant="gold">
                        <Send className="w-4 h-4 mr-2 inline" />
                        {t('messagerie.send')}
                      </Button>
                      <Button onClick={handleSaveDraft} variant="outline">
                        <FileText className="w-4 h-4 mr-2 inline" />
                        Enregistrer comme brouillon
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}

export default CandidatMessagerie
