
import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  maxTagLength?: number;
}

export function TagInput({ 
  tags, 
  onTagsChange, 
  placeholder = "Add tags...", 
  maxTags = 50,
  maxTagLength = 50 
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tagText: string) => {
    const trimmedTag = tagText.trim();
    
    if (!trimmedTag) return;
    
    if (trimmedTag.length > maxTagLength) {
      alert(`Tag must be ${maxTagLength} characters or less`);
      return;
    }
    
    if (tags.length >= maxTags) {
      alert(`Cannot add more than ${maxTags} tags`);
      return;
    }
    
    if (tags.includes(trimmedTag)) {
      alert('Tag already exists');
      return;
    }
    
    onTagsChange([...tags, trimmedTag]);
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleInputChange = (value: string) => {
    // Prevent input that would exceed max length
    if (value.length <= maxTagLength) {
      setInputValue(value);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge 
            key={index} 
            variant="secondary" 
            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="ml-1 hover:bg-blue-300 dark:hover:bg-blue-700 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length >= maxTags ? `Max ${maxTags} tags reached` : placeholder}
        className="border-slate-200 dark:border-slate-700 focus:border-blue-400 dark:focus:border-blue-400"
        disabled={tags.length >= maxTags}
      />
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {tags.length}/{maxTags} tags • {inputValue.length}/{maxTagLength} characters
      </p>
    </div>
  );
}
