export interface RegistrationData {
  id: string;
  fullName: string;
  phoneNumber: string;
  ticketCount: number;
  age: number;
  drinkPreference: string;
  timestamp: string;
  agreedToTerms: boolean;
}

export interface FormErrors {
  fullName?: string;
  phoneNumber?: string;
  ticketCount?: string;
  age?: string;
  drinkPreference?: string;
  terms?: string;
}