import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, Printer, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { useCertificationData } from '@/hooks/useCertificationData';
import jsPDF from 'jspdf';

// Import the components
import CertificateHeader from '@/components/products/certificate/CertificateHeader';
import CertificateMakers from '@/components/products/certificate/CertificateMakers';
import GradingTable from '@/components/products/certificate/GradingTable';
import CriteriaList from '@/components/products/certificate/CriteriaList';
import JudgesList from '@/components/products/certificate/JudgesList';
import CertificateFooter from '@/components/products/certificate/CertificateFooter';
import CertificateSkeleton from '@/components/products/certificate/CertificateSkeleton';

const CertificationPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { 
    product, 
    makers, 
    criteria, 
    judgingSummary,
    judges,
    isLoading, 
    certificateUrl,
    overallScore
  } = useCertificationData(productId);
  
  // Create a reference to the certificate content
  const certificateRef = useRef<HTMLDivElement>(null);

  useDocumentTitle(product?.name ? `${product.name} Certificate` : 'Product Certificate');

  // Generate PDF using jsPDF
  const handlePrintPDF = async () => {
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
    
    // Helper function to add image with aspect ratio preservation
    const addImageWithAspect = async (imageUrl: string, x: number, y: number, maxWidth: number, maxHeight: number) => {
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
            pdf.addImage(qrImage, 'PNG', qrX, pageHeight - 60, qrSize, qrSize);
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            pdf.text('Scan to verify this certificate', pageWidth / 2, pageHeight - 25, { align: 'center' });
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
      
      // Add decorative border
      pdf.setDrawColor(100, 100, 200);
      pdf.setLineWidth(0.5);
      pdf.rect(margin, margin, pageWidth - (margin * 2), pageHeight - (margin * 2), 'S');
      
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
      
      // Project Image
      if (product.image_url) {
        const imageResult = await addImageWithAspect(product.image_url, margin + 40, currentY, pageWidth - margin * 2 - 80, 80);
        currentY = imageResult.y + 25;
      }
      
      // Overall Score
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
        currentY += 25;
      }
      
      // Issue date
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
      
      // QR Code at the bottom
      const qrHeight = await addQRCode();
      
      // Footer
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(10);
      pdf.text('This certificate was issued as part of the Learnathon 3.0 program,', 
        pageWidth / 2, pageHeight - 15, { align: 'center' });
      pdf.text('organized by Geeky Solutions.', 
        pageWidth / 2, pageHeight - 10, { align: 'center' });
      
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
          pdf.text(`✓ ${criterion.name}`, margin + 5, yPosition);
          pdf.setFont('helvetica', 'normal');
          
          yPosition += 5;
          
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
      
      // Judges section
      if (judges && judges.length > 0) {
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
        
        const judgeNames = judges.map(judge => judge.profile?.username || 'Anonymous Judge');
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

  if (isLoading) {
    return <CertificateSkeleton />;
  }

  if (!product || !makers || makers.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Certificate Not Found</h2>
          <p className="mb-6">The certificate you're looking for doesn't exist or is not available.</p>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </Card>
      </div>
    );
  }
  
  const formattedDate = product.created_at
    ? new Date(product.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'Unknown Date';

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between mb-6">
        <Button variant="outline" asChild className="flex items-center gap-1">
          <Link to={`/products/${productId}`}><ChevronLeft className="w-4 h-4" /> Back to Product</Link>
        </Button>
        <Button onClick={handlePrintPDF} className="flex items-center gap-2">
          <Printer className="w-4 h-4" />
          Generate PDF
        </Button>
      </div>

      {/* Certificate Preview Container */}
      <div ref={certificateRef} className="certificate-container">
        {/* PAGE 1: Formal Certificate */}
        <Card className="p-8 md:p-12 border-4 border-primary/20 relative overflow-hidden certificate-card">
          {/* Background watermark */}
          <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
            <Award className="w-[80%] h-[80%]" />
          </div>
          
          {/* Certificate Content - Page 1 */}
          <div className="relative z-10 text-center certificate-page-1">
            {/* Enhanced Header */}
            <div className="mb-6 border-b border-primary/20 pb-4">
              <div className="certificate-ribbon">
                <h1 className="text-3xl md:text-5xl font-bold mb-3">Certificate of Completion</h1>
                <h2 className="text-xl md:text-2xl text-muted-foreground">Learnathon 3.0 by Geeky Solutions</h2>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="mb-6">
              <h3 className="text-lg md:text-2xl font-semibold mb-4">This is to certify that</h3>
              <div className="my-4">
                <CertificateMakers makers={makers} featured={true} />
              </div>
              <p className="text-lg my-4">
                successfully completed the project <span className="font-bold text-xl md:text-2xl text-primary">{product.name}</span>
              </p>
              
              {/* Project Image */}
              {product.image_url && (
                <div className="my-6 max-w-xs mx-auto">
                  <div className="bg-muted rounded-md overflow-hidden border border-border aspect-video">
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
              
              {/* Overall Score */}
              {overallScore !== null && (
                <div className="my-6 flex flex-col items-center">
                  <p className="text-lg mb-2">Overall Score</p>
                  <div className="certificate-score">
                    <span className="text-3xl font-bold text-primary">{overallScore.toFixed(1)}</span>
                    <span className="text-lg">/10</span>
                  </div>
                </div>
              )}
              
              <p className="text-muted-foreground mt-4">Issued on {formattedDate}</p>
            </div>
            
            {/* QR Code */}
            <div className="mt-auto">
              <CertificateFooter certificateUrl={certificateUrl} />
            </div>
          </div>
        </Card>
        
        {/* PAGE 2: Detailed Evaluation */}
        <Card className="p-8 md:p-12 border border-border relative overflow-hidden certificate-card page-2 mt-8">
          <div className="relative z-10 certificate-page-2">
            {/* Page 2 Header */}
            <div className="mb-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Detailed Evaluation</h2>
              <h3 className="text-xl text-primary font-semibold">{product.name}</h3>
            </div>
            
            {/* Evaluation Results */}
            <GradingTable judgingSummary={judgingSummary} overallScore={overallScore} detailed={true} />
            
            {/* Grading Criteria */}
            <CriteriaList criteria={criteria} />
            
            {/* Judges List */}
            <JudgesList judges={judges} />
            
            {/* Project Context */}
            {product.tagline && (
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <p className="font-medium mb-1">Project Description:</p>
                <p className="text-muted-foreground">{product.tagline}</p>
              </div>
            )}
            
            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                This certificate details the evaluation process and criteria used to assess this project
                as part of the Learnathon 3.0 program by Geeky Solutions.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CertificationPage;
