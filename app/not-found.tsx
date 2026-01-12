import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="border-2 border-gray-300 p-12 max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-6">Page not found</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 border-2 border-gray-900 bg-gray-900 text-white hover:bg-gray-700 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
