
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

  // Define layout zones (A4 = 210mm x 297mm)
  const zones = {
    header: { start: margin, end: margin + 45 },
    content: { start: margin + 50, end: margin + 120 },
    image: { start: margin + 125, end: margin + 170 },
    score: { start: margin + 175, end: margin + 210 },
    footer: { start: pageHeight - 85, end: pageHeight - margin }
  };

  // Helper function to wrap text and return lines
  const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
    pdf.setFontSize(fontSize);
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = pdf.getTextWidth(testLine);
      
      if (textWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // Word is too long, add it anyway
          lines.push(word);
        }
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  };

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

  // HEADER ZONE - Title and Organization
  pdf.setTextColor(80, 80, 120);
  pdf.setFontSize(32);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Certificate of Completion', pageWidth / 2, zones.header.start + 15, { align: 'center' });

  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Learnathon 3.0 by Geeky Solutions', pageWidth / 2, zones.header.start + 28, { align: 'center' });

  // Divider
  pdf.setDrawColor(150, 150, 220);
  pdf.setLineWidth(0.5);
  pdf.line(margin + 30, zones.header.end - 5, pageWidth - margin - 30, zones.header.end - 5);

  // CONTENT ZONE - Certification text and makers
  pdf.setTextColor(80, 80, 80);
  pdf.setFontSize(14);
  pdf.text('This is to certify that', pageWidth / 2, zones.content.start + 8, { align: 'center' });

  // Makers names with wrapping
  const makerNames = makers.map((m) => m.profile?.username || 'Unknown Maker');
  const allMakersText = makerNames.join(', ');
  
  // Calculate available width for maker names (with some padding)
  const maxTextWidth = pageWidth - margin * 2 - 40;
  
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(70, 60, 120);
  pdf.setFontSize(20);
  
  // Wrap the maker names
  const wrappedMakerLines = wrapText(allMakersText, maxTextWidth, 20);
  
  // Position the wrapped lines
  const lineHeight = 6;
  const startY = zones.content.start + 25;
  
  wrappedMakerLines.forEach((line, index) => {
    pdf.text(line, pageWidth / 2, startY + (index * lineHeight), { align: 'center' });
  });

  // Adjust subsequent content position based on number of lines
  const additionalHeight = (wrappedMakerLines.length - 1) * lineHeight;
  const completionTextY = zones.content.start + 40 + additionalHeight;

  // Completion text
  pdf.setTextColor(80, 80, 80);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text('successfully completed the project', pageWidth / 2, completionTextY, { align: 'center' });

  // Project Name - also wrap if needed
  pdf.setTextColor(70, 60, 120);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  
  const wrappedProjectLines = wrapText(product.name, maxTextWidth, 22);
  const projectStartY = completionTextY + 18;
  
  wrappedProjectLines.forEach((line, index) => {
    pdf.text(line, pageWidth / 2, projectStartY + (index * 7), { align: 'center' });
  });

  // IMAGE ZONE - Project Image (adjust position if needed)
  if (product.image_url) {
    const imageHeight = 40;
    const imageWidth = pageWidth - margin * 2 - 80;
    const imageX = margin + 40;
    
    await addImageWithAspect(
      pdf,
      product.image_url,
      imageX,
      zones.image.start,
      imageWidth,
      imageHeight
    );
  }

  // SCORE ZONE - Overall Score (fixed position)
  if (overallScore !== null) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    pdf.text('Overall Score', pageWidth / 2, zones.score.start + 5, { align: 'center' });

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(70, 60, 120);
    pdf.setFontSize(28);
    pdf.text(`${overallScore.toFixed(1)}/10`, pageWidth / 2, zones.score.start + 15, { align: 'center' });
  }

  // FOOTER ZONE - QR Code and footer text (fixed positions)
  // QR Code positioned at fixed location
  if (certificateUrl) {
    const qrImage = new Image();
    qrImage.crossOrigin = 'Anonymous';
    const qrPromise = new Promise<void>((resolve) => {
      qrImage.onload = function() {
        const qrSize = 25;
        const qrX = (pageWidth - qrSize) / 2;
        const qrY = zones.footer.start + 5;
        pdf.addImage(qrImage, 'PNG', qrX, qrY, qrSize, qrSize);
        
        // Footer text below QR code
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text('Scan to verify this certificate', pageWidth / 2, qrY + qrSize + 8, { align: 'center' });
        pdf.text('This certificate was issued as part of the Learnathon 3.0 program,', pageWidth / 2, qrY + qrSize + 16, { align: 'center' });
        pdf.text('organized by Geeky Solutions.', pageWidth / 2, qrY + qrSize + 22, { align: 'center' });
        resolve();
      };
      qrImage.onerror = () => {
        console.error('Failed to load QR code');
        resolve();
      };
    });
    
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(certificateUrl)}`;
    await qrPromise;
  } else {
    // Footer text without QR code
    const footerTextY = zones.footer.start + 20;
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('This certificate was issued as part of the Learnathon 3.0 program,', pageWidth / 2, footerTextY, { align: 'center' });
    pdf.text('organized by Geeky Solutions.', pageWidth / 2, footerTextY + 6, { align: 'center' });
  }
};
