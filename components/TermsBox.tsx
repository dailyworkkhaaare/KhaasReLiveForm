import React from 'react';
import { TERMS_AND_CONDITIONS } from '../constants';

const TermsBox: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-lg border border-gray-300 shadow-inner">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Terms & Conditions</h3>
        <span className="text-xs text-gray-400">Scroll to read</span>
      </div>
      <div className="h-48 overflow-y-auto p-4 text-xs text-gray-600 leading-loose whitespace-pre-wrap">
        {TERMS_AND_CONDITIONS}
      </div>
    </div>
  );
};

export default TermsBox;