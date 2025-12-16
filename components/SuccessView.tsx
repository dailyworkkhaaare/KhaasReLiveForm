import React from 'react';
import { CheckCircle, RotateCcw } from 'lucide-react';
import { RegistrationData } from '../types';

interface SuccessViewProps {
  data: RegistrationData;
  onReset: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({ data, onReset }) => {
  return (
    <div className="text-center space-y-10 animate-fade-in px-4">
      <div className="flex justify-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce-short">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-3xl font-black uppercase text-gray-900 tracking-tight">Registration Confirmed!</h2>
        <p className="text-gray-600 max-w-md mx-auto leading-loose text-lg">
          Thank you, <strong>{data.fullName}</strong>. Your request for <strong>{data.ticketCount} seat(s)</strong> has been recorded.
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 max-w-md mx-auto text-left space-y-6">
        <h3 className="font-bold text-yellow-800 uppercase text-xs tracking-wider border-b border-yellow-200 pb-3 mb-6">
          Booking Summary
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 text-sm">
          <span className="text-gray-500">Phone:</span>
          <span className="font-medium text-gray-900 text-right font-mono">{data.phoneNumber}</span>
          
          <span className="text-gray-500">Age:</span>
          <span className="font-medium text-gray-900 text-right">{data.age}</span>

          <span className="text-gray-500">Preference:</span>
          <span className="font-medium text-gray-900 text-right">{data.drinkPreference}</span>

          <span className="text-gray-500">Date:</span>
          <span className="font-medium text-gray-900 text-right font-mono">{new Date(data.timestamp).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="pt-8 flex flex-col gap-3 justify-center max-w-xs mx-auto">
        <button 
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200"
        >
          <RotateCcw className="w-4 h-4" /> Register Another
        </button>
      </div>
      
      <p className="text-xs text-gray-400 pt-8 max-w-md mx-auto leading-loose">
        Thank you for your interest. Our team will contact you shortly with the payment details and to confirm your seats.
      </p>
    </div>
  );
};

export default SuccessView;