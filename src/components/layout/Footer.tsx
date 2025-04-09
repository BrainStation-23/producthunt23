
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  getBrandName, 
  getBrandLogoLetter, 
  getCopyrightText, 
  getPrimaryColorClass,
  getSocialUrl
} from '@/config/appConfig';

const Footer: React.FC = () => {
  const logoColorClass = getPrimaryColorClass();
  
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className={`rounded-full ${logoColorClass} w-8 h-8 flex items-center justify-center`}>
                <span className="text-white font-bold">{getBrandLogoLetter()}</span>
              </div>
              <span className="font-bold text-xl">{getBrandName()}</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Discover the best new products in tech, design, and more, every day.
            </p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm font-medium">Company</h3>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link to="/careers" className="text-sm text-muted-foreground hover:text-foreground">
              Careers
            </Link>
            <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">
              Blog
            </Link>
          </div>
          
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm font-medium">Resources</h3>
            <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground">
              Help Center
            </Link>
            <Link to="/api" className="text-sm text-muted-foreground hover:text-foreground">
              API
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
          </div>
          
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm font-medium">Follow us</h3>
            <a href={getSocialUrl('twitter')} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
              Twitter
            </a>
            <a href={getSocialUrl('facebook')} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
              Facebook
            </a>
            <a href={getSocialUrl('instagram')} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
              Instagram
            </a>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            {getCopyrightText()}
          </p>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link to="/cookies" className="text-xs text-muted-foreground hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
