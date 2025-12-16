import { RegistrationData } from '../types';

const STORAGE_KEY = 'khaas_re_registrations';

// Configured Google Apps Script Web App URL
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxpYCks3GVX4Apv5zZ-lJI2ds4su_Lr_rzxht7eCn2HeQgNCxg53HpSPxIv4VcArgpu/exec"; 

export const saveRegistration = (data: Omit<RegistrationData, 'id' | 'timestamp'>): RegistrationData => {
  const registrations = getRegistrations();
  
  const newRegistration: RegistrationData = {
    ...data,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };

  registrations.push(newRegistration);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
  return newRegistration;
};

export const getRegistrations = (): RegistrationData[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to parse registrations", e);
    return [];
  }
};

export const submitToGoogleSheet = async (data: RegistrationData) => {
  // If no script URL is provided, we simulate a network delay so the UX feels consistent
  if (!GOOGLE_SCRIPT_URL) {
    console.warn("Google Script URL is not configured. Data saved locally only.");
    await new Promise(resolve => setTimeout(resolve, 800));
    return;
  }

  const formData = new FormData();
  formData.append('id', data.id);
  formData.append('timestamp', new Date(data.timestamp).toLocaleString());
  formData.append('fullName', data.fullName);
  formData.append('phoneNumber', data.phoneNumber);
  formData.append('ticketCount', data.ticketCount.toString());
  formData.append('age', data.age.toString());
  formData.append('drinkPreference', data.drinkPreference);
  formData.append('agreedToTerms', data.agreedToTerms ? 'Yes' : 'No');

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors' // standard mode for posting to Google Apps Script from browser
    });
  } catch (error) {
    console.error("Error submitting to Google Sheet:", error);
    // We don't throw error here to ensure the user still sees the Success screen
    // since the data was successfully saved to localStorage.
  }
};

export const downloadCSV = () => {
  const data = getRegistrations();
  if (data.length === 0) {
    alert("No data to download.");
    return;
  }

  const headers = ["ID", "Full Name", "Phone Number", "Tickets", "Age", "Drink Preference", "Date Registered", "Agreed To Terms"];
  const rows = data.map(row => [
    row.id,
    `"${row.fullName}"`, // Quote strings to handle commas
    `"${row.phoneNumber}"`,
    row.ticketCount,
    row.age,
    `"${row.drinkPreference}"`,
    row.timestamp,
    row.agreedToTerms ? "Yes" : "No"
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `khaas_re_registrations_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};