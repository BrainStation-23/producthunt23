
/**
 * Application Configuration
 * 
 * This file contains all configuration related to branding and application settings.
 * Changing values here will propagate throughout the application.
 */

export type AppConfig = {
  // Brand information
  brand: {
    name: string;
    shortName: string;
    slogan: string;
    description: string;
    logoLetterShort: string;
    companyName: string;
    yearFounded: number;
  };
  // SEO and meta information
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  // Social media links
  social: {
    twitter: string;
    facebook: string;
    instagram: string;
    github?: string;
    linkedin?: string;
  };
  // Contact information
  contact: {
    email: string;
    supportEmail: string;
  };
  // Application URLs
  urls: {
    homepage: string;
    about: string;
    terms: string;
    privacy: string;
    help: string;
    blog: string;
  };
  // Primary color in tailwind class name (without the bg- prefix)
  primaryColorClass: string;
};

/**
 * Application configuration
 */
export const appConfig: AppConfig = {
  brand: {
    name: "Learnathon Products Hub",
    shortName: "Learnathon Products Hub",
    slogan: "Student to Industry Ready Developers",
    description: "Join our community of product enthusiasts and discover the next big thing before anyone else.",
    logoLetterShort: "L",
    companyName: "Geeky Solutions Ltd.",
    yearFounded: 2023,
  },
  meta: {
    title: "Learnathon Products Hub",
    description: "Learnathon Products Hub is a platform for discovering products developed in Learnathon Programe",
    ogTitle: "Learnathon Products Hub",
    ogDescription: "Discover the newest products and tools developed in the Learnathon Program",
  },
  social: {
    twitter: "https://twitter.com",
    facebook: "https://www.facebook.com/geekysolutionsbd/",
    instagram: "https://instagram.com",
    github: "https://github.com/Learnathon-By-Geeky-Solutions",
    linkedin: "https://www.linkedin.com/company/geekysolutionsbd/",
  },
  contact: {
    email: "contact@learnathon.geeky.solutions",
    supportEmail: "contact@learnathon.geeky.solutions",
  },
  urls: {
    homepage: "/",
    about: "/about",
    terms: "/terms",
    privacy: "/privacy",
    help: "/help",
    blog: "/blog",
  },
  primaryColorClass: "hunt",
};

/**
 * Helper functions to access configuration
 */

/**
 * Get the full brand name
 */
export const getBrandName = (): string => {
  return appConfig.brand.name;
};

/**
 * Get the short brand name for mobile or space-constrained areas
 */
export const getShortBrandName = (): string => {
  return appConfig.brand.shortName;
};

/**
 * Get the brand logo letter (for letter-based logos)
 */
export const getBrandLogoLetter = (): string => {
  return appConfig.brand.logoLetterShort;
};

/**
 * Get the brand slogan
 */
export const getBrandSlogan = (): string => {
  return appConfig.brand.slogan;
};

/**
 * Get the brand description
 */
export const getBrandDescription = (): string => {
  return appConfig.brand.description;
};

/**
 * Get the primary color class name with the prefix (e.g., "bg-hunt-600")
 */
export const getPrimaryColorClass = (prefix: string = "bg", shade: string = "600"): string => {
  return `${prefix}-${appConfig.primaryColorClass}-${shade}`;
};

/**
 * Get the primary color hover class name
 */
export const getPrimaryColorHoverClass = (shade: string = "700"): string => {
  return `hover:bg-${appConfig.primaryColorClass}-${shade}`;
};

/**
 * Get the company name for copyright notices
 */
export const getCompanyName = (): string => {
  return appConfig.brand.companyName;
};

/**
 * Get the year founded for copyright notices
 */
export const getYearFounded = (): number => {
  return appConfig.brand.yearFounded;
};

/**
 * Get copyright text with current year
 */
export const getCopyrightText = (): string => {
  const currentYear = new Date().getFullYear();
  const yearText = currentYear > appConfig.brand.yearFounded 
    ? `${appConfig.brand.yearFounded}-${currentYear}` 
    : currentYear.toString();
  
  return `© ${yearText} ${appConfig.brand.companyName}. All rights reserved.`;
};

/**
 * Get a social media URL
 */
export const getSocialUrl = (platform: keyof AppConfig['social']): string => {
  return appConfig.social[platform] || '';
};

export default appConfig;
