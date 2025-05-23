
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getPrimaryColorClass } from '@/config/appConfig';
import { useIsMobile } from '@/hooks/use-mobile';

const CtaSection: React.FC = () => {
  const primaryColorClass = getPrimaryColorClass();
  const isMobile = useIsMobile();
  
  return (
    <section className="py-8 md:py-16 bg-hunt-50 overflow-x-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className={`${primaryColorClass} text-white rounded-xl p-6 sm:p-8 md:p-12`}>
          <div className="grid gap-6 md:gap-8 md:grid-cols-2 md:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tighter md:text-4xl">Get your Final Evaluation</h2>
              <p className="max-w-[600px] text-hunt-100 md:text-xl/relaxed lg:text-base/relaxed">Join the Learnathon Hall of Fame. Bring your project to public.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size={isMobile ? "default" : "lg"} variant="secondary" className="font-medium w-full sm:w-auto">
                  <Link to="/submit">Submit your product</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Product Launch" className="w-full h-auto rounded-xl object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
