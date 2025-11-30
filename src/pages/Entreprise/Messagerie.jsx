import { useState } from 'react'
import { Header, Sidebar } from '../../components/Layout'
import { Card, Button, Input } from '../../components/UI'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { Send } from 'lucide-react'

const EntrepriseMessagerie = () => {
  const { user } = useAuth()
  const { messages, addMessage } = useData()
  const { t } = useLanguage()
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [newMessage, setNewMessage] = useState({ sujet: '', contenu: '' })

  const mesMessages = messages.filter(m => 
    m.destinataireId === user?.id || m.expediteurId === user?.id
  )

  const handleSend = () => {
    if (!newMessage.sujet || !newMessage.contenu) return

    addMessage({
      id: Date.now().toString(),
      expediteurId: user.id,
      expediteurNom: user.nomEntreprise,
      expediteurRole: user.role,
      destinataireId: 'admin',
      destinataireNom: 'Administrateur',
      sujet: newMessage.sujet,
      contenu: newMessage.contenu,
      dateEnvoi: new Date().toISOString(),
      lu: false
    })

    setNewMessage({ sujet: '', contenu: '' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="entreprise" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">{t('messagerie.title')}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <h2 className="font-semibold mb-4">{t('messagerie.inbox')}</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {mesMessages.map(msg => (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`p-3 rounded cursor-pointer ${
                        selectedMessage?.id === msg.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                      }`}
                    >
                      <p className="font-medium text-sm">{msg.sujet}</p>
                      <p className="text-xs text-gray-500">{msg.expediteurNom}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2">
              {selectedMessage ? (
                <Card>
                  <h2 className="font-semibold mb-2">{selectedMessage.sujet}</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    De: {selectedMessage.expediteurNom} - {new Date(selectedMessage.dateEnvoi).toLocaleString()}
                  </p>
                  <p className="text-gray-700 whitespace-pre-line">{selectedMessage.contenu}</p>
                </Card>
              ) : (
                <Card>
                  <h2 className="font-semibold mb-4">Nouveau message</h2>
                  <div className="space-y-4">
                    <Input
                      label="Sujet"
                      value={newMessage.sujet}
                      onChange={(e) => setNewMessage({ ...newMessage, sujet: e.target.value })}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        value={newMessage.contenu}
                        onChange={(e) => setNewMessage({ ...newMessage, contenu: e.target.value })}
                        rows={10}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <Button onClick={handleSend} variant="primary">
                      <Send className="w-4 h-4 mr-2 inline" />
                      {t('messagerie.send')}
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default EntrepriseMessagerie







