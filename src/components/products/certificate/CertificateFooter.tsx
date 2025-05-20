
import React from 'react';
import { QrCode } from 'lucide-react';

interface CertificateFooterProps {
  certificateUrl: string | null;
}

const CertificateFooter = ({ certificateUrl }: CertificateFooterProps) => {
  return (
    <>
      {/* QR Code */}
      <div className="mb-6 flex justify-center">
        <div className="text-center">
          <div className="bg-white p-2 inline-block rounded-md border border-border shadow-sm">
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
      <div className="mt-8 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          This certificate was issued as part of the Learnathon 3.0 program, 
          organized by Geeky Solutions.
        </p>
      </div>
    </>
  );
};

export default CertificateFooter;
