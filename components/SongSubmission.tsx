
import React, { useState, useMemo } from 'react';
import { X, Send, Music, User, BookOpen, Layers, Type, CheckCircle2, AlertCircle, Eye, Info } from 'lucide-react';
import { ExtendedSong } from '../constants';
import ChordDisplay from './ChordDisplay';

interface SongSubmissionProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (song: ExtendedSong) => void;
}

const GENRES = ['Sertanejo', 'Rock', 'Pop', 'Reggae', 'Gospel', 'Forró', 'MPB', 'Samba', 'Sofrência'];

const SongSubmission: React.FC<SongSubmissionProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: 'Sertanejo',
    difficulty: 'Fácil' as 'Fácil' | 'Médio' | 'Difícil',
    originalKey: '',
    content: ''
  });

  const [showPreview, setShowPreview] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isFormValid = useMemo(() => {
    return formData.title.trim() && formData.artist.trim() && formData.content.trim().length > 20;
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const newSong: ExtendedSong = {
      id: `user-${Date.now()}`,
      title: formData.title,
      artist: formData.artist,
      genre: formData.genre,
      difficulty: formData.difficulty,
      originalKey: formData.originalKey,
      content: formData.content,
      verified: false
    };

    onSubmit(newSong);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setFormData({
        title: '',
        artist: '',
        genre: 'Sertanejo',
        difficulty: 'Fácil',
        originalKey: '',
        content: ''
      });
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#38cc63] rounded-2xl flex items-center justify-center shadow-lg shadow-[#38cc63]/20">
              <Send className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-black text-xl tracking-tight uppercase">Enviar Nova Cifra</h3>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Contribua com a comunidade</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                 <CheckCircle2 className="w-10 h-10 text-[#38cc63]" />
               </div>
               <h2 className="text-3xl font-black text-gray-900 uppercase mb-2">Música Enviada!</h2>
               <p className="text-gray-500 font-medium">Obrigado por fortalecer nossa comunidade musical.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left Column: Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Título da Música</label>
                    <div className="relative">
                      <Music className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input 
                        type="text"
                        required
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        placeholder="Ex: É o Amor"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#38cc63] rounded-2xl outline-none font-bold text-sm transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Artista / Banda</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input 
                        type="text"
                        required
                        value={formData.artist}
                        onChange={e => setFormData({...formData, artist: e.target.value})}
                        placeholder="Ex: Zezé Di Camargo"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#38cc63] rounded-2xl outline-none font-bold text-sm transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gênero</label>
                    <select 
                      value={formData.genre}
                      onChange={e => setFormData({...formData, genre: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#38cc63] rounded-2xl outline-none font-bold text-sm transition-all appearance-none"
                    >
                      {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Dificuldade</label>
                    <select 
                      value={formData.difficulty}
                      onChange={e => setFormData({...formData, difficulty: e.target.value as any})}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#38cc63] rounded-2xl outline-none font-bold text-sm transition-all appearance-none"
                    >
                      <option value="Fácil">Fácil</option>
                      <option value="Médio">Médio</option>
                      <option value="Difícil">Difícil</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tom Original</label>
                    <input 
                      type="text"
                      value={formData.originalKey}
                      onChange={e => setFormData({...formData, originalKey: e.target.value})}
                      placeholder="Ex: G"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#38cc63] rounded-2xl outline-none font-bold text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cifra (Letra + [Acordes])</label>
                    <span className="text-[9px] font-bold text-[#38cc63] flex items-center gap-1">
                      <Info className="w-3 h-3" /> Use [C] para acordes
                    </span>
                  </div>
                  <textarea 
                    required
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    placeholder="[G]No dia em que eu saí de [D]casa..."
                    className="w-full h-64 px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#38cc63] rounded-3xl outline-none font-mono text-sm transition-all resize-none"
                  ></textarea>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 border-2 ${showPreview ? 'bg-[#1c1c1c] text-white border-[#1c1c1c]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                  >
                    <Eye className="w-4 h-4" /> {showPreview ? 'Editar Cifra' : 'Ver Prévia'}
                  </button>
                  <button 
                    type="submit"
                    disabled={!isFormValid}
                    className="flex-1 py-4 bg-[#38cc63] hover:bg-[#2da34f] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#38cc63]/20 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Salvar Música
                  </button>
                </div>
              </form>

              {/* Right Column: Preview or Guide */}
              <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 overflow-hidden flex flex-col">
                {showPreview ? (
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                     <h4 className="text-[10px] font-black text-[#38cc63] uppercase tracking-[0.2em] mb-4">Prévia do Palco</h4>
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-3xl font-black text-gray-900 uppercase mb-1">{formData.title || 'Título'}</h2>
                        <p className="text-gray-400 font-bold text-xs uppercase mb-6">{formData.artist || 'Artista'}</p>
                        <ChordDisplay content={formData.content || 'A cifra aparecerá aqui...'} fontSize={14} />
                     </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                       <BookOpen className="w-8 h-8 text-[#38cc63]" />
                    </div>
                    <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4">Como formatar?</h4>
                    <ul className="space-y-4 text-left">
                      <li className="flex gap-3 text-sm text-gray-600 font-medium">
                        <div className="w-5 h-5 rounded-full bg-[#38cc63] text-white flex items-center justify-center shrink-0 text-[10px]">1</div>
                        Coloque os acordes entre colchetes como <strong className="text-[#38cc63]">[C]</strong> ou <strong className="text-[#38cc63]">[G#m7]</strong>.
                      </li>
                      <li className="flex gap-3 text-sm text-gray-600 font-medium">
                        <div className="w-5 h-5 rounded-full bg-[#38cc63] text-white flex items-center justify-center shrink-0 text-[10px]">2</div>
                        O acorde deve ficar exatamente antes da sílaba onde ele entra.
                      </li>
                      <li className="flex gap-3 text-sm text-gray-600 font-medium">
                        <div className="w-5 h-5 rounded-full bg-[#38cc63] text-white flex items-center justify-center shrink-0 text-[10px]">3</div>
                        Use <strong className="text-gray-900">[Intro]</strong> ou <strong className="text-gray-900">[Refrão]</strong> para marcar as seções.
                      </li>
                      <li className="flex gap-3 text-sm text-gray-600 font-medium">
                        <div className="w-5 h-5 rounded-full bg-[#38cc63] text-white flex items-center justify-center shrink-0 text-[10px]">4</div>
                        Para tablaturas, use o formato padrão de strings (e, B, G, D, A, E).
                      </li>
                    </ul>
                    <div className="mt-8 p-4 bg-white rounded-2xl border border-gray-100 w-full text-left">
                       <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Exemplo:</p>
                       <code className="text-xs text-gray-700 block whitespace-pre">
                         [G]No dia em que eu saí de [D]casa<br/>
                         Minha [C]mãe me [D]disse: filho, vem [G]cá
                       </code>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-gray-400" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sua cifra passará por uma revisão automática antes de ser listada publicamente.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongSubmission;
