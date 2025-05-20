
import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, Printer } from 'lucide-react';
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
        margin: 10mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
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
        <Button variant="outline" asChild>
          <Link to={`/products/${productId}`}>&larr; Back to Product</Link>
        </Button>
        <Button onClick={handlePrint} className="flex items-center gap-2">
          <Printer className="w-4 h-4" />
          Print Certificate
        </Button>
      </div>

      {/* Certificate Card - Will be printed */}
      <Card 
        ref={certificateRef}
        className="p-8 md:p-12 border-4 border-primary/20 relative overflow-hidden certificate-card"
      >
        {/* Background watermark */}
        <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
          <Award className="w-[80%] h-[80%]" />
        </div>
        
        {/* Certificate Content */}
        <div className="relative z-10 text-center">
          <CertificateHeader product={product} formattedDate={formattedDate} />
          <CertificateMakers makers={makers} />
          <GradingTable judgingSummary={judgingSummary} overallScore={overallScore} />
          <CriteriaList criteria={criteria} />
          <JudgesList judges={judges} />
          <CertificateFooter certificateUrl={certificateUrl} />
        </div>
      </Card>
    </div>
  );
};

export default CertificationPage;
