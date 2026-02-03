
import React, { useState, useRef } from 'react';
// Added PlusSquare to the imports from lucide-react
import { X, Send, Music, Upload, FileText, CheckCircle2, Globe, Lock, User, PlusSquare } from 'lucide-react';
import { ExtendedSong } from '../constants';

interface SongSubmissionProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (song: ExtendedSong) => void;
  defaultGenre?: string | null;
  currentUser?: { name: string } | null;
}

const GENRES = ['Sertanejo', 'Rock', 'Pop', 'Reggae', 'Gospel', 'Forró', 'MPB', 'Samba', 'Sofrência'];

const SongSubmission: React.FC<SongSubmissionProps> = ({ isOpen, onClose, onSubmit, defaultGenre, currentUser }) => {
  const [formData, setFormData] = useState({ 
    title: '', 
    artist: '', 
    content: '', 
    genre: defaultGenre || 'Pop',
    difficulty: 'Médio' as 'Fácil' | 'Médio' | 'Difícil',
    isPublic: true
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (file.name.endsWith('.json')) {
        try {
          const data = JSON.parse(text);
          setFormData({
            ...formData,
            title: data.title || '',
            artist: data.artist || '',
            content: data.content || '',
            genre: data.genre || formData.genre,
            difficulty: data.difficulty || 'Médio'
          });
        } catch (err) {
          alert("Erro ao ler arquivo JSON.");
        }
      } else {
        const lines = text.split('\n');
        setFormData({
          ...formData,
          title: lines[0]?.trim() || file.name.replace('.txt', ''),
          artist: lines[1]?.includes('-') ? lines[1].split('-')[0].trim() : lines[1]?.trim() || 'Artista Desconhecido',
          content: text
        });
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    
    onSubmit({ 
      id: `user-${Date.now()}`, 
      ...formData, 
      verified: false,
      author: currentUser?.name || 'Músico Anônimo'
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setFormData({ 
        title: '', 
        artist: '', 
        content: '', 
        genre: defaultGenre || 'Pop', 
        difficulty: 'Médio',
        isPublic: true
      });
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#22c55e] rounded-xl flex items-center justify-center shadow-lg shadow-[#22c55e]/20">
              <PlusSquare className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-black text-xl uppercase tracking-tight">Publicar Cifra</h3>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Compartilhe com a comunidade master</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-20 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-[#22c55e]/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-[#22c55e]" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase">Publicado com Sucesso!</h2>
            <p className="text-gray-500 mt-2">Sua cifra agora faz parte do feed da comunidade.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto max-h-[75vh] no-scrollbar">
            
            <div className="flex gap-4 mb-4">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, isPublic: true})}
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${formData.isPublic ? 'bg-[#22c55e]/10 border-[#22c55e] text-[#22c55e]' : 'bg-gray-50 border-transparent text-gray-400'}`}
                >
                   <Globe className="w-5 h-5" />
                   <div className="text-left">
                      <p className="text-xs font-black uppercase">Público</p>
                      <p className="text-[8px] font-bold uppercase opacity-60">Visível para todos</p>
                   </div>
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, isPublic: false})}
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${!formData.isPublic ? 'bg-gray-900 border-gray-900 text-white' : 'bg-gray-50 border-transparent text-gray-400'}`}
                >
                   <Lock className="w-5 h-5" />
                   <div className="text-left">
                      <p className="text-xs font-black uppercase">Privado</p>
                      <p className="text-[8px] font-bold uppercase opacity-60">Apenas meu perfil</p>
                   </div>
                </button>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-[#22c55e] hover:bg-[#22c55e]/5 cursor-pointer transition-all group"
            >
              <FileText className="w-6 h-6 text-gray-300 group-hover:text-[#22c55e]" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Importar TXT/JSON</p>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".txt,.json" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Música</label>
                <input type="text" placeholder="Ex: Tempo Perdido" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#22c55e] rounded-xl outline-none font-bold text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Artista</label>
                <input type="text" placeholder="Ex: Legião Urbana" required value={formData.artist} onChange={e => setFormData({...formData, artist: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#22c55e] rounded-xl outline-none font-bold text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ritmo</label>
                <select value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#22c55e] rounded-xl outline-none font-bold text-sm appearance-none cursor-pointer">
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Dificuldade</label>
                <select value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value as any})} className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#22c55e] rounded-xl outline-none font-bold text-sm appearance-none cursor-pointer">
                  <option value="Fácil">Fácil</option>
                  <option value="Médio">Médio</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cifra (Letra e [Acordes])</label>
              <textarea placeholder="[C]No dia em que eu saí de [G]casa..." required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full h-40 px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#22c55e] rounded-xl outline-none font-mono text-sm resize-none"></textarea>
            </div>

            <button type="submit" className="w-full py-4 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
              {formData.isPublic ? 'Publicar Globalmente' : 'Salvar no meu Perfil'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SongSubmission;
