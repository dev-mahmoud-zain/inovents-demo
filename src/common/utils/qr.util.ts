import QRCode from 'qrcode';

/**
 * Generates a base64 PNG data URL from the given data string.
 * This is stored directly on the Ticket document (qrCode field).
 */
export const generateQrCode = async (data: string): Promise<string> => {
  return QRCode.toDataURL(data, {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 300,
  });
};
