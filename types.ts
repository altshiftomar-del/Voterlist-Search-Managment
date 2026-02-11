export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  username: string;
  passwordHash: string; // Simplified for demo
  role: UserRole;
  isBlocked: boolean;
}

export enum FileStatus {
  UPLOADING = 'UPLOADING',
  PENDING_OCR = 'PENDING_OCR',
  PROCESSING = 'PROCESSING',
  OCR_COMPLETE = 'OCR_COMPLETE'
}

export interface VoterFile {
  id: string;
  name: string; // #District:Upazila:Union:Ward:Para/Type
  uploadDate: number;
  uploadedBy: string;
  status: FileStatus;
  fileData: string | null; // Base64 data URI for demo purposes
  searchContent?: string; // Simulated extracted text
  metadata: {
    district: string;
    upazila: string;
    union: string;
    ward: string;
    para: string;
    type: string; // Male, Female, Other
  };
}

export interface SearchResult {
  page: number;
  snippet: string;
  location: number; // Y-coordinate mock
}
