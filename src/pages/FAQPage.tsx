
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, MessageSquare, Shield, Zap, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FAQPage() {
  const faqs = [
    {
      icon: MessageSquare,
      question: "What AI features does PawNotes offer?",
      answer: "PawNotes includes Chat Assistant (JEENEY), Zodiac Insights, Language Translator, Smart Stickers, AI Summary, and Story Generator - all powered by Google's Gemini AI."
    },
    {
      icon: Shield,
      question: "Is my data secure?",
      answer: "Yes! Your notes are encrypted and stored securely. We use industry-standard security measures and do not share your data with third parties."
    },
    {
      icon: Zap,
      question: "How does the AI Summary feature work?",
      answer: "Our AI Summary feature uses Gemini AI to analyze your notes and create concise, meaningful summaries that capture the main points and key information."
    },
    {
      icon: FileText,
      question: "Can I export my notes?",
      answer: "Yes! You can export all your notes as a JSON file from the sidebar. You can also import notes from previous exports."
    },
    {
      icon: MessageSquare,
      question: "What makes the Chat Assistant special?",
      answer: "JEENEY (our Chat Assistant) maintains conversation context across sessions and provides a ChatGPT-style experience with conversation history and clean chat bubbles."
    },
    {
      icon: HelpCircle,
      question: "How do I use the Zodiac Insights feature?",
      answer: "Select your zodiac sign and get personalized, fun advice about how to approach your note-taking for the day. It's designed to be entertaining and creative!"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <Link to="/">
            <Button variant="outline" className="mb-6 hover:scale-105 transition-transform duration-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to App
            </Button>
          </Link>
          
          <div className="text-center mb-12">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl animate-scale-in">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Find answers to common questions about PawNotes
            </p>
          </div>
        </div>

        <Card className="mb-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60">
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-slate-200/60 dark:border-slate-700/60">
                  <AccordionTrigger className="text-left hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <faq.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-slate-300 leading-relaxed ml-11">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-700">
          <CardHeader>
            <CardTitle className="text-center text-indigo-800 dark:text-indigo-300">
              Still have questions?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Can't find what you're looking for? Try asking JEENEY, our AI Chat Assistant!
            </p>
            <Link to="/">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:scale-105 transition-all duration-200">
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat with JEENEY
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="text-center py-8 animate-fade-in">
          <p className="text-lg text-slate-500 dark:text-slate-400">
            Made with love by{' '}
            <span className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent font-bold animate-pulse hover:animate-bounce transition-all duration-300">
              JEENEY
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
