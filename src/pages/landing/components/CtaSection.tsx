import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getPrimaryColorClass } from '@/config/appConfig';
const CtaSection: React.FC = () => {
  const primaryColorClass = getPrimaryColorClass();
  return <section className="py-16 bg-hunt-50">
      <div className="container px-4 md:px-6">
        <div className={`${primaryColorClass} text-white rounded-xl p-8 sm:p-12`}>
          <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to launch your product?</h2>
              <p className="max-w-[600px] text-hunt-100 md:text-xl/relaxed lg:text-base/relaxed">
                Join thousands of makers who have successfully launched their products on our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" variant="secondary" className="font-medium">
                  <Link to="/submit">Submit your product</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 hover:text-white font-medium">
                  
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Product Launch" className="w-full h-auto rounded-xl object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default CtaSection;