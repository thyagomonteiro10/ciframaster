
import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative group w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busque artistas ou músicas..."
          className="w-full pl-10 pr-10 py-2 md:py-2.5 bg-gray-100 rounded-full text-xs md:text-sm text-black outline-none focus:ring-2 focus:ring-[#38cc63]/20 focus:bg-white transition-all border border-transparent focus:border-[#38cc63]/40"
        />
        <Search className="absolute left-3 top-2.5 md:top-3 w-4 h-4 text-gray-400 group-focus-within:text-[#38cc63] transition-colors" />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-1.5 md:top-2 p-1 text-gray-400 hover:text-[#38cc63] transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-[#38cc63] border-t-transparent rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
        </button>
      </div>
    </form>
  );
};

export default SearchInput;
