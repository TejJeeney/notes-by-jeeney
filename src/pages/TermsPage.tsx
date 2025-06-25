
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, Users, Gavel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  const sections = [
    {
      icon: FileText,
      title: "1. Acceptance of Terms",
      content: "By accessing and using PawNotes, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
    },
    {
      icon: Shield,
      title: "2. Privacy and Data Protection",
      content: "We are committed to protecting your privacy. Your notes and personal data are encrypted and stored securely. We do not share your personal information with third parties without your explicit consent."
    },
    {
      icon: Users,
      title: "3. User Responsibilities",
      content: "You are responsible for maintaining the confidentiality of your account and password. You agree not to use the service for any unlawful or prohibited activities."
    },
    {
      icon: Gavel,
      title: "4. Service Availability",
      content: "We strive to keep PawNotes available 24/7, but we cannot guarantee uninterrupted service. We reserve the right to modify or discontinue the service with or without notice."
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Terms & Conditions
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Please read these terms carefully before using PawNotes
            </p>
          </div>
        </div>

        <div className="space-y-6 mb-12">
          {sections.map((section, index) => (
            <Card 
              key={index}
              className="hover:shadow-xl hover:scale-102 transition-all duration-300 animate-fade-in border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {section.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-700">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-3 text-indigo-800 dark:text-indigo-300">
              Contact Information
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              If you have any questions about these Terms & Conditions, please contact us through the app's support system.
            </p>
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
