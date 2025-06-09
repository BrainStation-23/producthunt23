
import jsPDF from 'jspdf';
import { CertificateData } from './types';
import { addImageWithAspect, addQRCode } from './pdfHelpers';

export const generateCertificatePage1 = async (
  pdf: jsPDF,
  certificateData: CertificateData,
  pageWidth: number,
  pageHeight: number,
  margin: number
): Promise<void> => {
  const { product, makers, overallScore, certificateUrl } = certificateData;

  // Background
  pdf.setFillColor(250, 250, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Watermark
  pdf.setTextColor(240, 240, 250);
  pdf.setFontSize(180);
  pdf.text('★', pageWidth / 2, pageHeight / 2, { align: 'center' });
  pdf.setTextColor(0, 0, 0);

  // Border
  pdf.setDrawColor(100, 100, 200);
  pdf.setLineWidth(0.5);
  pdf.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2.5, 'S');

  // Title - reduced top spacing
  pdf.setTextColor(80, 80, 120);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Certificate of Completion', pageWidth / 2, margin + 12, { align: 'center' });

  // Organization - reduced spacing
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Learnathon 3.0 by Geeky Solutions', pageWidth / 2, margin + 22, { align: 'center' });

  // Divider - adjusted position
  pdf.setDrawColor(150, 150, 220);
  pdf.setLineWidth(0.5);
  pdf.line(margin + 30, margin + 35, pageWidth - margin - 30, margin + 35);

  // Certify line - reduced spacing
  pdf.setTextColor(80, 80, 80);
  pdf.setFontSize(12);
  pdf.text('This is to certify that', pageWidth / 2, margin + 48, { align: 'center' });

  // Makers - reduced spacing
  let currentY = margin + 58;
  const makerNames = makers.map((m) => m.profile?.username || 'Unknown Maker');

  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(70, 60, 120);
  pdf.setFontSize(16);
  pdf.text(makerNames.join(', '), pageWidth / 2, currentY, { align: 'center' });
  currentY += 12;

  // Completion text - reduced spacing
  pdf.setTextColor(80, 80, 80);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('successfully completed the project', pageWidth / 2, currentY, { align: 'center' });
  currentY += 8;

  // Project Name - reduced spacing
  pdf.setTextColor(70, 60, 120);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text(product.name, pageWidth / 2, currentY, { align: 'center' });
  currentY += 12;

  // Project Image - fixed height and better positioning
  if (product.image_url) {
    const imageHeight = 40; // Reduced from 60
    await addImageWithAspect(
      pdf,
      product.image_url,
      margin + 50,
      currentY,
      pageWidth - margin * 2 - 100,
      imageHeight
    );
    currentY += imageHeight + 10;
  }

  // Overall Score - better positioning
  if (overallScore !== null) {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    pdf.text('Overall Score', pageWidth / 2, currentY, { align: 'center' });
    currentY += 12;

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(70, 60, 120);
    pdf.setFontSize(20);
    pdf.text(`${overallScore.toFixed(1)}/10`, pageWidth / 2, currentY, { align: 'center' });
    currentY += 18;
  }

  // Issued Date - better positioning
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  const formattedDate = product.created_at
    ? new Date(product.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown Date';

  pdf.text(`Issued on ${formattedDate}`, pageWidth / 2, currentY, { align: 'center' });

  // QR Code at the bottom with proper spacing
  await addQRCode(pdf, certificateUrl, pageWidth, pageHeight, margin);

  // Footer - positioned above QR code
  const footerY = pageHeight - margin - 40;
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(8);
  pdf.text(
    'This certificate was issued as part of the Learnathon 3.0 program,',
    pageWidth / 2,
    footerY,
    { align: 'center' }
  );
  pdf.text('organized by Geeky Solutions.', pageWidth / 2, footerY + 6, {
    align: 'center',
  });
};
