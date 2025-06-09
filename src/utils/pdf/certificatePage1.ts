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

  // Title
  pdf.setTextColor(80, 80, 120);
  pdf.setFontSize(30);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Certificate of Completion', pageWidth / 2, margin + 25, { align: 'center' });

  // Organization
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Learnathon 3.0 by Geeky Solutions', pageWidth / 2, margin + 38, { align: 'center' });

  // Divider
  pdf.setDrawColor(150, 150, 220);
  pdf.setLineWidth(0.5);
  pdf.line(margin + 30, margin + 48, pageWidth - margin - 30, margin + 48);

  // Certify line
  pdf.setTextColor(80, 80, 80);
  pdf.setFontSize(14);
  pdf.text('This is to certify that', pageWidth / 2, margin + 65, { align: 'center' });

  // Makers
  let currentY = margin + 80;
  const makerNames = makers.map((m) => m.profile?.username || 'Unknown Maker');

  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(70, 60, 120);
  pdf.setFontSize(18);
  pdf.text(makerNames.join(', '), pageWidth / 2, currentY, { align: 'center' });
  currentY += 16;

  // Completion text
  pdf.setTextColor(80, 80, 80);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text('successfully completed the project', pageWidth / 2, currentY, { align: 'center' });
  currentY += 10;

  // Project Name
  pdf.setTextColor(70, 60, 120);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.text(product.name, pageWidth / 2, currentY, { align: 'center' });
  currentY += 10;

  // Project Image
  if (product.image_url) {
    const imageHeight = 60;
    await addImageWithAspect(
      pdf,
      product.image_url,
      margin + 40,
      currentY,
      pageWidth - margin * 2 - 80,
      imageHeight
    );
    currentY += imageHeight + 8;
  }

  // Overall Score
  if (overallScore !== null) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    pdf.text('Overall Score', pageWidth / 2, currentY, { align: 'center' });
    currentY += 16;

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(70, 60, 120);
    pdf.setFontSize(24);
    pdf.text(`${overallScore.toFixed(1)}/10`, pageWidth / 2, currentY, { align: 'center' });
    currentY += 25;
  }

  // Issued Date
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');

  const formattedDate = product.created_at
    ? new Date(product.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown Date';

  pdf.text(`Issued on ${formattedDate}`, pageWidth / 2, currentY, { align: 'center' });

  // QR Code at the bottom
  await addQRCode(pdf, certificateUrl, pageWidth, pageHeight, margin);

  // Footer
  const footerY = pageHeight - margin - 25;
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(10);
  pdf.text(
    'This certificate was issued as part of the Learnathon 3.0 program,',
    pageWidth / 2,
    footerY,
    { align: 'center' }
  );
  pdf.text('organized by Geeky Solutions.', pageWidth / 2, footerY + 8, {
    align: 'center',
  });
};