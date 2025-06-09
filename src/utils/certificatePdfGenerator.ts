
import jsPDF from 'jspdf';
import { CertificateData } from './pdf/types';
import { generateCertificatePage1 } from './pdf/certificatePage1';
import { generateCertificatePage2 } from './pdf/certificatePage2';

/**
 * Generates a PDF certificate for a product
 */
export const generateCertificatePdf = async (certificateData: CertificateData): Promise<void> => {
  const { product, makers } = certificateData;
  
  if (!product || !makers || makers.length === 0) return;
  
  // Create a new PDF document on A4 size
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  
  try {
    // Generate Page 1: Certificate
    await generateCertificatePage1(pdf, certificateData, pageWidth, pageHeight, margin);
    
    // Generate Page 2: Detailed Evaluation
    await generateCertificatePage2(pdf, certificateData, pageWidth, pageHeight, margin);
    
    // Save the PDF
    pdf.save(`${product.name}_Certificate.pdf`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

// Re-export types for backward compatibility
export type { CertificateData, JudgingSummaryItem, Judge } from './pdf/types';
