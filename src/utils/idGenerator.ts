/**
 * ID Generation Utilities
 * Provides various ID generation methods for the application
 */

/**
 * Generate a unique ID using timestamp and random characters
 */
export function generateId(prefix?: string): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  const id = `${timestamp}${randomPart}`;
  return prefix ? `${prefix}_${id}` : id;
}

/**
 * Generate a UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Generate a short ID (8 characters)
 */
export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * Generate a numeric ID
 */
export function generateNumericId(): number {
  return Math.floor(Math.random() * 1000000000);
}

/**
 * Generate a session ID
 */
export function generateSessionId(): string {
  return generateId('session');
}

/**
 * Generate a calculation ID
 */
export function generateCalculationId(): string {
  return generateId('calc');
}
