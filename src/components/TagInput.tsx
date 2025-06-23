
import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Hash } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ tags, onTagsChange, placeholder = "Add tags..." }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const newTag = inputValue.trim().replace(/^#/, '');
    if (newTag && !tags.includes(newTag)) {
      onTagsChange([...tags, newTag]);
    }
    setInputValue('');
  };

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      {tags.map((tag, index) => (
        <Badge 
          key={index} 
          variant="secondary" 
          className="flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
        >
          <Hash className="w-3 h-3" />
          {tag}
          <button
            onClick={() => removeTag(index)}
            className="ml-1 hover:text-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
      <div className="flex items-center gap-2 flex-1 min-w-[120px]">
        <Hash className="w-4 h-4 text-slate-400" />
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={placeholder}
          className="border-0 p-0 h-auto bg-transparent focus:ring-0 focus:outline-none"
        />
      </div>
    </div>
  );
}
