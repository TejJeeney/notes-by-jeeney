
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="transition-all duration-300 hover:scale-110 hover:rotate-12"
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 text-slate-600 hover:text-purple-600 transition-colors duration-300" />
      ) : (
        <Sun className="w-4 h-4 text-yellow-500 hover:text-yellow-400 transition-colors duration-300" />
      )}
    </Button>
  );
}
