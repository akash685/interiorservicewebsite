import Breadcrumb from '@/components/Breadcrumb';

export const metadata = {
  title: 'Terms of Service | Gupta Furniture',
  description: 'Terms of Service for Gupta Furniture Nashik.',
};

export default function TermsPage() {
  return (
    <div className="container section">
      <Breadcrumb items={[
        { name: 'Home', url: '/' },
        { name: 'Terms of Service', url: '/terms-of-service' }
      ]} />
      <h1 className="section-title">Terms of Service</h1>
      <div style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-bold mb-2">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing or using our website and services, you agree to be bound by these Terms of Service.
        </p>

        <h2 className="text-xl font-bold mb-2">2. Services</h2>
        <p className="mb-4">
          Gupta Furniture provides furniture repair, cleaning, and interior design services. We reserve the right to refuse service to anyone for any reason at any time.
        </p>

        <h2 className="text-xl font-bold mb-2">3. Pricing and Payment</h2>
        <p className="mb-4">
          Prices for our services are subject to change without notice. Payment is due upon completion of services unless otherwise agreed.
        </p>

        <h2 className="text-xl font-bold mb-2">4. Limitation of Liability</h2>
        <p className="mb-4">
          Gupta Furniture shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
        </p>
      </div>
    </div>
  );
}
