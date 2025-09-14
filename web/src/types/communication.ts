// Communication Apps Types
export interface CommunicationApp {
  id: number;
  name: string;
  displayName: string;
  iconUrl?: string;
  urlPattern?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserCommunicationContact {
  id: number;
  userId: number;
  communicationAppId: number;
  contactValue: string;
  isPreferred: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  app: CommunicationApp;
}

export interface FormattedUserContact {
  id: number;
  app: CommunicationApp;
  contactValue: string;
  isPreferred: boolean;
  isPublic: boolean;
  contactLink: string | null;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface CommunicationAppsResponse {
  success: boolean;
  data: CommunicationApp[];
  message: string;
}

export interface UserContactsResponse {
  success: boolean;
  data: UserCommunicationContact[];
  message: string;
}

export interface FormattedContactsResponse {
  success: boolean;
  data: FormattedUserContact[];
  message: string;
}

export interface ContactResponse {
  success: boolean;
  data: UserCommunicationContact;
  message: string;
}

// Form Types for Creating/Updating Contacts
export interface CreateContactRequest {
  communicationAppId: number;
  contactValue: string;
  isPreferred?: boolean;
  isPublic?: boolean;
}

export interface UpdateContactRequest extends CreateContactRequest {
  id: number;
}

// Host interface extension
export interface HostCommunicationContact {
  id: number;
  app: CommunicationApp;
  contactValue: string;
  isPreferred: boolean;
  contactLink: string | null;
}

// Extended Host type (add to existing Host interface)
export interface HostWithCommunication {
  // ... existing host properties
  communicationContacts?: HostCommunicationContact[];
}
