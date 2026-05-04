import crypto from 'crypto';

/**
 * Generates a cryptographically secure random token string.
 * Used as the validationToken on each Ticket document.
 */
export const generateSecureToken = (byteLength = 32): string => {
  return crypto.randomBytes(byteLength).toString('hex');
};

/**
 * Generates a short unique ticket ID (e.g. INV-A1B2C3D4).
 */
export const generateTicketId = (): string => {
  const suffix = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `INV-${suffix}`;
};
