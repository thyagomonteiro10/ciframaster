
import React from 'react';
import { X, Smartphone, Download } from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
  isInstallAvailable: boolean;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose, onInstall, isInstallAvailable }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-all"><X className="w-6 h-6" /></button>
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-[#22c55e] rounded-3xl flex items-center justify-center shadow-xl shadow-[#22c55e]/30 mb-6"><Download className="w-10 h-10 text-white" /></div>
          <h3 className="text-2xl font-black text-gray-900 text-center uppercase tracking-tight mb-2">Instalar App</h3>
          <p className="text-gray-500 text-center text-sm mb-8">Tenha o Cifra Master sempre à mão no seu celular!</p>
          {isInstallAvailable ? (
            <button onClick={onInstall} className="w-full py-5 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-2xl font-black text-sm uppercase shadow-lg shadow-[#22c55e]/20 transition-all active:scale-95">Instalar Agora (APK)</button>
          ) : (
            <div className="w-full space-y-4">
              <div className="p-4 bg-gray-50 rounded-2xl border flex gap-4">
                <Smartphone className="w-6 h-6 text-[#22c55e]" />
                <p className="text-xs text-gray-600">No Android/iOS, procure pela opção <strong>"Adicionar à tela de início"</strong> no menu do seu navegador para baixar o app.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;
