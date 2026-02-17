export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
}

export type Category = 'Starters' | 'Mains' | 'Desserts' | 'Drinks';

export interface UserProfile {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  orderStatusesNotification: boolean;
  passwordChangesNotification: boolean;
  specialOffersNotification: boolean;
  newsletterNotification: boolean;
}

export interface OnboardingData {
  firstName: string;
  email: string;
}
