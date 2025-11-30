import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Header, Footer } from '../components/Layout'
import { Card, Button } from '../components/UI'
import { useLanguage } from '../contexts/LanguageContext'
import { ChevronDown, ChevronUp, User, Building2, HelpCircle } from 'lucide-react'

const FAQ = () => {
  const { t } = useLanguage()
  const [openItems, setOpenItems] = useState({})

  const toggleItem = (id) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const candidatQuestions = [
    { id: 'q1', question: t('faq.q1'), answer: t('faq.a1') },
    { id: 'q2', question: t('faq.q2'), answer: t('faq.a2') },
    { id: 'q3', question: t('faq.q3'), answer: t('faq.a3') }
  ]

  const entrepriseQuestions = [
    { id: 'q4', question: t('faq.q4'), answer: t('faq.a4') },
    { id: 'q5', question: t('faq.q5'), answer: t('faq.a5') },
    { id: 'q6', question: t('faq.q6'), answer: t('faq.a6') }
  ]

  const generalQuestions = [
    { id: 'q7', question: t('faq.q7'), answer: t('faq.a7') },
    { id: 'q8', question: t('faq.q8'), answer: t('faq.a8') }
  ]

  const FAQItem = ({ id, question, answer }) => (
    <div className="border-b border-navy-600 last:border-0">
      <button
        onClick={() => toggleItem(id)}
        className="w-full flex items-center justify-between py-4 text-left hover:text-gold-500 transition-colors"
      >
        <span className="text-gray-100 font-medium pr-4">{question}</span>
        {openItems[id] ? (
          <ChevronUp className="w-5 h-5 text-gold-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {openItems[id] && (
        <div className="pb-4 text-gray-400 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  )

  const FAQSection = ({ icon: Icon, title, questions }) => (
    <Card className="p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Icon className="w-8 h-8 text-gold-500" />
        <h2 className="text-2xl font-bold text-gray-100">{title}</h2>
      </div>
      <div>
        {questions.map(q => (
          <FAQItem key={q.id} {...q} />
        ))}
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-r from-navy-800 to-navy-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-display font-bold mb-4 text-gray-100">{t('faq.title')}</h1>
            <p className="text-xl text-gray-400">{t('faq.subtitle')}</p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection 
              icon={User} 
              title={t('faq.candidateSection')} 
              questions={candidatQuestions} 
            />
            <FAQSection 
              icon={Building2} 
              title={t('faq.companySection')} 
              questions={entrepriseQuestions} 
            />
            <FAQSection 
              icon={HelpCircle} 
              title={t('faq.generalSection')} 
              questions={generalQuestions} 
            />
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-navy-800 via-navy-900 to-navy-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-100">{t('faq.stillQuestions')}</h2>
            <Link to="/contact">
              <Button variant="gold" size="lg">{t('faq.contactUs')}</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default FAQ

