
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
    name: "InnovateHub",
    shortName: "InnovateHub",
    slogan: "Discover the best products in tech",
    description: "Join our community of product enthusiasts and discover the next big thing before anyone else.",
    logoLetterShort: "I",
    companyName: "InnovateHub Inc.",
    yearFounded: 2023,
  },
  meta: {
    title: "InnovateHub - Discover the best in tech",
    description: "InnovateHub is a platform for discovering and sharing new digital products.",
    ogTitle: "InnovateHub",
    ogDescription: "Discover the newest products and tools in Brain Station 23",
  },
  social: {
    twitter: "https://twitter.com",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  contact: {
    email: "contact@innovatehub.com",
    supportEmail: "support@innovatehub.com",
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
