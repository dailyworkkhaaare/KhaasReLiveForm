import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="text-center space-y-2 mb-8">
      
      {/* Logo Image */}
      <div className="flex justify-center pt-2">
        <img 
          src="https://i.ibb.co/tpzsNGzk/khaas-re-live.png" 
          alt="khaas-re-live" 
          className="h-28 md:h-36 object-contain hover:scale-105 transition-transform duration-500 opacity-90"
        />
      </div>
      
      {/* Minimal Title Typography */}
      <div className="flex flex-col items-center justify-center relative z-10">
         <h1 className="brand-font text-2xl md:text-3xl font-semibold text-zinc-800 tracking-tight text-center leading-snug">
           Grand NYE Party
         </h1>
         
         <div className="w-12 h-0.5 bg-zinc-200 mt-3 mb-1 rounded-full"></div>
      </div>

      {/* Info Badges - Minimal */}
      <div className="flex flex-col items-center gap-3 mt-1">
        <div className="flex flex-wrap justify-center gap-3 w-full">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-50 border border-zinc-100 shadow-sm">
            <Calendar className="w-4 h-4 text-zinc-500" />
            <span className="font-medium text-zinc-600 text-sm">Dec 31, 2025</span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-50 border border-zinc-100 shadow-sm">
            <Clock className="w-4 h-4 text-zinc-500" />
            <span className="font-medium text-zinc-600 text-sm">6:00 PM Onwards</span>
          </div>
        </div>
      
        <a 
          href="https://maps.google.com/?q=Chandralok+Restaurant+Pune" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-50 border border-zinc-100 hover:bg-zinc-100 transition-colors group max-w-xs md:max-w-none mx-auto shadow-sm"
        >
          <MapPin className="w-4 h-4 text-zinc-400 group-hover:text-red-500 transition-colors" />
          <span className="font-medium text-zinc-500 text-sm text-center group-hover:text-zinc-700 leading-relaxed">
            Chandralok Restaurant, Near Rajaram Bridge, Pune
          </span>
        </a>
      </div>
    </div>
  );
};

export default Header;