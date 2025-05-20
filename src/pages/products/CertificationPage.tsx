
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QrCode, Award, Badge, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge as BadgeComponent } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { useCertificationData } from '@/hooks/useCertificationData';

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

  useDocumentTitle(product?.name ? `${product.name} Certificate` : 'Product Certificate');

  const handlePrint = () => {
    window.print();
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
    <div className="container max-w-4xl mx-auto py-8 px-4 print:py-0 print:px-0">
      <div className="flex justify-between mb-6 print:hidden">
        <Button variant="outline" asChild>
          <Link to={`/products/${productId}`}>&larr; Back to Product</Link>
        </Button>
        <Button onClick={handlePrint}>
          Print Certificate
        </Button>
      </div>

      <Card className="p-8 md:p-12 border-4 border-primary/20 relative overflow-hidden certificate-card">
        {/* Background watermark */}
        <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
          <Award className="w-[80%] h-[80%]" />
        </div>
        
        {/* Certificate Content */}
        <div className="relative z-10 text-center">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">Certificate of Completion</h1>
            <h2 className="text-xl md:text-2xl text-muted-foreground">Learnathon 3.0 by Geeky Solutions</h2>
          </div>

          {/* Project and Makers */}
          <div className="mb-8">
            <h3 className="text-lg md:text-xl font-semibold mb-2">This certifies that</h3>
            <div className="my-4">
              {makers.map((maker, index) => (
                <span key={maker.id} className="text-xl md:text-2xl font-bold text-primary">
                  {maker.profile?.username || 'Unknown Maker'}
                  {index < makers.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
            <p className="text-lg">
              successfully completed the project <span className="font-bold">{product.name}</span>
            </p>
            <p className="text-muted-foreground mt-2">Issued on {formattedDate}</p>
          </div>

          {/* Project Image */}
          {product.image_url && (
            <div className="mb-8 max-w-xs mx-auto">
              <AspectRatio ratio={16/9} className="bg-muted rounded-md overflow-hidden">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-contain"
                />
              </AspectRatio>
            </div>
          )}
          
          {/* Evaluation Results */}
          {judgingSummary && judgingSummary.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center justify-center">
                <Award className="mr-2" /> 
                Evaluation Results
              </h3>
              
              <div className="max-w-lg mx-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Criteria</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead className="text-right">Judges</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {judgingSummary
                      .filter(item => item.criteria_type === 'rating' && item.avg_rating !== null)
                      .map((item) => (
                        <TableRow key={item.criteria_id}>
                          <TableCell className="font-medium">{item.criteria_name}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <BadgeComponent variant="outline" className="font-bold">
                                {item.avg_rating !== null ? item.avg_rating.toFixed(1) : 'N/A'}
                              </BadgeComponent>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{item.count_judges}</TableCell>
                        </TableRow>
                    ))}
                    
                    {overallScore !== null && (
                      <TableRow className="font-bold">
                        <TableCell>Overall Score</TableCell>
                        <TableCell colSpan={2}>
                          <BadgeComponent className="bg-primary">
                            {overallScore.toFixed(1)}
                          </BadgeComponent>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Criteria Description */}
          {criteria && criteria.length > 0 && (
            <div className="mb-8 text-left">
              <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center">
                <Badge className="mr-2" />
                Grading Criteria
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {criteria.map((criterion) => (
                  <div key={criterion.id} className="flex items-start">
                    <Check className="mr-2 mt-1 h-4 w-4 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium">{criterion.name}</p>
                      {criterion.description && (
                        <p className="text-sm text-muted-foreground">{criterion.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Judges */}
          {judges && judges.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center justify-center">
                <Badge className="mr-2" />
                Evaluated By
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {judges.map((judge) => (
                  <div key={judge.id} className="text-center">
                    {judge.profile?.avatar_url && (
                      <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2">
                        <img 
                          src={judge.profile.avatar_url} 
                          alt={judge.profile?.username || 'Judge'} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <p className="font-medium">{judge.profile?.username || 'Anonymous Judge'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* QR Code */}
          <div className="mb-4 flex justify-center">
            <div className="text-center">
              <div className="bg-white p-2 inline-block rounded-md">
                {certificateUrl && (
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(certificateUrl)}`}
                    alt="Certificate QR Code" 
                    className="w-32 h-32"
                  />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Scan to verify this certificate
              </p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              This certificate was issued as part of the Learnathon 3.0 program, 
              organized by Geeky Solutions.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

const CertificateSkeleton = () => {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between mb-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      <Card className="p-8 md:p-12 border-4 border-primary/20">
        <div className="flex flex-col items-center space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
          
          <div className="w-full space-y-3">
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-8 w-1/2 mx-auto" />
            <Skeleton className="h-6 w-3/5 mx-auto" />
          </div>
          
          <Skeleton className="h-40 w-40" />
          
          <div className="w-full space-y-3">
            <Skeleton className="h-8 w-1/3 mx-auto" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
          
          <Skeleton className="h-32 w-32 mx-auto" />
        </div>
      </Card>
    </div>
  );
};

export default CertificationPage;
