import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
  title: 'Privacy Policy | Gupta Furniture',
  description: 'Privacy Policy for Gupta Furniture Nashik.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container section">
      <Breadcrumb items={[
        { name: 'Home', url: '/' },
        { name: 'Privacy Policy', url: '/privacy-policy' }
      ]} />
      <h1 className="section-title">Privacy Policy</h1>
      <div style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-bold mb-2">1. Information We Collect</h2>
        <p className="mb-4">
          We collect information you provide directly to us, such as when you fill out a contact form, request a quote, or communicate with us. This may include your name, phone number, and address.
        </p>

        <h2 className="text-xl font-bold mb-2">2. How We Use Your Information</h2>
        <p className="mb-4">
          We use the information we collect to provide, maintain, and improve our services, to respond to your comments and questions, and to send you related information, including confirmations and invoices.
        </p>

        <h2 className="text-xl font-bold mb-2">3. Data Security</h2>
        <p className="mb-4">
          We implement reasonable security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
        </p>

        <h2 className="text-xl font-bold mb-2">4. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at info@guptafurniture.com.
        </p>
      </div>
    </div>
  );
}
