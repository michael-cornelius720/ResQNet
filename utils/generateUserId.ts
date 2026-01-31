// lib/utils/generateUserId.ts

/**
 * Generates a unique user ID for emergency records
 * Format: EMG-{timestamp}-{random}
 * Example: EMG-1706745600000-A7B9C2
 */
export function generateEmergencyUserId(): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `EMG-${timestamp}-${randomStr}`;
}

/**
 * Alternative: Generate UUID v4 (more standard approach)
 * Requires: crypto (built-in in modern browsers and Node.js)
 */
export function generateUUID(): string {
  // For Node.js 14.17.0+ and modern browsers
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for older environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Short alphanumeric ID (8 characters)
 * Example: A7B9C2D4
 */
export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

/**
 * Nanoid-style ID (custom length, URL-safe)
 * Example: V1StGXR8_Z5jdHi6B-myT
 */
export function generateNanoId(length: number = 21): string {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
  let id = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    id += alphabet[randomIndex];
  }
  
  return id;
}