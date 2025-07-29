
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { ModernAppSidebar } from "@/components/ModernAppSidebar";
import { ModernNotesView } from "@/components/ModernNotesView";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 md:h-32 md:w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-300">
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex w-full min-h-screen">
          <div className="h-screen overflow-auto w-full">
            <ModernNotesView />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;
