
import jsPDF from 'jspdf';

/**
 * Helper function to add image with aspect ratio preservation
 */
export const addImageWithAspect = async (
  pdf: jsPDF,
  imageUrl: string, 
  x: number, 
  y: number, 
  maxWidth: number, 
  maxHeight: number
): Promise<{y: number}> => {
  return new Promise<{y: number}>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      const imgWidth = img.width;
      const imgHeight = img.height;
      let newWidth = maxWidth;
      let newHeight = (imgHeight * maxWidth) / imgWidth;
      
      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = (imgWidth * maxHeight) / imgHeight;
      }
      
      const centerX = x + (maxWidth - newWidth) / 2;
      pdf.addImage(img, 'PNG', centerX, y, newWidth, newHeight);
      resolve({y: y + newHeight});
    };
    img.onerror = function() {
      console.error("Failed to load image");
      resolve({y});
    };
    img.src = imageUrl;
  });
};

/**
 * Function to add QR code
 */
export const addQRCode = async (
  pdf: jsPDF, 
  certificateUrl: string | null, 
  pageWidth: number, 
  pageHeight: number, 
  margin: number
): Promise<number> => {
  if (!certificateUrl) return margin;
  
  try {
    const qrImage = new Image();
    qrImage.crossOrigin = 'Anonymous';
    const qrPromise = new Promise<void>((resolve) => {
      qrImage.onload = function() {
        const qrSize = 30;
        const qrX = (pageWidth - qrSize) / 2;
        pdf.addImage(qrImage, 'PNG', qrX, pageHeight - 80, qrSize, qrSize);
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text('Scan to verify this certificate', pageWidth / 2, pageHeight - 45, { align: 'center' });
        resolve();
      };
      qrImage.onerror = () => {
        console.error('Failed to load QR code');
        resolve();
      };
    });
    
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(certificateUrl)}`;
    await qrPromise;
    return 60;
  } catch (error) {
    console.error('Error adding QR code:', error);
    return margin;
  }
};
