import React, { useState } from 'react';
import Header from './components/Header';
import RegistrationForm from './components/RegistrationForm';
import SuccessView from './components/SuccessView';
import { RegistrationData } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'form' | 'success'>('form');
  const [successData, setSuccessData] = useState<RegistrationData | null>(null);

  const handleSuccess = (data: RegistrationData) => {
    setSuccessData(data);
    setView('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setSuccessData(null);
    setView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full bg-[#FFD700] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] text-zinc-900 font-sans selection:bg-black selection:text-yellow-400 pb-20">
      
      {/* Decorative Top Bar */}
      <div className="h-2 bg-black w-full sticky top-0 z-20"></div>

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-3xl relative">
        
        {/* Main Content Card */}
        <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden border-2 border-black/5 relative">
          
          {/* Subtle texture for card */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none"></div>
          
          <div className="relative p-6 md:p-10">
            <Header />
            
            <div className="mt-8 transition-all duration-500 ease-in-out">
              {view === 'form' ? (
                <RegistrationForm onSuccess={handleSuccess} />
              ) : (
                successData && <SuccessView data={successData} onReset={handleReset} />
              )}
            </div>
          </div>
          
          {/* Footer of Card */}
          <div className="bg-gray-100 p-6 text-center border-t border-gray-200">
            <p className="text-xs text-gray-500 font-medium leading-loose">
              &copy; 2025 Plant Lounge & Cafe. All rights reserved.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;