
import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, Printer, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { useCertificationData } from '@/hooks/useCertificationData';
import { useReactToPrint } from 'react-to-print';

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

  // Use react-to-print to handle printing only the certificate content
  const handlePrint = useReactToPrint({
    contentRef: certificateRef,
    documentTitle: `${product?.name || 'Product'} Certificate`,
    onAfterPrint: () => {
      console.log('Print completed');
    },
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          background-color: white;
          margin: 0;
          padding: 0;
        }
        html, body {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
        }
      }
    `
  });

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
        <Button onClick={handlePrint} className="flex items-center gap-2">
          <Printer className="w-4 h-4" />
          Print Certificate
        </Button>
      </div>

      {/* Certificate Pages Container - Will be printed */}
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
        <Card className="p-8 md:p-12 border border-border relative overflow-hidden certificate-card page-2">
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
