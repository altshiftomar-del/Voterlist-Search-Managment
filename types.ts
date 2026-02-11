// @ts-nocheck
// Making Enums available globally for browser
window.UserRole = {
  ADMIN: 'ADMIN',
  USER: 'USER'
};

window.FileStatus = {
  UPLOADING: 'UPLOADING',
  PENDING_OCR: 'PENDING_OCR',
  PROCESSING: 'PROCESSING',
  OCR_COMPLETE: 'OCR_COMPLETE'
};

// Interfaces are typescript only and removed at runtime, so no changes needed for them.