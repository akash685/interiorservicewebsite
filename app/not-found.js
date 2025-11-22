import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-24 px-6">
      <h2 className="text-8xl font-semibold text-gray-900 mb-6">404</h2>
      <p className="text-2xl text-gray-600 mb-6">
        Oops! We couldn't find that page.
      </p>
      <p className="text-gray-600 mb-12">
        It seems you've stumbled upon a broken link or a page that doesn't exist.
      </p>
      <Link 
        href="/" 
        className="inline-block px-8 py-3 font-semibold text-white transition-colors rounded-lg"
        style={{ backgroundColor: 'var(--primary)' }}
      >
        Return Home
      </Link>
    </div>
  );
}
