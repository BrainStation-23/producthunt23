
import jsPDF from 'jspdf';
import { Product, ProductMaker } from '@/types/product';
import { JudgingCriteria } from '@/components/admin/settings/judging/types';

type JudgingSummaryItem = {
  criteria_id: string;
  criteria_name: string;
  criteria_type: string;
  avg_rating: number | null;
  count_judges: number;
  count_true: number;
  count_false: number;
  weight: number;
};

type Judge = {
  id: string;
  profile?: {
    username: string | null;
    avatar_url: string | null;
    linkedin?: string | null;
  };
};

interface CertificateData {
  product: Product;
  makers: ProductMaker[];
  criteria: JudgingCriteria[];
  judgingSummary: JudgingSummaryItem[];
  judges: Judge[];
  overallScore: number | null;
  certificateUrl: string | null;
}

/**
 * Prioritizes and limits judges to 2, favoring those with images and LinkedIn
 */
const selectTopJudges = (judges: Judge[]): Judge[] => {
  if (!judges || judges.length === 0) return [];
  
  // Sort judges by priority: avatar_url and linkedin presence
  const sortedJudges = [...judges].sort((a, b) => {
    const aHasAvatar = !!a.profile?.avatar_url;
    const aHasLinkedIn = !!a.profile?.linkedin;
    const bHasAvatar = !!b.profile?.avatar_url;
    const bHasLinkedIn = !!b.profile?.linkedin;
    
    // Priority score: both avatar and linkedin = 3, only avatar = 2, only linkedin = 1, neither = 0
    const aScore = (aHasAvatar ? 2 : 0) + (aHasLinkedIn ? 1 : 0);
    const bScore = (bHasAvatar ? 2 : 0) + (bHasLinkedIn ? 1 : 0);
    
    return bScore - aScore; // Descending order
  });
  
  // Return max 2 judges
  return sortedJudges.slice(0, 2);
};

/**
 * Adds image with fixed dimensions and aspect ratio preservation
 */
const addImageWithFixedSpace = async (imageUrl: string, x: number, y: number, width: number, height: number, pdf: jsPDF): Promise<void> => {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      const imgWidth = img.width;
      const imgHeight = img.height;
      
      // Calculate dimensions to fit within the fixed space while maintaining aspect ratio
      let newWidth = width;
      let newHeight = (imgHeight * width) / imgWidth;
      
      if (newHeight > height) {
        newHeight = height;
        newWidth = (imgWidth * height) / imgHeight;
      }
      
      // Center the image within the fixed space
      const centerX = x + (width - newWidth) / 2;
      const centerY = y + (height - newHeight) / 2;
      
      pdf.addImage(img, 'PNG', centerX, centerY, newWidth, newHeight);
      resolve();
    };
    img.onerror = function() {
      console.error("Failed to load image");
      resolve();
    };
    img.src = imageUrl;
  });
};

/**
 * Generates a PDF certificate for a product
 */
