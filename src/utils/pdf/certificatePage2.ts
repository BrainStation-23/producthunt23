
import jsPDF from 'jspdf';
import { CertificateData } from './types';
import { selectTopJudges } from './judgeSelection';

export const generateCertificatePage2 = async (
  pdf: jsPDF,
  certificateData: CertificateData,
  pageWidth: number,
  pageHeight: number,
  margin: number
): Promise<void> => {
  const { product, criteria, judgingSummary, judges, overallScore } = certificateData;
  
  // Add new page
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
  
  // Judges section
  const selectedJudges = selectTopJudges(judges);
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
};
