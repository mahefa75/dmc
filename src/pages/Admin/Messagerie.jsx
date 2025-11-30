import { useState } from 'react'
import { Header, Sidebar } from '../../components/Layout'
import { Card, Button, Input } from '../../components/UI'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { Send } from 'lucide-react'

const AdminMessagerie = () => {
  const { messages } = useData()
  const { t } = useLanguage()
  const [selectedMessage, setSelectedMessage] = useState(null)

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-display font-bold mb-8 text-gray-100">{t('admin.messagerie')}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <h2 className="font-semibold mb-4 text-gray-100">{t('messagerie.inbox')}</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`p-3 rounded cursor-pointer transition-colors ${
                        selectedMessage?.id === msg.id ? 'bg-gold-500/20 border border-gold-500/30' : 'hover:bg-navy-600'
                      }`}
                    >
                      <p className="font-medium text-sm text-gray-100">{msg.sujet}</p>
                      <p className="text-xs text-gray-400">{msg.expediteurNom}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2">
              {selectedMessage ? (
                <Card>
                  <h2 className="font-semibold mb-2 text-gray-100">{selectedMessage.sujet}</h2>
                  <p className="text-sm text-gray-400 mb-4">
                    De: {selectedMessage.expediteurNom} - {new Date(selectedMessage.dateEnvoi).toLocaleString()}
                  </p>
                  <p className="text-gray-300 whitespace-pre-line">{selectedMessage.contenu}</p>
                </Card>
              ) : (
                <Card>
                  <p className="text-center text-gray-400">Sélectionnez un message</p>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminMessagerie
