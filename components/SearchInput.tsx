
import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSearch(query); }} className="relative w-full">
      <div className="relative group w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busque artistas ou músicas..."
          className="w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-full text-sm text-black outline-none focus:ring-2 focus:ring-[#22c55e]/20 focus:bg-white border border-transparent focus:border-[#22c55e]/40 transition-all"
        />
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-[#22c55e]" />
        {isLoading && <div className="absolute right-3 top-3 w-4 h-4 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />}
      </div>
    </form>
  );
};

export default SearchInput;
