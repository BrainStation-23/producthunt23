
import React from "react";
import { Separator } from "@/components/ui/separator";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <Separator className="mb-8" />
      
      <div className="prose prose-gray max-w-none">
        <p className="mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
        <p className="mb-4">
          ProductHunt Clone ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by ProductHunt Clone.
        </p>
        <p className="mb-4">
          This Privacy Policy applies to our website, and its associated subdomains (collectively, our "Service"). By accessing or using our Service, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
        <p className="mb-4">
          We collect information from you when you register on our site, submit a product, save a product, or fill out a form. The information we collect includes:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Name</li>
          <li>Email address</li>
          <li>Profile information</li>
          <li>Usage data and preferences</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
        <p className="mb-4">
          We use the information we collect in various ways, including to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide, operate, and maintain our website</li>
          <li>Improve, personalize, and expand our website</li>
          <li>Understand and analyze how you use our website</li>
          <li>Develop new products, services, features, and functionality</li>
          <li>Communicate with you for customer service and updates</li>
          <li>Send you emails</li>
          <li>Find and prevent fraud</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Cookies</h2>
        <p className="mb-4">
          We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
        </p>
        <p className="mb-4">
          You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Retention</h2>
        <p className="mb-4">
          We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Security</h2>
        <p className="mb-4">
          The security of your personal information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Your Rights</h2>
        <p className="mb-4">
          You have the right to access, update or delete your personal information. You may also have the right to data portability and the right to restrict processing of your personal information.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes To This Privacy Policy</h2>
        <p className="mb-4">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at privacy@producthuntclone.com.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