export const generateCertificatePdf = async (certificateData: CertificateData): Promise<void> => {
  const { 
    product, 
    makers, 
    criteria, 
    judgingSummary, 
    judges, 
    overallScore, 
    certificateUrl 
  } = certificateData;
  
  if (!product || !makers || makers.length === 0) return;
  
  // Select top 2 judges based on priority
  const selectedJudges = selectTopJudges(judges);
  
  // Create a new PDF document on A4 size
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  
  // Fixed layout positions and dimensions
  const LAYOUT = {
    HEADER_HEIGHT: 40,
    MAKER_SECTION_HEIGHT: 25,
    PROJECT_NAME_HEIGHT: 15,
    IMAGE_SECTION_HEIGHT: 50, // Fixed height for image area
    IMAGE_WIDTH: 120, // Fixed width for image
    SCORE_SECTION_HEIGHT: 25,
    DATE_SECTION_HEIGHT: 10,
    QR_SECTION_HEIGHT: 40,
    FOOTER_HEIGHT: 20
  };
  
  // Function to add QR code at fixed position
  const addQRCode = async (yPosition: number) => {
    if (!certificateUrl) return;
    
    try {
      const qrImage = new Image();
      qrImage.crossOrigin = 'Anonymous';
      const qrPromise = new Promise<void>((resolve) => {
        qrImage.onload = function() {
          const qrSize = 25;
          const qrX = (pageWidth - qrSize) / 2;
          pdf.addImage(qrImage, 'PNG', qrX, yPosition, qrSize, qrSize);
          pdf.setFontSize(8);
          pdf.setTextColor(100, 100, 100);
          pdf.text('Scan to verify this certificate', pageWidth / 2, yPosition + qrSize + 5, { align: 'center' });
          resolve();
        };
        qrImage.onerror = () => {
          console.error('Failed to load QR code');
          resolve();
        };
      });
      
      qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(certificateUrl)}`;
      await qrPromise;
    } catch (error) {
      console.error('Error adding QR code:', error);
    }
  };
  
  try {
    // ---------- PAGE 1: Certificate ----------
    // Add decorative background
    pdf.setFillColor(250, 250, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Add subtle award watermark
    pdf.setTextColor(240, 240, 250);
    pdf.setFontSize(180);
    pdf.text('★', pageWidth / 2, pageHeight / 2, { align: 'center' });
    pdf.setTextColor(0, 0, 0);
    
    // Add decorative border
    pdf.setDrawColor(100, 100, 200);
    pdf.setLineWidth(0.5);
    pdf.rect(margin, margin, pageWidth - (margin * 2), pageHeight - (margin * 2), 'S');
    
    let currentY = margin + 15;
    
    // Certificate Title - Fixed position
    pdf.setTextColor(80, 80, 120);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Certificate of Completion', pageWidth / 2, currentY, { align: 'center' });
    currentY += 8;
    
    // Organization - Fixed position
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Learnathon 3.0 by Geeky Solutions', pageWidth / 2, currentY, { align: 'center' });
    currentY += 5;
    
    // Decorative line - Fixed position
    pdf.setDrawColor(150, 150, 220);
    pdf.setLineWidth(0.5);
    pdf.line(margin + 30, currentY, pageWidth - margin - 30, currentY);
    currentY += 5;
    
    // "This is to certify that" - Fixed position
    pdf.setTextColor(80, 80, 80);
    pdf.setFontSize(12);
    pdf.text('This is to certify that', pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;
    
    // Makers section - Fixed height allocation
    pdf.setTextColor(70, 60, 120);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    
    const makerNames = makers.map(maker => maker.profile?.username || 'Unknown Maker');
    pdf.text(makerNames.join(', '), pageWidth / 2, currentY, { align: 'center' });
    currentY += LAYOUT.MAKER_SECTION_HEIGHT;
    
    // "Successfully completed" - Fixed position
    pdf.setTextColor(80, 80, 80);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('successfully completed the project', pageWidth / 2, currentY, { align: 'center' });
    currentY += 8;
    
    // Project Name - Fixed height allocation
    pdf.setTextColor(70, 60, 120);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text(product.name, pageWidth / 2, currentY, { align: 'center' });
    currentY += LAYOUT.PROJECT_NAME_HEIGHT;
    
    // Project Image - Fixed space allocation
    if (product.image_url) {
      const imageX = (pageWidth - LAYOUT.IMAGE_WIDTH) / 2;
      await addImageWithFixedSpace(
        product.image_url, 
        imageX, 
        currentY, 
        LAYOUT.IMAGE_WIDTH, 
        LAYOUT.IMAGE_SECTION_HEIGHT, 
        pdf
      );
    }
    // Always advance by the fixed height regardless of image presence
    currentY += LAYOUT.IMAGE_SECTION_HEIGHT + 10;
    
    // Overall Score - Fixed position and space
    if (overallScore !== null) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(80, 80, 80);
      pdf.text('Overall Score', pageWidth / 2, currentY, { align: 'center' });
      currentY += 8;
      
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(70, 60, 120);
      pdf.setFontSize(20);
      pdf.text(`${overallScore.toFixed(1)}/10`, pageWidth / 2, currentY, { align: 'center' });
    }
    currentY += LAYOUT.SCORE_SECTION_HEIGHT;
    
    // Issue date - Fixed position
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const formattedDate = product.created_at
      ? new Date(product.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      : 'Unknown Date';
    pdf.text(`Issued on ${formattedDate}`, pageWidth / 2, currentY, { align: 'center' });
    currentY += LAYOUT.DATE_SECTION_HEIGHT;
    
    // QR Code at calculated position
    const qrYPosition = pageHeight - margin - LAYOUT.FOOTER_HEIGHT - LAYOUT.QR_SECTION_HEIGHT;
    await addQRCode(qrYPosition);
    
    // Footer - Fixed position at bottom
    const footerY = pageHeight - margin - 10;
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(8);
    pdf.text('This certificate was issued as part of the Learnathon 3.0 program,', 
      pageWidth / 2, footerY - 5, { align: 'center' });
    pdf.text('organized by Geeky Solutions.', 
      pageWidth / 2, footerY, { align: 'center' });
    
    // ---------- PAGE 2: Detailed Evaluation ----------
    pdf.addPage();
    
    // Page header
    pdf.setTextColor(80, 80, 120);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Detailed Evaluation', pageWidth / 2, margin + 15, { align: 'center' });
    
    // Project Name
    pdf.setTextColor(100, 100, 150);
    pdf.setFontSize(14);
    pdf.text(product.name, pageWidth / 2, margin + 25, { align: 'center' });
    
    let yPosition = margin + 40;
    
    // Evaluation Results section
    if (judgingSummary && judgingSummary.length > 0) {
      pdf.setTextColor(80, 80, 120);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Evaluation Results', margin, yPosition);
      yPosition += 8;
      
      // Table header
      pdf.setFillColor(240, 240, 250);
      pdf.rect(margin, yPosition, pageWidth - (margin * 2), 8, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(80, 80, 80);
      pdf.text('Criteria', margin + 3, yPosition + 5);
      pdf.text('Weight', pageWidth - margin - 50, yPosition + 5);
      pdf.text('Score', pageWidth - margin - 20, yPosition + 5);
      yPosition += 8;
      
      // Filter for rating results
      const ratingResults = judgingSummary.filter(item => 
        item.criteria_type === 'rating' && item.avg_rating !== null
      );
      
      // Table rows
      pdf.setFont('helvetica', 'normal');
      let isAlternate = false;
      for (const item of ratingResults) {
        if (isAlternate) {
          pdf.setFillColor(250, 250, 255);
          pdf.rect(margin, yPosition, pageWidth - (margin * 2), 8, 'F');
        }
        
        pdf.setTextColor(60, 60, 60);
        pdf.setFontSize(8);
        pdf.text(item.criteria_name, margin + 3, yPosition + 5);
        pdf.text(`${item.weight}x`, pageWidth - margin - 50, yPosition + 5);
        pdf.text(item.avg_rating !== null ? item.avg_rating.toFixed(1) : 'N/A', pageWidth - margin - 20, yPosition + 5);
        
        yPosition += 8;
        isAlternate = !isAlternate;
      }
      
      // Overall score in table
      if (overallScore !== null) {
        pdf.setFillColor(240, 240, 255);
        pdf.rect(margin, yPosition, pageWidth - (margin * 2), 8, 'F');
        
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(70, 60, 120);
        pdf.setFontSize(9);
        pdf.text('Overall Score', margin + 3, yPosition + 5);
        pdf.text('-', pageWidth - margin - 50, yPosition + 5);
        pdf.text(overallScore.toFixed(1), pageWidth - margin - 20, yPosition + 5);
        
        yPosition += 15;
      }
    }
    
    // Grading Criteria section
    if (criteria && criteria.length > 0) {
      pdf.setTextColor(80, 80, 120);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Grading Criteria', margin, yPosition);
      yPosition += 8;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(60, 60, 60);
      
      for (const criterion of criteria) {
        // Criterion name with check mark
        pdf.setFont('helvetica', 'bold');
        pdf.text(`✓ ${criterion.name}`, margin + 1, yPosition);
        pdf.setFont('helvetica', 'normal');
        
        yPosition += 3;
        
        // Description (if available)
        if (criterion.description) {
          const maxWidth = pageWidth - (margin * 2) - 10;
          const splitDescription = pdf.splitTextToSize(criterion.description, maxWidth);
          
          pdf.setTextColor(100, 100, 100);
          for (const line of splitDescription) {
            yPosition += 4;
            pdf.text(line, margin + 8, yPosition);
          }
        }
        
        yPosition += 6;
        
        // Check if we need a new page
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = margin + 15;
        }
      }
      
      yPosition += 8;
    }
    
    // Judges section - now limited to 2 judges
    if (selectedJudges && selectedJudges.length > 0) {
      // Check if we need a new page
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = margin + 15;
      }
      
      pdf.setTextColor(80, 80, 120);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Evaluated By', margin, yPosition);
      yPosition += 8;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(60, 60, 60);
      
      const judgeNames = selectedJudges.map(judge => judge.profile?.username || 'Anonymous Judge');
      pdf.text(judgeNames.join(', '), margin + 3, yPosition);
    }
    
    // Project description if available
    if (product.tagline) {
      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = margin + 15;
      } else {
        yPosition += 15;
      }
      
      pdf.setTextColor(80, 80, 120);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Project Description', margin, yPosition);
      yPosition += 8;
      
      pdf.setFillColor(245, 245, 250);
      pdf.roundedRect(margin, yPosition, pageWidth - (margin * 2), 25, 2, 2, 'F');
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(80, 80, 80);
      
      const maxWidth = pageWidth - (margin * 2) - 6;
      const splitTagline = pdf.splitTextToSize(product.tagline, maxWidth);
      
      for (let i = 0; i < splitTagline.length; i++) {
        pdf.text(splitTagline[i], margin + 3, yPosition + 6 + (i * 4));
      }
    }
    
    // Save the PDF
    pdf.save(`${product.name}_Certificate.pdf`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
