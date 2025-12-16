import React from 'react';
import { X, ArrowLeft, FileText } from 'lucide-react';
import { TERMS_AND_CONDITIONS } from '../constants';

interface TermsModalProps {
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scale-in transform transition-all border border-white/20"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="bg-black/5 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-black" />
            </div>
            <h3 id="terms-title" className="font-bold text-xl text-gray-900 uppercase tracking-wide">
              Terms & Conditions
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 rounded-full transition-all duration-200 shadow-sm group"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto text-sm text-gray-600 leading-loose whitespace-pre-wrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {TERMS_AND_CONDITIONS}
        </div>
        
        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end">
           <button 
             onClick={onClose}
             className="w-full sm:w-auto bg-black text-yellow-400 px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider hover:bg-zinc-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
           >
             <ArrowLeft className="w-5 h-5" /> Back to Registration
           </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;