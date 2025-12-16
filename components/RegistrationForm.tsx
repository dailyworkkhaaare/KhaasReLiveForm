import React, { useState } from 'react';
import { User, Phone, Ticket, CheckCircle2, ArrowRight, Loader2, CalendarDays, Wine } from 'lucide-react';
import TermsModal from './TermsModal';
import { RegistrationData, FormErrors } from '../types';
import { saveRegistration, submitToGoogleSheet } from '../services/storageService';

interface RegistrationFormProps {
  onSuccess: (data: RegistrationData) => void;
}

const DRINK_OPTIONS = ["Beer", "Rum", "Whisky", "Anything", "Nothing"];

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    ticketCount: 1,
    age: '',
    drinkPreference: '',
    agreedToTerms: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    
    // Basic phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phoneNumber.replace(/[\s-]/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit number';
    }

    if (formData.ticketCount < 1) newErrors.ticketCount = 'At least 1 ticket is required';
    if (formData.ticketCount > 20) newErrors.ticketCount = 'Max 20 tickets per booking';

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else {
      const ageNum = parseInt(formData.age);
      if (isNaN(ageNum) || ageNum < 18) newErrors.age = 'Must be 18+ to register';
    }

    if (!formData.drinkPreference) newErrors.drinkPreference = 'Please select a preference';

    if (!formData.agreedToTerms) newErrors.terms = 'You must agree to the Terms and Conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      // 1. Save to Local Storage (Immediate Backup)
      const savedData = saveRegistration({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        ticketCount: Number(formData.ticketCount),
        age: Number(formData.age),
        drinkPreference: formData.drinkPreference,
        agreedToTerms: formData.agreedToTerms
      });

      // 2. Sync to Google Sheet (Async)
      // We await this to ensure we don't unmount component too early,
      // and to give the "Processing" feel.
      await submitToGoogleSheet(savedData);
      
      onSuccess(savedData);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
      
      <form onSubmit={handleSubmit} className="space-y-10 w-full max-w-lg mx-auto">
        
        {/* Name Input */}
        <div className="space-y-3 group">
          <label htmlFor="fullName" className="block text-sm font-bold text-gray-800 uppercase tracking-wide group-focus-within:text-black transition-colors duration-300">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors duration-300" />
            </div>
            <input
              type="text"
              id="fullName"
              className={`block w-full pl-10 pr-3 py-3 border-2 ${
                errors.fullName 
                  ? 'border-red-500 bg-red-50 focus:ring-red-200' 
                  : 'border-gray-200 bg-gray-50/30 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5'
              } rounded-xl focus:outline-none transition-all duration-300 text-lg shadow-sm focus:shadow-lg`}
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          {errors.fullName && <p className="text-red-500 text-xs font-medium pl-1 animate-fade-in pt-1">{errors.fullName}</p>}
        </div>

        {/* Phone Input */}
        <div className="space-y-3 group">
          <label htmlFor="phoneNumber" className="block text-sm font-bold text-gray-800 uppercase tracking-wide group-focus-within:text-black transition-colors duration-300">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors duration-300" />
            </div>
            <input
              type="tel"
              id="phoneNumber"
              className={`block w-full pl-10 pr-3 py-3 border-2 ${
                errors.phoneNumber 
                  ? 'border-red-500 bg-red-50 focus:ring-red-200' 
                  : 'border-gray-200 bg-gray-50/30 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5'
              } rounded-xl focus:outline-none transition-all duration-300 text-lg shadow-sm focus:shadow-lg`}
              placeholder="9876543210"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              maxLength={15}
            />
          </div>
          {errors.phoneNumber && <p className="text-red-500 text-xs font-medium pl-1 animate-fade-in pt-1">{errors.phoneNumber}</p>}
        </div>

        {/* Tickets Input */}
        <div className="space-y-3 group">
          <label htmlFor="ticketCount" className="block text-sm font-bold text-gray-800 uppercase tracking-wide group-focus-within:text-black transition-colors duration-300">
            Number of Seats
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Ticket className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors duration-300" />
            </div>
            <input
              type="number"
              id="ticketCount"
              min="1"
              max="20"
              className={`block w-full pl-10 pr-3 py-3 border-2 ${
                errors.ticketCount 
                  ? 'border-red-500 bg-red-50 focus:ring-red-200' 
                  : 'border-gray-200 bg-gray-50/30 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5'
              } rounded-xl focus:outline-none transition-all duration-300 text-lg font-mono shadow-sm focus:shadow-lg`}
              value={formData.ticketCount}
              onChange={(e) => setFormData({...formData, ticketCount: parseInt(e.target.value) || 0})}
            />
          </div>
          {errors.ticketCount && <p className="text-red-500 text-xs font-medium pl-1 animate-fade-in pt-1">{errors.ticketCount}</p>}
        </div>

        {/* Age Input */}
        <div className="space-y-3 group">
          <label htmlFor="age" className="block text-sm font-bold text-gray-800 uppercase tracking-wide group-focus-within:text-black transition-colors duration-300">
            Age
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarDays className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors duration-300" />
            </div>
            <input
              type="number"
              id="age"
              min="18"
              max="120"
              placeholder="e.g. 25"
              className={`block w-full pl-10 pr-3 py-3 border-2 ${
                errors.age 
                  ? 'border-red-500 bg-red-50 focus:ring-red-200' 
                  : 'border-gray-200 bg-gray-50/30 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5'
              } rounded-xl focus:outline-none transition-all duration-300 text-lg font-mono shadow-sm focus:shadow-lg`}
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
            />
          </div>
          {errors.age && <p className="text-red-500 text-xs font-medium pl-1 animate-fade-in pt-1">{errors.age}</p>}
        </div>

        {/* Drink Preference Input */}
        <div className="space-y-3 group">
          <label htmlFor="drinkPreference" className="block text-sm font-bold text-gray-800 uppercase tracking-wide group-focus-within:text-black transition-colors duration-300">
            What you prefer in drink?
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Wine className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors duration-300" />
            </div>
            <select
              id="drinkPreference"
              className={`block w-full pl-10 pr-3 py-3 border-2 ${
                errors.drinkPreference 
                  ? 'border-red-500 bg-red-50 focus:ring-red-200' 
                  : 'border-gray-200 bg-gray-50/30 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5'
              } rounded-xl focus:outline-none transition-all duration-300 text-lg bg-white appearance-none cursor-pointer shadow-sm focus:shadow-lg`}
              value={formData.drinkPreference}
              onChange={(e) => setFormData({...formData, drinkPreference: e.target.value})}
            >
              <option value="" disabled>Select an option</option>
              {DRINK_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors duration-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
          {errors.drinkPreference && <p className="text-red-500 text-xs font-medium pl-1 animate-fade-in pt-1">{errors.drinkPreference}</p>}
        </div>

        {/* Terms Section */}
        <div className="space-y-3 pt-6">
          <label className="flex items-start space-x-4 cursor-pointer group select-none">
            <div className="relative flex items-center mt-1">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={formData.agreedToTerms}
                onChange={(e) => setFormData({...formData, agreedToTerms: e.target.checked})}
              />
              <div className={`w-6 h-6 border-2 rounded transition-all flex items-center justify-center
                ${formData.agreedToTerms ? 'bg-black border-black scale-105' : 'border-gray-300 bg-white group-hover:border-black'}
                ${errors.terms ? 'border-red-500' : ''}
              `}>
                <CheckCircle2 className={`w-4 h-4 text-white transition-all duration-300 ${formData.agreedToTerms ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
              </div>
            </div>
            <span className={`text-sm leading-loose transition-colors duration-300 ${errors.terms ? 'text-red-600' : 'text-gray-700 group-hover:text-black'}`}>
              I have read and agree to the{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowTerms(true);
                }}
                className="font-bold underline text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                Terms and Conditions
              </button>
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-yellow-400 hover:bg-zinc-800 active:bg-zinc-900 
                   font-black uppercase tracking-widest text-lg py-4 rounded-xl 
                   shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300
                   disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-xl
                   flex items-center justify-center gap-2 group mt-8"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              Reserve My Spot <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </>
          )}
        </button>
      </form>
    </>
  );
};

export default RegistrationForm;