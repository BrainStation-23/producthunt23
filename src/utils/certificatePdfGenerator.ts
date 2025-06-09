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
  const margin = 15;
  
  // Fixed dimensions for different sections
  const FIXED_IMAGE_HEIGHT = 60; // Fixed height for product image
  const FIXED_IMAGE_WIDTH = pageWidth - margin * 2 - 80; // Fixed width with margins
  
  // Function to add QR code
  const addQRCode = async () => {
    if (!certificateUrl) return margin;
    
    try {
      const qrImage = new Image();
      qrImage.crossOrigin = 'Anonymous';
      const qrPromise = new Promise<void>((resolve) => {
        qrImage.onload = function() {
          const qrSize = 30;
          const qrX = (pageWidth - qrSize) / 2;
          // Fixed position for QR code
          const qrY = pageHeight - 80;
          pdf.addImage(qrImage, 'PNG', qrX, qrY, qrSize, qrSize);
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
  
  try {
    // ---------- PAGE 1: Certificate ----------
    // Add decorative background
    pdf.setFillColor(250, 250, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Add subtle award watermark - using opacity workaround instead of setGlobalAlpha
    pdf.setTextColor(240, 240, 250);  // Using very light color instead of alpha
    pdf.setFontSize(180);
    pdf.text('★', pageWidth / 2, pageHeight / 2, { align: 'center' });
    pdf.setTextColor(0, 0, 0);  // Reset text color
    
    // Add decorative border with more space at the bottom
    pdf.setDrawColor(100, 100, 200);
    pdf.setLineWidth(0.5);
    pdf.rect(margin, margin, pageWidth - (margin * 2), pageHeight - (margin * 2.5), 'S');
    
    // Certificate Title
    pdf.setTextColor(80, 80, 120);
    pdf.setFontSize(30);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Certificate of Completion', pageWidth / 2, margin + 20, { align: 'center' });
    
    // Organization
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Learnathon 3.0 by Geeky Solutions', pageWidth / 2, margin + 30, { align: 'center' });
    
    // Presentational line
    pdf.setDrawColor(150, 150, 220);
    pdf.setLineWidth(0.5);
    pdf.line(margin + 30, margin + 40, pageWidth - margin - 30, margin + 40);
    
    // This is to certify that
    pdf.setTextColor(80, 80, 80);
    pdf.setFontSize(14);
    pdf.text('This is to certify that', pageWidth / 2, margin + 60, { align: 'center' });
    
    // Makers
    let currentY = margin + 70;
    pdf.setTextColor(70, 60, 120);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    
    const makerNames = makers.map(maker => maker.profile?.username || 'Unknown Maker');
    pdf.text(makerNames.join(', '), pageWidth / 2, currentY, { align: 'center' });
    currentY += 20;
    
    // Successfully completed
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
    currentY += 25;
    
    // Fixed space for Project Image
    if (product.image_url) {
      const imageX = margin + 40;
      await addImageWithFixedSpace(product.image_url, imageX, currentY, FIXED_IMAGE_WIDTH, FIXED_IMAGE_HEIGHT, pdf);
    }
    // Always advance by the fixed height, regardless of whether image exists
    currentY += FIXED_IMAGE_HEIGHT + 15;
    
    // Overall Score - fixed position
    if (overallScore !== null) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(80, 80, 80);
      pdf.text('Overall Score', pageWidth / 2, currentY, { align: 'center' });
      currentY += 15;
      
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(70, 60, 120);
      pdf.setFontSize(24);
      pdf.text(`${overallScore.toFixed(1)}/10`, pageWidth / 2, currentY, { align: 'center' });
      currentY += 20;
    }
    
    // Issue date - fixed position
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const formattedDate = product.created_at
      ? new Date(product.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      : 'Unknown Date';
    pdf.text(`Issued on ${formattedDate}`, pageWidth / 2, currentY, { align: 'center' });
    
    // QR Code at fixed position
    await addQRCode();
    
    // Footer - positioned within the border at fixed location
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(10);
    pdf.text('This certificate was issued as part of the Learnathon 3.0 program,', 
      pageWidth / 2, pageHeight - margin - 20, { align: 'center' });
    pdf.text('organized by Geeky Solutions.', 
      pageWidth / 2, pageHeight - margin - 15, { align: 'center' });
    
    // ---------- PAGE 2: Detailed Evaluation ----------
    pdf.addPage();
    
    // Page header
    pdf.setTextColor(80, 80, 120);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Detailed Evaluation', pageWidth / 2, margin + 15, { align: 'center' });
    
    // Project Name
    pdf.setTextColor(100, 100, 150);
    pdf.setFontSize(16);
    pdf.text(product.name, pageWidth / 2, margin + 25, { align: 'center' });
    
    let yPosition = margin + 40;
    
    // Evaluation Results section
    if (judgingSummary && judgingSummary.length > 0) {
      pdf.setTextColor(80, 80, 120);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Evaluation Results', margin, yPosition);
      yPosition += 10;
      
      // Table header
      pdf.setFillColor(240, 240, 250);
      pdf.rect(margin, yPosition, pageWidth - (margin * 2), 10, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(80, 80, 80);
      pdf.text('Criteria', margin + 5, yPosition + 7);
      pdf.text('Weight', pageWidth - margin - 65, yPosition + 7);
      pdf.text('Score', pageWidth - margin - 25, yPosition + 7);
      yPosition += 10;
      
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
          pdf.rect(margin, yPosition, pageWidth - (margin * 2), 10, 'F');
        }
        
        pdf.setTextColor(60, 60, 60);
        pdf.text(item.criteria_name, margin + 5, yPosition + 7);
        pdf.text(`${item.weight}x`, pageWidth - margin - 65, yPosition + 7);
        pdf.text(item.avg_rating !== null ? item.avg_rating.toFixed(1) : 'N/A', pageWidth - margin - 25, yPosition + 7);
        
        yPosition += 10;
        isAlternate = !isAlternate;
      }
      
      // Overall score in table
      if (overallScore !== null) {
        pdf.setFillColor(240, 240, 255);
        pdf.rect(margin, yPosition, pageWidth - (margin * 2), 10, 'F');
        
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(70, 60, 120);
        pdf.text('Overall Score', margin + 5, yPosition + 7);
        pdf.text('-', pageWidth - margin - 65, yPosition + 7);
        pdf.text(overallScore.toFixed(1), pageWidth - margin - 25, yPosition + 7);
        
        yPosition += 20;
      }
    }
    
    // Grading Criteria section
    if (criteria && criteria.length > 0) {
      pdf.setTextColor(80, 80, 120);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Grading Criteria', margin, yPosition);
      yPosition += 10;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      
      for (const criterion of criteria) {
        // Criterion name with check mark
        pdf.setFont('helvetica', 'bold');
        pdf.text(`✓ ${criterion.name}`, margin + 1, yPosition);
        pdf.setFont('helvetica', 'normal');
        
        yPosition += 2;
        
        // Description (if available)
        if (criterion.description) {
          // Handle potential line wrapping for descriptions
          const maxWidth = pageWidth - (margin * 2) - 10;
          const splitDescription = pdf.splitTextToSize(criterion.description, maxWidth);
          
          pdf.setTextColor(100, 100, 100);
          for (const line of splitDescription) {
            yPosition += 5;
            pdf.text(line, margin + 10, yPosition);
          }
        }
        
        yPosition += 8;
        
        // Check if we need a new page
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = margin + 15;
        }
      }
      
      yPosition += 10;
    }
    
    // Judges section - now limited to 2 judges
    if (selectedJudges && selectedJudges.length > 0) {
      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = margin + 15;
      }
      
      pdf.setTextColor(80, 80, 120);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Evaluated By', margin, yPosition);
      yPosition += 10;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      
      const judgeNames = selectedJudges.map(judge => judge.profile?.username || 'Anonymous Judge');
      pdf.text(judgeNames.join(', '), margin + 5, yPosition);
    }
    
    // Project description if available
    if (product.tagline) {
      // Check if we need a new page
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        yPosition = margin + 15;
      } else {
        yPosition += 20;
      }
      
      pdf.setTextColor(80, 80, 120);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Project Description', margin, yPosition);
      yPosition += 10;
      
      pdf.setFillColor(245, 245, 250);
      pdf.roundedRect(margin, yPosition, pageWidth - (margin * 2), 30, 2, 2, 'F');
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(80, 80, 80);
      
      const maxWidth = pageWidth - (margin * 2) - 10;
      const splitTagline = pdf.splitTextToSize(product.tagline, maxWidth);
      
      for (let i = 0; i < splitTagline.length; i++) {
        pdf.text(splitTagline[i], margin + 5, yPosition + 7 + (i * 5));
      }
    }
    
    // Save the PDF
    pdf.save(`${product.name}_Certificate.pdf`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
